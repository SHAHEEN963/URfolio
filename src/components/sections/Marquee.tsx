"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SparkleOverlay } from "@/components/ui/SparkleOverlay";
import { useSiteContent } from "@/lib/site-content";
import { useReducedMotion } from "@/lib/useReducedMotion";

function Row({ reverse, words }: { reverse: boolean; words: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;
    const tween = gsap.to(track, {
      xPercent: reverse ? 0 : -50,
      ease: "none",
      duration: 28,
      repeat: -1,
    });
    if (reverse) gsap.set(track, { xPercent: -50 });

    const slow = () => gsap.to(tween, { timeScale: 0.25, duration: 0.6, ease: "power2.out" });
    const restore = () => gsap.to(tween, { timeScale: 1, duration: 0.6, ease: "power2.out" });
    track.addEventListener("mouseenter", slow);
    track.addEventListener("mouseleave", restore);

    return () => {
      tween.kill();
      track.removeEventListener("mouseenter", slow);
      track.removeEventListener("mouseleave", restore);
    };
  }, [reverse, reduced]);

  const items = (key: string) => (
    <span className="flex shrink-0 items-center gap-8 pr-8" key={key}>
      {words.map((word, i) => (
        <span key={i} className="flex items-center gap-8 text-h3 text-fg-muted">
          {word}
          <SparkleOverlay className="h-4 w-4 text-caramel" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex w-max">
        {items("a")}
        {items("b")}
      </div>
    </div>
  );
}

export function Marquee() {
  const { marquee } = useSiteContent();
  return (
    <div className="border-y border-[var(--line)] py-8" aria-hidden="true">
      <Row reverse={false} words={marquee.words} />
      <div className="h-6" />
      <Row reverse={true} words={marquee.words} />
    </div>
  );
}
