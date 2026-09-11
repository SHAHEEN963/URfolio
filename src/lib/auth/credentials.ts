import "server-only";

/**
 * The one authorized dashboard account. Both values come from environment
 * variables only — never hardcoded, never committed — so the password
 * itself never touches the frontend or the source tree; only its one-way
 * scrypt hash does, and only as an env var.
 *
 * Generate the hash locally with `npm run set-password` (it prints the
 * hash and never writes or transmits the plaintext), then set:
 *   ADMIN_EMAIL=you@example.com
 *   ADMIN_PASSWORD_HASH=scrypt$...
 * in .env.local for development, and in your host's environment variables
 * for production.
 */

export function getAdminEmail(): string | undefined {
  const email = process.env.ADMIN_EMAIL;
  return email ? email.trim().toLowerCase() : undefined;
}

export function getAdminPasswordHash(): string | undefined {
  return process.env.ADMIN_PASSWORD_HASH || undefined;
}

/** True once both env vars needed for login are actually configured. */
export function isAuthConfigured(): boolean {
  return Boolean(getAdminEmail() && getAdminPasswordHash());
}
