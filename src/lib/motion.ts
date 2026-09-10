/**
 * Shared motion tokens (Phase 0 plan, §2 "Motion"). CSS easings mirror the
 * GSAP eases 1:1 so transition-based and GSAP-driven motion always match.
 */

export const ease = {
  /** cubic-bezier form of GSAP's expo.out — every entrance. */
  enter: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** cubic-bezier form of GSAP's power3.out — hover, press, toggles, accordion. */
  ui: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  /** cubic-bezier form of GSAP's expo.inOut — full-screen wipes and the before/after morph only. */
  wipe: "cubic-bezier(0.87, 0, 0.13, 1)",
} as const;

export const gsapEase = {
  enter: "expo.out",
  ui: "power3.out",
  wipe: "expo.inOut",
  scrub: "none",
} as const;

export const duration = {
  ui: 0.4,
  enter: 0.8,
  signature: 1.2,
} as const;

export const stagger = {
  lines: 0.08,
  heroChars: 0.018,
  bars: 0.07,
  rows: 0.05,
} as const;

/** Max px a magnetic button may travel toward the cursor. */
export const MAGNETIC_RANGE = 10;

/** Cap on how long the preloader can hold the page, in ms — Phase 0 flag 3. */
export const PRELOADER_MAX_MS = 1400;
