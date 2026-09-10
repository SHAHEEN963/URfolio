import { FORMSPREE_ENDPOINT } from "@/lib/config";

export type BriefPayload = {
  audience: string;
  need: string;
  plan: string;
  budget: string;
  name: string;
  email: string;
  whatsapp: string;
  link: string;
  message: string;
};

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Sends the brief form. Static export has no server of its own, so this
 * posts straight to Formspree — the brief's Resend/Formspree TODO.
 *
 * TODO: create a form at https://formspree.io and paste its endpoint into
 * `FORMSPREE_ENDPOINT` in lib/config.ts. Until then this resolves as a
 * failure with a message pointing at that TODO, so the UI's error path is
 * exercised honestly instead of silently pretending to succeed.
 */
export async function submitBrief(payload: BriefPayload): Promise<SubmitResult> {
  if (!FORMSPREE_ENDPOINT) {
    return {
      ok: false,
      error: "Form isn't connected yet — set FORMSPREE_ENDPOINT in lib/config.ts.",
    };
  }

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: "Something went wrong. Please try WhatsApp instead." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try WhatsApp instead." };
  }
}
