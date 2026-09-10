"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

/**
 * Starts Lenis and syncs it with GSAP's ticker/ScrollTrigger, following
 * Lenis's own recommended integration. Skipped entirely for touch pointers
 * and `prefers-reduced-motion` (Phase 0 plan §5) — both keep native scrolling,
 * so the browser's own momentum, keyboard scrolling and find-in-page all keep
 * working untouched.
 */
export function startSmoothScroll(): () => void {
  if (lenis) return stopSmoothScroll;

  gsap.registerPlugin(ScrollTrigger);

  lenis = new Lenis({
    autoRaf: false,
    anchors: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const tick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return stopSmoothScroll;

  function stopSmoothScroll() {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  }
}

export function getLenis() {
  return lenis;
}

/** Scrolls to an in-page anchor, accounting for the fixed nav height. */
export function scrollToHash(hash: string, offset = -72) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { offset });
  } else {
    (target as HTMLElement).scrollIntoView({ block: "start" });
  }
}
