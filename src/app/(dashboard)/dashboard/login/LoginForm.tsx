"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/lib/auth/actions";

const initialState: FormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="flex w-full max-w-sm flex-col gap-5 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] p-8"
    >
      <div>
        <h1 className="text-h3 text-fg">URfolio Dashboard</h1>
        <p className="text-small text-fg-muted mt-1">Sign in to edit the site.</p>
      </div>

      <div>
        <label className="text-small text-fg-muted mb-2 block" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent px-4 py-3 text-fg outline-none focus-visible:border-caramel"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="text-small text-fg-muted mb-2 block" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent px-4 py-3 text-fg outline-none focus-visible:border-caramel"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-small text-mauve">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center rounded-full bg-caramel px-7 py-3.5 text-[0.95rem] font-medium text-espresso transition-colors hover:bg-clay disabled:opacity-50"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
