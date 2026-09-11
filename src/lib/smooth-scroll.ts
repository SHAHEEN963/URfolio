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

/**
 * Scrolls to an in-page anchor, accounting for the fixed nav height.
 *
 * A nav-link jump that has to cross a pinned section (currently just
 * "How it works", pinned for ~300% of a viewport height) used to spend a
 * large share of the scroll animation's distance inside that pin, where the
 * viewport visually holds still while only the step content flickers by —
 * reading as the whole jump pausing partway through. This hops across any
 * such pinned range instantly, with a normal smooth scroll on either side.
 * Manual wheel/trackpad scrolling never calls this function, so it's
 * completely unaffected.
 */
export function scrollToHash(hash: string, offset = -72) {
  const target = document.querySelector(hash);
  if (!target) return;

  if (!lenis) {
    (target as HTMLElement).scrollIntoView({ block: "start" });
    return;
  }

  const targetY = Math.max(
    0,
    (target as HTMLElement).getBoundingClientRect().top + window.scrollY + offset
  );
  const startY = window.scrollY;
  const goingDown = targetY > startY;
  const [from, to] = goingDown ? [startY, targetY] : [targetY, startY];

  const pins = ScrollTrigger.getAll().filter((st) => st.pin && st.start < to && st.end > from);

  if (pins.length === 0) {
    lenis.scrollTo(targetY, { offset: 0, duration: 1.1 });
    return;
  }

  const pinStart = Math.min(...pins.map((st) => st.start));
  const pinEnd = Math.max(...pins.map((st) => st.end));
  const BUFFER = 2; // lands just clear of the pin's own boundary, not exactly on it
  const approachY = goingDown ? pinStart - BUFFER : pinEnd + BUFFER;
  const jumpToY = goingDown ? pinEnd + BUFFER : pinStart - BUFFER;

  lenis.scrollTo(approachY, {
    offset: 0,
    duration: 0.9,
    onComplete: () => {
      lenis?.scrollTo(jumpToY, { offset: 0, immediate: true });
      lenis?.scrollTo(targetY, { offset: 0, duration: 0.7 });
    },
  });
}
