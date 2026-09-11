"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Mark } from "@/components/ui/Mark";
import { Button } from "@/components/ui/Button";
import { nav } from "@/content/site";
import { scrollToHash } from "@/lib/smooth-scroll";
import { gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { PALETTE_BARS, BAR_BG_CLASS } from "@/lib/palette-bars";

/**
 * Fixed nav: hides on scroll down, returns on scroll up, tracks which
 * section is active, and opens a full-screen mobile menu with the same
 * five-bar wipe used by the preloader (brief §1).
 */
export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Hide on scroll down, return on scroll up.
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current + 4;
      const goingUp = y < lastY.current - 4;
      if (goingDown && y > 120) setHidden(true);
      else if (goingUp || y < 120) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section tracking for the nav's own anchor links.
  useEffect(() => {
    const ids = nav.links.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: five-bar wipe down, links stagger in.
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const bars = el.querySelectorAll<HTMLElement>("[data-menu-bar]");
    const links = el.querySelectorAll<HTMLElement>("[data-menu-link]");

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      if (reduced) {
        gsap.set(bars, { scaleY: 1 });
        gsap.set(links, { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.set(el, { display: "flex" })
        .fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: gsapEase.wipe, stagger: stagger.bars })
        .fromTo(
          links,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: gsapEase.enter, stagger: stagger.lines },
          "-=0.2"
        );
    } else {
      document.body.style.overflow = "";
      if (reduced) return;
      gsap.to(el, { opacity: 0, duration: 0.2, onComplete: () => gsap.set(el, { display: "none", opacity: 1 }) });
    }
  }, [menuOpen, reduced]);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToHash(href);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-[--dur-ui] ease-[--ease-ui] ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="container flex h-[72px] items-center justify-between border-b border-[var(--line)] bg-espresso/85 backdrop-blur">
          <a href="#top" className="flex items-center gap-2.5 text-fg" onClick={(e) => {
            e.preventDefault();
            go("#top");
          }}>
            <Mark className="h-9 w-9 shrink-0" />
            <span className="text-lg font-semibold">URfolio</span>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                aria-current={active === link.href ? "true" : undefined}
                className={`relative py-1 text-sm font-medium transition-colors duration-[--dur-ui] ${
                  active === link.href ? "text-caramel" : "text-fg hover:text-caramel"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px bg-caramel transition-transform duration-[--dur-ui] ease-[--ease-ui]"
                  style={{
                    width: "100%",
                    transform: active === link.href ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left",
                  }}
                />
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button href="#contact" onClick={(e) => { e.preventDefault(); go("#contact"); }}>
              {nav.cta}
            </Button>
          </div>

          <button
            className="md:hidden text-fg p-2 -mr-2"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="fixed inset-0 z-50 hidden flex-col bg-espresso"
        style={{ display: "none" }}
      >
        <div className="absolute inset-0 flex flex-col" aria-hidden="true">
          {PALETTE_BARS.map((c) => (
            <div key={c} data-menu-bar className={`flex-1 ${BAR_BG_CLASS[c]} origin-top`} />
          ))}
        </div>
        <div className="relative z-10 flex h-full flex-col">
          <div className="container flex h-[72px] items-center justify-between">
            <span className="flex items-center gap-2.5 text-espresso">
              <Mark className="h-9 w-9 shrink-0" />
              <span className="text-lg font-semibold">URfolio</span>
            </span>
            <button
              className="text-espresso p-2 -mr-2"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>
          </div>
          <nav className="container flex flex-1 flex-col justify-center gap-6" aria-label="Mobile">
            {nav.links.map((link) => (
              <a
                key={link.href}
                data-menu-link
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                className="text-hero text-espresso"
              >
                {link.label}
              </a>
            ))}
            <a
              data-menu-link
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
              }}
              className="mt-4 inline-flex w-fit rounded-full bg-espresso px-7 py-3.5 text-base font-medium text-paper"
            >
              {nav.cta}
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
