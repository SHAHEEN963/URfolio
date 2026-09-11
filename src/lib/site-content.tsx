"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteContent } from "@/content/site";
import { site as defaultContent } from "@/content/site";

/**
 * Every section reads its copy through `useSiteContent()` instead of
 * importing `content/site.ts` directly, so a save from `/dashboard` (which
 * re-fetches this from the content store on the server, see layout.tsx)
 * shows up on the page without a code change or a rebuild.
 */
const SiteContentContext = createContext<SiteContent>(defaultContent);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
