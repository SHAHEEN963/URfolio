"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a boolean media query via `useSyncExternalStore` — the
 * SSR-safe way to read browser-only state: the server snapshot is always
 * `false` (matching first paint, no hydration mismatch), and React
 * re-checks the real value right after hydration and on every change.
 */
function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/**
 * Tracks `prefers-reduced-motion: reduce`. Every signature animation and
 * scroll-driven effect in the sections checks this before running (Phase 0
 * plan, motion rules) — reduced-motion visitors get the finished state
 * immediately instead of a stripped-down animation.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for touch/coarse-pointer devices — cursor effects and pinning are disabled there. */
export function useIsTouchDevice(): boolean {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}
