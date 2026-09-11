"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { beforeAfter } from "@/content/site";
import { WorkVisual } from "@/components/ui/WorkVisual";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { gsapEase } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Mode = "without" | "with";

/** The cluttered CV + link-in-bio mock, desaturated. */
function WithoutMock() {
  return (
    <div className="grid grid-cols-2 gap-4 rotate-[-1.5deg]">
      <div className="rounded-sm bg-white/90 p-4 text-[#333] shadow-sm">
        <p className="text-xs font-bold">{beforeAfter.persona.name}.pdf</p>
        <div className="mt-3 space-y-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-1.5 rounded-full bg-[#333]/25" style={{ width: `${70 - i * 4}%` }} />
          ))}
        </div>
      </div>
      <div className="rotate-[2deg] rounded-sm bg-white/90 p-4 text-[#333] shadow-sm self-start">
        <p className="text-xs font-bold">link-in-bio</p>
        <div className="mt-3 space-y-2">
          {["Portfolio", "Instagram", "Old Behance", "Book me"].map((label) => (
            <div key={label} className="rounded-full border border-[#333]/30 px-2 py-1 text-[10px] text-[#333]/70">
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WithMock() {
  return (
    <BrowserFrame url={beforeAfter.persona.domain}>
      <p className="text-h3 leading-tight">{beforeAfter.persona.name}</p>
      <p className="text-fg-muted text-small">{beforeAfter.persona.role}</p>
      <div className="mt-4 aspect-video overflow-hidden rounded-[var(--radius-sm)]">
        <WorkVisual seed={99} className="h-full w-full" />
      </div>
    </BrowserFrame>
  );
}

const GLASS_CHIP =
  "block whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--bg)]/70 px-5 py-2 text-small font-medium text-fg backdrop-blur-md";

export function BeforeAfter() {
  const [mode, setMode] = useState<Mode>("without");
  const withRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const captionGroupRef = useRef<HTMLDivElement>(null);
  const captionWithoutRef = useRef<HTMLSpanElement>(null);
  const captionWithRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // Entrance: the glass caption chip reveals in a mask as the section
  // scrolls into view (this section's one entrance behaviour).
  useEffect(() => {
    const root = rootRef.current;
    const chip = captionGroupRef.current;
    if (!root || !chip || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chip,
        { yPercent: 130, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: gsapEase.enter,
          scrollTrigger: { trigger: root, start: "top 80%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Toggle morph: the card's clip-path circle reveal and the caption
  // crossfade animate together, on the same short, gentle transition — a
  // deliberately smaller/gentler curve than the old 1.2s expo.inOut wipe,
  // which read as slow and jumpy for a simple two-state toggle.
  useEffect(() => {
    const el = withRef.current;
    const without = captionWithoutRef.current;
    const withEl = captionWithRef.current;
    if (!el || !without || !withEl) return;
    const isWith = mode === "with";
    const clipPath = isWith ? "circle(150% at 50% 0%)" : "circle(0% at 50% 0%)";
    const cardOpacity = isWith ? 1 : 0;
    if (reduced) {
      el.style.clipPath = clipPath;
      el.style.opacity = String(cardOpacity);
      without.style.opacity = isWith ? "0" : "1";
      withEl.style.opacity = isWith ? "1" : "0";
      return;
    }
    gsap.to(el, { clipPath, opacity: cardOpacity, duration: 0.4, ease: gsapEase.ui });
    gsap.to(without, { opacity: isWith ? 0 : 1, duration: 0.35, ease: gsapEase.ui });
    gsap.to(withEl, { opacity: isWith ? 1 : 0, duration: 0.35, ease: gsapEase.ui });
  }, [mode, reduced]);

  return (
    <section
      id="before-after"
      data-surface="paper"
      // A fixed, smaller padding instead of `.section`'s clamp(5rem…11rem):
      // this is a compact toggle + card, not a long-form section, so that
      // much top/bottom space read as excessive empty space around it.
      className="bg-[var(--bg)] py-16 text-[var(--fg)] sm:py-20"
      aria-label="Before and after URfolio"
    >
      <div className="container">
        <h2 className="visually-hidden">Before and after URfolio</h2>

        <div className="flex justify-center">
          <div role="group" aria-label="Toggle between without and with URfolio" className="inline-flex rounded-full border border-[var(--line)] p-1">
            {(["without", "with"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="switch"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") setMode("without");
                  if (e.key === "ArrowRight") setMode("with");
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors duration-[--dur-ui] ${
                  mode === m ? "bg-cocoa text-paper" : "text-fg-muted hover:text-fg"
                }`}
              >
                {m === "without" ? beforeAfter.toggle.without : beforeAfter.toggle.with}
              </button>
            ))}
          </div>
        </div>

        <div ref={rootRef} className="relative mx-auto mt-8 max-w-2xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-raised)] p-6 grayscale sm:p-8">
            <WithoutMock />
          </div>
          <div ref={withRef} className="absolute inset-0 p-6 sm:p-8" style={{ clipPath: "circle(0% at 50% 0%)" }}>
            <WithMock />
          </div>

          {/* Glass caption — lives inside the card now and crossfades with
              the toggle, instead of a separate line of text underneath. */}
          <div
            ref={captionGroupRef}
            className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 sm:bottom-6"
            aria-live="polite"
          >
            <div className="relative">
              <span ref={captionWithoutRef} className={GLASS_CHIP} aria-hidden={mode !== "without"}>
                {beforeAfter.caption.without}
              </span>
              <span
                ref={captionWithRef}
                className={`${GLASS_CHIP} absolute inset-0 flex items-center justify-center opacity-0`}
                aria-hidden={mode !== "with"}
              >
                {beforeAfter.caption.with}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
