import type { Contact } from "@/content/site";

/**
 * A fabricated phone number in a live wa.me link could message a real,
 * unrelated person — so these return null (render as a disabled placeholder)
 * rather than ever inventing one. Fill `contact.whatsapp` / `contact.email`
 * in content/site.ts to make them live.
 */

export function whatsappHref(contact: Contact, prefilledMessage?: string): string | null {
  let digits = contact.whatsapp.replace(/[^0-9]/g, "");
  // "00" is the international dialing prefix some people write instead of
  // "+" (e.g. "00963988824456" for "+963988824456") — wa.me needs neither,
  // just the country code onward.
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (!digits) return null;
  const text = prefilledMessage ? `?text=${encodeURIComponent(prefilledMessage)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function mailHref(contact: Contact): string | null {
  if (!contact.email) return null;
  return `mailto:${contact.email}`;
}
