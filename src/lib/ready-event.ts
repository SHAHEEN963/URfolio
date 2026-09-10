/**
 * Fired once the preloader is done (or skipped instantly for a repeat
 * visit / reduced motion). Several sections' entrances wait on this
 * (Hero, Nav) — `onReady` guards against the event firing before a given
 * listener subscribes, since mount order between components isn't
 * guaranteed.
 */
export const READY_EVENT = "urfolio:ready";

declare global {
  interface Window {
    __urfolioReady?: boolean;
  }
}

export function markReady() {
  if (typeof window === "undefined" || window.__urfolioReady) return;
  window.__urfolioReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/** Calls `cb` when the ready event fires — immediately if it already has. */
export function onReady(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__urfolioReady) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
}
