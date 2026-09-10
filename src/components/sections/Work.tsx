"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { work, type WorkItem } from "@/content/site";
import { WorkVisual } from "@/components/ui/WorkVisual";
import { Modal } from "@/components/ui/Modal";
import { AutoPlaceholder } from "@/components/ui/Placeholder";
import { useIsTouchDevice, useReducedMotion } from "@/lib/useReducedMotion";
import { gsapEase, stagger } from "@/lib/motion";

/** A small deterministic rotation per row, so the floating preview doesn't sit dead flat. */
function rotationFor(seed: number) {
  return ((seed * 37) % 13) - 6; // -6..6 deg
}

function WorkModal({ item, onClose }: { item: WorkItem; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} titleId="work-modal-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="work-modal-title" className="text-h3 text-fg">
          {item.number} · {item.title}
        </h3>
        <button type="button" onClick={onClose} aria-label="Close" className="text-fg-muted hover:text-caramel text-xl leading-none">
          ✕
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2 aspect-video overflow-hidden rounded-[var(--radius-sm)]">
          <WorkVisual seed={item.seed} className="h-full w-full" />
        </div>
        <div className="aspect-video overflow-hidden rounded-[var(--radius-sm)] sm:aspect-auto sm:h-full">
          <WorkVisual seed={item.seed + 1} className="h-full w-full" />
        </div>
      </div>
      <p className="text-lead mt-6 text-fg">
        <AutoPlaceholder text={item.result} />
      </p>
      {item.link ? (
        <a href={item.link} className="mt-4 inline-block text-caramel hover:underline">
          Visit site ↗
        </a>
      ) : (
        <p className="mt-4 text-small text-fg-muted" title="Placeholder — replace before launch">
          Visit site ↗ <span className="ph-inline">(no live link yet)</span>
        </p>
      )}
    </Modal>
  );
}

function Row({
  item,
  onOpen,
  onMouseEnter,
}: {
  item: WorkItem;
  onOpen: () => void;
  onMouseEnter?: () => void;
}) {
  return (
    <li className="border-t border-[var(--line)] last:border-b" onMouseEnter={onMouseEnter}>
      <button
        type="button"
        onClick={onOpen}
        data-work-row
        className="group flex w-full items-center gap-4 py-5 text-left"
      >
        <span className="text-small text-fg-muted w-8 shrink-0">{item.number}</span>
        <span className="text-h3 flex-1 text-fg transition-colors group-hover:text-caramel">{item.title}</span>
        <span className="text-small text-fg-muted hidden sm:block w-24 shrink-0">{item.type}</span>
        <span className="text-small text-fg-muted w-16 shrink-0 text-right">
          <AutoPlaceholder text={item.year} />
        </span>
      </button>
    </li>
  );
}

function Card({ item, onOpen }: { item: WorkItem; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="text-left">
      <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)]">
        <WorkVisual seed={item.seed} className="h-full w-full" />
      </div>
      <p className="text-h3 mt-3 text-fg">
        {item.number} · {item.title}
      </p>
      <p className="text-small text-fg-muted mt-1">
        {item.type} · <AutoPlaceholder text={item.year} />
      </p>
    </button>
  );
}

export function Work() {
  const [openItem, setOpenItem] = useState<WorkItem | null>(null);
  const [hoveredSeed, setHoveredSeed] = useState<number | null>(null);
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const quick = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  // Entrance: row/card hairlines & cards draw in, staggered.
  useEffect(() => {
    const root = listRef.current ?? gridRef.current;
    if (!root || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = root.children;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: gsapEase.enter,
          stagger: stagger.rows,
          scrollTrigger: { trigger: root, start: "top 85%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced, isTouch]);

  // Cursor-follow preview (desktop only).
  useEffect(() => {
    if (isTouch || reduced) return;
    const preview = previewRef.current;
    if (!preview) return;
    quick.current = {
      x: gsap.quickTo(preview, "x", { duration: 0.5, ease: gsapEase.ui }),
      y: gsap.quickTo(preview, "y", { duration: 0.5, ease: gsapEase.ui }),
    };
    const onMove = (e: MouseEvent) => {
      quick.current?.x(e.clientX + 24);
      quick.current?.y(e.clientY + 24);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isTouch, reduced]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || isTouch || reduced) return;
    gsap.to(preview, {
      opacity: hoveredSeed !== null ? 1 : 0,
      scale: hoveredSeed !== null ? 1 : 0.9,
      duration: 0.3,
      ease: gsapEase.ui,
    });
  }, [hoveredSeed, isTouch, reduced]);

  return (
    <section id="work" className="section" aria-label="Selected work">
      <div className="container">
        <div className="mb-10 flex items-baseline justify-between">
          <h2 className="text-h2 text-fg">{work.heading}</h2>
          <span className="text-small text-fg-muted">{work.count}</span>
        </div>

        {isTouch ? (
          <div ref={gridRef} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {work.items.map((item) => (
              <Card key={item.id} item={item} onOpen={() => setOpenItem(item)} />
            ))}
          </div>
        ) : (
          <ul ref={listRef} onMouseLeave={() => setHoveredSeed(null)}>
            {work.items.map((item) => (
              <Row
                key={item.id}
                item={item}
                onOpen={() => setOpenItem(item)}
                onMouseEnter={() => setHoveredSeed(item.seed)}
              />
            ))}
          </ul>
        )}
      </div>

      {!isTouch && !reduced && (
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-30 h-40 w-56 overflow-hidden rounded-[var(--radius-sm)] opacity-0"
          style={{ transform: `rotate(${hoveredSeed ? rotationFor(hoveredSeed) : 0}deg)` }}
        >
          {hoveredSeed !== null && <WorkVisual seed={hoveredSeed} className="h-full w-full" />}
        </div>
      )}

      {openItem && <WorkModal item={openItem} onClose={() => setOpenItem(null)} />}
    </section>
  );
}
