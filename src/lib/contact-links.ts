import type { Contact } from "@/content/site";

/**
 * A fabricated phone number in a live wa.me link could message a real,
 * unrelated person — so these return null (render as a disabled placeholder)
 * rather than ever inventing one. Fill `contact.whatsapp` / `contact.email`
 * in content/site.ts to make them live.
 */

export function whatsappHref(contact: Contact, prefilledMessage?: string): string | null {
  const digits = contact.whatsapp.replace(/[^0-9]/g, "");
  if (!digits) return null;
  const text = prefilledMessage ? `?text=${encodeURIComponent(prefilledMessage)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function mailHref(contact: Contact): string | null {
  if (!contact.email) return null;
  return `mailto:${contact.email}`;
}
