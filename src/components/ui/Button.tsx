"use client";

import Link from "next/link";
import { useRef, type MouseEventHandler, type ReactNode } from "react";
import { gsap } from "gsap";
import { MAGNETIC_RANGE, gsapEase } from "@/lib/motion";
import { useIsTouchDevice, useReducedMotion } from "@/lib/useReducedMotion";

type Variant = "primary" | "secondary" | "ghost";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler;
  "aria-label"?: string;
  disabled?: boolean;
};

type ButtonAsButton = CommonProps & { href?: never; type?: "button" | "submit" };
type ButtonAsLink = CommonProps & { href: string; target?: string; rel?: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.95rem] font-medium transition-colors duration-[--dur-ui] ease-[--ease-ui] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-caramel text-espresso hover:bg-clay",
  secondary: "border border-[var(--line)] text-fg hover:border-caramel hover:text-caramel",
  ghost: "text-fg hover:text-caramel",
};

/**
 * Magnetic pull toward the cursor — disabled for touch and reduced motion
 * (brief §5). Called unconditionally on every render regardless of whether
 * this instance renders as a link or a button, so hook order never depends
 * on props.
 */
function useMagnetic<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();

  const onMouseMove = (e: React.MouseEvent) => {
    if (isTouch || reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    gsap.to(ref.current, { x: relX * MAGNETIC_RANGE, y: relY * MAGNETIC_RANGE, duration: 0.3, ease: gsapEase.ui });
  };

  const onMouseLeave = () => {
    if (isTouch || reduced || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.4, ease: gsapEase.ui });
  };

  return { ref, onMouseMove, onMouseLeave };
}

export function Button(props: ButtonProps) {
  const { variant = "primary", children, className = "", onClick, disabled } = props;
  const ariaLabel = props["aria-label"];
  const classes = `${base} ${variants[variant]} ${className}`;
  const { ref, onMouseMove, onMouseLeave } = useMagnetic<HTMLAnchorElement | HTMLButtonElement>();

  if (props.href !== undefined) {
    const isExternal = /^https?:\/\//.test(props.href) || props.href.startsWith("mailto:");
    const shared = {
      className: classes,
      onMouseMove,
      onMouseLeave,
      onClick,
      "aria-label": ariaLabel,
      target: props.target,
      rel: props.rel,
    };
    return isExternal ? (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={props.href} {...shared}>
        {children}
      </a>
    ) : (
      <Link ref={ref as React.Ref<HTMLAnchorElement>} href={props.href} {...shared}>
        {children}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={props.type ?? "button"}
      className={classes}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
