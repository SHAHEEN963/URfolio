"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { proof, isPh } from "@/content/site";
import { gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

// ─── Counters ──────────────────────────────────────────────────────────

function Counter({ value, suffix, label }: { value: number | string; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (isPh(value)) return;
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: reduced ? 0 : 1.4,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.n).toString();
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });
    return () => ctx.revert();
  }, [value, reduced]);

  return (
    <div data-stat>
      <p className="text-h2 text-fg">
        {isPh(value) ? (
          <span className="ph-block">{value}</span>
        ) : (
          <>
            <span ref={ref} className="tabular-nums">
              0
            </span>
            {suffix}
          </>
        )}
      </p>
      <p className="text-small text-fg-muted mt-1">{label}</p>
    </div>
  );
}

// ─── Testimonial 3D stack ──────────────────────────────────────────────

const TOTAL = proof.testimonials.length;

/** Depth styling per position in the ring, 0 = front. Alternating rotation gives a fanned, not lopsided, stack. */
function depthStyle(offset: number) {
  const dir = offset % 2 === 0 ? -1 : 1;
  return {
    z: offset === 0 ? 0 : -40 - (offset - 1) * 38,
    y: offset === 0 ? 0 : 10 + (offset - 1) * 8,
    scale: 1 - offset * 0.055,
    rotationY: offset === 0 ? 0 : dir * (6 + (offset - 1) * 2),
    opacity: offset === 0 ? 1 : Math.max(0.1, 0.52 - (offset - 1) * 0.2),
    zIndex: TOTAL - offset,
  };
}

function TestimonialStack() {
  const [index, setIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const positioned = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const reduced = useReducedMotion();

  const goTo = (i: number) => setIndex((i + TOTAL) % TOTAL);

  useEffect(() => {
    const cards = cardRefs.current;
    cards.forEach((card, i) => {
      if (!card) return;
      const offset = (i - index + TOTAL) % TOTAL;
      const target = depthStyle(offset);
      if (!positioned.current || reduced) {
        gsap.set(card, target);
      } else {
        gsap.to(card, { ...target, duration: 0.6, ease: gsapEase.enter });
      }
    });
    positioned.current = true;
  }, [index, reduced]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className="relative mx-auto h-[210px] sm:h-[180px]"
        style={{ perspective: "1200px" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {proof.testimonials.map((t, i) => {
          const isFront = i === index;
          return (
            <div
              key={t.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              aria-hidden={!isFront}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--bg-raised)] px-6 py-6 text-center will-change-transform"
              style={{ pointerEvents: isFront ? "auto" : "none" }}
            >
              <p className="text-lead text-fg">“{t.quote}”</p>
              <p className="text-small text-fg-muted mt-4">
                {t.name} — {t.role}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4" role="group" aria-label="Client testimonials">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous testimonial"
          className="text-fg-muted hover:text-caramel"
        >
          ‹
        </button>
        <span className="text-micro text-fg-muted tabular-nums" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next testimonial"
          className="text-fg-muted hover:text-caramel"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export function Proof() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Entrance: stat blocks rise in a stagger as a group; the testimonial
  // stack fades in on its own right after.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const stats = root.querySelectorAll<HTMLElement>("[data-stat]");
    const stack = root.querySelector<HTMLElement>("[data-stack]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 80%" } });
      tl.fromTo(stats, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: gsapEase.enter, stagger: stagger.rows });
      if (stack) tl.fromTo(stack, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: gsapEase.enter }, "-=0.3");
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="section" aria-label="Proof">
      <div ref={rootRef} className="container">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {proof.metrics.map((m, i) => (
            <Counter key={i} value={m.value} suffix={m.suffix} label={m.label} />
          ))}
        </div>
        <div className="mt-16 flex justify-center" data-stack>
          <TestimonialStack />
        </div>
      </div>
    </section>
  );
}
