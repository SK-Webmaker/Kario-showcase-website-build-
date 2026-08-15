import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible to count. */
  threshold?: number;
  /** Shrinks the viewport so things fire slightly before the true edge. */
  rootMargin?: string;
  /** Stop observing after the first hit (the default for reveals). */
  once?: boolean;
};

/**
 * Reports whether an element has entered the viewport. Used for one-shot
 * reveals and for starting counters at the moment they become readable.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Without IntersectionObserver, show everything rather than nothing.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}
