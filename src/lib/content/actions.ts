"use server";

import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { del, put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth/admin";
import { getContent, isWritable, saveContent } from "./store";
import type { SiteContent } from "@/content/site";

export type SaveResult = { ok: boolean; message: string };

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

/** Persists the whole document and refreshes the public page. */
export async function saveSiteContent(content: SiteContent): Promise<SaveResult> {
  await requireAdmin();

  try {
    await saveContent(content);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save." };
  }

  // The public page reads content per-request but Next still caches
  // rendered output — this pushes the new content live immediately.
  revalidatePath("/", "layout");
  revalidatePath("/dashboard");

  return { ok: true, message: "Saved." };
}

export async function loadSiteContent(): Promise<SiteContent> {
  await requireAdmin();
  return getContent();
}

export type UploadResult = { ok: boolean; path?: string; message: string };

/** Stores one image (public/uploads locally, Vercel Blob in production) and returns its public URL. */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  if (!isWritable()) {
    return {
      ok: false,
      message: "Image uploads aren't available in this deployment (no writable storage configured — see README).",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "No file selected." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, message: "Image is larger than 5MB." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { ok: false, message: "Unsupported format. Use JPG, PNG, WEBP, AVIF, GIF or SVG." };
  }

  // Generated name: never trust the client-supplied filename for a path.
  const filename = `${randomUUID()}${extension}`;

  try {
    if (process.env.VERCEL) {
      const blob = await put(`uploads/${filename}`, file, { access: "public" });
      return { ok: true, path: blob.url, message: "Image uploaded." };
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);
    return { ok: true, path: `/uploads/${filename}`, message: "Image uploaded." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not upload image." };
  }
}

/** Removes an uploaded file that is no longer referenced. */
export async function deleteUpload(publicPath: string): Promise<SaveResult> {
  await requireAdmin();

  if (process.env.VERCEL) {
    if (!publicPath.includes("blob.vercel-storage.com")) {
      return { ok: false, message: "Invalid path." };
    }
    try {
      await del(publicPath);
    } catch {
      // Already gone — not an error from the caller's point of view.
    }
    return { ok: true, message: "Image deleted." };
  }

  // Only ever touch files directly inside public/uploads.
  const name = path.basename(publicPath);
  if (!publicPath.startsWith("/uploads/") || name !== publicPath.slice("/uploads/".length)) {
    return { ok: false, message: "Invalid path." };
  }

  try {
    await fs.unlink(path.join(UPLOAD_DIR, name));
    return { ok: true, message: "Image deleted." };
  } catch {
    return { ok: true, message: "Image was already gone." };
  }
}
