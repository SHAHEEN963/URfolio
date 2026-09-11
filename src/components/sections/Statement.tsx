"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteContent } from "@/lib/site-content";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Scroll-fill statement (brief §4). Two stacked, pixel-identical copies of
 * the same text — a dim mauve base layer, and a paper overlay whose words
 * fade in word-by-word as the section scrolls through view. Only `opacity`
 * animates (never `color`), per the motion rules.
 */
export function Statement() {
  const { statement } = useSiteContent();
  const words = statement.text.split(" ");
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const overlayWords = root.querySelectorAll<HTMLElement>("[data-fill-word]");
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          end: "bottom 45%",
          scrub: true,
        },
      }).to(overlayWords, { opacity: 1, stagger: 0.05, ease: "none" });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="section" aria-label="Why URfolio">
      <div className="container">
        <div ref={rootRef} className="relative mx-auto max-w-4xl">
          <p className="text-statement text-mauve opacity-25" aria-hidden="true">
            {statement.text}
          </p>
          <p className="text-statement absolute inset-0 text-paper">
            {words.map((word, i) => (
              <span key={i} data-fill-word style={{ opacity: reduced ? 1 : 0 }}>
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
