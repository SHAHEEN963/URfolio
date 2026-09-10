const PLACEHOLDER = /\[[^\]]*\]/;

/** A selectable pill used by the brief form (brief §12 — chips, not free typing). */
export function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const isPlaceholder = PLACEHOLDER.test(label);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      title={isPlaceholder ? "Placeholder — replace before launch" : undefined}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-[--dur-ui] ease-[--ease-ui] border",
        selected
          ? "bg-caramel text-espresso border-caramel"
          : "bg-transparent text-fg border-[var(--line)] hover:border-caramel hover:text-caramel",
        isPlaceholder ? "border-dashed" : "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
