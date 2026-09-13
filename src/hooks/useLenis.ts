import { useEffect } from "react";
import Lenis from "lenis";

import { pulse, releasePulse } from "@/components/v2/cinematic";

/**
 * Smooth scrolling.
 *
 * The weighted scroll is doing more work than it looks: every pinned
 * section on this site is a function of scroll position, so smoothing the
 * input smooths all of them at once. Without it the pinned stages step;
 * with it they glide.
 *
 * Two things make it feel right rather than merely smooth.
 *
 * First, `lerp` instead of `duration`. A duration gives every gesture the
 * same length whatever its size, so a nudge and a flick take equally long
 * and the page feels like it is negotiating with you. A lerp is an
 * exponential follow: it always moves a fixed fraction of the remaining
 * distance per frame, so a small gesture settles quickly and a large one
 * carries — and it is frame-rate independent, so it behaves the same at
 * 120Hz as at 60.
 *
 * Second, and this is the one that actually removed the judder: the
 * cinematic engine is driven from inside Lenis's own animation frame.
 * Lenis writes the scroll position in its rAF; a window scroll listener
 * necessarily fires after that, so every scroll-linked transform on the
 * page was resolving one frame behind where the page really was. At speed
 * that reads as the pinned sections lagging and snapping back.
 *
 * Disabled entirely when the visitor has asked for less motion — then the
 * browser's own instant scrolling is exactly what they want.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // 0.09 is deliberately a touch heavier than Lenis's 0.1 default:
      // this page is mostly large type and full-bleed sections, and the
      // extra weight is what makes it read as film rather than as a
      // document that happens to ease.
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      // Touch devices already have momentum; adding ours fights it.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      // Same frame, after Lenis has written the position: the engine
      // reads the page where it actually is, not where it was.
      pulse();
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors have to go through Lenis or they jump.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      // Hand the loop back to scroll events, or the next route without
      // Lenis would sit there with a driven engine and never update.
      releasePulse();
    };
  }, [enabled]);
}
