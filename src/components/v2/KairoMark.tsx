import type { CSSProperties } from "react";

/**
 * The Kairo monogram.
 *
 * Traced from public/kairo-logo.png — the same mark that is the favicon
 * and the Instagram avatar — and rebuilt as strokes so it can do things
 * the PNG cannot: take currentColor, so it works on the near-black ground
 * without an inverted copy; scale to any size without a second asset; and
 * draw itself, which is how it arrives on the title card.
 *
 * Geometry measured off the original at 512×512: a 64-wide round-capped
 * stem centred at x=160 running y=112→399, and a V whose tips sit at
 * x=350 on the same rows, meeting the stem at (208, 256).
 */
export function KairoMark({
  size = "1em",
  className = "",
  style,
  draw = false,
  delay = 0,
  title,
}: {
  size?: string | number;
  className?: string;
  style?: CSSProperties;
  /** Animate the strokes on rather than showing them immediately. */
  draw?: boolean;
  /** ms before the draw starts. */
  delay?: number;
  /** Sets an accessible name. Omit on decorative uses. */
  title?: string;
}) {
  return (
    <svg
      /* Cropped to the mark's own bounds rather than the original PNG's
         512 square. A quarter of that square is empty on each side, so
         drawing it uncropped renders a K noticeably shorter than the
         wordmark beside it, with a gap that looks like a mistake.
         Height drives the size and the width follows the aspect. */
      viewBox="128 80 256 352"
      className={`${draw ? "v2-mark--draw" : ""} ${className}`}
      style={{ ...style, height: size, width: "auto", "--v2-delay": `${delay}ms` } as CSSProperties}
      fill="none"
      stroke="currentColor"
      strokeWidth={64}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...(title ? { "aria-label": title } : {})}
    >
      {title ? <title>{title}</title> : null}
      {/* The stem. 287 units long, which is its dash length below. */}
      <path className="v2-mark__stem" d="M160 112V399" pathLength={100} />
      {/* The arms, drawn as one polyline so they meet cleanly at the stem. */}
      <path className="v2-mark__arms" d="M350 112L208 256L350 399" pathLength={100} />
    </svg>
  );
}

/**
 * Mark plus wordmark, the lockup used in the nav and the footer. The
 * wordmark is type rather than a path so it stays selectable, searchable
 * and correctly sized at every breakpoint.
 */
export function KairoLockup({
  className = "",
  markSize = "1.1em",
  style,
}: {
  className?: string;
  markSize?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} style={style}>
      <KairoMark size={markSize} style={{ marginRight: "0.34em" }} />
      <span className="v2-display">Kairo</span>
    </span>
  );
}

/**
 * The monogram as page texture: one enormous, near-invisible K fixed to
 * the bottom-right of the frame. It breathes on a very long cycle, so
 * the ground is never completely static behind the content.
 */
export function Watermark() {
  return (
    <div aria-hidden="true" className="v2-watermark">
      <KairoMark size="calc(46 * var(--u))" />
    </div>
  );
}
