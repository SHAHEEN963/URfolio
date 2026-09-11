"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { audiences, type AudiencePanel } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { useSiteState } from "@/lib/site-state";
import { useIsTouchDevice, useReducedMotion } from "@/lib/useReducedMotion";
import { gsapEase, stagger } from "@/lib/motion";
import { scrollToHash } from "@/lib/smooth-scroll";

/**
 * Two audience panels, always at their natural fixed size (no resizing,
 * sliding or clip-path trick — that used to cause overlap/clipping). Hover
 * instead "lights up" the panel in place: a soft tint wash, a glow behind
 * the heading, the CTA lifting slightly, and the other panel dimming a
 * touch — all transform/opacity, ~350ms, disabled on touch.
 */
function Panel({
  panel,
  hovered,
  dimmed,
  onHoverChange,
}: {
  panel: AudiencePanel;
  hovered: boolean;
  dimmed: boolean;
  onHoverChange: (v: boolean) => void;
}) {
  const { setAudience } = useSiteState();
  const isIndividual = panel.audience === "individual";

  return (
    <div
      data-audience-panel
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="relative flex flex-col justify-center overflow-hidden p-10 transition-opacity duration-[350ms] ease-[--ease-ui] lg:p-16"
      style={{
        background: isIndividual ? "var(--espresso-2)" : "var(--plum)",
        opacity: dimmed ? 0.8 : 1,
      }}
    >
      {/* Hover tint wash — brightens the panel a touch without touching layout. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-[350ms] ease-[--ease-ui]"
        style={{ background: "var(--paper)", opacity: hovered ? 0.06 : 0 }}
      />

      <div className="relative">
        <p className="text-small text-caramel">{panel.eyebrow}</p>
        <h3 className="text-h2 relative mt-3 inline-block text-fg">
          {/* Accent glow behind the heading, sweeping in from the left. */}
          <span
            aria-hidden="true"
            className="absolute -inset-x-2 -inset-y-1 -z-10 origin-left rounded-sm bg-caramel/15 transition-transform duration-[350ms] ease-[--ease-ui]"
            style={{ transform: hovered ? "scaleX(1)" : "scaleX(0)" }}
          />
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
        <div
          className="mt-8 inline-block transition-transform duration-300 ease-[--ease-ui]"
          style={{ transform: hovered ? "translateY(-3px)" : "translateY(0)" }}
        >
          <Button
            variant={isIndividual ? "primary" : "secondary"}
            // A single arbitrary box-shadow with the same two layers (an
            // inset "ring" + an outer glow) in both states, so the browser
            // can interpolate it smoothly on transition-shadow rather than
            // snapping — mixing this with Tailwind's own `ring-*` utility
            // would just have one silently overwrite the other's box-shadow.
            className={`transition-shadow duration-300 ease-[--ease-ui] ${
              hovered
                ? "shadow-[inset_0_0_0_2px_rgba(214,162,116,0.5),0_10px_24px_-8px_rgba(214,162,116,0.55)]"
                : "shadow-[inset_0_0_0_0px_rgba(214,162,116,0),0_0_0_0_rgba(214,162,116,0)]"
            }`}
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

export function Audiences() {
  const [hovered, setHovered] = useState<"individual" | "company" | null>(null);
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  // Entrance: both panels rise together as one unit (this section's single
  // entrance behaviour).
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
  // Hover-dependent effects are desktop-only — touch devices get the panels
  // at rest, with no dimming/tint/lift to fight tap interactions.
  const hoverEnabled = !isTouch;

  return (
    <section id="audiences" className="section" aria-label="Who we build for">
      <h2 className="container text-h2 text-fg mb-10">{audiences.heading}</h2>
      <div
        ref={rootRef}
        className="grid grid-cols-1 gap-px bg-[var(--line)] md:grid-cols-2"
        onMouseLeave={() => setHovered(null)}
      >
        <Panel
          panel={individual}
          hovered={hoverEnabled && hovered === "individual"}
          dimmed={hoverEnabled && hovered === "company"}
          onHoverChange={(v) => hoverEnabled && setHovered(v ? "individual" : null)}
        />
        <Panel
          panel={company}
          hovered={hoverEnabled && hovered === "company"}
          dimmed={hoverEnabled && hovered === "individual"}
          onHoverChange={(v) => hoverEnabled && setHovered(v ? "company" : null)}
        />
      </div>
    </section>
  );
}
