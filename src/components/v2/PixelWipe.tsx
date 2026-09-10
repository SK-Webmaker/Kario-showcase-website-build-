import { useEffect, useRef } from "react";

/**
 * The pixel field that forms and dissolves across a section boundary.
 *
 * This is the reference's `pixelGrad`, ported. The mechanics, in its own
 * terms:
 *
 *  - the viewport is divided into sixteen columns of square cells (5.3 on
 *    a phone, so the squares stay chunky rather than becoming a mosaic);
 *  - a band's travel through the viewport gives a number that ramps
 *    0 → 2, holds at 2 across the middle, and ramps back to 0;
 *  - every row carries a factor that smoothsteps to zero near the band's
 *    top and bottom edges, so the field has no hard horizontal seam;
 *  - each cell has a threshold made of its distance from the horizontal
 *    centre of the screen plus a hash of its grid coordinates, and it
 *    fills once the ramp times the row factor passes that threshold. The
 *    centre term opens the field outward from the middle; the hash keeps
 *    its edge ragged rather than a clean expanding rectangle.
 *
 * The one thing worth being precise about is where it draws. The canvas
 * is absolutely positioned inside the band and sits *behind* the page —
 * it is not a fixed overlay. That is the whole reason the reference's
 * version never gets in the way: the pixels form and dissolve in the
 * background while the content stays legible on top of them. Lifting the
 * canvas above the content turns a transition into a blindfold.
 *
 * Not taken from the reference: it fills its cells with a purple-to-orange
 * gradient. Kairo's field is one flat blue with the texture coming from
 * per-cell alpha, because a two-tone wash is the one thing this site is
 * not allowed to look like.
 */
export function PixelWipe({ className = "" }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame: number | null = null;
    let lastKey = "";
    let cell = 0;
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let noiseWeight = 0.4;

    /** Deterministic per-cell hash — the reference's, unchanged. A
     *  Math.random() here would make the whole field boil every frame. */
    const noise = (x: number, y: number) => {
      let h = Math.imul(374761393 ^ x, 1000003) ^ Math.imul(668265263 ^ y, 1000033);
      h ^= h >>> 13;
      h = Math.imul(h, 1274126177);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967295;
    };

    const smoothstep = (n: number) => {
      const t = Math.min(1, Math.max(0, n));
      return t * t * (3 - 2 * t);
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w === 0 || h === 0) return false;

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const mobile = window.innerWidth < 768;
      cell = Math.round(window.innerWidth / (mobile ? 5.3 : 16));
      offsetX = mobile ? -0.85 * cell : 0;
      noiseWeight = mobile ? 0.7 : 0.4;
      cols = Math.ceil(w / cell) + 2;
      rows = Math.ceil(h / cell) + 2;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastKey = "";
      return true;
    };

    const draw = () => {
      frame = null;
      const rect = host.getBoundingClientRect();
      const vh = window.innerHeight;
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;

      // The reference's entry curve: how far the viewport's bottom edge has
      // travelled past the band's top, ramped 0→2 on the way in, held at 2,
      // and ramped back down on the way out.
      const past = vh - rect.top;
      const span = vh + h;
      let ramp: number;
      if (past <= 0 || past >= span) ramp = 0;
      else if (past < vh) ramp = (2 * past) / vh;
      else if (past > h) ramp = (2 * (span - past)) / vh;
      else ramp = 2;

      const key = `${Math.round(ramp * 200)}:${Math.round(w)}`;
      if (key === lastKey) return;
      lastKey = key;

      ctx.clearRect(0, 0, w, h);
      if (ramp <= 0) return;

      const half = w / 2;
      // Rows fade out towards the band's own edges, so the field arrives
      // and leaves rather than being cut off where the canvas stops.
      const edge = h * 0.26;

      for (let row = 0; row < rows; row++) {
        const y = row * cell;
        const mid = y + cell / 2;
        const rowFactor = Math.min(smoothstep(mid / edge), smoothstep((h - mid) / edge));
        if (rowFactor <= 0) continue;
        const x = ramp * rowFactor;

        for (let col = 0; col < cols; col++) {
          const cx = offsetX + col * cell;
          const centre = 1 - Math.max(0, 1 - Math.abs(cx + cell / 2 - half) / half);
          const threshold = centre * (1 - noiseWeight) + noise(col, row) * noiseWeight;
          if (threshold >= x) continue;

          // Soft as a cell turns on, and each keeps its own weight so the
          // field reads as pixels rather than as one flat panel.
          const rising = Math.min(1, (x - threshold) * 3);
          const tone = 0.55 + 0.45 * noise(col + 977, row + 313);
          const alpha = 0.92 * rising * tone * rowFactor;
          if (alpha < 0.01) continue;
          ctx.fillStyle = `rgba(18, 50, 122, ${alpha.toFixed(3)})`;
          ctx.fillRect(Math.round(cx), Math.round(y), cell, cell);
        }
      }
    };

    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(draw);
    };
    const onResize = () => {
      if (layout()) onScroll();
    };

    if (!layout()) return;
    draw();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
