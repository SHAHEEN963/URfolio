"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { process as processContent } from "@/content/site";
import { WorkVisual } from "@/components/ui/WorkVisual";
import { useIsTouchDevice, useReducedMotion } from "@/lib/useReducedMotion";

const STEP_COUNT = processContent.steps.length;

/** The step visual — a distinct generated composition per step. */
function StepVisual({ index }: { index: number }) {
  return (
    <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
      <WorkVisual seed={20 + index} className="h-full w-full" />
    </div>
  );
}

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();
  const pinned = !isTouch && !reduced;

  useEffect(() => {
    // Touch / reduced motion render an entirely different (unpinned) JSX
    // branch below that never reads `activeStep`, so there's nothing to
    // synchronize here.
    if (!pinned) return;
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: pinRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(line, { scaleY: self.progress });
          setActiveStep(Math.min(STEP_COUNT - 1, Math.floor(self.progress * STEP_COUNT)));
        },
      });
      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, [pinned]);

  if (!pinned) {
    // Touch / reduced motion: a plain vertical list, no pinning.
    return (
      <section id="process" className="section" aria-label="How it works">
        <div className="container">
          <h2 className="text-h2 text-fg mb-12">{processContent.heading}</h2>
          <ol className="space-y-12">
            {processContent.steps.map((step, i) => (
              <li key={step.number} className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                <div className="flex sm:flex-col items-start gap-4 sm:gap-0">
                  <span className="text-h3 text-caramel">{step.number}</span>
                  <div className="hidden sm:block mt-2 h-full w-px bg-[var(--line)]" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-h3 text-fg">{step.title}</h3>
                  <p className="text-lead measure mt-2 text-fg-muted">{step.description}</p>
                  <div className="mt-6 max-w-sm">
                    <StepVisual index={i} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="process" ref={sectionRef} aria-label="How it works">
      {/*
        Not the shared `.section` class here on purpose: its padding-block
        (clamp(5rem, …, 11rem) — up to 176px) is meant for a normal scrolling
        section, but this one is pinned to a fixed-height viewport box, so
        that much padding both pushed the heading far down on entry and made
        the top/bottom gap uneven against the content's actual height. A
        small, fixed, equal padding keeps the pin visually balanced at any
        screen height.
      */}
      <div ref={pinRef} className="min-h-screen flex items-center py-12 sm:py-16">
        <div className="container grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-h2 text-fg mb-10">{processContent.heading}</h2>
            <div className="relative flex gap-8">
              <div className="relative w-px shrink-0 bg-[var(--line)]">
                <div
                  ref={lineRef}
                  className="absolute inset-x-0 top-0 h-full origin-top bg-caramel"
                  style={{ transform: "scaleY(0)" }}
                />
              </div>
              <ol className="flex-1 space-y-10">
                {processContent.steps.map((step, i) => (
                  <li
                    key={step.number}
                    className="transition-opacity duration-500"
                    style={{ opacity: i <= activeStep ? 1 : 0.35 }}
                  >
                    <span className="text-small text-caramel">{step.number}</span>
                    <h3 className="text-h3 text-fg mt-1">{step.title}</h3>
                    {i === activeStep && <p className="text-lead measure mt-2 text-fg-muted">{step.description}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="relative">
            {processContent.steps.map((_, i) => (
              <div
                key={i}
                className="transition-opacity duration-500"
                style={{
                  opacity: i === activeStep ? 1 : 0,
                  position: i === activeStep ? "relative" : "absolute",
                  inset: 0,
                }}
              >
                <StepVisual index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
