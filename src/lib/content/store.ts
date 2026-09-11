import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { site as defaultContent } from "@/content/site";
import type { SiteContent } from "@/content/site";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const BLOB_CONTENT_FILE = "content/urfolio-content.json";

/**
 * Whether a save can actually persist right now. Vercel's serverless
 * filesystem is read-only, so a real deployment needs Vercel Blob
 * (`BLOB_READ_WRITE_TOKEN`) configured; local dev can always write to disk.
 */
export function isWritable(): boolean {
  return !process.env.VERCEL || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Merges saved content over the defaults field by field, so a field added
 * to `content/site.ts` after someone's last save still shows up (arrays are
 * taken whole from whichever side actually has a value, since a saved,
 * intentionally-emptied list is meaningful and shouldn't be re-merged item
 * by item with the defaults).
 */
function mergeWithDefaults<T>(base: T, saved: unknown): T {
  if (!isPlainObject(saved) || !isPlainObject(base)) {
    return saved === undefined ? base : (saved as T);
  }

  const out: Record<string, unknown> = { ...base };

  for (const key of Object.keys(base as Record<string, unknown>)) {
    const baseValue = (base as Record<string, unknown>)[key];
    const savedValue = saved[key];

    if (savedValue === undefined) continue;

    out[key] = Array.isArray(baseValue) ? savedValue : mergeWithDefaults(baseValue, savedValue);
  }

  return out as T;
}

/** Reads saved content from Vercel Blob in production, or data/content.json locally. */
export async function getContent(): Promise<SiteContent> {
  if (process.env.VERCEL) {
    try {
      const result = await get(BLOB_CONTENT_FILE, { access: "private", useCache: false });
      if (!result || result.statusCode !== 200) return defaultContent;
      const raw = await new Response(result.stream).text();
      return mergeWithDefaults(defaultContent, JSON.parse(raw));
    } catch {
      return defaultContent;
    }
  }

  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    return mergeWithDefaults(defaultContent, JSON.parse(raw));
  } catch {
    return defaultContent;
  }
}

/** Saves content to Vercel Blob in production, or data/content.json locally. */
export async function saveContent(content: SiteContent): Promise<void> {
  const json = JSON.stringify(content, null, 2) + "\n";

  if (process.env.VERCEL) {
    await put(BLOB_CONTENT_FILE, json, { access: "private", allowOverwrite: true });
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CONTENT_FILE, json, "utf8");
}
