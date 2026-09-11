# URfolio

A premium, animation-rich, single-page marketing site for **URfolio** — a service
that builds portfolio websites for individuals and companies, using AI, refined
by a human designer. Built from `docs/brief.md` following the plan in
`docs/phase-0-plan.md`.

## Stack

Next.js 16 (App Router, TypeScript, server-rendered) · Tailwind CSS v4 ·
GSAP (ScrollTrigger) · Lenis (smooth scroll) · web-vitals · Vercel Blob
(dashboard content/image persistence in production). No other UI or
animation libraries.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # production server
npm run lint
npm run check-placeholders   # lists every placeholder still left in content/site.ts
```

This site needs a Node server (not a static host) because of the `/dashboard`
admin panel — deploy it to Vercel or any other Next.js-compatible host, not
as a static export.

## Editing content

There are two ways to edit everything on the site — text, headings, numbers,
contact details, images, and every repeating list (work items, testimonials,
pricing plans, FAQ, etc.):

1. **`/dashboard`** — the recommended way for day-to-day edits. Log in, edit,
   hit Save, and the change goes live immediately. See "Dashboard" below for
   setup.
2. **`src/content/site.ts`** directly — a code change, useful for restructuring
   content or changing something the dashboard doesn't expose. This file also
   defines the *default/fallback* values the site renders if nothing has been
   saved from the dashboard yet (see `src/lib/content/store.ts`).

Two other small files hold non-content configuration:

```
src/lib/config.ts     Adobe Fonts kit ID, canonical domain, Formspree endpoint
public/brand/          logo.svg and color.svg — the source brand files, untouched
```

## Dashboard

A password-protected admin panel at `/dashboard` for editing every piece of
visible content without touching code — text, images, the logo, work items
(add/edit/delete/duplicate/reorder/hide), and every other repeating list.

**One-time setup:**

1. Generate a session-signing secret (any random 32+ character string) and a
   password hash:

   ```bash
   npm run set-password
   ```

   This prompts for a password (12+ characters) and prints an `ADMIN_EMAIL`
   line (edit the address) and an `ADMIN_PASSWORD_HASH` line. The plaintext
   password is never written anywhere — only the one-way hash it prints
   belongs in your environment.

2. Add to `.env.local` (local dev) and your hosting provider's environment
   variables (production):

   ```
   SESSION_SECRET=<32+ random characters>
   ADMIN_EMAIL=you@example.com
   ADMIN_PASSWORD_HASH=scrypt\$...\$...
   ```

   **Escape every `$` in the hash as `\$`** — otherwise Next's env loader
   tries to expand `$<hex>` as a variable reference and silently corrupts the
   value, which shows up as "Incorrect email or password" even with the right
   password.

3. Restart the dev server (or redeploy). Sign in at `/dashboard` with that
   email and password. The session cookie lasts 400 days or until you log
   out — there's no separate "remember me" toggle.

**Where content and uploads are stored:**

- **Local dev**: `data/content.json` and `public/uploads/` (both gitignored —
  don't commit them). Deleting `data/content.json` resets the site back to
  `src/content/site.ts`'s defaults.
- **Production (Vercel)**: a [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
  store, since a deployed serverless filesystem can't be written to. Add a
  Blob store to your Vercel project and set `BLOB_READ_WRITE_TOKEN` (Vercel
  does this automatically if you attach the store through its dashboard).
  Without it, `/dashboard` still loads and lets you look around, but shows a
  banner explaining that saves and image uploads won't persist.

Changing `ADMIN_EMAIL` or `ADMIN_PASSWORD_HASH` immediately invalidates any
existing session, even ones with an unexpired cookie.

## ⚠️ Before launch — placeholders to fill in

`content/site.ts`'s own numbers, prices and testimonials have since been
replaced with realistic sample data (edit them via `/dashboard` or the file
directly) — running `npm run check-placeholders` should report none left:

```bash
npm run check-placeholders
```

Contact details: email (`shaheen@urfolio.net`) and WhatsApp
(`+963 988 824 456`) are set and live — editable from `/dashboard`'s
"Header & Footer" tab. **Social links**
(`contact.socials[].href` — Instagram/LinkedIn/Behance) are still empty on
purpose and render as disabled/dashed links until filled in, also from that
same tab (see `src/lib/contact-links.ts`).

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
  app/
    (site)/       layout.tsx · page.tsx        ← the public marketing site
    (dashboard)/  layout.tsx
      dashboard/  page.tsx · login/ · _components/  ← Editor.tsx, fields.tsx
    globals.css · icon.tsx · apple-icon.tsx · opengraph-image.tsx
    sitemap.ts · robots.ts
  proxy.ts        redirects signed-out /dashboard/* requests to /dashboard/login
  components/
    sections/     Preloader · Nav · Hero · Marquee · Statement · Audiences
                  Process · Work · BeforeAfter · Proof · Pricing · Faq
                  Contact · Footer
    ui/           Logo · Mark · SparkleOverlay · Button · TogglePill · Chip
                  Modal · BrowserFrame · WorkVisual · Placeholder
  content/        site.ts          ← every string, number, price and link
                                      (defaults/fallback + the dashboard's shape)
  lib/
    auth/         password.ts · session.ts · credentials.ts · admin.ts · actions.ts
    content/      store.ts (read/write, local file or Vercel Blob) · actions.ts
    site-content.tsx   React context feeding dashboard-edited content to every
                        section component via useSiteContent()
    motion.ts · config.ts · site-state.ts · smooth-scroll.ts · submit-brief.ts
    contact-links.ts · ready-event.ts · useReducedMotion.ts · mark-path.ts
    palette-bars.ts
public/brand/     logo.svg · color.svg
docs/             brief.md · phase-0-plan.md
scripts/          check-placeholders.mjs · set-password.mjs
```

## Notable implementation details

- **The logo mark and its sparkle overlay** (`components/ui/Mark.tsx`,
  `SparkleOverlay.tsx`) are drawn from the exact path data in
  `public/brand/logo.svg`, extracted programmatically rather than retyped, so
  there's no risk of a transcription error in that path. `logo.svg` itself is
  never edited — see `lib/mark-path.ts`. `components/ui/Logo.tsx` renders that
  mark by default, or a dashboard-uploaded image once one is set.
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
repeat visit never even paints the preloader. It has no effect on what a
visitor sees.

## What I could not verify in this environment

I don't have a Lighthouse/DevTools audit tool available here, so the
brief's ≥90 score targets (Performance/Accessibility/Best Practices/SEO,
LCP < 2.5s, CLS < 0.1) are unverified — please run Lighthouse once this is
deployed. Everything within reach here checks out: `next build`, `tsc
--noEmit` and `eslint` are all clean, and the full dashboard flow (login,
edit, save, confirm the change on the public site, log out invalidates the
session) was checked end-to-end against a production build.
