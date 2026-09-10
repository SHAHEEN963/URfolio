# URfolio — Phase 0 plan

**Status: waiting for your approval.** Nothing is scaffolded yet. The brand files are in `public/brand/`, the brief is in `docs/brief.md`, and nothing is committed or pushed.

---

## 1. What I inspected

### `logo.svg`
- viewBox 1080 × 1080, one path, `#8F7277`, two subpaths: the fused U+R silhouette (bbox x 166.8–913.5, y 254.0–826.2) and the sparkle hole.
- **Sparkle cutout:** bbox x 487.3–745.6, y 400.9–651.1 (258 × 250). Tips: left (487.3, 528.8), right (745.6, 528.6), top (617.7, 400.9), bottom (617.5, 651.1). **Centre ≈ (617.6, 528.7)**, 57% across and 49% down the viewBox.
- The arms are not quite equal (left 130, right 128, top 128, bottom 123), and the hole is an auto-trace with 160 nodes. A "clean" hand-drawn star would sit a few units off the hole.
- **Overlay decision:** the sparkle overlay is a copy of the hole's own subpath, converted to absolute coordinates, in its own `<svg viewBox="0 0 1080 1080">` stacked exactly on the mark. With the same viewBox it lines up at every size, with no CSS offsets. Its rotation origin is (617.6, 528.7). `logo.svg` itself is never edited.
- `components/ui/Mark.tsx` uses the same `d` with `fill="currentColor"`.

### `color.svg`
Five bars, 618.87 × 103.08, with a 15.08 gap. Top to bottom: **mauve, caramel, cocoa, plum, clay**. The bar ratio is 6 : 1 and the gap is 14.6% of a bar's height. The preloader, the mobile-menu wipe and the footer-wordmark reveal all reuse this order and rhythm.

### Contrast (recomputed, WCAG 2.x)

| Colour | on espresso | on espresso-2 | on paper |
|---|---|---|---|
| paper | **15.31** | 14.17 | — |
| caramel | **8.03** | 7.43 | 1.91 ✗ |
| mauve | 4.19 (large) | 3.88 (large) | 3.65 (large) |
| clay | 4.38 (large) | 4.06 (large) | 3.49 (large) |
| plum | 2.77 ✗ | 2.56 ✗ | **5.52** |
| cocoa | 2.17 ✗ | 2.01 ✗ | **7.05** |

Every figure in the brief checks out. Two additions:
- espresso text on a caramel button is 8.03:1;
- paper text on a plum fill is 5.52:1, which is what the featured pricing card and the company panel use.

---

## 2. Design tokens

### Colour

| Token | Value | Role |
|---|---|---|
| `--mauve` | `#8F7277` | logo, display type (large only), decorative lines |
| `--caramel` | `#D6A274` | CTAs, highlights, focus rings, active states |
| `--cocoa` | `#6B4438` | deep fills; body text on paper |
| `--plum` | `#7C5257` | secondary fills (company panel, featured plan); body text on paper |
| `--clay` | `#A2715F` | hover fills, illustrations, large text only |
| `--espresso` | `#1B1412` | page background |
| `--espresso-2` | `#251B18` | raised surfaces on dark |
| `--espresso-3` | `#30231F` | hover on raised dark surfaces *(new)* |
| `--paper` | `#F2EAE6` | text on dark; paper-section background |
| `--paper-2` | `#E7DBD5` | raised surfaces inside paper sections *(new)* |
| `--fg-muted` | paper @ 72% → ≈ `#B6AEAB` | secondary text on dark (≈ 8.3 : 1) *(new)* |
| `--line` | mauve @ 32% | hairlines on dark *(new)* |
| `--line-paper` | cocoa @ 22% | hairlines on paper *(new)* |

Semantic layer: `--bg`, `--fg`, `--fg-muted`, `--line`, `--accent`, `--focus`. A `data-surface="paper"` attribute on a section swaps them, so components don't need to know which surface they sit on. Tailwind v4 `@theme` exposes them as `bg-espresso`, `text-caramel`, and so on.

**Page rhythm:** Hero ▓ Marquee ▓ Statement ▓ Audiences ▓ Process ▓ Work ▓ **Before/After ░** Proof ▓ **Pricing ░** FAQ ▓ Contact ▓ Footer ▓ (two paper moments, separated by Proof).

### Type
- Stack: `vesterbro-vf, "URfolio Fallback", sans-serif` with `font-variation-settings: normal` as the base.
- `URfolio Fallback` is `local("Arial")` with `size-adjust` / `ascent-override` / `descent-override` / `line-gap-override`, computed from Vesterbro's real metrics once the kit loads (see Flag 1).
- One family for everything. The wordmark "URfolio" is live text, not an image.

| Token | Use | Size (375 → 1920) | Line height | Tracking |
|---|---|---|---|---|
| `display` | footer wordmark | `clamp(5.5rem, 0.6rem + 21vw, 25rem)` | 0.8 | −0.05em |
| `hero` | the only H1 | `clamp(2.75rem, 1.5rem + 4.4vw, 7rem)` | 0.94 | −0.035em |
| `h2` | section headings | `clamp(2.25rem, 1.25rem + 3.4vw, 5.25rem)` | 1.0 | −0.03em |
| `statement` | scroll-fill text | `clamp(1.75rem, 0.9rem + 3vw, 4.25rem)` | 1.12 | −0.02em |
| `h3` | panel / step / plan titles | `clamp(1.375rem, 1.1rem + 1vw, 2.125rem)` | 1.1 | −0.015em |
| `lead` | hero sub, section intros | `clamp(1.125rem, 1.02rem + 0.45vw, 1.375rem)` | 1.45 | 0 |
| `body` | running text (16 → 18px) | `clamp(1rem, 0.93rem + 0.31vw, 1.125rem)` | 1.6 | 0 |
| `small` | chips, meta, captions | `0.875rem` | 1.45 | 0.005em |
| `micro` | instrument panel, counter labels | `0.8125rem`, `tabular-nums` | 1.3 | 0.02em |

- The body measure is capped at `66ch`.
- There are no all-caps labels; hierarchy comes from size, weight and space.
- Weights are 400 body / 500 UI / 700 display, pending the kit's real axes. If a `wght` axis exists, nav links go 500 → 700 on hover and the footer wordmark shifts weight under the cursor.

### Spacing, grid, radius
- **Spacing** (4px base): `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`.
- **Section padding:** `clamp(5rem, 2.5rem + 8vw, 11rem)` top and bottom.
- **Gutter:** `clamp(1.25rem, 0.6rem + 2.8vw, 3.5rem)`.
- **Container:** max 1760px, so 1920 still breathes. 12 columns from 1024px, 6 at 768, 4 at 375.
- **Nav:** 72px, or 60px on mobile.

Radius:
- `0` for sections, marquee, work rows and palette bars. The bars are square, and so is the system.
- `4px` for inputs, pricing cards and the instrument panel.
- `14px` for anything that depicts UI: the browser frame, the modal, the before/after mocks.
- `999px` for buttons, toggles and chips.

**No drop shadows.** Depth comes from surface steps (espresso → -2 → -3) and hairlines.

### Motion (`lib/motion.ts`, mirrored as CSS custom properties)

| Token | CSS | GSAP | Use |
|---|---|---|---|
| `ease.enter` | `cubic-bezier(0.16, 1, 0.3, 1)` | `expo.out` | every entrance |
| `ease.ui` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | `power3.out` | hover, press, toggles, accordion |
| `ease.wipe` | `cubic-bezier(0.87, 0, 0.13, 1)` | `expo.inOut` | full-screen bar wipes and the before/after morph only |
| `scrub` | linear | `none` | anything tied to scroll position |

- **Durations:** `ui 0.4s` · `enter 0.8s` · `signature 1.2s`.
- **Staggers:** lines 0.08 · hero chars 0.018 · bars 0.07 · rows 0.05.
- **Distances:** lines reveal from 100% of their own box, inside a mask. The magnetic pull is at most 10px. The cursor preview follows with `quickTo` at 0.5s.

---

## 3. Wireframes

**Tablet (768)** is re-composed, not squeezed, and it's assumed to be touch:
- **Hero** stacks: copy first, with the preview full-width underneath.
- **Audiences** stay side by side, but without the hover expand.
- **Process** uses the mobile stepper (no pinning on touch).
- **Work** keeps the numbered list, with a small inline thumbnail on each row instead of the cursor preview.
- **Pricing** stays three columns, with tighter padding.
- **Contact** puts the intro above a single-column form.
- **FAQ** runs full width.

The wireframes below show the two extremes.

Legend: `( … )` button · `[ … ]` selected chip / active toggle / input · `✦` the logo sparkle · `[X]` / `[ ]` your placeholder · `━━` text lines.

### 0 · Preloader (first visit per session, ≤1.4s, skippable)

**Desktop** (1280–1920)

```
┌─ 0 · Preloader ──────────────────────────────────────────────────────────────┐
│ ████  mauve  ███████████████████████████████████████████████████████████████ │
│ ████████████████████████████████████████████████████████████████████████████ │
│ ████  caramel  █████████████████████████████████████████████████████████████ │
│ ████████████████████████████████████████████████████████████████████████████ │
│ ███████████████████████████████   U✦R mark   ███████████████████████████████ │
│ ████  cocoa  ███████████████████████████████████████████████████████████████ │
│ ████  plum  ████████████████████████████████████████████████████████████████ │
│ ████████████████████████████████████████████████████████████████████████████ │
│ ████  clay  ████████████████████████████████████████████████████████████████ │
│ ████████████████████████████████████████████████████████████████████████████ │
│                                                                              │
│                                                               Skip ›  (Esc)  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 0 · Preloader ────────────────┐
│ ████  mauve  █████████████████ │
│ ██████████████████████████████ │
│ ████  caramel  ███████████████ │
│ ██████████████████████████████ │
│ ████████   U✦R mark   ████████ │
│ ████  cocoa  █████████████████ │
│ ████  plum  ██████████████████ │
│ ██████████████████████████████ │
│ ████  clay  ██████████████████ │
│ ██████████████████████████████ │
│                                │
│                        Skip ›  │
└────────────────────────────────┘
```

### 1 · Navigation (fixed)

**Desktop** (1280–1920)

```
┌─ 1 · Nav ────────────────────────────────────────────────────────────────────┐
│ [✦] URfolio        Work   Process   Pricing   FAQ       ( Start your folio ) │
│                    ────   ← active indicator follows scroll                  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 1 · Nav ──────────────────────┐
│ [✦]URfolio (Start your folio)≡ │
└────────────────────────────────┘

┌─ menu open (five-bar wipe) ────┐
│ [✦] URfolio                  ✕ │
│                                │
│ Work                           │
│ Process                        │
│ Pricing                        │
│ FAQ                            │
│                                │
│ ( Start your folio )           │
│                                │
│ WhatsApp · Email · Instagram   │
└────────────────────────────────┘
```

### 2 · Hero

**Desktop** (1280–1920)

```
┌─ 2 · Hero ───────────────────────────────────────────────────────────────────┐
│ ( [Individual]  Company )                                                    │
│                                             ┌─────────────────────────────┐  │
│ Your portfolio.                             │ ● ● ●   lina-haddad.com     │  │
│ Built with AI,                              ├─────────────────────────────┤  │
│ finished by hand.                           │ Lina Haddad                 │  │
│                                             │ Brand Photographer          │  │
│ Send us your CV and your best work.         │ ┌───────┐┌───────┐┌───────┐ │  │
│ We turn it into a one-page portfolio        │ │  img  ││  img  ││  img  │ │  │
│ that gets you hired — live in [X] days.     │ └───────┘└───────┘└───────┘ │  │
│                                             │ ━━━━━━━━━━  ━━━━━━          │  │
│ (Start your folio)   See examples ↓         ├─────────────────────────────┤  │
│                                             │ ✦ Published                 │  │
│ [X]+ sites launched · Reply within          └─────────────────────────────┘  │
│ [X] hours · Rated [X]/5                     Type your name [__________]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 2 · Hero ─────────────────────┐
│ ( [Individual]  Company )      │
│                                │
│ Your portfolio.                │
│ Built with AI,                 │
│ finished by hand.              │
│                                │
│ Send us your CV and your best  │
│ work. We turn it into a        │
│ one-page portfolio that gets   │
│ you hired — live in [X] days.  │
│                                │
│ (     Start your folio      )  │
│ See examples ↓                 │
│                                │
│ [X]+ sites launched            │
│ Reply within [X] hours         │
│ Rated [X]/5                    │
│                                │
│ ┌────────────────────────────┐ │
│ │ ● ● ●  lina-haddad.com     │ │
│ ├────────────────────────────┤ │
│ │ Lina Haddad                │ │
│ │ Brand Photographer         │ │
│ │ ┌──────────┐┌──────────┐   │ │
│ │ │   img    ││   img    │   │ │
│ │ └──────────┘└──────────┘   │ │
│ ├────────────────────────────┤ │
│ │ ✦ Published                │ │
│ └────────────────────────────┘ │
│ Type your name [___________]   │
└────────────────────────────────┘
```

### 3 · Marquee strip

**Desktop** (1280–1920)

```
┌─ 3 · Marquee ────────────────────────────────────────────────────────────────┐
│ ──────────────────────────────────────────────────────────────────────────── │
│ ←  Designers ✦ Photographers ✦ Consultants ✦ Engineers ✦ Studios ✦ Agenc     │
│ ps ✦ Freelancers ✦ Designers ✦ Photographers ✦ Consultants ✦ Engineers  →    │
│ ──────────────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 3 · Marquee ──────────────────┐
│ ────────────────────────────── │
│ ← Designers ✦ Photographers ✦  │
│ ies ✦ Startups ✦ Freelancers → │
│ ────────────────────────────── │
└────────────────────────────────┘
```

### 4 · Statement (scroll-fill)

**Desktop** (1280–1920)

```
┌─ 4 · Statement ──────────────────────────────────────────────────────────────┐
│                                                                              │
│    Talent isn't the problem. Visibility is. A PDF                            │
│    CV and a scattered Instagram don't close deals.                           │
│    A portfolio does — and now it takes days, not                             │
│    months.                                                                   │
│                                                                              │
│    ▲ scrolled past = --paper   ▲ still ahead = --mauve @ 25%                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 4 · Statement ────────────────┐
│                                │
│ Talent isn't the problem.      │
│ Visibility is. A PDF CV and    │
│ a scattered Instagram don't    │
│ close deals. A portfolio does  │
│ — and now it takes days, not   │
│ months.                        │
│                                │
└────────────────────────────────┘
```

### 5 · Two audiences

**Desktop** (1280–1920)

```
┌─ 5 · Audiences ──────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────┐┌────────────────────────────────────┐ │
│ │ For individuals                    ││ For companies                      │ │
│ │                                    ││                                    │ │
│ │ Get hired,                         ││ Look as good                       │ │
│ │ get booked.                        ││ as your work.                      │ │
│ │                                    ││                                    │ │
│ │ — Personal story & positioning     ││ — Services & offer                 │ │
│ │ — Selected work with case notes    ││ — Project showcase                 │ │
│ │ — Skills and experience            ││ — Team and clients                 │ │
│ │ — Contact & booking links          ││ — Trust signals                    │ │
│ │ — CV download                      ││ — Lead form & WhatsApp             │ │
│ │                                    ││                                    │ │
│ │ ( Build my portfolio )             ││ ( Build our company site )         │ │
│ └────────────────────────────────────┘└────────────────────────────────────┘ │
│    espresso-2 fill  ◄── seam slides to 62/38 on hover ──►  plum fill         │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 5 · Audiences ────────────────┐
│ ┌────────────────────────────┐ │
│ │ For individuals            │ │
│ │ Get hired, get booked.     │ │
│ │ — Personal story &         │ │
│ │   positioning              │ │
│ │ — Selected work with case  │ │
│ │   notes                    │ │
│ │ — Skills and experience    │ │
│ │ — Contact & booking links  │ │
│ │ — CV download              │ │
│ │ ( Build my portfolio )     │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ For companies              │ │
│ │ Look as good as your work. │ │
│ │ — Services & offer         │ │
│ │ — Project showcase         │ │
│ │ — Team and clients         │ │
│ │ — Trust signals            │ │
│ │ — Lead form & WhatsApp     │ │
│ │ ( Build our company site ) │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### 6 · Process (pinned on desktop)

**Desktop** (1280–1920)

```
┌─ 6 · Process ────────────────────────────────────────────────────────────────┐
│ How it works                                                                 │
│                                                                              │
│ ┃ 01  Brief                              ┌─────────────────────────────────┐ │
│ ┃     Share your CV, work and links.     │                                 │ │
│ ┃     10-minute form, no writing needed. │ visual for the active step      │ │
│ │ 02  AI draft                           │                                 │ │
│ │ 03  Human polish                       │ 01 chip-form fragments          │ │
│ │ 04  Launch                             │ 02 wireframe + ✦ drafting       │ │
│                                          │ 03 type specimen, redlines      │ │
│ ┃ = progress line, fills with scroll     │ 04 browser frame, your domain   │ │
│                                          │                                 │ │
│                                          └─────────────────────────────────┘ │
│                                                                              │
│ pinned ≈ 300vh · one step per quarter of scroll                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 6 · Process ──────────────────┐
│ How it works                   │
│                                │
│ ┃ 01  Brief                    │
│ ┃     Share your CV, work and  │
│ ┃     links. 10-minute form,   │
│ ┃     no writing needed.       │
│ ┃     ┌────────────────────┐   │
│ ┃     │ chip-form visual   │   │
│ ┃     └────────────────────┘   │
│ │ 02  AI draft                 │
│ │     …text + visual inline    │
│ │ 03  Human polish             │
│ │ 04  Launch                   │
│                                │
│ no pin · line fills natively   │
└────────────────────────────────┘
```

### 7 · Work — selected portfolios

**Desktop** (1280–1920)

```
┌─ 7 · Work ───────────────────────────────────────────────────────────────────┐
│ Selected portfolios                                               06 samples │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 01   Brand photographer · sample       Personal                       [year] │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 02   Architecture studio · sample      Company        ┌───────────┐   [year] │
│ ──────────────────────────────────────────────────────│   preview │───────── │
│ 03   Product designer · sample         Personal       │   follows │   [year] │
│ ──────────────────────────────────────────────────────│   cursor  │───────── │
│ 04   Specialty coffee roaster · sample Company        └───────────┘   [year] │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 05   Management consultant · sample    Personal                       [year] │
│ ──────────────────────────────────────────────────────────────────────────── │
│ 06   Software engineer · sample        Personal                       [year] │
│ ──────────────────────────────────────────────────────────────────────────── │
└──────────────────────────────────────────────────────────────────────────────┘

          ┌─ modal (click a row) ────────────────────────────────────┐
          │ 02 · Architecture studio · sample                    ✕   │
          │                                                          │
          │ ┌──────────────────────┐┌─────────────┐┌─────────────┐   │
          │ │       visual 1       ││  visual 2   ││  visual 3   │   │
          │ └──────────────────────┘└─────────────┘└─────────────┘   │
          │                                                          │
          │ [One-line result]                                        │
          │ Visit site ↗   (disabled until a real link exists)       │
          └──────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 7 · Work ─────────────────────┐
│ Selected portfolios            │
│                                │
│ ┌────────────────────────┐     │
│ │                        │     │
│ │       visual (4:3)     │     │
│ │                        │     │
│ └────────────────────────┘     │
│ 01  Brand photographer         │
│     Sample · Personal · [year] │
│                                │
│ ┌────────────────────────┐     │
│ │                        │     │
│ │       visual (4:3)     │     │
│ │                        │     │
│ └────────────────────────┘     │
│ 02  Architecture studio        │
│     Sample · Company · [year]  │
│                                │
│ … 03 – 06                      │
└────────────────────────────────┘
```

### 8 · Before / After (light --paper section)

**Desktop** (1280–1920)

```
┌─ 8 · Before / After — PAPER ─────────────────────────────────────────────────┐
│ (visually hidden H2: Before and after)              ( Without │ [With] )     │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │     ┌─ CV.pdf ───────────┐                                               │ │
│ │     │ LINA HADDAD        │     ┌─ link-in-bio ────┐                      │ │
│ │     │ ━━━━━━ ━━━━ ━━━    │     │ ○ Portfolio      │                      │ │
│ │     │ ━━━━ ━━━━━━ ━━     │     │ ○ Instagram      │                      │ │
│ │     │ ━━━━━━━ ━━━━       │     │ ○ Old Behance    │                      │ │
│ │     │ ━━━━━ ━━━━━━━━     │     │ ○ Book me        │                      │ │
│ │     └────────────────────┘     └──────────────────┘                      │ │
│ │                                                                          │ │
│ │     desaturated · cluttered · slightly tilted, taped                     │ │
│ │                                                                          │ │
│ │     ◯ With → the finished URfolio site grows over it from the switch     │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ Easy to ignore.   ⇄   Hard to forget.      ← H2-size caption, aria-live      │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 8 · Before/After — PAPER ─────┐
│ ( Without │ [With] )           │
│                                │
│ ┌────────────────────────────┐ │
│ │ CV.pdf + link-in-bio,      │ │
│ │ stacked, tilted, grey      │ │
│ │                            │ │
│ │ ◯ With: the site grows     │ │
│ │   over it from the switch  │ │
│ └────────────────────────────┘ │
│                                │
│ Easy to ignore.                │
│   ⇄  Hard to forget.           │
└────────────────────────────────┘
```

### 9 · Proof

**Desktop** (1280–1920)

```
┌─ 9 · Proof ──────────────────────────────────────────────────────────────────┐
│ [X]                [X]                [X]                [X]/5               │
│ sites launched     countries          avg. days to       client rating       │
│                                       launch                                 │
│ ──────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│ “[Testimonial quote — to be supplied]”        ┌────────────────────────────┐ │
│                                               │ Your visit, measured       │ │
│ (◯) [Name]                                    ├────────────────────────────┤ │
│     [Role, Company]                           │ LCP    measuring…          │ │
│                                               │ INP    waiting for a tap   │ │
│                                               │ CLS    measuring…          │ │
│ ‹  ›  drag · swipe · ← →           01 / 04    │ TTFB   measuring…          │ │
│                                               ├────────────────────────────┤ │
│                                               │ Measured on your device,   │ │
│                                               │ just now. Every URfolio    │ │
│                                               │ site is built to this      │ │
│                                               │ standard.                  │ │
│                                               └────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 9 · Proof ────────────────────┐
│ [X]            [X]             │
│ sites launched countries       │
│                                │
│ [X]            [X]/5           │
│ avg. days to   client rating   │
│ launch                         │
│ ────────────────────────────── │
│ “[Testimonial quote — to be    │
│ supplied]”                     │
│                                │
│ (◯) [Name], [Role]             │
│ ‹ swipe ›              01 / 04 │
│                                │
│ ┌────────────────────────────┐ │
│ │ Your visit, measured       │ │
│ ├────────────────────────────┤ │
│ │ LCP    measuring…          │ │
│ │ INP    waiting for a tap   │ │
│ │ CLS    measuring…          │ │
│ │ TTFB   measuring…          │ │
│ ├────────────────────────────┤ │
│ │ Measured on your device,   │ │
│ │ just now. Every URfolio    │ │
│ │ site is built to this      │ │
│ │ standard.                  │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

### 10 · Pricing (light --paper section)

**Desktop** (1280–1920)

```
┌─ 10 · Pricing — PAPER ───────────────────────────────────────────────────────┐
│                         ┌─────────────────────────┐                          │
│ ┌─────────────────────┐ │ ✦ Recommended           │ ┌─────────────────────┐  │
│ │ Personal            │ │ Professional            │ │ Company             │  │
│ │ AED [ ]             │ │ AED [ ]                 │ │ AED [ ]             │  │
│ │                     │ │                         │ │                     │  │
│ │ One-page portfolio  │ │ Everything in Personal  │ │ One-page company    │  │
│ │ AI draft + designer │ │ + Custom copywriting    │ │   profile           │  │
│ │   polish            │ │ + Case study layouts    │ │ Services & projects │  │
│ │ Up to [X] projects  │ │ + SEO setup             │ │ Team & clients      │  │
│ │ [X] revision rounds │ │ + Analytics             │ │ Lead form+WhatsApp  │  │
│ │ Your domain         │ │ + [X] revision rounds   │ │ Optional Arabic     │  │
│ │                     │ │                         │ │                     │  │
│ │ ( Choose Personal ) │ │ ( Choose Professional ) │ │ ( Choose Company )  │  │
│ └─────────────────────┘ │                         │ └─────────────────────┘  │
│                         └─────────────────────────┘                          │
│                                                                              │
│               Need something bigger? Tell us in the brief.                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 10 · Pricing — PAPER ─────────┐
│ ┌────────────────────────────┐ │
│ │ Personal · AED [ ]         │ │
│ │ — One-page portfolio …     │ │
│ │ ( Choose Personal )        │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ ✦ Recommended              │ │
│ │ Professional · AED [ ]     │ │
│ │ — Everything in Personal … │ │
│ │ ( Choose Professional )    │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ Company · AED [ ]          │ │
│ │ — One-page company …       │ │
│ │ ( Choose Company )         │ │
│ └────────────────────────────┘ │
│ Need something bigger?         │
│ Tell us in the brief.          │
└────────────────────────────────┘
```

### 11 · FAQ

**Desktop** (1280–1920)

```
┌─ 11 · FAQ ───────────────────────────────────────────────────────────────────┐
│ Questions               Do I need to write the content?                  +   │
│                         ──────────────────────────────────────────────────   │
│                         Is it all AI?                                    –   │
│ Still unsure?           No. AI handles the first draft and speed.            │
│ Message us on           A designer makes every final decision.               │
│ WhatsApp ↗              ──────────────────────────────────────────────────   │
│                         How long does it take?                           +   │
│                         ──────────────────────────────────────────────────   │
│                         Can I update it later?                           +   │
│                         ──────────────────────────────────────────────────   │
│                         Do you handle domain and hosting?                +   │
│                         ──────────────────────────────────────────────────   │
│                         Can my site be in Arabic?                        +   │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 11 · FAQ ─────────────────────┐
│ Questions                      │
│                                │
│ Do I need to write the       + │
│   content?                     │
│ ────────────────────────────── │
│ Is it all AI?                – │
│ No. AI handles the first       │
│ draft and speed. A designer    │
│ makes every final decision.    │
│ ────────────────────────────── │
│ How long does it take?       + │
│ … 3 more                       │
│                                │
│ Still unsure? WhatsApp ↗       │
└────────────────────────────────┘
```

### 12 · Contact — the brief form

**Desktop** (1280–1920)

```
┌─ 12 · Contact ───────────────────────────────────────────────────────────────┐
│ Let's build yours.            I am      [Individual] (Company)               │
│                               I need    (New portfolio) (Redesign)           │
│ Answer a few taps. We reply             (Not sure yet)                       │
│ within [X] hours.             Plan      (Personal) [Professional]            │
│                                         (Company) (Not sure)                 │
│                               Budget    ([range 1]) ([range 2])              │
│                                         ([range 3]) (Not sure)               │
│                                                                              │
│                               Name      [________________________]           │
│                               Email     [________________________]           │
│                               WhatsApp  [+971 5X XXX XXXX]  optional         │
│                               Work link [________________]  optional         │
│ Prefer WhatsApp?              Message   [________________]  optional         │
│ Message us ↗                                                                 │
│                               ( Send my brief )                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 12 · Contact ─────────────────┐
│ Let's build yours.             │
│ Answer a few taps. We reply    │
│ within [X] hours.              │
│                                │
│ I am                           │
│ [Individual] (Company)         │
│ I need                         │
│ (New portfolio) (Redesign)     │
│ (Not sure yet)                 │
│ Plan                           │
│ (Personal) [Professional]      │
│ (Company) (Not sure)           │
│ Budget                         │
│ ([range 1]) ([range 2])        │
│ ([range 3]) (Not sure)         │
│                                │
│ Name     [________________]    │
│ Email    [________________]    │
│ WhatsApp [+971 5X XXX XXXX]    │
│ Work link, Message (optional)  │
│                                │
│ (      Send my brief       )   │
│ Prefer WhatsApp? Message us ↗  │
└────────────────────────────────┘
```

### 13 · Footer

**Desktop** (1280–1920)

```
┌─ 13 · Footer ────────────────────────────────────────────────────────────────┐
│ hello@[domain]   WhatsApp   Instagram   LinkedIn   Behance            ↑ Top  │
│                                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │                                                                          │ │
│ │                                                                          │ │
│ │    URfolio            ← giant wordmark, edge to edge (≈21vw),            │ │
│ │                         revealed in five horizontal bands                │ │
│ │                                                                          │ │
│ │                                                                          │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ Based in the UAE. Building portfolios worldwide.              © 2026 URfolio │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Mobile** (375)

```
┌─ 13 · Footer ──────────────────┐
│ hello@[domain]                 │
│ WhatsApp · Instagram           │
│ LinkedIn · Behance             │
│                                │
│ ┌────────────────────────────┐ │
│ │                            │ │
│ │ URfolio  (≈21vw)           │ │
│ │                            │ │
│ └────────────────────────────┘ │
│                                │
│ Based in the UAE.              │
│ Building portfolios worldwide. │
│ © 2026 URfolio           ↑ Top │
└────────────────────────────────┘
```

---

## 4. Animation map

"Touch" means `(hover: none)` or `(pointer: coarse)`. "RM" means `prefers-reduced-motion: reduce`. Each section has exactly one entrance behaviour, marked **E**. Everything else in its row is interaction or scroll-scrubbed state.

| # | Section | Trigger | Behaviour | Touch | RM fallback |
|---|---|---|---|---|---|
| — | Smooth scroll | load | Lenis (wheel only) is driven by `gsap.ticker` and feeds `ScrollTrigger.update`. Anchors use `lenis.scrollTo(el, { offset: -nav })`. Keyboard, find-in-page and scrollbar stay native. | Lenis off; native momentum | Lenis never initialised |
| 0 | Preloader | first load, if `sessionStorage` has no flag (checked by an inline head script before paint, so there's no flash) | Bands `scaleX` 0→1 from the left (stagger 0.07, expo.out) → mark scales in, the sparkle overlay turns 90° and flashes once → bands `yPercent −100` from the top (expo.inOut) → dispatches `urfolio:ready` as clay leaves. Any key or click skips it. | same, 1.1s | skipped; page renders final |
| 1 | Nav | `urfolio:ready`; scroll direction; a ScrollTrigger per section | **E** slides down once. Hides on scroll down and returns on scroll up (`yPercent`, 0.4s ui). The active indicator moves via `x`/`scaleX`. Link underlines draw with `scaleX`. Hairline and solid fill appear after 40px. | menu: five bands wipe down, links rise per line (masked), Esc closes, focus trapped | always visible, indicator jumps, menu opens instantly |
| 2 | Hero | `urfolio:ready` | **E** H1 split by *character* (the only place): chars rise out of per-line masks, then sub, CTAs and chips fade 16px up once. The build-preview timeline (~4.5s) runs: wireframe → name types in → images `clip-path` in → layout snaps → palette applies → "Published". The toggle pill slides and rebuilds the timeline. The name input writes straight into the preview. A sparkle-shaped light follows the cursor (`quickTo`, 6% opacity). | no cursor light | everything in its final state; preview shows the finished site; name input still live |
| 3 | Marquee | in view | **E** none (motion is its entrance). Two `xPercent` loops in opposite directions. Hover eases `timeScale` → 0.25. Paused off-screen. | same, no hover | static, wrapped rows |
| 4 | Statement | scroll 80% → 30% of viewport | **E** scrubbed fill: two stacked layers (mauve @ 25% and paper), with each paper word's **opacity** tied to scroll, so only opacity animates. | same (cheap) | fully filled |
| 5 | Audiences | in view / hover | **E** both panels open from the centre seam (`clip-path`). Hover moves the seam to 62/38 via `clip-path`; content re-centres with `transform` (no flex-basis animation, see Flag 7). | stacked, no expand | static 50/50 |
| 6 | Process | pinned, scrub | **E** pin ≈ 300vh. The progress line grows with `scaleY`, and each quarter activates a step: title to paper, body opens with `clip-path`, and the right-hand visual swaps with a masked wipe. | no pin; line fills on native scroll; visuals inline | no pin; all steps open; line full |
| 7 | Work | in view / pointer | **E** row hairlines draw in with `scaleX` (stagger 0.05). Hovering a row shows a preview that follows the cursor with lag and velocity-based rotation (±6°). Clicking opens the modal via `clip-path` from the row's rect; focus is trapped and Esc closes it. | cards with visuals; no cursor effect | no follow; modal appears instantly |
| 8 | Before/After | in view / toggle | **E** caption lines reveal in masks. The toggle grows or shrinks the "With" layer with `clip-path: circle()` from the switch position (1.0s expo.inOut). The caption swaps line by line. Arrow keys and Space work on the switch. | same | instant swap |
| 9 | Proof | in view once / drag | **E** counters count up once, using `tabular-nums` and fixed width so there's no CLS. The testimonial slider drags with `transform`, snaps, supports ←/→, and updates the "01 / 04" counter. The instrument panel's values tick in as `web-vitals` reports them. | swipe | final numbers; slider moves without transition |
| 10 | Pricing | in view | **E** cards rise 24px + fade, staggered. This is the *only* section using a staggered rise. The featured card's ✦ turns once. "Choose X" scrolls to the form and pre-selects the plan. | same | static |
| 11 | FAQ | click / Enter | **E** heading line reveal. `<details name="faq">`: one open at a time, natively. The answer expands with CSS `grid-template-rows: 0fr → 1fr` (Flag 6) and the +/– rotates. | same | opens instantly |
| 12 | Contact | in view / input | **E** heading line reveal. Chips press to 0.97 scale and the selection fill slides in. Errors appear inline on blur and submit. Success replaces the form with a `clip-path` reveal and is announced via `aria-live="polite"`. | same | no transitions |
| 13 | Footer | footer enters | **E** the wordmark is revealed in **five horizontal bands** (the palette bars), each masked and staggered 0.07 (Flag 15). On hover it shifts weight under the cursor, if a `wght` axis exists. Back-to-top uses Lenis. | reveal only | shown instantly |
| — | Micro | pointer | Magnetic primary buttons (≤10px, `quickTo`). Link underlines draw. Toggle pills slide. | magnetic off | all off, states instant |

Performance guard: GSAP only ever touches `transform`, `opacity`, `clip-path` and `font-variation-settings`. The only exceptions are the FAQ height (CSS, user-triggered) and counter text. `will-change` is applied only while an animation runs. Each ScrollTrigger is created with `gsap.matchMedia()`, so touch and RM variants are torn down cleanly.

---

## 5. Flags — weak or conflicting points, with my recommended fix

1. **Adobe Fonts kit (blocking for final type, not for Phase 1).**
   - I need your **KIT_ID**. Until I have it I can't inspect the axes or compute the fallback metrics, so I'll build on the fallback and swap it in.
   - "Preload only the hero font file" isn't possible with a Typekit kit, because its file URLs are tokenised and served through the kit CSS. The fix is `preconnect` to `use.typekit.net` and `p.typekit.net`, plus setting the kit's **Font display** to `swap` in your Adobe Fonts web project.
2. **Vesterbro can't appear in the generated OG image or app icons.** The build has no access to the font file, since Adobe Fonts never exposes one. **Fix:** export "URfolio" as an **outlined SVG wordmark** from Illustrator or Photoshop and I'll use it there. Until then, the OG image uses the mark plus the fallback font.
3. **Preloader vs LCP and Lighthouse.** Lighthouse is always a first visit, so the preloader always runs during a Lighthouse test, and the live LCP readout would include it too. **Fix:**
   - cap the preloader at ~1.4s;
   - paint the hero sub-copy under the overlay from the first frame, so the LCP candidate exists immediately;
   - verify in Phase 4, and shorten the preloader if it costs the ≥ 90 score.
4. **Placeholders going live.** "`[X]+ sites launched`", "Rated `[X]/5`", empty testimonials and "AED `[ ]`" read as broken, or worse, as fake if you launch before filling them. **Fix:**
   - each placeholder is typed in `site.ts` and renders with a dashed outline;
   - `npm run build` prints a checklist of unfilled ones;
   - a single `hideUnfilled` switch hides chips, counters and testimonials that are still empty.

   JSON-LD will **not** include `aggregateRating`: self-served ratings aren't eligible, and the number isn't real yet.
5. **Sample work mustn't look like real clients.** The six projects are archetypes labelled "sample" (e.g. "Brand photographer · sample"), not invented company names. The modal's link is disabled until a real URL exists.
6. **FAQ "smooth height" vs "animate only transform/opacity/clip-path".** An accordion has to change height. **Fix:** use `<details name="faq">`, which gives native one-open-at-a-time, keyboard support, and **find-in-page auto-opens the matching answer**. Its height is animated in CSS with `grid-template-rows`. It's one small, user-triggered exception.
7. **Audiences "expand on hover"** implies animating flex-basis, which is a layout property. **Fix:** a `clip-path` seam plus a `transform` content shift, which looks the same and stays on the compositor.
8. **Caramel focus ring on paper fails.** It's 1.91:1, below the 3:1 non-text minimum (WCAG 1.4.11). **Fix:** in paper sections the focus ring is a double ring, 2px espresso inside 2px caramel. Elsewhere it's plain caramel.
9. **Form backend on a static site.** Static export has no server actions, and Resend needs a secret key that can't live in the browser. **Fix:** `submitBrief()` POSTs to **Formspree**, with the endpoint in `site.ts` and a TODO. If you'd rather use Resend later, it needs one small serverless function.
10. **Live web-vitals honesty.** INP only exists after an interaction, and LCP is finalised on the first input. **Fix:**
    - INP reads "waiting for a tap" until you interact;
    - values update live (`reportAllChanges`);
    - each value is rated good / needs work / poor against Google's thresholds, so a slow device sees the truth rather than a flattering number.
11. **"Individual / Company" is asked three times** (hero toggle, audiences, form). **Fix:** one shared state. The hero toggle pre-selects "I am" in the form and highlights the matching audience panel.
12. **Domain and host.** These are needed for `canonical`, `sitemap.xml` and absolute OG URLs. GitHub Pages would serve at `/URfolio/` and need a `basePath`. **Recommendation:** Vercel or Cloudflare Pages on your own domain. I'll use a placeholder domain until you choose.
13. **Motion curves.** I added a third curve (`expo.inOut`) used *only* for the full-screen bar wipes and the before/after morph. Entrances use `expo.out` and interactions use `power3.out`, as the brief asks.
14. **TypeScript 7** became npm `latest` this month, but Next 16.3 is proven on TS 5. I'll pin `typescript@^5`.
15. **Footer "line by line":** "URfolio" is a single line. My take is to reveal it in five horizontal bands that echo the palette bars, which ties the footer to the preloader.
16. **Before/After persona:** the same person as the hero sample (Lina Haddad), for continuity. Company mode doesn't change this section.

---

## 6. Stack and structure (Phase 1)

`next 16.3.4` (App Router, `output: 'export'`) · `react 19` · `tailwindcss 4.3` · `gsap 3.15` (ScrollTrigger, SplitText) · `lenis 1.3` · `web-vitals 6.2` · `typescript ^5` · dev: `@playwright/test 1.63`. No other UI or animation libraries.

```
app/          layout.tsx · page.tsx · globals.css · opengraph-image.tsx · icon.svg · sitemap.ts · robots.ts
components/
  sections/   Preloader · Nav · Hero · Marquee · Statement · Audiences · Process · Work · BeforeAfter · Proof · Pricing · Faq · Contact · Footer
  ui/         Mark · SparkleOverlay · Button · TogglePill · Chip · Modal · BrowserFrame · Placeholder
content/      site.ts          ← every string, number, price and link (keyed `en` so `ar` can be added)
lib/          motion.ts · smooth-scroll.ts · submit-brief.ts · config.ts (TYPEKIT_KIT_ID, SITE_URL)
public/brand/ logo.svg · color.svg
scripts/      check-placeholders.mjs
docs/         brief.md · phase-0-plan.md
```

All layout uses **logical properties** (`ms-*`, `ps-*`, `text-start`, `inset-inline-*`), so a future Arabic version is mostly a `dir="rtl"` flip plus a second content object.

## 7. What I need from you

1. **Approval** of this plan, or changes to it.
2. **Adobe Fonts KIT_ID.** Also confirm the kit includes Vesterbro VF, and set Font display to `swap`.
3. *(Optional)* An outlined "URfolio" wordmark SVG, for the OG image and icons.
4. *(Optional, any time before launch)* Your domain and host.
