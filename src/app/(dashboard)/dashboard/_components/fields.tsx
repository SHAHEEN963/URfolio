"use client";

import { useId, useState, useTransition, type ReactNode } from "react";
import { uploadImage } from "@/lib/content/actions";
import type { Maybe } from "@/content/site";

const inputClass =
  "w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-transparent px-3 py-2 text-sm text-fg outline-none focus-visible:border-caramel";
const labelClass = "text-small text-fg-muted mb-1.5 block";

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={inputClass}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** A number field that stores its placeholder text (e.g. "[ ]", "[X]") until a real number is typed. */
export function NumberField<T extends string>({
  label,
  value,
  onChange,
  placeholderText,
}: {
  label: string;
  value: Maybe<T>;
  onChange: (value: Maybe<T>) => void;
  placeholderText: T;
}) {
  const id = useId();
  const isPh = typeof value === "string";
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        className={inputClass}
        value={isPh ? "" : String(value)}
        placeholder={isPh ? value || placeholderText : undefined}
        onChange={(e) => {
          const raw = e.target.value.trim();
          if (raw === "") {
            onChange(placeholderText);
            return;
          }
          const n = Number(raw);
          if (Number.isFinite(n)) onChange(n);
        }}
      />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <textarea id={id} className={inputClass} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="text-fg-muted/70 mt-1.5 text-xs">{hint}</p>}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-small text-fg">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 accent-[var(--caramel)]"
      />
      {label}
    </label>
  );
}

/** Add / edit / delete / duplicate / reorder for a list of objects. */
export function ListEditor<T>({
  items,
  onChange,
  makeNew,
  addLabel,
  renderItem,
  summary,
  emptyLabel = "No items yet.",
  hiddenKey,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  makeNew: () => T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  summary: (item: T, index: number) => string;
  emptyLabel?: string;
  /** A boolean field name (e.g. "hidden") — if given, each row gets a show/hide toggle. */
  hiddenKey?: keyof T;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function update(index: number, patch: Partial<T>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex((current) => (current === index ? target : current === target ? index : current));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  function duplicate(index: number) {
    const copy = { ...items[index] } as T & { id?: string };
    if (typeof copy.id === "string") {
      copy.id = `${copy.id}-copy-${Math.random().toString(36).slice(2, 7)}`;
    }
    const next = [...items];
    next.splice(index + 1, 0, copy);
    onChange(next);
    setOpenIndex(index + 1);
  }

  return (
    <div className="flex flex-col gap-3">
      {items.length === 0 && <p className="text-fg-muted text-sm">{emptyLabel}</p>}

      {items.map((item, index) => {
        const open = openIndex === index;
        const isHidden = hiddenKey ? Boolean(item[hiddenKey]) : false;
        return (
          <div
            key={index}
            className={`rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg-raised)] ${
              isHidden ? "opacity-60" : ""
            }`}
          >
            <div className="flex flex-wrap items-center gap-1.5 p-3">
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex-1 truncate text-start text-sm font-semibold text-fg hover:text-caramel"
              >
                <span className="me-2 text-caramel">{open ? "▾" : "▸"}</span>
                {summary(item, index) || "Untitled"}
                {isHidden && <span className="text-fg-muted ms-2 text-xs font-normal">(hidden)</span>}
              </button>

              {hiddenKey && (
                <button
                  type="button"
                  onClick={() => update(index, { [hiddenKey]: !isHidden } as Partial<T>)}
                  aria-label={isHidden ? "Show on site" : "Hide from site"}
                  title={isHidden ? "Show on site" : "Hide from site"}
                  className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-fg-muted hover:border-caramel hover:text-caramel"
                >
                  {isHidden ? "Show" : "Hide"}
                </button>
              )}
              <button
                type="button"
                onClick={() => duplicate(index)}
                aria-label="Duplicate"
                title="Duplicate"
                className="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-fg-muted hover:border-caramel hover:text-caramel"
              >
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="rounded-full border border-[var(--line)] px-2 py-1 text-xs text-fg-muted hover:border-caramel hover:text-caramel disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="rounded-full border border-[var(--line)] px-2 py-1 text-xs text-fg-muted hover:border-caramel hover:text-caramel disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Delete"
                className="rounded-full border border-mauve/50 px-2.5 py-1 text-xs text-mauve hover:bg-mauve/10"
              >
                Delete
              </button>
            </div>

            {open && <div className="flex flex-col gap-4 border-t border-[var(--line)] p-4">{renderItem(item, (patch) => update(index, patch), index)}</div>}
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => {
          onChange([...items, makeNew()]);
          setOpenIndex(items.length);
        }}
        className="self-start rounded-full border border-[var(--line)] px-4 py-2 text-sm text-fg hover:border-caramel hover:text-caramel"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/** Edits an array of plain strings (headline lines, trust chips, marquee words…). */
export function StringListEditor({
  label,
  items,
  onChange,
  addLabel,
  multiline,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex flex-col gap-2">
        {items.map((value, index) => (
          <div key={index} className="flex items-start gap-2">
            {multiline ? (
              <textarea
                className={inputClass}
                rows={2}
                value={value}
                aria-label={`${label} ${index + 1}`}
                onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
              />
            ) : (
              <input
                className={inputClass}
                value={value}
                aria-label={`${label} ${index + 1}`}
                onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Delete"
              className="mt-1 shrink-0 rounded-full border border-mauve/50 px-2.5 py-1 text-xs text-mauve hover:bg-mauve/10"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="self-start rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-fg hover:border-caramel hover:text-caramel"
        >
          + {addLabel}
        </button>
      </div>
    </div>
  );
}

/** Upload / preview / clear one image. */
export function ImagePicker({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (path: string) => void;
  hint?: string;
}) {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.ok && result.path) {
        onChange(result.path);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--bg)]">
          {value ? (
            // Plain <img>: dashboard uploads of unknown/unbounded dimensions.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-fg-muted px-2 text-center text-xs">No image</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml"
            className="text-fg-muted text-xs file:me-3 file:rounded-full file:border-0 file:bg-[var(--bg-raised)] file:px-3 file:py-1.5 file:text-fg"
            onChange={(e) => handleFile(e.target.files?.[0])}
            disabled={pending}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="w-fit rounded-full border border-mauve/50 px-2.5 py-1 text-xs text-mauve hover:bg-mauve/10"
            >
              Remove image
            </button>
          )}
          {pending && <p className="text-xs text-caramel">Uploading…</p>}
          {error && (
            <p role="alert" className="text-xs text-mauve">
              {error}
            </p>
          )}
          {hint && !error && <p className="text-fg-muted/70 text-xs">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
