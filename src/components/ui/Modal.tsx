"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getLenis } from "@/lib/smooth-scroll";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * A small in-page dialog (brief §7 — the Work modal opens "not a new page").
 * Traps focus, closes on Escape or backdrop click, restores focus to
 * whatever opened it, and pauses Lenis while open so background scroll
 * can't fight the trapped focus.
 */
export function Modal({
  open,
  onClose,
  titleId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusables = () => Array.from(dialog?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      lenis?.start();
      openerRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-espresso/85" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-[var(--radius-md)] bg-[var(--espresso-2)] border border-[var(--line)] p-6 sm:p-8"
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
