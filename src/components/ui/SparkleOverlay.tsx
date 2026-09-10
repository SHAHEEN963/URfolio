import { forwardRef } from "react";
import { SPARKLE_D, SPARKLE_CENTER } from "@/lib/mark-path";

export { SPARKLE_CENTER };

/**
 * The four-point sparkle, as a standalone filled shape — a copy of the hole
 * cut into Mark.tsx's path, with its opening moveto rewritten as absolute so
 * it stands alone. Same viewBox as Mark, so it lines up on the cutout at any
 * size with zero manual offsets. Its geometric centre is SPARKLE_CENTER, for
 * use as a rotation transform-origin.
 *
 * Reused three places: the preloader (rotates + flashes once), the marquee
 * separator, and here on the logo itself. Forwards its ref to the <svg> so
 * GSAP can animate it directly.
 */
export const SparkleOverlay = forwardRef<SVGSVGElement, { className?: string; style?: React.CSSProperties }>(
  function SparkleOverlay({ className, style }, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 1080 1080"
        className={className}
        style={style}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={SPARKLE_D} />
      </svg>
    );
  }
);
