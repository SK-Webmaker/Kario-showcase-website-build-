import { useEffect, useRef } from "react";

import { GALLERY, type Shot } from "@/data/gallery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BrowserFrame, PhoneFrame } from "./ui/DeviceFrame";
import { Reveal } from "./ui/Reveal";

/**
 * The showcase strip, directly under the opening sequence.
 *
 * A visitor who has just watched the mark unfold into a diary has been
 * told a story and shown no product. This answers "what does it actually
 * look like" before anything else asks for their patience.
 *
 * The strip drifts sideways on its own, but a visitor can also drag or
 * swipe it at any time. Hovering pauses the drift so they can look at a
 * frame without chasing it.
 */

function Card({
  shot,
  duplicate = false,
}: {
  shot: Shot;
  /** The second pass of the loop: visible, but not a second tab stop. */
  duplicate?: boolean;
}) {
  const img = (
    <img
      src={shot.src}
      alt={shot.alt}
      loading="eager"
      decoding="sync"
      draggable={false}
      className="block w-full"
    />
  );

  return (
    <div
      {...(duplicate ? { tabIndex: -1, "aria-hidden": true } : {})}
      className={`group/card relative shrink-0 transition-transform duration-[660ms] ease-66
                  hover:-translate-y-1.5
                  ${shot.device === "phone" ? "w-[200px] sm:w-[224px]" : "w-[420px] sm:w-[520px]"}`}
    >
      {shot.device === "phone" ? (
        <PhoneFrame>{img}</PhoneFrame>
      ) : (
        <BrowserFrame url={shot.url}>{img}</BrowserFrame>
      )}

      <span className="mt-3 flex items-baseline gap-3">
        <span className="chrome text-ink">{shot.label}</span>
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-line transition-colors duration-[660ms] ease-66 group-hover/card:bg-brand"
        />
      </span>
    </div>
  );
}

export function Showcase() {
  const reduced = useReducedMotion();

  // -----------------------------------------------------------------
  // Drifting strip + manual scroll/drag
  // -----------------------------------------------------------------
  const stripRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const userScrollUntilRef = useRef<number>(0);
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const strip = stripRef.current;
    const track = trackRef.current;
    if (!strip || !track) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;

      const dx = e.clientX - startXRef.current;
      const passWidth = track.scrollWidth / 2;
      let next = startScrollRef.current - dx;
      if (passWidth > 0) {
        if (next >= passWidth) {
          next -= passWidth;
          startScrollRef.current = next + dx;
        } else if (next < 0) {
          next += passWidth;
          startScrollRef.current = next + dx;
        }
      }
      isProgrammaticScrollRef.current = true;
      strip.scrollLeft = next;
      isProgrammaticScrollRef.current = false;
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      strip.style.cursor = "";
      userScrollUntilRef.current = Date.now() + 800;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
    };

    const onPointerDown = (e: PointerEvent) => {
      // Touch devices already scroll natively; we only add mouse drag.
      if (e.pointerType !== "mouse") return;
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      startScrollRef.current = strip.scrollLeft;
      strip.style.cursor = "grabbing";
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      document.addEventListener("pointercancel", onPointerUp);
    };

    const onScroll = () => {
      // Ignore scroll events we triggered ourselves in the rAF loop or drag.
      if (isProgrammaticScrollRef.current) return;
      // Pause auto-drift briefly after any user-initiated scroll (touch,
      // trackpad, wheel).
      userScrollUntilRef.current = Date.now() + 800;
    };

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = Math.min(time - lastTimeRef.current, 50);
      lastTimeRef.current = time;

      const passWidth = track.scrollWidth / 2;
      const paused =
        passWidth <= 0 ||
        isDraggingRef.current ||
        strip.matches(":hover") ||
        strip.matches(":focus-within") ||
        Date.now() < userScrollUntilRef.current;

      if (!paused) {
        // One full pass every 64 seconds, matching the old marquee keyframe.
        const speed = passWidth / 64000;
        let next = strip.scrollLeft + speed * delta;
        if (next >= passWidth) next -= passWidth;
        isProgrammaticScrollRef.current = true;
        strip.scrollLeft = next;
        // Reset in the next frame so any asynchronously-dispatched scroll
        // event still recognises this as a programmatic move.
        requestAnimationFrame(() => {
          isProgrammaticScrollRef.current = false;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    strip.addEventListener("pointerdown", onPointerDown);
    strip.addEventListener("scroll", onScroll, { passive: true });

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <section id="showcase" className="relative border-t border-line py-16 sm:py-20">
      <div className="shell">
        <Reveal>
          <div className="mb-7 flex items-center gap-4 border-b border-line pb-3">
            <span className="chrome text-ink">[01]</span>
            <span className="chrome">The actual thing</span>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <Reveal delay={60}>
            <h2 className="display-lg max-w-[15ch]">This is what you get</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lede lg:pb-2">
              Eight screens from the system as it runs today — no mockups, no renders. Drag or swipe
              the strip, or let it drift.
            </p>
          </Reveal>
        </div>
      </div>

      {/* The strip. Full-bleed on purpose: a track that stops at the shell
          margin reads as a component, one that runs off both edges reads
          as more of it existing than fits. */}
      <div
        ref={stripRef}
        className="group/strip mask-fade-x mt-12 cursor-grab select-none overflow-x-auto pl-5 [scrollbar-width:none]
                   sm:pl-8 lg:pl-12 [&::-webkit-scrollbar]:hidden"
      >
        <div ref={trackRef} className="flex w-max items-end">
          {/* Two identical passes. The loop resets scrollLeft by exactly one
              pass width, so the seam is invisible. */}
          {[0, 1].map((pass) => (
            <div key={pass} className="flex items-end gap-6 pr-6 sm:gap-8 sm:pr-8">
              {GALLERY.map((shot) => (
                <Card key={shot.src} shot={shot} duplicate={pass === 1} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
