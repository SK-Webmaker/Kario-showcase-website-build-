import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserFrame, PhoneFrame } from "./ui/DeviceFrame";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mailtoHref, shot } from "@/site.config";

/* ------------------------------------------------------------------ */
/* The opening sequence                                                */
/*                                                                     */
/* The Kairo mark is three strokes: an upright and two arms. They draw  */
/* themselves on load, then as the visitor scrolls they rotate flat and */
/* become the first three appointments of a salon's day. The rest of    */
/* the day fills in around them, and it resolves into the dashboard.    */
/*                                                                     */
/* The logo becomes the diary.                                          */
/* ------------------------------------------------------------------ */

type Stroke = {
  logo: { cx: number; cy: number; angle: number; len: number };
  block: { cx: number; cy: number; angle: number; len: number };
  color: string;
};

const STROKES: Stroke[] = [
  { logo: { cx: 440, cy: 310, angle: 90, len: 180 }, block: { cx: 480, cy: 250, angle: 0, len: 420 }, color: "#3b82f6" },
  { logo: { cx: 500, cy: 265, angle: 136.8, len: 131.6 }, block: { cx: 420, cy: 316, angle: 0, len: 300 }, color: "#0f9d63" },
  { logo: { cx: 500, cy: 355, angle: 43.2, len: 131.6 }, block: { cx: 530, cy: 382, angle: 0, len: 520 }, color: "#b9760d" },
];

const FILL_BLOCKS = [
  { cy: 184, len: 360 },
  { cy: 448, len: 430 },
  { cy: 514, len: 250 },
];

const TIMES = ["9:00", "10:15", "11:00", "12:30", "1:00", "2:15"];
const ROW_Y = [184, 250, 316, 382, 448, 514];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const phase = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function endpoints(cx: number, cy: number, angle: number, len: number) {
  const r = (angle * Math.PI) / 180;
  const dx = (Math.cos(r) * len) / 2;
  const dy = (Math.sin(r) * len) / 2;
  return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy };
}

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  const narrow = useMediaQuery("(max-width: 700px)");

  const [drawing, setDrawing] = useState(false);
  const [drawDone, setDrawDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDrawing(true);
      setDrawDone(true);
      return;
    }
    const raf = requestAnimationFrame(() => setDrawing(true));
    const id = window.setTimeout(() => setDrawDone(true), 1900);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
    };
  }, [reduced]);

  const p = reduced ? 1 : progress;
  const gate = drawDone ? 1 : 0;
  const tRot = gate * easeInOut(phase(p, 0.16, 0.33));
  const tPos = gate * easeInOut(phase(p, 0.26, 0.46));
  const tFill = easeInOut(phase(p, 0.3, 0.55));
  const tCopy = easeInOut(phase(p, 0.54, 0.74));
  const tHandoff = easeInOut(phase(p, 0.72, 1));

  const isBooking = tRot > 0.6;
  const stage = 1 - tHandoff;
  const inkDim = "rgb(var(--ink) / 0.28)";

  /* The dashboard has to finish inside the pinned viewport, or the
     opening beat ends on a screenshot sliced off by the fold. Rather
     than guessing a size, measure what the headline and buttons
     actually took and give the frame the rest — width is derived from
     the height so the aspect ratio is never distorted. */
  const copyRef = useRef<HTMLDivElement | null>(null);
  const [frameWidth, setFrameWidth] = useState(896);

  useLayoutEffect(() => {
    const measure = () => {
      const copyH = copyRef.current?.offsetHeight ?? 0;
      const padTop = window.innerWidth >= 640 ? 96 : 80;
      const gap = 40;
      const breathe = 28;
      const isNarrow = window.innerWidth <= 700;
      // The phone frame has no title bar; the browser frame does.
      const chromeBar = isNarrow ? 0 : 34;
      const available = window.innerHeight - padTop - copyH - gap - breathe - chromeBar;
      // width ÷ height of the frame that's actually on screen
      const aspect = isNarrow ? 780 / 1688 : 1600 / 1000;
      const byHeight = available * aspect;
      const cap = isNarrow ? 240 : 896;
      const floor = isNarrow ? 150 : 300;
      // Below the floor there is no room for a legible frame. Showing a
      // sliced one looks like a bug, so show none.
      setFrameWidth(byHeight < floor ? 0 : Math.min(cap, byHeight));
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    if (copyRef.current) ro.observe(copyRef.current);
    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [narrow]);

  return (
    <section ref={ref} id="top" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* the mark, and what it becomes */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center px-5"
          style={{ opacity: stage, transform: `scale(${lerp(1, 0.95, tHandoff)})`, pointerEvents: "none" }}
        >
          <svg
            viewBox={narrow ? "150 128 692 448" : "0 0 1000 620"}
            className="h-auto w-full max-w-[840px]"
            style={{ maxHeight: narrow ? "56vh" : "72vh" }}
          >
            <line x1="256" y1="150" x2="256" y2="548" stroke="currentColor" className="text-ink-4" strokeWidth={narrow ? 2.5 : 1.5} opacity={tFill} />

            {TIMES.map((t, i) => (
              <text
                key={t}
                x={narrow ? 245 : 238}
                y={ROW_Y[i] + (narrow ? 8 : 4)}
                textAnchor="end"
                fill="currentColor"
                className="fill-ink-3"
                fontSize={narrow ? 26 : 15}
                fontFamily='"JetBrains Mono", monospace'
                opacity={tFill}
              >
                {t}
              </text>
            ))}

            {FILL_BLOCKS.map((b, i) => {
              const s = clamp01((tFill - i * 0.13) / 0.6);
              return (
                <line
                  key={b.cy}
                  x1={270}
                  y1={b.cy}
                  x2={270 + b.len * s}
                  y2={b.cy}
                  stroke={inkDim}
                  strokeWidth={narrow ? 40 : 30}
                  opacity={s}
                />
              );
            })}

            {STROKES.map((s, i) => {
              const cx = lerp(s.logo.cx, s.block.cx, tPos);
              const cy = lerp(s.logo.cy, s.block.cy, tPos);
              const angle = lerp(s.logo.angle, s.block.angle, tRot);
              const len = lerp(s.logo.len, s.block.len, tPos);
              const { x1, y1, x2, y2 } = endpoints(cx, cy, angle, len);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isBooking ? s.color : "currentColor"}
                  className={isBooking ? "" : "text-ink"}
                  strokeWidth={lerp(narrow ? 34 : 26, narrow ? 40 : 30, tPos)}
                  strokeLinecap={isBooking ? "butt" : "round"}
                  strokeDasharray={len}
                  strokeDashoffset={drawing ? 0 : len}
                  style={{
                    transition: reduced
                      ? "none"
                      : `stroke-dashoffset 1200ms cubic-bezier(.66,0,.01,1) ${150 + i * 200}ms, stroke 700ms ease`,
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Corner meta. Fills the frame the way an instrument panel does,
            and carries the three facts a salon owner wants in the first
            five seconds. Retires as the mark starts to unfold. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-20 hidden px-5 lg:block"
          style={{ opacity: (1 - clamp01(tRot / 0.4)) * stage }}
        >
          <div className="shell grid grid-cols-3 gap-8">
            <div>
              <p className="display text-[22px] leading-[1.05]">
                Bookings &amp;
                <br />
                Payments
              </p>
            </div>
            <div>
              <p className="chrome-2 normal-case tracking-normal leading-relaxed">
                Built in a salon.
                <br />
                Run by one, daily.
              </p>
            </div>
            <div>
              <p className="chrome-2 max-w-[42ch] normal-case tracking-normal leading-relaxed">
                Kairo is the diary, the client book, the till and the messages,
                on your own booking link — no marketplace, no commission, and
                nothing shared with another business.
              </p>
            </div>
          </div>
        </div>

        {/* wordmark, before the mark unfolds */}
        <div
          aria-hidden={tRot > 0.3}
          className="absolute inset-x-0 flex flex-col items-center px-5"
          style={{ top: "calc(50% + 16vh)", opacity: (1 - clamp01(tRot / 0.5)) * stage }}
        >
          <p
            className="display text-[clamp(34px,5.4vw,62px)]"
            style={{ animation: reduced ? "none" : "rise-in 900ms cubic-bezier(.66,0,.01,1) 900ms both" }}
          >
            Kairo
          </p>
          <p
            className="chrome mt-4"
            style={{ animation: reduced ? "none" : "rise-in 900ms cubic-bezier(.66,0,.01,1) 1150ms both" }}
          >
            The software a salon runs its whole day on
          </p>
          <div
            className="chrome mt-9 flex items-center gap-2"
            style={{ animation: reduced ? "none" : "rise-in 900ms cubic-bezier(.66,0,.01,1) 1500ms both" }}
          >
            Scroll
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[10vh] flex justify-center px-5"
          style={{ opacity: Math.min(tFill, 1 - tCopy) * 0.9 }}
        >
          <p className="chrome">One Thursday · Luxe Hair Studio</p>
        </div>

        {/* the resting state */}
        <div className="absolute inset-0 flex flex-col justify-start pt-20 sm:pt-24">
          <div className="shell">
            <div
              ref={copyRef}
              style={{
                opacity: tCopy,
                transform: `translateY(${lerp(28, 0, tCopy)}px)`,
                pointerEvents: tCopy > 0.5 ? "auto" : "none",
              }}
            >
              <h1 className="hero-title mx-auto max-w-[18ch] text-center display text-[clamp(30px,5vw,68px)]">
                The diary that answers the phone
              </h1>
              <p className="hero-lede mx-auto mt-6 max-w-[54ch] text-center text-[14.5px] leading-[1.55] text-ink-2 sm:text-[16px]">
                Bookings, the calendar, the client book, payments, stock and
                every message that goes to a customer. One system, one login, no
                commission.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a href={mailtoHref} className="btn-brand">Talk to us</a>
                <a href="#why" className="btn-line">Why not Fresha or Square</a>
              </div>
            </div>

            <div
              className="mx-auto mt-10"
              hidden={frameWidth === 0}
              style={{
                width: narrow ? undefined : frameWidth,
                maxWidth: "100%",
                opacity: tHandoff,
                transform: `translateY(${lerp(60, 0, tHandoff)}px)`,
              }}
            >
              {narrow ? (
                <PhoneFrame className="mx-auto" style={{ width: frameWidth }}>
                  <img src={shot("23-phone-dashboard.jpg")} alt="The Kairo dashboard on a phone." loading="eager" fetchPriority="high" className="block w-full" />
                </PhoneFrame>
              ) : (
                <BrowserFrame url="luxehairstudio.kairo.app">
                  <img
                    src={shot("01-dashboard.jpg")}
                    alt="The Kairo dashboard: twelve appointments today, four done, takings against expected, and who is in the chair right now."
                    width={1600}
                    height={1000}
                    loading="eager"
                    fetchPriority="high"
                    className="block w-full"
                  />
                </BrowserFrame>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
