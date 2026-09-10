"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { beforeAfter } from "@/content/site";
import { WorkVisual } from "@/components/ui/WorkVisual";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { gsapEase, duration } from "@/lib/motion";
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

export function BeforeAfter() {
  const [mode, setMode] = useState<Mode>("without");
  const withRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Entrance: captions reveal in masks as the section comes into view.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const heading = root.querySelector("[data-reveal]");
    if (!heading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heading,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.7, ease: gsapEase.enter, scrollTrigger: { trigger: root, start: "top 80%" } }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  // Toggle morph: clip-path circle reveal from the switch, not a fade.
  useEffect(() => {
    const el = withRef.current;
    if (!el) return;
    if (reduced) {
      el.style.clipPath = mode === "with" ? "circle(150% at 50% 0%)" : "circle(0% at 50% 0%)";
      return;
    }
    gsap.to(el, {
      clipPath: mode === "with" ? "circle(150% at 50% 0%)" : "circle(0% at 50% 0%)",
      duration: duration.signature,
      ease: gsapEase.wipe,
    });
  }, [mode, reduced]);

  return (
    <section
      id="before-after"
      data-surface="paper"
      className="section bg-[var(--bg)] text-[var(--fg)]"
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

        <div ref={rootRef} className="relative mx-auto mt-12 max-w-2xl">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-raised)] p-8 grayscale">
            <WithoutMock />
          </div>
          <div ref={withRef} className="absolute inset-0 p-8" style={{ clipPath: "circle(0% at 50% 0%)" }}>
            <WithMock />
          </div>

          <p className="mt-8 overflow-hidden text-center">
            <span data-reveal className="text-h3 inline-block text-fg" aria-live="polite">
              {mode === "with" ? beforeAfter.caption.with : beforeAfter.caption.without}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
