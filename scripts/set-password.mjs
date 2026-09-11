#!/usr/bin/env node
/**
 * Generates the dashboard's password hash.
 *
 *   npm run set-password
 *
 * Prints the scrypt hash for ADMIN_PASSWORD_HASH. The plaintext password is
 * never written to a file, logged elsewhere, or transmitted anywhere —
 * only the one-way hash this prints belongs in your environment variables.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { promisify } from "node:util";
import readline from "node:readline";

const scrypt = promisify(scryptCb);
const KEY_LEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

const fromArgv = process.argv[2];
const password = fromArgv ?? (await ask("New dashboard password (12+ characters): "));

if (!password || password.length < 12) {
  console.error("\n✗ Too short — use at least 12 characters.");
  process.exit(1);
}

const hash = await hashPassword(password);

console.log("\n✓ Add these to .env.local (development) and your host's environment");
console.log("  variables (production) — the password itself is not stored anywhere:\n");
console.log(`ADMIN_EMAIL=you@example.com`);
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
