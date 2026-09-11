"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Logo } from "@/components/ui/Logo";
import { SparkleOverlay, SPARKLE_CENTER } from "@/components/ui/SparkleOverlay";
import { PALETTE_BARS, BAR_BG_CLASS } from "@/lib/palette-bars";
import { PRELOADER_SEEN_KEY } from "@/lib/config";
import { markReady } from "@/lib/ready-event";
import { gsapEase } from "@/lib/motion";

/**
 * The five palette bars stack in, the mark appears, the sparkle overlay
 * turns and flashes once, then the bars wipe upward (brief §0). Max ~1.4s,
 * skippable with Esc/Enter/Space or a click, shown once per session.
 *
 * `window.__urfolioReady` may already be `true` here — layout.tsx's head
 * script sets it (and hides this element via CSS) synchronously on a repeat
 * visit or with reduced motion, before this component ever mounts. When
 * that's the case, this effect does nothing at all.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.__urfolioReady) return;

    const root = rootRef.current;
    if (!root) return;

    try {
      sessionStorage.setItem(PRELOADER_SEEN_KEY, "1");
    } catch {
      // sessionStorage unavailable (private-mode edge cases) — the
      // animation still plays fine, it just may replay on next load.
    }

    const bars = root.querySelectorAll<HTMLElement>("[data-bar]");
    const markEl = markRef.current;
    const sparkleEl = sparkleRef.current;

    // markReady() (which starts the hero's entrance) fires from this same
    // onComplete, once the bars have fully finished wiping away — not
    // partway through, like before. That earlier overlap meant the hero
    // animation was already partly playing, hidden behind the tail end of
    // the preloader; now the sequence is strictly loader → gone → hero.
    const finish = () => {
      root.style.display = "none";
      markReady();
    };

    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(
      bars,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.35, ease: gsapEase.enter, stagger: 0.05, transformOrigin: "left" },
      0
    )
      .fromTo(markEl, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.2, ease: gsapEase.enter }, 0.45)
      .to(
        sparkleEl,
        { rotate: 90, duration: 0.25, ease: gsapEase.ui, transformOrigin: `${SPARKLE_CENTER.x}px ${SPARKLE_CENTER.y}px` },
        0.65
      )
      .to(sparkleEl, { opacity: 0.2, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 0.65)
      .to(markEl, { opacity: 0, scale: 0.9, duration: 0.25, ease: gsapEase.ui }, 0.85)
      .to(bars, { yPercent: -100, duration: 0.35, ease: gsapEase.wipe, stagger: 0.035 }, 0.9);

    const skip = () => {
      tl.kill();
      finish(); // hides the overlay and calls markReady()
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    root.addEventListener("click", skip);
    window.addEventListener("keydown", onKey);

    return () => {
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      id="urfolio-preloader"
      // bg-espresso matters here: each bar starts scaled to zero width
      // (`transform: scaleX(0)`), which only affects paint, not layout — so
      // without its own opaque backdrop, this root was letting the actual
      // page (hero text, nav) show through the gaps for the first ~350ms,
      // right as the bars were still stacking in.
      className="fixed inset-0 z-[999] flex cursor-pointer flex-col bg-espresso"
      role="presentation"
      aria-hidden="true"
    >
      {PALETTE_BARS.map((c) => (
        <div key={c} data-bar className={`flex-1 ${BAR_BG_CLASS[c]}`} style={{ transform: "scaleX(0)" }} />
      ))}
      <div ref={markRef} className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0">
        <div className="relative h-20 w-20 text-paper sm:h-28 sm:w-28">
          <Logo className="absolute inset-0" />
          <SparkleOverlay ref={sparkleRef} className="absolute inset-0 text-caramel" />
        </div>
      </div>
      <button type="button" className="absolute bottom-8 right-8 text-small text-espresso/70">
        Skip ›
      </button>
    </div>
  );
}
