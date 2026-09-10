"use client";

import { useEffect, type ReactNode } from "react";
import { SiteStateProvider } from "@/lib/site-state";
import { startSmoothScroll } from "@/lib/smooth-scroll";

/**
 * Boots Lenis for pointer devices with no reduced-motion preference only —
 * touch keeps native momentum scrolling, and reduced motion keeps native
 * scrolling entirely, so both keep their own keyboard/scrollbar/find-in-page
 * behaviour untouched (brief §5).
 *
 * Reads matchMedia directly inside the effect (rather than through the
 * `useIsTouchDevice`/`useReducedMotion` hooks, which default to `false`
 * until their own effects run) so Lenis is never even briefly started for a
 * touch or reduced-motion visitor.
 */
function SmoothScrollBoot() {
  useEffect(() => {
    const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (touchQuery.matches || motionQuery.matches) return;
    const stop = startSmoothScroll();
    return stop;
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SiteStateProvider>
      <SmoothScrollBoot />
      {children}
    </SiteStateProvider>
  );
}
