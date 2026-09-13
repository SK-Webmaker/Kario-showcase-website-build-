import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * The second cinematic layer: depth, focus and pointer.
 *
 * motion.tsx decides *when* something plays. This file decides how the
 * page behaves while you are moving through it — a different problem
 * needing a different mechanism. Everything scroll-linked here runs on
 * ONE requestAnimationFrame loop that reads every rect before it writes
 * any style. Batching the reads away from the writes is what stops the
 * browser recalculating layout between elements, and it is the whole
 * reason this can drive a dozen things at once without dropping frames.
 *
 * Nothing here re-renders React. Every value is written straight to the
 * node, because a transform that changes sixty times a second has no
 * business going through a component.
 */

type Kind = "stage" | "float";

type Entry = {
  kind: Kind;
  /** Measured for position. */
  el: HTMLElement;
  /** Written to. Same node as `el` for a stage; the frame for a float. */
  target: HTMLElement;
  /** stage: 0–1 strength. float: pixels of counter-travel. */
  amount: number;
  dirty: boolean;
  lastRadius: number;
};

const entries = new Set<Entry>();
/** Everything that needs the loop running — transformed elements AND
 *  anything that only wants the published scroll state. */
let consumers = 0;
let frame: number | null = null;
let reduced = false;
/** Set while Lenis is driving; stops us scheduling a second loop. */
let driven = false;

/* ---- the page's own scroll state, published once a frame ---- */
let lastY = 0;
let vel = 0; // smoothed, signed, roughly -1..1
let lastProgress = -1;
let lastVelOut = -1;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Writes how far down the page you are, and how hard you are moving, to
 * the root element as custom properties.
 *
 * Publishing it as CSS rather than as React state is the whole point: a
 * value that changes sixty times a second has no business going through
 * a component, and this way any rule anywhere on the site can read it
 * without subscribing to anything.
 */
function publishScrollState() {
  const doc = document.documentElement;
  const y = window.scrollY;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);

  // Velocity, normalised against a brisk flick and then eased, so it
  // rises and falls rather than snapping between frames.
  const raw = (y - lastY) / Math.max(1, window.innerHeight * 0.45);
  lastY = y;
  vel = lerp(vel, Math.max(-1, Math.min(1, raw)), 0.16);
  if (Math.abs(vel) < 0.001) vel = 0;

  // Quantised before writing: a custom property change invalidates style
  // on everything that reads it, so we only pay for it when it matters.
  const progress = Math.round(clamp01(y / max) * 1000) / 1000;
  const velOut = Math.round(vel * 100) / 100;
  if (progress !== lastProgress) {
    doc.style.setProperty("--v2-progress", String(progress));
    lastProgress = progress;
  }
  if (velOut !== lastVelOut) {
    doc.style.setProperty("--v2-vel", String(velOut));
    doc.style.setProperty("--v2-speed", String(Math.abs(velOut)));
    lastVelOut = velOut;
  }
}

function run() {
  frame = null;
  const vh = window.innerHeight;
  publishScrollState();

  /* ---- read pass: measure everything, touch no style ---- */
  const reads: { e: Entry; top: number; h: number }[] = [];
  entries.forEach((e) => {
    const r = e.el.getBoundingClientRect();
    reads.push({ e, top: r.top, h: r.height });
  });

  /* ---- write pass ---- */
  for (const { e, top, h } of reads) {
    // Anything well clear of the fold is already at rest. An off-screen
    // section should cost nothing, so clear it once and skip it after.
    const near = top < vh * 1.25 && top + h > -vh * 0.75;
    if (!near) {
      if (e.dirty) {
        e.target.style.transform = "";
        if (e.kind === "stage") e.target.style.borderRadius = "";
        e.dirty = false;
        e.lastRadius = -1;
      }
      continue;
    }

    if (e.kind === "stage") {
      // A focus pull: the section arrives slightly small with its corners
      // eased off, settles flat and square while it owns the screen, then
      // recedes the same way. The rounding is what makes it read as a
      // panel moving over a fixed ground rather than as a fade.
      const tIn = clamp01((vh - top) / (vh * 0.45));
      const tOut = clamp01(-top / (vh * 0.55));
      const scale = lerp(0.965, 1, tIn) * lerp(1, 0.955, tOut);
      const y = lerp(22, 0, tIn) + lerp(0, -16, tOut);
      const radius = lerp(30, 0, tIn) + lerp(0, 30, tOut);
      const s = e.amount;

      // No opacity, on purpose: a full-height non-opaque layer has to be
      // re-rasterised on every scroll frame. Transform and border-radius
      // carry the movement for free.
      e.target.style.transform =
        `translate3d(0, ${(y * s).toFixed(2)}px, 0) ` +
        `scale(${(1 - (1 - scale) * s).toFixed(4)})`;

      const next = Math.round((radius * s) / 4) * 4;
      if (next !== e.lastRadius) {
        e.target.style.borderRadius = next === 0 ? "" : `${next}px`;
        e.lastRadius = next;
      }
    } else {
      // A float: the whole framed plate glides a few pixels against the
      // scroll. It moves as one object — frame, border and picture
      // together — so nothing is ever cropped and no edge can be
      // exposed. A screenshot is a document: the moment you scale and
      // crop one to manufacture parallax it stops looking photographed
      // and starts looking pasted in.
      // -1 well below the fold, +1 well above it.
      const t = 1 - (2 * (top + h / 2)) / (vh + h);
      // A little extra travel in the direction you are actually moving,
      // which is what makes a fast scroll feel weighted rather than
      // merely fast. Capped hard: past a few pixels it stops reading as
      // depth and starts reading as the page failing to keep up.
      const lead = vel * 14;
      e.target.style.transform = `translate3d(0, ${(t * e.amount + lead).toFixed(1)}px, 0)`;
    }

    e.dirty = true;
  }
}

function schedule() {
  if (frame !== null || reduced || driven) return;
  frame = requestAnimationFrame(run);
}

/**
 * Runs one pass immediately, from somebody else's animation frame.
 *
 * This is what fixes the judder. Lenis owns its own rAF and writes the
 * scroll position inside it; a listener on the window's scroll event
 * necessarily runs after that write, so every scroll-linked transform
 * on the page resolved one frame behind where the page actually was.
 * Reading and writing inside Lenis's own frame puts them back in step.
 */
export function pulse() {
  if (reduced) return;
  driven = true;
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
  run();
}

/** Hands the loop back to scroll events, for pages without Lenis. */
export function releasePulse() {
  driven = false;
}

function listen() {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}
function unlisten() {
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame !== null) cancelAnimationFrame(frame);
  frame = null;
}

/** Registers one element with the shared loop for its lifetime. */
function useEngine(
  kind: Kind,
  amount: number,
  elRef: { current: HTMLElement | null },
  targetRef: { current: HTMLElement | null },
) {
  useEffect(() => {
    const el = elRef.current;
    const target = targetRef.current;
    if (!el || !target) return;

    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const entry: Entry = { kind, el, target, amount, dirty: false, lastRadius: -1 };
    entries.add(entry);
    if (consumers === 0) listen();
    consumers += 1;
    schedule();

    return () => {
      entries.delete(entry);
      target.style.transform = "";
      if (kind === "stage") target.style.borderRadius = "";
      consumers -= 1;
      if (consumers === 0) unlisten();
    };
  }, [kind, amount, elRef, targetRef]);
}

/**
 * Keeps the loop running for a page that wants the published scroll
 * state but has nothing for the engine to transform.
 *
 * Without this, --v2-progress and --v2-vel would only exist on pages
 * that happen to contain a Stage or a Plate, and every effect keyed to
 * them would silently do nothing everywhere else.
 */
export function useScrollState() {
  useEffect(() => {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    if (consumers === 0) listen();
    consumers += 1;
    schedule();
    return () => {
      consumers -= 1;
      if (consumers === 0) unlisten();
    };
  }, []);
}

/**
 * A section that pulls into focus as it takes the screen.
 *
 * NEVER wrap a section containing a `position: sticky` or `position:
 * fixed` descendant. A transformed ancestor becomes the containing block
 * for both, which silently breaks the pin — and most of this page's
 * sections are pinned. Their pin already *is* their transition, so they
 * are deliberately left alone.
 */
export function Stage({
  children,
  strength = 1,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEngine("stage", strength, ref, ref);
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

/** Fires once, the first time the element crosses into the lower fold. */
function useArrived(ref: { current: HTMLElement | null }): boolean {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No observer, or motion turned down: it is simply already there.
    if (typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    // threshold 0 with a negative bottom margin, NOT a fractional
    // threshold. A fraction of a tall element can need most of the
    // screen before it is ever satisfied, which is how a picture ends up
    // sitting as an empty panel and then arriving late and all at once.
    // This fires the moment the top edge crosses 88% of the viewport,
    // whatever the element's height.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return on;
}

/**
 * A screenshot, shown whole.
 *
 * Every picture on the site arrives the same way — it rises a little,
 * fades up, and settles — and then glides a few pixels against the
 * scroll for as long as it is on screen. One movement, one vocabulary.
 *
 * The arrival is on the outer wrapper and the glide is on the frame
 * inside it, because both are transforms and a single node cannot carry
 * two. Nothing here clips or scales the image: a product screenshot that
 * has been cropped to fake depth reads as a mistake, not as a photograph.
 */
export function Plate({
  src,
  alt,
  depth = 16,
  delay = 0,
  radius,
  eager = false,
  width = 2048,
  height = 1280,
  className = "",
  frameClassName = "",
  style,
}: {
  src: string;
  alt: string;
  /** Pixels of counter-travel across a whole viewport crossing. Small. */
  depth?: number;
  /** ms held back, for staggering a picture behind the words above it. */
  delay?: number;
  /** Overrides the frame's corner. Cards want a tighter one than a hero. */
  radius?: string;
  eager?: boolean;
  width?: number;
  height?: number;
  className?: string;
  frameClassName?: string;
  style?: CSSProperties;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const frame = useRef<HTMLElement | null>(null);
  const arrived = useArrived(wrap);
  useEngine("float", depth, wrap, frame);

  return (
    <div
      ref={wrap}
      className={`v2-plate ${arrived ? "v2-plate--in" : ""} ${className}`}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      <figure
        ref={frame}
        className={`v2-plate__frame ${frameClassName}`}
        style={radius === undefined ? undefined : { borderRadius: radius }}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="v2-plate__img"
        />
      </figure>
    </div>
  );
}

/** Fires once, the first time the element is genuinely on screen. */
function useWordsInView(ref: { current: HTMLElement | null }, immediate: boolean): boolean {
  const [on, setOn] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    // Without IntersectionObserver, show the words rather than nothing.
    if (typeof IntersectionObserver === "undefined") {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate, ref]);

  return on;
}

/** Must match the v2-word-arrive duration in styles.css. */
const ARRIVE_MS = 1060;

/**
 * True once `ms` has passed since the arrival began.
 *
 * The mask that hides a word before it rises also clips anything drawn
 * outside the line box — which includes the glow on .v2-bloom, whose
 * shadow reaches several times further than the mask's descender
 * padding. So the mask stops clipping the moment it has nothing left to
 * hide, and the glow is whole.
 */
function useSettled(started: boolean, ms: number): boolean {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    const t = window.setTimeout(() => setDone(true), ms);
    return () => window.clearTimeout(t);
  }, [started, ms]);

  return done;
}

/**
 * Display type that arrives word by word out of a mask.
 *
 * MaskLines staggers whole lines, which is right where a line has to land
 * as one phrase. This is for the two or three headings that carry the
 * page: at that size a per-word cascade reads as the sentence being
 * spoken rather than displayed. Each line still clips independently, so
 * descenders are never shaved.
 *
 * The words are real text in the server-rendered HTML either way — only
 * their arrival is animated, so a crawler and a reduced-motion visitor
 * both read the whole sentence.
 */
export function WordLines({
  lines,
  play = "view",
  delay = 0,
  step = 42,
  lineStep = 90,
  className = "",
  lineClassName = "",
}: {
  lines: readonly string[];
  /** "now" bakes the played state in; "view" waits for scroll. */
  play?: "now" | "view";
  delay?: number;
  /** ms between words. */
  step?: number;
  /** ms added at each new line. */
  lineStep?: number;
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const on = useWordsInView(ref, play === "now");

  // Total words, so we know when the last one has finished travelling.
  const wordCount = lines.reduce((n, line) => n + line.split(" ").length, 0);
  const settled = useSettled(
    on,
    delay + (lines.length - 1) * lineStep + Math.max(0, wordCount - 1) * step + ARRIVE_MS + 80,
  );

  // Runs across the whole block, so the cascade never restarts at a line
  // break — the sentence arrives as one movement, not as three.
  let index = 0;

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span
            key={`${line}-${li}`}
            className={`v2-wordmask ${settled ? "v2-wordmask--settled" : ""}`}
          >
            <span className={`v2-wordline ${lineClassName}`}>
              {words.map((word, wi) => {
                const d = delay + li * lineStep + index * step;
                index += 1;
                return (
                  <span
                    key={`${word}-${wi}`}
                    className={`v2-word-rise ${on ? "v2-word-rise--in" : ""}`}
                    style={{ "--v2-delay": `${d}ms` } as CSSProperties}
                  >
                    {word}
                    {wi < words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </span>
          </span>
        );
      })}
    </span>
  );
}

/**
 * A surface that lights where the pointer is.
 *
 * One delegated pointer listener for the whole group rather than one per
 * card, and the position is written as two custom properties the CSS
 * turns into a soft accent bloom. Nothing re-renders and nothing
 * animates on a timer: the light exists only while somebody is actually
 * moving across the surface.
 *
 * Pointer only. On a touch screen there is no cursor to follow, and a
 * glow that appears wherever you last tapped reads as a bug.
 */
export function Spotlight({
  children,
  className = "",
  style,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "ul";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number | null = null;
    let x = 0;
    let y = 0;
    let target: HTMLElement | null = null;

    const write = () => {
      raf = null;
      if (!target) return;
      target.style.setProperty("--v2-mx", `${x.toFixed(1)}px`);
      target.style.setProperty("--v2-my", `${y.toFixed(1)}px`);
    };

    const onMove = (e: PointerEvent) => {
      // The lit element is the nearest opted-in surface under the
      // pointer, so a grid of cards lights one card, not the whole grid.
      const el = (e.target as HTMLElement)?.closest?.("[data-lit]") as HTMLElement | null;
      if (el !== target) {
        target?.style.removeProperty("--v2-lit");
        target = el;
        target?.style.setProperty("--v2-lit", "1");
      }
      if (!target) return;
      const r = target.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (raf === null) raf = requestAnimationFrame(write);
    };

    const onLeave = () => {
      target?.style.removeProperty("--v2-lit");
      target = null;
    };

    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
      target?.style.removeProperty("--v2-lit");
    };
  }, []);

  return (
    <Tag ref={ref as never} className={`v2-spot ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/**
 * A control that leans towards the pointer.
 *
 * Two or three pixels, only while the cursor is genuinely near it, and
 * only on a device that has a cursor at all. It is the smallest possible
 * amount of "this page is aware of you" — enough to make the one button
 * that matters feel considered, and well short of a toy.
 */
export function Magnetic({
  children,
  strength = 0.28,
  radius = 90,
  className = "",
}: {
  children: ReactNode;
  /** Fraction of the offset travelled. Keep well under 0.5. */
  strength?: number;
  /** How close the pointer must come, in px, before anything moves. */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let raf: number | null = null;
    let tx = 0;
    let ty = 0;

    const write = () => {
      raf = null;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
    };
    const queue = () => {
      if (raf === null) raf = requestAnimationFrame(write);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const reach = Math.max(r.width, r.height) / 2 + radius;

      if (dist > reach) {
        if (tx !== 0 || ty !== 0) {
          tx = 0;
          ty = 0;
          queue();
        }
        return;
      }
      // Falls off towards the edge of reach, so it releases rather than
      // snapping back as the pointer leaves.
      const fall = 1 - dist / reach;
      tx = dx * strength * fall;
      ty = dy * strength * fall;
      queue();
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      queue();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("blur", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("blur", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={`v2-magnetic ${className}`}>
      {children}
    </span>
  );
}

/**
 * The room's air.
 *
 * Fixed to the viewport rather than to the page, so it is still moving
 * when the reader has stopped scrolling — which is the whole point. Three
 * layers, all of them beneath everything and none of them interactive:
 * two very large pools of the one accent drifting on clocks that never
 * line up, and a film grain over the top of them.
 *
 * It is meant to be felt rather than noticed. If you can point at it
 * while reading a paragraph it is turned up too far.
 */
export function Ambience() {
  useScrollState();
  return (
    <div className="v2-ambience" aria-hidden="true">
      <span className="v2-ambience__pool v2-ambience__pool--a" />
      <span className="v2-ambience__pool v2-ambience__pool--b" />
      <span className="v2-ambience__grain" />
    </div>
  );
}
