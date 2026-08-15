import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives the pinned sections.
 *
 * Give this a ref to a tall section that contains a `sticky` child. It
 * returns how far the page has scrolled through that section's travel,
 * from 0 (the sticky child has just locked to the top) to 1 (the section
 * is about to release). Everything inside the pin — which screenshot is
 * showing, which step is lit, how far a progress bar has filled — is a
 * pure function of this one number.
 *
 * Reads are batched into a rAF callback so a fast scroll costs one layout
 * measurement per frame rather than one per event.
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // Total distance this section can be scrolled while pinned.
    const travel = rect.height - window.innerHeight;

    if (travel <= 0) {
      // Section is shorter than the viewport: treat it as fully entered
      // once its top passes the halfway mark.
      setProgress(rect.top <= 0 ? 1 : 0);
      return;
    }

    const scrolled = -rect.top;
    const next = Math.min(1, Math.max(0, scrolled / travel));

    // Skip sub-pixel churn; anything finer is invisible.
    setProgress((prev) => (Math.abs(prev - next) < 0.0004 ? prev : next));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure]);

  return { ref, progress };
}

/** Overall page scroll, 0–1. Feeds the reading-progress bar in the nav. */
export function usePageProgress(): number {
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max)));
    };

    const onScroll = () => {
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = null;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return progress;
}
