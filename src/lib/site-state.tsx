"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Audience } from "@/content/site";
import { scrollToHash } from "@/lib/smooth-scroll";

/**
 * The one piece of state several sections share: which audience the visitor
 * is (asked in the hero, and again implicitly by which pricing plan they
 * pick), so the contact form can arrive pre-filled instead of asking a third
 * time (Phase 0 plan, flag 11).
 */
type SiteState = {
  audience: Audience;
  setAudience: (a: Audience) => void;
  planId: string | null;
  /** Sets the plan, switches to the Contact section, and scrolls to it. */
  choosePlan: (planId: string) => void;
};

const Ctx = createContext<SiteState | null>(null);

export function SiteStateProvider({ children }: { children: ReactNode }) {
  const [audience, setAudience] = useState<Audience>("individual");
  const [planId, setPlanId] = useState<string | null>(null);

  const choosePlan = useCallback((id: string) => {
    setPlanId(id);
    scrollToHash("#contact");
  }, []);

  const value = useMemo(
    () => ({ audience, setAudience, planId, choosePlan }),
    [audience, planId, choosePlan]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSiteState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSiteState must be used within <SiteStateProvider>");
  return ctx;
}
