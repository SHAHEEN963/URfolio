/**
 * Single place for the handful of values that aren't content copy:
 * kit IDs, the canonical domain, and third-party endpoints. Everything the
 * visitor actually reads lives in `content/site.ts` instead.
 */

/**
 * Adobe Fonts ("Typekit") kit ID for Vesterbro. Paste yours here — until then
 * the site renders on the metric-matched fallback defined in globals.css.
 */
export const TYPEKIT_KIT_ID = "";

/**
 * Canonical domain, used for metadata, sitemap.xml and absolute OG/Twitter
 * image URLs. urfolio.net is the intended domain but isn't purchased yet —
 * update nothing else once it is, this is the only place it's referenced.
 */
export const SITE_URL = "https://urfolio.net";

/**
 * Formspree endpoint for the brief form (see submit-brief.ts). Static export
 * has no server to send email from, so the form posts here directly.
 * Sign up at https://formspree.io, create a form, and paste its endpoint.
 */
export const FORMSPREE_ENDPOINT = "";

/** sessionStorage key the preloader uses to skip itself after the first run. */
export const PRELOADER_SEEN_KEY = "urfolio:preloader-seen";

/**
 * When true, counters/testimonials/contact links that are still unfilled
 * placeholders are hidden instead of shown with a dashed placeholder style.
 * Flip this to true right before a real launch, once `content/site.ts` has
 * no more `[ ]` values left (see `npm run check-placeholders`).
 */
export const HIDE_UNFILLED = false;
