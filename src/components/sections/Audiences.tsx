"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audiences, type Audience, type AudiencePanel } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { useSiteState } from "@/lib/site-state";
import { useIsTouchDevice, useReducedMotion } from "@/lib/useReducedMotion";
import { gsapEase, stagger } from "@/lib/motion";
import { scrollToHash } from "@/lib/smooth-scroll";

/**
 * Two audience panels. On desktop, hovering one expands it from 50/50 to
 * 62/38 — both panels stay full width and only their `clip-path` (plus a
 * `transform` shift on the inner content) changes, per Phase 0 plan flag 7,
 * so nothing here ever animates layout width directly.
 */
function Panel({
  panel,
  side,
  hoverShare,
  onMouseEnter,
}: {
  panel: AudiencePanel;
  side: "left" | "right";
  /** 0.5 at rest; the hovered panel's share when a panel is hovered (e.g. 0.62). */
  hoverShare: number;
  onMouseEnter: () => void;
}) {
  const { setAudience } = useSiteState();
  const clipPath =
    side === "left" ? `inset(0 ${(1 - hoverShare) * 100}% 0 0)` : `inset(0 0 0 ${hoverShare * 100}%)`;
  // The content box is a fixed 50%-of-container width, anchored to this
  // panel's own edge — so at rest (hoverShare=0.5) it exactly fills its
  // half's clip window. When the split moves off 50/50, this shifts it (as
  // a % of its OWN width, so it works identically for the left- and
  // right-anchored box) back toward the centre of its new, wider-or-
  // narrower window — derivation: Phase 0 plan flag 7.
  const shiftPct = hoverShare * 100 - 50;

  return (
    <div
      data-audience-panel
      // clip-path excludes the clipped-away area from hit-testing in every
      // major browser, so attaching the hover handler here — not on an
      // unclipped wrapper — is what keeps each half's hover zone from
      // swallowing the other's (the two panels fully overlap at rest).
      onMouseEnter={onMouseEnter}
      className="absolute inset-0 transition-[clip-path] duration-[--dur-ui] ease-[--ease-ui]"
      style={{
        clipPath,
        // The background lives on this same clipped box, so the colour
        // fill always exactly matches whatever clip-path currently reveals
        // — the inner box below only ever positions the *content*, sized
        // to the panel's rest-state half so it never needs to animate width.
        background: panel.audience === "individual" ? "var(--espresso-2)" : "var(--plum)",
      }}
    >
      <div
        className={`absolute inset-y-0 flex w-1/2 flex-col justify-center p-10 lg:p-16 transition-transform duration-[--dur-ui] ease-[--ease-ui] ${
          side === "left" ? "left-0" : "right-0"
        }`}
        style={{ transform: `translateX(${shiftPct}%)` }}
      >
        <p className="text-small text-caramel">{panel.eyebrow}</p>
        <h3 className="text-h2 mt-3 text-fg">
          {panel.heading.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h3>
        <ul className="measure mt-6 space-y-2 text-fg-muted">
          {panel.points.map((point) => (
            <li key={point} className="flex gap-2">
              <span aria-hidden="true">—</span>
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button
            variant={panel.audience === "individual" ? "primary" : "secondary"}
            onClick={() => {
              setAudience(panel.audience);
              scrollToHash("#contact");
            }}
          >
            {panel.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Full-flow mobile/tablet card — no absolute clip-path trick, no hover. */
function StackedPanel({ panel }: { panel: AudiencePanel }) {
  const { setAudience } = useSiteState();
  return (
    <div
      className="p-8 sm:p-10"
      style={{ background: panel.audience === "individual" ? "var(--espresso-2)" : "var(--plum)" }}
    >
      <p className="text-small text-caramel">{panel.eyebrow}</p>
      <h3 className="text-h2 mt-3 text-fg">
        {panel.heading.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h3>
      <ul className="measure mt-6 space-y-2 text-fg-muted">
        {panel.points.map((point) => (
          <li key={point} className="flex gap-2">
            <span aria-hidden="true">—</span>
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button
          variant={panel.audience === "individual" ? "primary" : "secondary"}
          onClick={() => {
            setAudience(panel.audience);
            scrollToHash("#contact");
          }}
        >
          {panel.cta}
        </Button>
      </div>
    </div>
  );
}

export function Audiences() {
  const [hovered, setHovered] = useState<Audience | null>(null);
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Entrance: both panels rise together as one unit (this section's single
  // entrance behaviour), driven by the panel content, not the clip layer.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = root.querySelectorAll<HTMLElement>("[data-audience-panel]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: gsapEase.enter,
          stagger: stagger.rows,
          scrollTrigger: { trigger: root, start: "top 75%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const [individual, company] = audiences.panels;
  const leftShare = !isTouch && hovered === "individual" ? 0.62 : !isTouch && hovered === "company" ? 0.38 : 0.5;

  return (
    <section id="audiences" className="section" aria-label="Who we build for">
      <h2 className="container text-h2 text-fg mb-10">{audiences.heading}</h2>
      <div
        ref={rootRef}
        className="relative min-h-[640px] sm:min-h-[560px] hidden md:block"
        onMouseLeave={() => setHovered(null)}
      >
        <Panel panel={individual} side="left" hoverShare={leftShare} onMouseEnter={() => setHovered("individual")} />
        <Panel panel={company} side="right" hoverShare={leftShare} onMouseEnter={() => setHovered("company")} />
      </div>
      <div className="grid gap-px bg-[var(--line)] md:hidden" data-audience-panel>
        <StackedPanel panel={individual} />
        <StackedPanel panel={company} />
      </div>
    </section>
  );
}
