/**
 * Signed session tokens.
 *
 * Uses Web Crypto (HMAC-SHA256) rather than node:crypto so the exact same
 * verification runs in the Edge proxy and in Node server actions.
 *
 * Token shape: <base64url(payload)>.<base64url(hmac)>
 * The payload is not secret — it is signed, not encrypted — so it holds only
 * the admin's email and an expiry.
 */

export const SESSION_COOKIE = "urfolio_session";
// "Keep the user logged in until they log out" — 400 days is the longest
// expiry Chrome/most browsers accept for a cookie, i.e. as close to
// indefinite as a cookie can practically be, while still being a bounded,
// re-checked value rather than a session with no expiry at all.
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 400;

export type SessionPayload = {
  email: string;
  /** Unix seconds. */
  exp: number;
};

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Returns an explicitly ArrayBuffer-backed view, which is what BufferSource wants. */
function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET is missing or too short (needs 32+ characters). Add it to .env.local.");
  }
  return secret;
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(email: string): Promise<string> {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await importKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(encoded));
  return `${encoded}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the payload only if the signature is valid and the token is unexpired. */
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  try {
    const key = await importKey();
    const valid = await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), new TextEncoder().encode(encoded));
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded))) as SessionPayload;

    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
