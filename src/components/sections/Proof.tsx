"use client";

import { useEffect, useRef, useState } from "react";
import { onCLS, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { proof, isPh } from "@/content/site";
import { gsapEase } from "@/lib/motion";
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
    <div>
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

// ─── Testimonial slider ────────────────────────────────────────────────

function TestimonialSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = proof.testimonials.length;

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = (i + total) % total;
    track.children[clamped]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      setIndex(Math.min(total - 1, Math.max(0, i)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [total]);

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]"
        role="region"
        aria-label="Client testimonials"
      >
        {proof.testimonials.map((t) => (
          <div key={t.id} className="w-full shrink-0 snap-start pr-6">
            <p className="text-lead measure text-fg">“{t.quote}”</p>
            <p className="text-small text-fg-muted mt-4">
              {t.name} — {t.role}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous testimonial"
          className="text-fg-muted hover:text-caramel"
        >
          ‹
        </button>
        <span className="text-micro text-fg-muted tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
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

// ─── Live performance instrument ──────────────────────────────────────

type VitalState = { value: number; rating: Metric["rating"] } | "measuring" | "waiting";

const VITAL_META: Record<string, { label: string; format: (v: number) => string }> = {
  LCP: { label: "LCP", format: (v) => `${(v / 1000).toFixed(2)}s` },
  CLS: { label: "CLS", format: (v) => v.toFixed(3) },
  INP: { label: "INP", format: (v) => `${Math.round(v)}ms` },
  TTFB: { label: "TTFB", format: (v) => `${Math.round(v)}ms` },
};

const RATING_COLOR: Record<NonNullable<Metric["rating"]>, string> = {
  good: "var(--caramel)",
  "needs-improvement": "var(--clay)",
  poor: "var(--mauve)",
};

function Instrument() {
  const [vitals, setVitals] = useState<Record<string, VitalState>>({
    LCP: "measuring",
    CLS: "measuring",
    INP: "waiting",
    TTFB: "measuring",
  });

  useEffect(() => {
    const set = (name: string) => (metric: Metric) =>
      setVitals((v) => ({ ...v, [name]: { value: metric.value, rating: metric.rating } }));
    onLCP(set("LCP"), { reportAllChanges: true });
    onCLS(set("CLS"), { reportAllChanges: true });
    onINP(set("INP"), { reportAllChanges: true });
    onTTFB(set("TTFB"), { reportAllChanges: true });
  }, []);

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-raised)] p-6">
      <p className="text-h3 text-fg">{proof.instrument.heading}</p>
      <dl className="mt-4 space-y-2">
        {Object.entries(VITAL_META).map(([key, meta]) => {
          const state = vitals[key];
          return (
            <div key={key} className="flex items-center justify-between text-micro">
              <dt className="text-fg-muted">{meta.label}</dt>
              <dd className="tabular-nums text-fg">
                {state === "measuring" && "measuring…"}
                {state === "waiting" && "waiting for a tap"}
                {typeof state === "object" && (
                  <span style={{ color: RATING_COLOR[state.rating] }}>{meta.format(state.value)}</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="text-small text-fg-muted mt-4">{proof.instrument.note}</p>
    </div>
  );
}

export function Proof() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: gsapEase.enter, scrollTrigger: { trigger: root, start: "top 80%" } }
      );
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
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_320px]">
          <TestimonialSlider />
          <Instrument />
        </div>
      </div>
    </section>
  );
}
