import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { TYPEKIT_KIT_ID, SITE_URL, PRELOADER_SEEN_KEY } from "@/lib/config";
import { meta } from "@/content/site";

/**
 * Anti-flash script for the preloader (Preloader.tsx, Phase 0 plan §4).
 * Runs synchronously in <head>, before <body> exists, so it can only set a
 * flag/attribute — not query the preloader element directly. It stamps
 * `data-preloader="skip"` on <html>, which a plain CSS rule in globals.css
 * hides the preloader with, and sets `window.__urfolioReady` so every
 * `onReady()` listener (Hero, Nav) that subscribes after hydration sees it
 * immediately instead of waiting on an event no one fired. Net effect: a
 * repeat visit (or reduced motion) never paints the preloader at all.
 */
const ANTI_FLASH_SCRIPT = `(function(){try{var seen=sessionStorage.getItem(${JSON.stringify(
  PRELOADER_SEEN_KEY
)})==="1";var reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(seen||reduced){document.documentElement.setAttribute("data-preloader","skip");window.__urfolioReady=true;}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: SITE_URL,
    siteName: "URfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
  alternates: { canonical: SITE_URL },
};

// ProfessionalService JSON-LD. Deliberately no aggregateRating — a
// self-served number isn't eligible for rich results, and it isn't a real
// measured figure yet (Phase 0 plan, flag 4). No street address either:
// the brief only gives "based in the UAE", so nothing more specific is
// invented.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "URfolio",
  description: meta.description,
  areaServed: "Worldwide",
  address: { "@type": "PostalAddress", addressCountry: "AE" },
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the anti-flash script above intentionally
    // stamps data-preloader on this element before React hydrates (the
    // same sanctioned pattern next-themes and other "no-flash" scripts
    // use) — it's the one expected, harmless mismatch on this tag.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FLASH_SCRIPT }} />
        {TYPEKIT_KIT_ID && (
          <>
            <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
            <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
            <link rel="stylesheet" href={`https://use.typekit.net/${TYPEKIT_KIT_ID}.css`} />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
