import "server-only";
import { cookies } from "next/headers";
import { getAdminEmail } from "./credentials";
import { SESSION_COOKIE, verifySessionToken } from "./session";

export function isAdminEmail(email: string): boolean {
  const admin = getAdminEmail();
  return Boolean(admin) && email.trim().toLowerCase() === admin;
}

/** The signed-in admin's email, or null. Verifies the cookie signature. */
export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const payload = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  // Re-check against the configured admin email: changing ADMIN_EMAIL logs
  // out any old session even if it still holds a validly signed cookie.
  if (!isAdminEmail(payload.email)) return null;
  return payload.email;
}

/**
 * Guard for every mutating action. The proxy redirect is only an
 * optimisation; this is the check that actually protects data.
 */
export async function requireAdmin(): Promise<string> {
  const email = await getSessionEmail();
  if (!email) throw new Error("Not authorized — sign in first.");
  return email;
}
