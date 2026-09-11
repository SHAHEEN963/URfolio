"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminEmail } from "./admin";
import { getAdminPasswordHash, isAuthConfigured } from "./credentials";
import { verifyPassword } from "./password";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "./session";

export type FormState = { error?: string };

/** Slows down bulk password guessing a little without a rate-limit store. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (!isAuthConfigured()) {
    return {
      error:
        "No dashboard account is configured yet. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH (see README) and restart the server.",
    };
  }

  // Always run the hash comparison, even for a non-admin address, so the
  // response time does not reveal which email is the real one.
  const emailAllowed = isAdminEmail(email);
  const passwordOk = await verifyPassword(password, getAdminPasswordHash());

  if (!emailAllowed || !passwordOk) {
    await delay(600);
    return { error: "Incorrect email or password." };
  }

  const token = await createSessionToken(email.toLowerCase());
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/dashboard/login");
}
