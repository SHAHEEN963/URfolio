"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useSiteContent } from "@/lib/site-content";
import { AutoPlaceholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { TogglePill } from "@/components/ui/TogglePill";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { useSiteState } from "@/lib/site-state";
import { onReady } from "@/lib/ready-event";
import { scrollToHash } from "@/lib/smooth-scroll";
import { gsapEase, stagger as staggerTokens } from "@/lib/motion";
import { useIsTouchDevice, useReducedMotion } from "@/lib/useReducedMotion";

const STEPS = ["wireframe", "identity", "assembled", "published"] as const;
type Step = (typeof STEPS)[number];
const STEP_DELAYS_MS = [0, 900, 2000, 3300]; // when each step becomes active

/** "Mohammad Shaheen" -> "mohammad-shaheen.com" — live as the visitor types. */
function nameToDomain(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // strip anything that isn't a domain-safe character
    .replace(/[\s-]+/g, "-") // collapse spaces/repeated hyphens into one
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
  return slug ? `${slug}.com` : "";
}

/** The hero's live build preview — a scripted demo, no real AI call (brief §2). */
function LivePreview({ visitorName }: { visitorName: string }) {
  const { hero } = useSiteContent();
  const { audience } = useSiteState();
  const sample = hero.preview[audience];
  const [step, setStep] = useState<Step>("wireframe");
  const reduced = useReducedMotion();
  const displayName = visitorName.trim() || sample.name;
  // Both the name and the domain shown in the preview come from the same
  // input, live — falling back to the sample domain once the typed name
  // strips down to nothing (e.g. only symbols/emoji were entered).
  const displayDomain = nameToDomain(visitorName) || sample.domain;

  useEffect(() => {
    // Reduced motion skips the scripted sequence entirely — handled as a
    // render-time value below, not by setting state here for a case that
    // has nothing else to do.
    if (reduced) return;
    // Every step — including the reset back to "wireframe" at delay 0 —
    // goes through setTimeout, so every setState call here happens in an
    // async callback rather than synchronously in the effect body.
    const timers = STEP_DELAYS_MS.map((delay, i) => setTimeout(() => setStep(STEPS[i]), delay));
    return () => timers.forEach(clearTimeout);
  }, [audience, reduced]);

  const displayStep = reduced ? "published" : step;
  const stepIndex = STEPS.indexOf(displayStep);

  return (
    <BrowserFrame url={displayDomain}>
      <div className="space-y-4">
        <div className="space-y-1">
          {stepIndex >= 1 ? (
            <>
              <p className="text-h3 leading-tight">{displayName}</p>
              <p className="text-fg-muted text-small">{sample.role}</p>
            </>
          ) : (
            <>
              <div className="h-5 w-40 rounded bg-[var(--bg-raised-2)]" />
              <div className="h-3 w-28 rounded bg-[var(--bg-raised-2)]" />
            </>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded transition-colors duration-500"
              style={{
                background: stepIndex >= 2 ? ["var(--mauve)", "var(--caramel)", "var(--clay)"][i] : "var(--bg-raised-2)",
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <div className="h-2 flex-[2] rounded-full bg-[var(--bg-raised-2)]" />
          <div className="h-2 flex-1 rounded-full bg-[var(--bg-raised-2)]" />
        </div>
        <div className="flex items-center gap-2 border-t border-[var(--line)] pt-3 text-micro text-fg-muted">
          <span
            className="inline-block size-1.5 rounded-full"
            style={{ background: stepIndex >= 3 ? "var(--caramel)" : "var(--fg-muted)" }}
          />
          {hero.previewStatus[stepIndex]}
        </div>
      </div>
    </BrowserFrame>
  );
}

/**
 * One headline line, split by word then by character. Each word is its own
 * `inline-block` so the browser can only wrap between words, never inside
 * one — splitting by bare character with no word grouping lets a trailing
 * punctuation mark (or any character) wrap onto its own line.
 */
function HeadlineLine({ line }: { line: string }) {
  const words = line.split(" ");
  return (
    <span className="block overflow-hidden py-[0.05em]">
      <span className="inline-block">
        {words.map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {[...word].map((char, j) => (
              <span key={j} data-char className="inline-block will-change-transform">
                {char}
              </span>
            ))}
            {w < words.length - 1 && (
              <span data-char className="inline-block will-change-transform">
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Hero() {
  const { hero } = useSiteContent();
  const { audience, setAudience } = useSiteState();
  const [visitorName, setVisitorName] = useState("");
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();

  // Signature entrance: hero headline splits into characters (the one place
  // in the site that does — every other heading masks by line instead).
  useEffect(() => {
    const headline = headlineRef.current;
    const rest = restRef.current;
    if (!headline || !rest) return;

    const chars = headline.querySelectorAll<HTMLElement>("[data-char]");
    const restChildren = rest.children;

    if (reduced) {
      gsap.set(chars, { opacity: 1, y: 0 });
      gsap.set(restChildren, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(chars, { opacity: 0, y: "110%" });
    gsap.set(restChildren, { opacity: 0, y: 16 });

    // `onReady`'s "already ready" path calls back synchronously and returns
    // a no-op unsubscribe — so if this effect ever runs a second time before
    // the first timeline finishes (React Strict Mode's mount→cleanup→mount
    // in dev, most commonly), that first timeline would otherwise be
    // orphaned: never killed, still animating elements a second copy of this
    // effect just reset to hidden. Capturing it here lets cleanup kill
    // whichever of "still subscribed" or "already playing" actually happened.
    let tl: gsap.core.Timeline | null = null;
    const stop = onReady(() => {
      tl = gsap
        .timeline()
        .to(chars, { opacity: 1, y: "0%", duration: 0.7, ease: gsapEase.enter, stagger: staggerTokens.heroChars })
        .to(restChildren, { opacity: 1, y: 0, duration: 0.6, ease: gsapEase.enter, stagger: 0.08 }, "-=0.35");
    });
    return () => {
      stop();
      tl?.kill();
    };
  }, [reduced]);

  // Sparkle-shaped cursor light — desktop only, subtle (brief §2).
  useEffect(() => {
    if (isTouch || reduced) return;
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!section || !glow) return;
    const quickX = gsap.quickTo(glow, "x", { duration: 0.6, ease: gsapEase.ui });
    const quickY = gsap.quickTo(glow, "y", { duration: 0.6, ease: gsapEase.ui });
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      quickX(e.clientX - rect.left);
      quickY(e.clientY - rect.top);
    };
    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [isTouch, reduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="section relative overflow-hidden"
      // `.section`'s own padding-block (globals.css) is unlayered CSS, so it
      // always wins over a Tailwind pt-* utility here regardless of source
      // order — an inline style is the one thing guaranteed to override it,
      // giving the hero a small, fixed gap below the fixed nav instead of
      // the section rhythm's much larger clamp() top padding.
      style={{ paddingTop: "calc(72px + 2rem)" }}
      aria-label="Introduction"
    >
      {!isTouch && !reduced && (
        <div
          ref={glowRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 -z-0 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, var(--caramel), transparent 70%)" }}
        />
      )}
      <div className="container relative grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <TogglePill
            aria-label="I'm looking for a portfolio as an"
            value={audience}
            onChange={setAudience}
            options={[
              { value: "individual", label: hero.toggle.individual },
              { value: "company", label: hero.toggle.company },
            ]}
          />

          {/*
            aria-label carries the real, correctly-spaced headline for
            screen readers; the animated per-line/per-character spans below
            are hidden from assistive tech, since their textContent runs the
            three lines together with no space ("...AI,finished by...").
          */}
          <h1 ref={headlineRef} className="text-hero mt-6 text-fg" aria-label={hero.headline.join(" ")}>
            <span aria-hidden="true">
              {hero.headline.map((line, i) => (
                <HeadlineLine key={i} line={line} />
              ))}
            </span>
          </h1>

          <div ref={restRef}>
            <p className="text-lead measure mt-6 text-fg-muted">
              <AutoPlaceholder text={hero.sub[audience]} />
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#contact" onClick={(e) => { e.preventDefault(); scrollToHash("#contact"); }}>
                {hero.ctaPrimary}
              </Button>
              <Button
                variant="secondary"
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHash("#work");
                }}
              >
                {hero.ctaSecondary}
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-small text-fg-muted">
              {hero.trustChips.map((chip, i) => (
                <li key={i}>
                  <AutoPlaceholder text={chip} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <LivePreview visitorName={visitorName} />
          <label className="mt-4 flex items-center gap-3 text-small text-fg-muted">
            {hero.namePrompt}
            <input
              type="text"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder={hero.preview[audience].name}
              maxLength={40}
              className="min-w-0 flex-1 rounded-full border border-[var(--line)] bg-transparent px-4 py-2 text-fg outline-none focus-visible:border-caramel"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
