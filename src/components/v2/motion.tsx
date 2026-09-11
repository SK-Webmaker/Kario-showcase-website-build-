import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useInView } from "@/hooks/useInView";

import { KairoMark } from "./KairoMark";

/**
 * The cinematic layer's React side.
 *
 * The movement itself lives in styles.css as keyframes; everything here
 * only decides *when* a class goes on. That split matters: the opening
 * card and the hero's own lines carry their class in the server-rendered
 * HTML, so they play at parse time with no JavaScript at all, and only
 * the scroll-triggered reveals need the observer.
 */

type Play = "now" | "view";

/**
 * One line of display type rising out of a mask.
 *
 * Takes the lines already broken, because at this size a reflow moves the
 * whole composition — the break is a design decision, not a consequence
 * of the viewport.
 */
export function MaskLines({
  lines,
  play = "view",
  delay = 0,
  step = 110,
  className = "",
  lineClassName = "",
}: {
  lines: readonly string[];
  /** "now" bakes the played state into the HTML; "view" waits for scroll. */
  play?: Play;
  /** ms before the first line moves. */
  delay?: number;
  /** ms between lines. */
  step?: number;
  className?: string;
  /** Applied to the moving span inside each mask, e.g. an accent colour. */
  lineClassName?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.25 });
  const on = play === "now" || inView;

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className={`v2-mask ${on ? "v2-mask--in" : ""}`}>
          <span
            className={lineClassName}
            style={{ "--v2-delay": `${delay + i * step}ms` } as CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/** The quiet reveal: body copy, chrome, cards, list rows. */
export function Reveal({
  children,
  delay = 0,
  opacity = 1,
  play = "view",
  as: Tag = "div",
  className = "",
  style,
}: {
  children: ReactNode;
  /**
   * "now" plays on load, for anything that is part of the opening rather
   * than of the scroll. The observer shrinks the viewport slightly at the
   * bottom so reveals fire a beat after they enter — which means content
   * parked at the foot of the first screen sits inside that dead band and
   * never fires at all. That content wants "now".
   */
  play?: Play;
  delay?: number;
  /**
   * Where the reveal settles. Most of what this wraps is muted copy, and
   * animating to 1 would silently override the element's own opacity —
   * so the destination is a value, not an assumption.
   */
  opacity?: number;
  as?: "div" | "p" | "li" | "ul" | "section" | "span";
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });
  const on = play === "now" || inView;
  return (
    <Tag
      ref={ref as never}
      className={`v2-lift ${on ? "v2-lift--in" : ""} ${className}`}
      style={{ ...style, "--v2-delay": `${delay}ms`, "--v2-o": opacity } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/**
 * The title card. Pure CSS from the moment it parses, so it plays before
 * hydration rather than after it, and takes itself out of the paint once
 * the animation is spent — a full-viewport fixed layer left over the page
 * is a real cost on scroll compositing even at pointer-events: none.
 */
export function Opening({ name }: { name: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Hidden rather than removed: the node belongs to React, and pulling
    // it out from under the reconciler is a crash waiting for the first
    // re-render of the page it sits on.
    const done = () => {
      el.style.display = "none";
    };
    el.addEventListener("animationend", done, { once: true });
    // Belt and braces: if the animation never fires (reduced motion, a
    // backgrounded tab at load) the card still goes.
    const t = window.setTimeout(done, 2200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="v2-open">
      <div className="flex flex-col items-center">
        {/* The mark draws itself first, then the name arrives under it —
            the same order the brand is read in. */}
        <KairoMark draw delay={120} size="calc(4.6 * var(--u))" className="v2-open__glyph" />
        <p
          className="v2-display v2-open__mark"
          style={{ fontSize: "calc(2.6 * var(--u))", marginTop: "calc(0.9 * var(--u))" }}
        >
          {name}
        </p>
        <span
          className="v2-open__rule mt-2 block h-px w-full"
          style={{ background: "var(--v2-a)" }}
        />
      </div>
    </div>
  );
}

/** Lens falloff and grain. Two fixed layers, no content, no listeners. */
export function Lens() {
  return (
    <>
      <div aria-hidden="true" className="v2-vignette" />
      <div aria-hidden="true" className="v2-grain" />
    </>
  );
}

/**
 * Moves a decorative layer at a fraction of scroll speed.
 *
 * Writes the transform straight to the node inside a rAF rather than
 * going through state: the orbs move every frame, and re-rendering a
 * section sixty times a second to set one transform is pure waste.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(factor = 0.12) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | null = null;
    const write = () => {
      frame = null;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      // Distance of this layer's centre from the viewport's, in pixels.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      node.style.transform = `translate3d(0, ${(-offset * factor).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(write);
    };

    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [factor]);

  return ref;
}

/**
 * A number that counts up the first time it enters the frame.
 *
 * Static figures are the one place a marketing page can be honest and
 * still feel alive: the value is real, only its arrival is animated. The
 * final value is what the server renders, so a crawler and a
 * reduced-motion visitor both read the number rather than a zero.
 *
 * After that first run it mirrors `value` directly — these sit next to
 * sliders, and a figure that kept re-animating every time you moved one
 * would be unreadable.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1100,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [shown, setShown] = useState(value);
  const played = useRef(false);
  const target = useRef(value);
  target.current = value;

  useEffect(() => {
    if (played.current) {
      setShown(value);
      return;
    }
    if (!inView) return;
    played.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    const t0 = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const p = Math.min(1, (now - t0) / duration);
      // Ease out cubic: fast off the mark, settling rather than stopping.
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(target.current * eased));
      if (p < 1) frame = requestAnimationFrame(step);
      else setShown(target.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown.toLocaleString("en-AU")}
      {suffix}
    </span>
  );
}

/**
 * A light that follows the pointer across a section.
 *
 * Written straight to a CSS custom property inside a rAF rather than
 * through state — this fires on every mouse move, and re-rendering a
 * section for each one would be indefensible. Desktop only: there is no
 * cursor to follow on a phone, and the layer would just be a static blob.
 */
export function Torch() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame: number | null = null;
    let x = 0;
    let y = 0;

    const write = () => {
      frame = null;
      el.style.setProperty("--tx", `${x}px`);
      el.style.setProperty("--ty", `${y}px`);
    };
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (frame === null) frame = requestAnimationFrame(write);
    };
    const on = () => el.classList.add("v2-torch--on");
    const off = () => el.classList.remove("v2-torch--on");

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseenter", on);
    host.addEventListener("mouseleave", off);
    return () => {
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseenter", on);
      host.removeEventListener("mouseleave", off);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="v2-torch" />;
}

/**
 * The hairline that sweeps the top of the frame when the route changes.
 *
 * Keyed by pathname so it remounts and replays on every navigation, and
 * removed once it has run — a fixed layer that stays costs compositing
 * on every subsequent scroll for no benefit.
 */
export function RouteSwipe({ pathname }: { pathname: string }) {
  const [live, setLive] = useState(true);

  useEffect(() => {
    setLive(true);
    const t = window.setTimeout(() => setLive(false), 900);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (!live) return null;
  return <div key={pathname} aria-hidden="true" className="v2-swipe" />;
}

/**
 * A scene slate: a small fixed marker naming the part of the page you are
 * currently in.
 *
 * On a page that runs to sixteen screens this is orientation, not
 * decoration — and because the label swaps with the same masked rise the
 * headings use, moving between sections reads as a chapter change.
 *
 * It watches the sections by id rather than by position so it cannot
 * drift out of step with the layout.
 */
export function Chapters({ items }: { items: readonly { id: string; label: string }[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const nodes = items
      .map((it, i) => ({ i, el: document.getElementById(it.id) }))
      .filter((n): n is { i: number; el: HTMLElement } => Boolean(n.el));
    if (nodes.length === 0) return;

    // Whichever watched section covers the middle of the screen wins. A
    // band rather than a line, so a short section between two tall ones
    // still gets its turn.
    const seen = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        let best = -1;
        let bestRatio = 0;
        for (const n of nodes) {
          const r = seen.get(n.el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = n.i;
          }
        }
        setActive(bestRatio > 0 ? best : null);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.01, 0.5, 1] },
    );

    for (const n of nodes) observer.observe(n.el);
    return () => observer.disconnect();
  }, [items]);

  const current = active === null ? null : items[active];

  return (
    <div aria-hidden="true" className={`v2-chapter ${current ? "v2-chapter--on" : ""}`}>
      <span className="v2-chapter__dot" />
      <span className="v2-eyebrow v2-chapter__slot">
        <span key={current?.id ?? "none"} className="v2-chapter__label">
          {current?.label ?? ""}
        </span>
      </span>
    </div>
  );
}

/**
 * A section divider that draws itself as the section arrives.
 *
 * Replaces a plain `border-top` on the inner pages: same hairline, but
 * it wipes in from the left, which is what makes a stack of sections
 * read as a sequence rather than a list.
 */
export function Rule({ className = "" }: { className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0, rootMargin: "0px" });
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`v2-rule ${inView ? "v2-rule--in" : ""} ${className}`}
    />
  );
}

/**
 * Drifts an element against the scroll while it crosses the viewport.
 *
 * The difference from useParallax is what it is for: that one moves a
 * decorative layer inside its own section, this one gives a screenshot a
 * little counter-motion so a stack of them does not scroll past as one
 * flat sheet. Returns a ref to put on the moving element, and writes the
 * transform inside a rAF rather than through state.
 */
export function useDrift<T extends HTMLElement = HTMLElement>(distance = 26) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | null = null;
    const write = () => {
      frame = null;
      const node = ref.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      // -1 well below the fold, +1 well above it.
      const t = 1 - (2 * (r.top + r.height / 2)) / (vh + r.height);
      node.style.transform = `translate3d(0, ${(t * distance).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [distance]);

  return ref;
}
