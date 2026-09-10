import type { CSSProperties, ReactNode } from "react";

import { useParallax } from "./motion";

/**
 * Shared pieces of the Patch-structure layer.
 *
 * The reference splits every heading into per-word spans and staggers
 * them in — that is what makes its type feel like it arrives rather than
 * just appears. `Words` reproduces it, and because each word is its own
 * inline-block the line breaks stay natural.
 */
export function Words({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  step = 55,
}: {
  text: string;
  className?: string;
  /** Applied to each word span, e.g. an accent colour on one line. */
  wordClassName?: string;
  /** ms before the first word moves. */
  delay?: number;
  /** ms between words. */
  step?: number;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={`v2-word ${wordClassName}`}
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {w}
          {i < text.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/**
 * The atmosphere. The reference runs 58 of these radial glows; they are
 * the single thing that stops a near-black page reading as flat. Each is
 * a blurred radial gradient with no content, so they cost one composited
 * layer and nothing else.
 */
export function Orbs({
  spec,
  parallax = 0.1,
}: {
  spec: readonly { x: string; y: string; size: string; tone: "a" | "b" }[];
  /** Fraction of scroll speed the layer moves at. 0 pins it to the page. */
  parallax?: number;
}) {
  const drift = useParallax<HTMLDivElement>(parallax);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={drift} className="absolute inset-0 will-change-transform">
        {spec.map((o, i) => (
          // Two layers on purpose: the wrapper carries the ambient drift,
          // the orb keeps the translate that centres it on its own point.
          <span key={i} className="v2-orb-float">
            <span
              className={`v2-orb v2-orb--${o.tone}`}
              style={{
                left: o.x,
                top: o.y,
                width: o.size,
                height: o.size,
                transform: "translate(-50%,-50%)",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Section chrome: the small uppercase label the reference puts above every heading. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`v2-eyebrow v2-accent font-semibold ${className}`}>{children}</p>;
}

export function u(n: number): CSSProperties {
  return { fontSize: `calc(${n} * var(--u))` };
}
