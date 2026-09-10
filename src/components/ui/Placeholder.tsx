/**
 * Renders placeholder content visibly instead of inventing real numbers,
 * clients or testimonials (brief §4, Phase 0 flag 4).
 *
 * Two shapes show up in `content/site.ts`:
 *  - inline text placeholders, written as literal `[X]` inside a sentence
 *    ("live in [X] days") — <AutoPlaceholder> finds and styles them;
 *  - standalone numeric placeholders (counters, prices), typed as
 *    `number | "[X]"` — <Metric> and <Price> render those as a dashed chip
 *    instead of animating toward nothing.
 */

const BRACKET = /(\[[^\]]*\])/g;

/** True when a value is still the unfilled placeholder rather than real data. */
export function isPlaceholder(value: number | string): value is string {
  return typeof value === "string";
}

/** Splits copy on `[bracketed]` spans and wraps each one for visible styling. */
export function AutoPlaceholder({ text }: { text: string }) {
  // A capturing split puts every matched bracket group at an odd index, with
  // the plain text around it at even indices — no separate matching pass needed.
  const parts = text.split(BRACKET);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="ph-inline" title="Placeholder — replace before launch">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
