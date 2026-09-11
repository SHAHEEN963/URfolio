"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteContent } from "@/lib/site-content";
import { whatsappHref, mailHref } from "@/lib/contact-links";
import { scrollToHash } from "@/lib/smooth-scroll";
import { gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const BANDS = 5;

/** A link that renders visibly disabled when its target is still an unfilled placeholder. */
function ContactLink({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (!href) {
    return (
      <span className="ph-inline" title="Placeholder — replace before launch">
        {children}
      </span>
    );
  }
  return (
    <a href={href} className="hover:text-caramel">
      {children}
    </a>
  );
}

export function Footer() {
  const { footer, contact } = useSiteContent();
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = wordmarkRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const bands = root.querySelectorAll<HTMLElement>("[data-band]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bands,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.8,
          ease: gsapEase.enter,
          stagger: stagger.bars,
          scrollTrigger: { trigger: root, start: "top 90%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const wa = whatsappHref(contact, "Hi! I'd like to build a portfolio with URfolio.");
  const mail = mailHref(contact);

  return (
    <footer className="section pb-12">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--line)] pb-10 text-small text-fg-muted">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <ContactLink href={mail}>{contact.email || "[Email]"}</ContactLink>
            <ContactLink href={wa}>{contact.whatsappDisplay}</ContactLink>
            {contact.socials.map((s) => (
              <ContactLink key={s.id} href={s.href || null}>
                {s.label}
              </ContactLink>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollToHash("#top")}
            className="rounded-full border border-[var(--line)] px-4 py-2 hover:border-caramel hover:text-caramel"
          >
            ↑ {footer.backToTop}
          </button>
        </div>

        <div
          ref={wordmarkRef}
          className="relative mt-10 h-[calc(var(--fs-display)*0.85)] overflow-hidden select-none"
          aria-hidden="true"
        >
          {Array.from({ length: BANDS }).map((_, i) => (
            <div
              key={i}
              data-band
              className="absolute inset-x-0 overflow-hidden"
              style={{ top: `${(i / BANDS) * 100}%`, height: `${100 / BANDS}%` }}
            >
              <span
                className="footer-wordmark absolute inset-x-0 block text-display leading-[0.85] text-fg"
                // The band div's own height (1/5th of the full wordmark) is
                // this span's percentage-resolution base, so shifting it up
                // by `i * 100%` reveals exactly the i-th fifth of the glyph
                // through this band's `overflow: hidden` window.
                style={{ top: `${-i * 100}%` }}
              >
                {footer.wordmark}
              </span>
            </div>
          ))}
        </div>
        <h2 className="visually-hidden">{footer.wordmark}</h2>

        <p className="text-small text-fg-muted mt-8">
          {footer.tagline} · © {new Date().getFullYear()} {footer.wordmark}.
        </p>
      </div>
    </footer>
  );
}
