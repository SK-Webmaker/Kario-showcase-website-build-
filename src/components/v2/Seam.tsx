import { useEffect, useRef } from "react";

/**
 * The transition between two acts.
 *
 * The pixel field this replaces drew several hundred hard-edged squares
 * over the boundary; at any real scroll speed that reads as noise rather
 * than as a cut. This does the opposite and does it with three elements:
 *
 *  - the outgoing section sinks into the ground through a soft vertical
 *    veil in the page's own near-black, so it dissolves rather than
 *    stopping;
 *  - a single hairline draws outward from the centre of the seam as the
 *    boundary crosses the middle of the screen — the same drawn-rule
 *    gesture used everywhere else on the page, at its largest scale;
 *  - a very wide, very faint bloom sits behind the line, which is what
 *    keeps the black from going flat at the join.
 *
 * All of it is opacity and scaleX on three fixed nodes, driven by one
 * rAF-throttled scroll read, so it costs nothing per frame. Under
 * reduced motion the veil is simply not drawn at all.
 */
export function Seam({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement | null>(null);
  const veil = useRef<HTMLDivElement | null>(null);
  const line = useRef<HTMLDivElement | null>(null);
  const bloom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const h = host.current;
    const v = veil.current;
    const l = line.current;
    const b = bloom.current;
    if (!h || !v || !l || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | null = null;
    let last = -1;

    const draw = () => {
      frame = null;
      const r = h.getBoundingClientRect();
      const vh = window.innerHeight;

      // 0 while the seam is still below the fold, 1 once it has left the
      // top of the screen. The band is a whole viewport tall, so this is
      // a slow, deliberate crossing rather than a flick.
      const t = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const q = Math.round(t * 200) / 200;
      if (q === last) return;
      last = q;

      // The veil arrives over the first two thirds and holds.
      const veilAmount = Math.min(1, q * 1.5);
      v.style.opacity = veilAmount.toFixed(3);

      // The line and its bloom peak as the seam passes mid-screen, then
      // leave with it: the cut happens once, it does not linger.
      const peak = 1 - Math.abs(q - 0.5) * 2;
      const eased = peak <= 0 ? 0 : peak * peak * (3 - 2 * peak);
      l.style.transform = `scaleX(${(0.12 + 0.88 * eased).toFixed(3)})`;
      l.style.opacity = eased.toFixed(3);
      b.style.opacity = (eased * 0.5).toFixed(3);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={host} aria-hidden="true" className={`v2-seam ${className}`}>
      <div ref={veil} className="v2-seam__veil" />
      <div ref={bloom} className="v2-seam__bloom" />
      <div ref={line} className="v2-seam__line" />
    </div>
  );
}
