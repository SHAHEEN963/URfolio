/**
 * The five bars from public/brand/color.svg, top to bottom. Reused by the
 * preloader, the mobile-menu wipe, and the footer wordmark reveal.
 *
 * Written as full literal Tailwind class names in a lookup object (never
 * built with a template string) so Tailwind's scanner — which only sees
 * complete class names in source, not interpolated ones — actually
 * generates `bg-mauve`, `bg-caramel`, etc.
 */
export const PALETTE_BARS = ["mauve", "caramel", "cocoa", "plum", "clay"] as const;

export type PaletteColor = (typeof PALETTE_BARS)[number];

export const BAR_BG_CLASS: Record<PaletteColor, string> = {
  mauve: "bg-mauve",
  caramel: "bg-caramel",
  cocoa: "bg-cocoa",
  plum: "bg-plum",
  clay: "bg-clay",
};
