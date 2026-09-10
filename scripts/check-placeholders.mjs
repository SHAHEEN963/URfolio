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

// contact.email/whatsapp/socials[].href are empty strings rather than
// `[bracketed]` text when unfilled, so the walk above never catches them —
// checked separately here.
const emptyContactFields = [
  !site.contact.email && "contact.email",
  !site.contact.whatsapp && "contact.whatsapp",
  ...site.contact.socials.filter((s) => !s.href).map((s) => `contact.socials["${s.id}"].href`),
].filter(Boolean);

if (emptyContactFields.length > 0) {
  console.log(`\nAlso empty (render as disabled placeholders): ${emptyContactFields.join(", ")}`);
}
process.exit(1);
