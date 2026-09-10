# Build brief: URfolio — one-page marketing website

You are the lead designer-developer on this project. Build a premium, animation-rich, **single-page** website for **URfolio**, a service that builds portfolio websites for **individuals** and **companies** using AI, refined by a human designer.

Read this whole brief before writing any code. Follow the phases at the end. Do not skip Phase 0.

---

## 1. The business

- **Name:** URfolio ("UR" = your + "folio"). Always written `URfolio` — "UR" uppercase, "folio" lowercase.
- **What it sells:** fast, professional portfolio websites.
  - **Individuals:** designers, photographers, marketers, consultants, engineers, freelancers, job seekers.
  - **Companies:** studios, agencies, small businesses, startups that need a sharp one-page company profile.
- **How it works:** the client shares their CV, work, links and goals → AI drafts structure, copy and layout → a designer refines everything → site goes live on the client's domain.
- **Positioning:** the speed of AI with the taste of a human designer. Not a DIY template builder.
- **Market:** based in the UAE, serving clients globally. English site now; structure content so an Arabic (RTL) version can be added later. Do not build the Arabic version now.
- **Primary goal of the page:** get qualified leads to submit the brief form (or contact on WhatsApp).

---

## 2. Brand assets

### Files
Place the provided files in `/public/brand/`:
- `logo.svg` — the URfolio mark: a bold "U" and "R" fused into one shape, with a **four-point sparkle cut out** where the letters meet (the sparkle = AI). Single colour `#8F7277`, viewBox 1080×1080, one path.
- `color.svg` — the palette, drawn as **five stacked horizontal bars**.

Logo rules:
- Never distort, recolour with gradients, or add effects to the logo geometry.
- Create a `currentColor` version of the mark so it can sit on dark or light backgrounds.
- The sparkle is a hole inside the single path. To animate it, draw a matching four-point star as a **separate SVG overlay** positioned over the cutout. Do not edit the logo path.
- The wordmark "URfolio" is typeset in Vesterbro next to the mark.

### Colour tokens

Brand palette (from `color.svg`, in bar order):

| Token | Hex | Role |
|---|---|---|
| `--mauve` | `#8F7277` | Logo colour, large display type, decorative lines |
| `--caramel` | `#D6A274` | Primary accent: CTAs, highlights, focus rings, active states |
| `--cocoa` | `#6B4438` | Deep surfaces, text on light sections |
| `--plum` | `#7C5257` | Secondary surfaces, cards on dark, body text on light |
| `--clay` | `#A2715F` | Tertiary accent, hover states, illustrations |

Derived neutrals (tune slightly if needed, keep them warm):

| Token | Hex | Role |
|---|---|---|
| `--espresso` | `#1B1412` | Main page background (dark-first site) |
| `--espresso-2` | `#251B18` | Raised surfaces on dark |
| `--paper` | `#F2EAE6` | Primary text on dark; background of light sections |

**Contrast rules (WCAG AA, already measured — follow exactly):**
- On `--espresso`: body text = `--paper` (15.3:1). `--caramel` is safe for any text (8:1). `--mauve` (4.2:1) and `--clay` (4.4:1) = **large text only** (≥24px, or ≥19px bold). `--cocoa` and `--plum` = **fills only, never text**.
- On `--paper`: body text = `--espresso` or `--cocoa` (7:1). `--plum` is fine for body (5.5:1). `--mauve`/`--clay` = large text only. **Never put `--caramel` text on `--paper`** (1.9:1) — use it as a fill only.
- Primary button: `--caramel` background + `--espresso` text (8:1).

Overall rhythm: dark espresso base, with **one or two light `--paper` sections** to break the scroll and create contrast moments. No purple/blue gradients, no neon, no generic grey.

### Typography

Single typeface: **Vesterbro** (Adobe Fonts).

```css
font-family: vesterbro-vf, sans-serif;
font-style: normal;
font-variation-settings: normal;
```

- Load via the Adobe Fonts kit: `<link rel="preconnect" href="https://use.typekit.net" crossorigin>` and `<link rel="stylesheet" href="https://use.typekit.net/[KIT_ID].css">`. Put `[KIT_ID]` in an env/config constant so I can paste my ID.
- It's a variable font (`-vf`). Inspect which axes the kit actually exposes before relying on any. If a weight axis exists, use it for tasteful hover animations (e.g. nav links or the big footer wordmark shifting weight). Keep `font-variation-settings: normal` as the base.
- Use one family for everything; build hierarchy with size, weight, tracking and line-height.
- Type scale (fluid with `clamp()`): display XL for hero and footer wordmark (very large, tight tracking), H1, H2, H3, body (18px desktop / 16px mobile), small. Body line length ≤ 70 characters.
- Add a fallback font with `size-adjust`/metric overrides to avoid layout shift while Vesterbro loads.
- Headlines are a design element: large, confident, split into lines for animation.

---

## 3. References — what to take from each

Study the patterns, not the visuals. **Do not copy their text, images, logos or code.**

1. **benjamincreative.me** — oversized personal typography, infinite marquee strips, numbered work list with year where hovering a row shows a floating image preview that follows the cursor, a long statement paragraph that "fills in" word by word as you scroll, services list with media previews, huge closing CTA with marquee.
2. **blackshard.com.au** — sober, credible, engineering-grade tone. Plain factual copy, client logo row, a short 3-step "how we work" with clear verbs. Take the **confidence and restraint**, not the dark-tech look.
3. **crency.agency** — conversion-first agency layout: headline with trust chips right under it (rating, response time, sites built), service blocks with specific action CTAs ("build my website" not "learn more"), case slider with testimonial + counter (01 / 04), and a contact form where the user **picks** budget and service instead of typing.
4. **jamiemckaye.com/writing** — the site proves its own quality: it measures the visitor's page performance live (TTFB, LCP, INP, CLS). Also: calm editorial layout, precise microcopy, details that feel "instrumented".
5. **basepowercompany.com/core** — scroll-driven storytelling: pinned sections, an image grid that expands on scroll, a day/night **toggle** that shows a before/after state, numbered benefit list, 3-step sign-up with progress, tactile collage details (tape, polaroid-style photos), pricing card, testimonial carousel, FAQ accordion, image sequence that ends on a strong final visual and CTA.

---

## 4. Page structure (single page, anchor navigation)

All copy below is a strong first draft — use it. Put **every string, number, price and link in one file** (`/content/site.ts`) so I can edit without touching components. Anything marked `[ ]` is a placeholder I will fill; render it visibly as a placeholder, never invent real numbers, clients or testimonials.

### 0. Preloader (max ~1.6s, skippable, only on first visit per session)
The five palette bars from `color.svg` stack in, the mark appears, the sparkle overlay rotates and flashes once, then the bars wipe upward to reveal the hero. The hero headline animation starts as the last bar leaves.

### 1. Navigation (fixed)
- Left: mark + "URfolio". Center/right: Work · Process · Pricing · FAQ. Right: primary button **"Start your folio"**.
- Hides on scroll down, returns on scroll up. Active section indicator follows scroll.
- Mobile: full-screen menu opened with the five-bar wipe; links stagger in.

### 2. Hero — the signature moment
Layout: headline left, **live build preview** right (stacked on mobile).

- Toggle at the top: **Individual | Company** (animated pill).
- Headline: **"Your portfolio. Built with AI, finished by hand."**
- Sub (Individual): "Send us your CV and your best work. We turn it into a one-page portfolio that gets you hired — live in [X] days."
- Sub (Company): "Send us your services and projects. We turn them into a sharp company profile that wins clients — live in [X] days."
- Buttons: **"Start your folio"** (primary) · **"See examples"** (secondary, scrolls to Work).
- Trust chips under the buttons: `[X]+ sites launched` · `Reply within [X] hours` · `Rated [X]/5`.

**Live build preview (the one bold idea of the page):** a minimal browser frame where a portfolio site assembles itself:
1. Empty wireframe blocks appear.
2. A name and role type in (Individual: "Lina Haddad — Brand Photographer"; Company: "Northline Studio — Architecture & Interiors").
3. Image blocks fill in, the section layout snaps into place, palette colours apply.
4. A small status line ends on "Published".

Add a small input under the frame: **"Type your name"** — whatever the visitor types replaces the sample name in the preview in real time. Switching the Individual/Company toggle rebuilds the preview with the other sample. No real AI call; this is a scripted demo.

Extra: a soft sparkle-shaped light that follows the cursor inside the hero (desktop only, subtle).

### 3. Marquee strip
Two opposite-direction rows: "Designers ✦ Photographers ✦ Consultants ✦ Engineers ✦ Studios ✦ Agencies ✦ Startups ✦ Freelancers". Use the **four-point sparkle from the logo** as the separator (inline SVG, not an emoji). Slows down on hover.

### 4. Statement (scroll-fill text)
Large text that fills from `--mauve` at low opacity to `--paper` word by word as it scrolls through the viewport:
> "Talent isn't the problem. Visibility is. A PDF CV and a scattered Instagram don't close deals. A portfolio does — and now it takes days, not months."

### 5. Two audiences — Individual / Company
Split section, two large panels. On desktop, hovering one panel expands it and compresses the other. Each panel:
- **For individuals:** "Get hired, get booked." Points: personal story & positioning, selected work with case notes, skills and experience, contact & booking links, CV download.
- **For companies:** "Look as good as your work." Points: services & offer, project showcase, team and clients, trust signals, lead form & WhatsApp.
- CTA in each: "Build my portfolio" / "Build our company site".

### 6. Process — pinned scroll (this is a real sequence, so numbering is correct)
Section pins while four steps advance with a progress line; the visual on the right changes per step.
1. **Brief** — "Share your CV, work and links. 10-minute form, no writing needed."
2. **AI draft** — "AI structures your story, writes first-draft copy and proposes a layout."
3. **Human polish** — "A designer refines every detail: type, imagery, flow, tone."
4. **Launch** — "Live on your domain with SEO, analytics and fast loading built in."

### 7. Work — selected portfolios
Numbered list rows: number, project name, type (Personal / Company), year. Hover a row → a floating image preview follows the cursor with slight rotation and lag. Click → opens a lightweight in-page modal (not a new page) with 2–3 images, a one-line result and a link. Use 6 placeholder projects with tasteful generated placeholder visuals in the brand palette (no stock photos of people, no lorem ipsum).

On mobile: rows become cards with the image visible, no cursor effect.

### 8. Before / After toggle — light `--paper` section
Inspired by Base Power's grid on/off toggle. A switch: **Without URfolio | With URfolio**.
- *Without:* a flat, cluttered mock of a PDF CV + a link-in-bio page, desaturated.
- *With:* the same person as a clean URfolio site, full colour.
The transition morphs between the two (clip-path/mask reveal, not a simple fade). Caption changes with the state: "Easy to ignore." → "Hard to forget."

### 9. Proof
- Animated counters (count up once when visible): `[X]` sites launched, `[X]` countries, `[X]` average days to launch, `[X]/5` client rating.
- Testimonial slider: quote, name, role, small avatar placeholder, counter "01 / 04", drag/swipe enabled.
- **Live performance readout** (inspired by jamiemckaye.com): a small "instrument" panel showing this visitor's real LCP, CLS, INP and TTFB using the `web-vitals` library, with the line: "Measured on your device, just now. Every URfolio site is built to this standard." Show "measuring…" until values arrive; never display fake numbers.

### 10. Pricing
Three plans, the middle one visually emphasised. Prices in AED as placeholders.
- **Personal** — `AED [ ]` — one-page portfolio, AI draft + designer polish, up to [X] projects, [X] revision rounds, launch on your domain.
- **Professional** (featured) — `AED [ ]` — everything in Personal, plus custom copywriting, case study layouts, SEO setup, analytics, [X] revision rounds.
- **Company** — `AED [ ]` — one-page company profile, services & projects, team & clients, lead form + WhatsApp, optional Arabic version.
Each card CTA: "Choose Personal" / "Choose Professional" / "Choose Company" → scrolls to the contact form with that plan pre-selected.
Note under cards: "Need something bigger? Tell us in the brief."

### 11. FAQ (accordion, one open at a time, smooth height animation)
- *Do I need to write the content?* No. Send your CV, links and work — AI drafts the copy, a designer refines it, you approve.
- *Is it all AI?* No. AI handles the first draft and speed. A designer makes every final decision.
- *How long does it take?* Most sites launch in [X] days after we receive your materials.
- *Can I update it later?* Yes. [Describe the update option / care plan.]
- *Do you handle domain and hosting?* Yes, we set up your domain, hosting and analytics.
- *Can my site be in Arabic?* Yes, bilingual Arabic/English is available on request.

### 12. Contact — the brief form
Headline: **"Let's build yours."** Sub: "Answer a few taps. We reply within [X] hours."
Form built from selectable chips, not long typing:
- I am: **Individual / Company**
- I need: **New portfolio / Redesign / Not sure yet**
- Plan: **Personal / Professional / Company / Not sure** (pre-selected if coming from Pricing)
- Budget: **[range 1] / [range 2] / [range 3] / Not sure**
- Name, email, WhatsApp number (UAE format hint, optional), link to current work (optional), short message (optional).
- Submit button: **"Send my brief"** → success state: "Brief received. We'll reply within [X] hours."
- Inline validation with clear messages (e.g. "Enter a valid email so we can reply").
- No backend yet: write a single `submitBrief()` function with a TODO to connect Formspree/Resend, and a visible WhatsApp alternative: "Prefer WhatsApp? Message us" (`https://wa.me/[NUMBER]`).

### 13. Footer
- A giant "URfolio" wordmark that reveals line by line as the footer enters, with a subtle weight shift on hover (if the axis exists).
- Email, WhatsApp, Instagram, LinkedIn, Behance placeholders.
- "Based in the UAE. Building portfolios worldwide." · © [year] URfolio.
- Back-to-top button.

---

## 5. Motion system

The brief asks for a site **full of animation that still feels professional**. Achieve that with orchestration, not noise.

**Signature moments (build these with the most care):**
1. Preloader bars → hero reveal
2. Hero live build preview + name input
3. Scroll-fill statement
4. Pinned process timeline
5. Before/after morph toggle
6. Footer wordmark reveal

**Supporting micro-interactions:** magnetic primary buttons, cursor-follow image previews in Work, marquee, count-up numbers, accordion, toggle pills, link underline draws, nav hide/show.

**Rules:**
- Do **not** put the same fade-up-on-scroll on every section and every element. Each section gets at most one entrance behaviour, and it should suit that content.
- Headlines animate by line (masked slide), not by letter, except the hero headline.
- Easing: one custom curve for entrances (e.g. `expo.out`-like) and one for interactive feedback; durations 0.4–1.2s. Keep it consistent via shared tokens in `/lib/motion.ts`.
- Animate only `transform`, `opacity`, `clip-path`, and variable font axes. No layout-thrashing properties.
- 60fps on a mid-range phone. Disable cursor effects and heavy pinning on touch devices; replace with simpler equivalents.
- **`prefers-reduced-motion`:** skip the preloader, disable smooth scroll, pinning, marquee movement and scroll-fill; show final states instantly. The page must be fully usable and complete.
- Smooth scrolling must not break anchor links, keyboard scrolling, or the browser's find-in-page.

---

## 6. Tech stack

- **Next.js** (latest stable, App Router, TypeScript), **static export** (`output: 'export'`).
- **Tailwind CSS** (latest) with the colour, type and spacing tokens above defined as CSS variables.
- **GSAP** with ScrollTrigger and SplitText (all GSAP plugins are free) for scroll and timeline animation.
- **Lenis** for smooth scroll, synced with ScrollTrigger.
- **web-vitals** for the live performance readout.
- No other animation or UI libraries. No jQuery, no Bootstrap, no component kits.
- Clean folder structure: `/app`, `/components/sections/*`, `/components/ui/*`, `/content/site.ts`, `/lib/motion.ts`, `/public/brand`.

---

## 7. Quality bar

- **Responsive:** designed for 375, 768, 1280 and 1920px widths. Mobile is not a squeezed desktop — re-compose layouts.
- **Performance:** Lighthouse mobile ≥ 90 for Performance, Accessibility, Best Practices and SEO. LCP < 2.5s, CLS < 0.1. Lazy-load below-the-fold media, use AVIF/WebP, preload only the hero font file needed.
- **Accessibility:** WCAG AA contrast (follow the rules in section 2), semantic landmarks, one H1, logical heading order, visible `--caramel` focus rings, full keyboard access (toggles, slider, accordion, modal with focus trap, form), `aria-live` for the form success state, alt text on all images.
- **SEO:** title "URfolio — Portfolio websites built with AI, finished by hand", meta description, Open Graph + Twitter image (generate one in the brand style), favicon/app icons from the mark, JSON-LD `ProfessionalService`, `sitemap.xml`, `robots.txt`.
- **Code:** typed, componentised, no dead code, no console errors, comments only where the animation logic is non-obvious.

### Avoid
- Generic SaaS look: identical rounded cards with soft grey shadows, gradient blobs, glassmorphism everywhere.
- Emojis as icons, stock photos of smiling people at laptops, lorem ipsum.
- All-caps eyebrow labels above every heading.
- Invented statistics, client names or testimonials presented as real.
- Copying any text, image or code from the reference sites.

---

## 8. Phases — follow in order

**Phase 0 — Plan (stop and wait for my approval)**
1. Inspect `/public/brand/logo.svg` and `color.svg`.
2. Send me: final design tokens (colour, type scale, spacing, radius, motion curves), an ASCII wireframe of every section for desktop and mobile, and an animation map (section → trigger → behaviour → reduced-motion fallback).
3. Flag anything in this brief you think is weak or conflicting, with your recommended fix.

**Phase 1 — Foundation:** scaffold project, tokens, Vesterbro loading, Lenis + GSAP setup, nav, footer, `content/site.ts`.

**Phase 2 — Sections (static):** build all sections with final copy and responsive layouts, no scroll animation yet. Show me screenshots at 375 and 1440px.

**Phase 3 — Motion:** add signature moments first, then micro-interactions, then reduced-motion fallbacks.

**Phase 4 — QA:** run Lighthouse; use Playwright to screenshot every section at 375 / 768 / 1280 / 1920 and review them yourself; test keyboard-only navigation and reduced motion; fix issues; then give me a short report of scores, what you fixed, and every placeholder I still need to fill.

**Definition of done:** runs with `npm run dev`, builds with `npm run build` to static files, all checks in section 7 pass, and every placeholder is listed for me in `README.md`.
