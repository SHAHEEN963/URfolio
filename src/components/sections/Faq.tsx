"use client";

import { useId, useState } from "react";
import { useSiteContent } from "@/lib/site-content";
import { AutoPlaceholder } from "@/components/ui/Placeholder";

/**
 * One open at a time, smooth height animation via the CSS grid-rows trick
 * (`grid-template-rows: 0fr` → `1fr`) — a plain React-controlled accordion
 * rather than native `<details>`, so both opening and closing animate
 * smoothly (native `<details>` only animates one direction without JS
 * intercepting its toggle event). Height is the one property here that
 * isn't transform/opacity/clip-path — a deliberate, small, user-triggered
 * exception, same as the brief's own accordion ask implies.
 */
export function Faq() {
  const { faq } = useSiteContent();
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="section" aria-label="Frequently asked questions">
      <div className="container max-w-3xl">
        <h2 className="text-h2 text-fg mb-10">{faq.heading}</h2>
        <dl>
          {faq.items.map((item) => {
            const open = openId === item.id;
            const buttonId = `${baseId}-${item.id}-button`;
            const panelId = `${baseId}-${item.id}-panel`;
            return (
              <div key={item.id} className="border-t border-[var(--line)] last:border-b">
                <dt>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : item.id)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-h3 text-fg">{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl text-caramel transition-transform duration-[--dur-ui] ease-[--ease-ui]"
                      style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      +
                    </span>
                  </button>
                </dt>
                <dd
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows] duration-[--dur-ui] ease-[--ease-ui]"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="text-lead measure pb-6 text-fg-muted">
                      <AutoPlaceholder text={item.answer} />
                    </p>
                  </div>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
