import { useEffect, useRef, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* The section transition                                              */
/*                                                                     */
/* A block rises into place from below — slightly small, corners        */
/* rounded off, a little faded — settles flat and sharp while it owns   */
/* the screen, then recedes the same way as it leaves. The rounding is  */
/* what makes it read as scooping away rather than merely fading.       */
/*                                                                     */
/* Every stage on the page is driven by ONE rAF loop that reads all     */
/* the rects first and writes all the styles second. Batching the       */
/* reads away from the writes is what stops the browser re-calculating  */
/* layout between each element, which is where this kind of effect      */
/* normally starts dropping frames. Nothing here re-renders React.      */
/* ------------------------------------------------------------------ */

type Entry = {
  el: HTMLElement;
  strength: number;
  dirty: boolean;
  /** Last written values, so we never repeat a style write. */
  lastRadius: number;
};

const stages = new Set<Entry>();
let frame: number | null = null;
let reduced = false;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function run() {
  frame = null;
  const vh = window.innerHeight;

  // --- read pass: measure everything before touching any style ---
  const reads: { entry: Entry; top: number; height: number }[] = [];
  stages.forEach((entry) => {
    const r = entry.el.getBoundingClientRect();
    reads.push({ entry, top: r.top, height: r.height });
  });

  // --- write pass ---
  for (const { entry, top, height } of reads) {
    const { el, strength } = entry;

    // A stage well clear of the fold is already at rest. Skip it — the
    // only cost of an off-screen section should be zero.
    const near = top < vh * 1.3 && top + height > -vh * 0.8;
    if (!near) {
      if (entry.dirty) {
        el.style.transform = "";
        el.style.borderRadius = "";
        entry.dirty = false;
        entry.lastRadius = -1;
      }
      continue;
    }

    // How far in from the bottom, and how far out past the top.
    const tIn = clamp01((vh - top) / (vh * 0.45));
    const tOut = clamp01(-top / (vh * 0.55));

    // Deliberately restrained. This is meant to be felt rather than
    // watched: enough that the page reads as panels moving over a fixed
    // grid, not so much that a section visibly shrinks away from you.
    const scale = lerp(0.972, 1, tIn) * lerp(1, 0.962, tOut);
    const y = lerp(16, 0, tIn) + lerp(0, -12, tOut);
    const radius = lerp(22, 0, tIn) + lerp(0, 22, tOut);

    const s = strength;

    // There is deliberately NO opacity animation here. Measured against
    // this exact page, fading a full-height section was the single cost
    // of the whole effect: a non-opaque layer that tall has to be
    // re-rasterized as it scrolls. Transform and border-radius together
    // measured free, and carry the movement on their own.
    el.style.transform = `translate3d(0, ${(y * s).toFixed(2)}px, 0) scale(${(1 - (1 - scale) * s).toFixed(4)})`;

    const nextRadius = Math.round((radius * s) / 4) * 4;
    if (nextRadius !== entry.lastRadius) {
      el.style.borderRadius = nextRadius === 0 ? "" : `${nextRadius}px`;
      entry.lastRadius = nextRadius;
    }

    entry.dirty = true;
  }
}

function schedule() {
  if (frame !== null || reduced) return;
  frame = requestAnimationFrame(run);
}

function ensureLoop() {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}
function teardownLoop() {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
}

type Props = {
  children: ReactNode;
  /** 0 disables, 1 is the full effect. Lower it for tall sections. */
  strength?: number;
  className?: string;
};

/**
 * IMPORTANT: never wrap a section that contains a `position: sticky`
 * child. A transformed ancestor becomes the containing block for its
 * descendants, which silently kills sticky. The pinned sections on this
 * site are deliberately left alone — their pin is their transition.
 */
export function ScrollStage({ children, strength = 1, className = "" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const entry: Entry = { el, strength, dirty: false, lastRadius: -1 };
    const first = stages.size === 0;
    stages.add(entry);
    if (first) ensureLoop();
    schedule();

    return () => {
      stages.delete(entry);
      el.style.transform = "";
      el.style.borderRadius = "";
      if (stages.size === 0) teardownLoop();
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transformOrigin: "50% 50%", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
