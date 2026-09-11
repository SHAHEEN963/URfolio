import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

const KEY_LEN = 64;

/**
 * Hashes a password with scrypt and a per-password random salt.
 * Format: scrypt$<saltHex>$<keyHex> — self-describing, so it can be
 * verified later without storing parameters separately.
 *
 * The plaintext password is never written to disk, logged, or committed —
 * only the output of this function belongs in ADMIN_PASSWORD_HASH.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

/** Constant-time verification. Returns false for any malformed stored hash. */
export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  if (!stored) return false;
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length !== KEY_LEN) return false;

  const actual = await scrypt(password, salt, KEY_LEN);
  // Lengths match by construction, so timingSafeEqual is safe to call.
  return timingSafeEqual(actual, expected);
}
