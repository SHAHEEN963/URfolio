"use client";

import { Mark } from "./Mark";
import { useSiteContent } from "@/lib/site-content";

/**
 * The brand mark everywhere it appears in chrome (nav, mobile menu,
 * preloader) — renders an uploaded logo image if one's set from
 * /dashboard's Branding tab, or the built-in currentColor mark otherwise.
 */
export function Logo({ className }: { className?: string }) {
  const { branding } = useSiteContent();
  if (branding.logoImage) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={branding.logoImage} alt="" className={`${className ?? ""} object-contain`} />
      </>
    );
  }
  return <Mark className={className} />;
}
