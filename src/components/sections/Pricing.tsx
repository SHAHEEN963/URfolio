"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pricing, isPh, type PricingPlan } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SparkleOverlay } from "@/components/ui/SparkleOverlay";
import { AutoPlaceholder } from "@/components/ui/Placeholder";
import { useSiteState } from "@/lib/site-state";
import { gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

function PriceTag({ plan }: { plan: PricingPlan }) {
  if (isPh(plan.price)) {
    return (
      <p className="text-h2 mt-4 text-fg">
        {plan.currency} <span className="ph-block">{plan.price}</span>
      </p>
    );
  }
  return (
    <p className="text-h2 mt-4 text-fg">
      {plan.currency} {plan.price.toLocaleString()}
    </p>
  );
}

function Card({ plan }: { plan: PricingPlan }) {
  const { choosePlan } = useSiteState();
  return (
    <div
      data-pricing-card
      className={`flex flex-col rounded-[var(--radius-sm)] border p-8 ${
        plan.featured
          ? "border-caramel bg-[var(--bg-raised)] lg:-translate-y-4 lg:scale-105"
          : "border-[var(--line)] bg-[var(--bg)]"
      }`}
    >
      {plan.featured && (
        <div className="mb-2 flex items-center gap-2 text-small text-caramel">
          <SparkleOverlay className="h-3.5 w-3.5" />
          Recommended
        </div>
      )}
      <h3 className="text-h3 text-fg">{plan.name}</h3>
      <PriceTag plan={plan} />
      <ul className="mt-6 flex-1 space-y-2 text-fg-muted">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2 text-small">
            <span aria-hidden="true">—</span>
            <span>
              <AutoPlaceholder text={f} />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button
          variant={plan.featured ? "primary" : "secondary"}
          onClick={() => choosePlan(plan.id)}
          className="w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  );
}

export function Pricing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const cards = root.querySelectorAll("[data-pricing-card]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: gsapEase.enter,
          stagger: stagger.rows,
          scrollTrigger: { trigger: root, start: "top 80%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="pricing"
      data-surface="paper"
      className="section bg-[var(--bg)] text-[var(--fg)]"
      aria-label="Pricing"
    >
      <div ref={rootRef} className="container">
        <h2 className="text-h2 mb-12 text-center text-fg">{pricing.heading}</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <Card key={plan.id} plan={plan} />
          ))}
        </div>
        <p className="text-small text-fg-muted mt-10 text-center">{pricing.note}</p>
      </div>
    </section>
  );
}
