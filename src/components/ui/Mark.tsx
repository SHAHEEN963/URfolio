import { MARK_D } from "@/lib/mark-path";

/**
 * The URfolio mark — a bold "U" and "R" fused into one shape, with the
 * sparkle cut out where the letters meet. This is the untouched path from
 * `public/brand/logo.svg` (both subpaths, so the nonzero fill-rule still
 * carves the hole correctly), just with `fill="currentColor"` instead of
 * the hardcoded `#8F7277` so it can sit on dark or light backgrounds.
 *
 * Never edit this path directly — see SparkleOverlay.tsx for the animated
 * sparkle that sits on top of the cutout.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1080 1080" className={className} fill="currentColor" aria-hidden="true">
      <path d={MARK_D} />
    </svg>
  );
}
