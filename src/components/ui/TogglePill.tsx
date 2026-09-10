"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { gsapEase, duration } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Option<T extends string> = { value: T; label: string };

/**
 * A two- or three-way pill toggle with a sliding highlight (hero
 * Individual/Company, before/after Without/With). Every option gets an
 * equal-width slot up front, so the highlight only ever needs `transform`
 * — no width animation, keeping it on the compositor per the motion rules.
 */
export function TogglePill<T extends string>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  "aria-label": string;
}) {
  const activeIndex = options.findIndex((o) => o.value === value);
  const highlightRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  // A plain ref, not state: it only distinguishes "first paint" (jump, no
  // tween) from "later" (animate) — nothing needs to re-render because of it.
  const positioned = useRef(false);

  useLayoutEffect(() => {
    const target = itemRefs.current[activeIndex];
    const highlight = highlightRef.current;
    if (!target || !highlight) return;
    const x = target.offsetLeft;
    const width = target.offsetWidth;
    if (!positioned.current) {
      gsap.set(highlight, { x, width });
      positioned.current = true;
      return;
    }
    gsap.to(highlight, {
      x,
      width,
      duration: reduced ? 0 : duration.ui,
      ease: gsapEase.ui,
    });
  }, [activeIndex, reduced]);

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="relative inline-flex rounded-full border border-[var(--line)] p-1 bg-[var(--bg-raised)]"
    >
      <div
        ref={highlightRef}
        aria-hidden="true"
        className="absolute inset-y-1 left-0 rounded-full bg-caramel"
        style={{ willChange: "transform" }}
      />
      {options.map((opt, i) => (
        <button
          key={opt.value}
          ref={(el) => {
            itemRefs.current[i] = el;
          }}
          role="radio"
          aria-checked={opt.value === value}
          onClick={() => onChange(opt.value)}
          className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-[--dur-ui] ${
            opt.value === value ? "text-espresso" : "text-fg-muted hover:text-fg"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
