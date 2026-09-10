# URfolio

A premium, animation-rich, single-page marketing site for **URfolio** — a service
that builds portfolio websites for individuals and companies, using AI, refined
by a human designer. Built from `docs/brief.md` following the plan in
`docs/phase-0-plan.md`.

## Stack

Next.js 16 (App Router, TypeScript, **static export**) · Tailwind CSS v4 ·
GSAP (ScrollTrigger) · Lenis (smooth scroll) · web-vitals. No other UI or
animation libraries.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to /out
npm run lint
npm run check-placeholders   # lists every placeholder still left in content/site.ts
```

`npm run build` produces a fully static site in `/out` — upload that folder
anywhere, or point Vercel/Cloudflare Pages/Netlify at this repo (framework
preset: Next.js, static export). It needs no server or database.

## Editing content

Every string, number, price and link on the page lives in one file:

```
src/content/site.ts
```

Nothing else needs to change to edit copy, prices, FAQ answers, work samples,
or contact details. Two other small files hold non-content configuration:

```
src/lib/config.ts     Adobe Fonts kit ID, canonical domain, Formspree endpoint
public/brand/          logo.svg and color.svg — the source brand files, untouched
```

## ⚠️ Before launch — placeholders to fill in

The brief asked for a strong first draft with real numbers, clients and
testimonials left as visible placeholders rather than invented — run this any
time to get the full list:

```bash
npm run check-placeholders
```

At the time of writing, that's **45 bracketed values** in `content/site.ts` —
sites-launched / countries / avg. days / rating counters, all three
`AED [ ]` prices, revision-round and project-count numbers, the six sample
work items' years and one-line results, all four testimonials, the three
budget-range chip labels, and the "reply within [X] hours" / "launch in [X]
days" copy. Each renders with a dashed outline on the live site so an unfilled
one is never mistaken for a real figure.

Contact details: email (`shaheen@urfolio.net`) and WhatsApp
(`+963 988 824 456`) are set and live. **Social links**
(`contact.socials[].href` — Instagram/LinkedIn/Behance) are still empty on
purpose and render as disabled/dashed links until filled in (see
`src/lib/contact-links.ts`).

Two more things aren't bracketed but are still placeholders:

- **`src/lib/config.ts`**:
  - `TYPEKIT_KIT_ID` — skipped for now. The site renders on a
    metric-matched fallback (`globals.css`), and that fallback's
    `size-adjust`/`ascent-override` values are estimates, not a measured
    match — see the note in that file once a real kit is set.
  - `SITE_URL` is set to `https://urfolio.net` — the intended domain,
    **not purchased yet**. Canonical links, the sitemap and the OG image
    already point there; nothing else needs to change once it's bought and
    pointed at wherever this is hosted.
  - `FORMSPREE_ENDPOINT` — empty. The brief form (`Contact.tsx` →
    `submitBrief()`) posts here; without it, submitting the form correctly
    shows "Form isn't connected yet" and offers the WhatsApp link instead of
    silently pretending to succeed. Create a form at
    [formspree.io](https://formspree.io) and paste its endpoint in.
- **The FAQ's "Can I update it later?" answer** is a real draft I wrote (a
  short window of free polish after launch, plus an optional ongoing care
  plan) rather than a `[bracketed]` unknown, since the brief asked for a
  first draft there rather than flagging a missing number — confirm it
  matches your actual policy before launch.

Once every placeholder above is filled, flip `HIDE_UNFILLED` in
`src/lib/config.ts` to `true` — anything still empty (should be none by then)
hides instead of showing a dashed placeholder.

### Optional, any time before launch

- An outlined "URfolio" wordmark SVG (Illustrator/Photoshop export) — Adobe
  Fonts never exposes its font *file* to a build step, so the generated
  Open Graph image and app icons currently fall back to a system sans rather
  than Vesterbro (`src/app/opengraph-image.tsx`, `icon.tsx`, `apple-icon.tsx`).
- Set your Adobe Fonts kit's **Font display** to `swap` (the brief's
  performance ask) — this is a setting in the Adobe Fonts web project, not
  something this repo controls.

## Project structure

```
src/
  app/            layout.tsx · page.tsx · globals.css
                  icon.tsx · apple-icon.tsx · opengraph-image.tsx  (generated from the mark)
                  sitemap.ts · robots.ts
  components/
    sections/     Preloader · Nav · Hero · Marquee · Statement · Audiences
                  Process · Work · BeforeAfter · Proof · Pricing · Faq
                  Contact · Footer
    ui/           Mark · SparkleOverlay · Button · TogglePill · Chip · Modal
                  BrowserFrame · WorkVisual · Placeholder
  content/        site.ts          ← every string, number, price and link
  lib/            motion.ts · config.ts · site-state.ts · smooth-scroll.ts
                  submit-brief.ts · contact-links.ts · ready-event.ts
                  useReducedMotion.ts · mark-path.ts · palette-bars.ts
public/brand/     logo.svg · color.svg
docs/             brief.md · phase-0-plan.md
scripts/          check-placeholders.mjs
```

## Notable implementation details

- **The logo mark and its sparkle overlay** (`components/ui/Mark.tsx`,
  `SparkleOverlay.tsx`) are drawn from the exact path data in
  `public/brand/logo.svg`, extracted programmatically rather than retyped, so
  there's no risk of a transcription error in that path. `logo.svg` itself is
  never edited — see `lib/mark-path.ts`.
- **Placeholders** render visibly (dashed outline, a tooltip explaining why)
  via `components/ui/Placeholder.tsx`, rather than ever inventing a number.
- **Individual/Company** is asked once — the hero toggle, the audience
  panels, and the contact form's "I am" field all share one piece of state
  (`lib/site-state.tsx`), and choosing a pricing plan carries that selection
  to the contact form too.
- **Reduced motion and touch** are respected throughout: every scroll-driven
  or cursor-driven effect has a real fallback (see the animation map in
  `docs/phase-0-plan.md` §4) rather than just being disabled outright — the
  page is fully usable and complete either way.
- **Accessibility specifics**: one `<h1>` (with a plain-text `aria-label`,
  since its animated per-character markup would otherwise read as one
  run-on string to a screen reader); a skip link; a double-ring focus style
  on the light/paper sections, where a plain caramel ring falls just short of
  the 3:1 non-text contrast minimum; a real focus trap in the Work modal; the
  FAQ accordion is one-open-at-a-time with `aria-expanded`/`aria-controls`.

## Known dev-only console note

In `npm run dev` you'll see one React hydration warning in the console for
`data-preloader` on `<html>`. This is expected and harmless: it's the same
"avoid a flash of the wrong state" pattern used by most dark-mode toggles
(`suppressHydrationWarning` is set on that tag) — a synchronous script in
`<head>` intentionally stamps that attribute before React hydrates, so a
repeat visit never even paints the preloader. It does not appear in the
production build (verified against the static `/out` export) and has no
effect on what a visitor sees.

## What I could not verify in this environment

I don't have a Lighthouse/DevTools audit tool available here, so the
brief's ≥90 score targets (Performance/Accessibility/Best Practices/SEO,
LCP < 2.5s, CLS < 0.1) are unverified — please run Lighthouse once this is
deployed. Everything within reach here checks out: `next build` produces a
clean static export, `tsc --noEmit` and `eslint` are both clean, and the
production build's console is free of errors (checked by serving `/out`
directly and inspecting the console).
