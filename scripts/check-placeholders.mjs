#!/usr/bin/env node
/**
 * Walks the real `site` object from content/site.ts and lists every value
 * that's still a placeholder: a `[bracketed]` string, or a hard `"[X]"` /
 * `"[ ]"` numeric placeholder. Run before launch — see README.md.
 *
 * Uses `tsx` to import the actual TypeScript module (not a regex over the
 * source text), so it can't miss a placeholder or flag a false one because
 * of how the string happens to be formatted in the file.
 */
import { register } from "tsx/esm/api";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

register();

const siteUrl = pathToFileURL(resolve(import.meta.dirname, "../src/content/site.ts")).href;
const { site } = await import(siteUrl);

const BRACKET = /\[[^\]]*\]/;
const found = [];

function walk(value, path) {
  if (typeof value === "string") {
    if (BRACKET.test(value)) found.push({ path, value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      walk(v, path ? `${path}.${key}` : key);
    }
  }
}

walk(site, "site");

if (found.length === 0) {
  console.log("No placeholders found in content/site.ts. ✓");
  process.exit(0);
}

console.log(`${found.length} placeholder value(s) in content/site.ts:\n`);
for (const { path, value } of found) {
  console.log(`  ${path.padEnd(48)} ${JSON.stringify(value)}`);
}
console.log("\nAlso check: contact.email / contact.whatsapp / contact.socials[].href");
console.log("(empty strings, not bracketed — they render as disabled placeholders).");
process.exit(1);
