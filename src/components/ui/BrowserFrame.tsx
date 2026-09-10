import type { ReactNode } from "react";

/** Decorative browser chrome around the hero's live build preview. */
export function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--espresso-2)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--line)]">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-mauve/60" />
          <span className="size-2.5 rounded-full bg-clay/60" />
          <span className="size-2.5 rounded-full bg-caramel/60" />
        </span>
        <span className="flex-1 text-center text-micro text-fg-muted truncate">{url}</span>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
