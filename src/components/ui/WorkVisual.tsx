/**
 * Generated placeholder art for the Work section and hero preview — tasteful
 * abstract compositions in the brand palette, deterministic per `seed` so
 * server and client render identically. No stock photography, no lorem
 * ipsum (brief §4.7, "Avoid" list).
 */

const PALETTE = ["var(--mauve)", "var(--caramel)", "var(--cocoa)", "var(--plum)", "var(--clay)"] as const;

/** Tiny deterministic PRNG (mulberry32) so the same seed always draws the same visual. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Shape = { kind: "rect" | "circle"; x: number; y: number; size: number; color: string; opacity: number };

function buildShapes(seed: number, w: number, h: number): Shape[] {
  const rand = mulberry32(seed * 97 + 1);
  const count = 4 + Math.floor(rand() * 3);
  const shapes: Shape[] = [];
  for (let i = 0; i < count; i++) {
    const color = PALETTE[Math.floor(rand() * PALETTE.length)];
    const size = (0.35 + rand() * 0.55) * Math.min(w, h);
    shapes.push({
      kind: rand() > 0.5 ? "circle" : "rect",
      x: rand() * w,
      y: rand() * h,
      size,
      color,
      opacity: 0.55 + rand() * 0.35,
    });
  }
  return shapes;
}

export function WorkVisual({ seed, className }: { seed: number; className?: string }) {
  const w = 400;
  const h = 300;
  const shapes = buildShapes(seed, w, h);
  const rand = mulberry32(seed * 13 + 7);
  const gridOffset = rand() * 40;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={className}
      role="img"
      aria-label="Generated placeholder artwork, standing in for a project screenshot"
    >
      <rect width={w} height={h} fill="var(--espresso-2)" />
      {/* faint grid, ties every card to the same system */}
      <g stroke="var(--line)" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`v${i}`} x1={gridOffset + i * (w / 5)} y1={0} x2={gridOffset + i * (w / 5)} y2={h} />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * (h / 4)} x2={w} y2={i * (h / 4)} />
        ))}
      </g>
      {shapes.map((s, i) =>
        s.kind === "circle" ? (
          <circle key={i} cx={s.x} cy={s.y} r={s.size / 2} fill={s.color} opacity={s.opacity} />
        ) : (
          <rect
            key={i}
            x={s.x - s.size / 2}
            y={s.y - s.size / 2}
            width={s.size}
            height={s.size}
            fill={s.color}
            opacity={s.opacity}
            transform={`rotate(${Math.round(rand() * 45)} ${s.x} ${s.y})`}
          />
        )
      )}
    </svg>
  );
}
