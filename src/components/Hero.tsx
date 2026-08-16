import { useEffect, useState } from "react";
import { BrowserFrame, PhoneFrame } from "./ui/DeviceFrame";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { mailtoHref, shot } from "@/site.config";

/* ------------------------------------------------------------------ */
/* The opening sequence                                                */
/*                                                                     */
/* The Kairo mark is three strokes: an upright and two arms. On load    */
/* they draw themselves. As the visitor scrolls, those same three       */
/* strokes rotate flat and become the first three appointments of a     */
/* salon's day — the rest of the day fills in around them, and the      */
/* whole thing then resolves into the real dashboard.                   */
/*                                                                     */
/* The logo becomes the diary. That's the whole idea.                   */
/* ------------------------------------------------------------------ */

type Stroke = {
  /** Where it sits as part of the letter K. */
  logo: { cx: number; cy: number; angle: number; len: number };
  /** Where it lands as an appointment block. */
  block: { cx: number; cy: number; angle: number; len: number };
  /** Colour once it has become a booking. */
  color: string;
};

const STROKES: Stroke[] = [
  {
    logo: { cx: 440, cy: 310, angle: 90, len: 180 },
    block: { cx: 480, cy: 250, angle: 0, len: 420 },
    color: "#5ea3f0",
  },
  {
    logo: { cx: 500, cy: 265, angle: 136.8, len: 131.6 },
    block: { cx: 420, cy: 316, angle: 0, len: 300 },
    color: "#34d399",
  },
  {
    logo: { cx: 500, cy: 355, angle: 43.2, len: 131.6 },
    block: { cx: 530, cy: 382, angle: 0, len: 520 },
    color: "#f5b455",
  },
];

/** Blocks that join once the three originals are in place. */
const FILL_BLOCKS = [
  { cy: 184, len: 360, color: "#5ea3f0" },
  { cy: 448, len: 430, color: "#5ea3f0" },
  { cy: 514, len: 250, color: "#34d399" },
];

const TIMES = ["9:00", "10:15", "11:00", "12:30", "1:00", "2:15"];
const ROW_Y = [184, 250, 316, 382, 448, 514];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** Progress through one phase of the sequence. */
const phase = (p: number, from: number, to: number) => clamp01((p - from) / (to - from));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Turn centre/angle/length into the two endpoints of a line. */
function endpoints(cx: number, cy: number, angle: number, len: number) {
  const r = (angle * Math.PI) / 180;
  const dx = (Math.cos(r) * len) / 2;
  const dy = (Math.sin(r) * len) / 2;
  return { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy };
}

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();
  // On a phone the full stage would shrink the day to an unreadable
  // strip, so it crops in and everything scales up to suit.
  const narrow = useMediaQuery("(max-width: 700px)");

  // Two separate flags. `drawing` flips on the first frame so the mark
  // starts drawing the instant the page paints — nothing is held back.
  // `drawDone` flips once that finishes, and only then is the morph
  // allowed, so the two animations never fight over the same geometry.
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

  // --- the phases ---------------------------------------------------
  // The strokes rotate flat first, then file into position — unfolding
  // rather than sliding, which is what makes it read as choreography
  // instead of a single linear tween.
  const gate = drawDone ? 1 : 0;
  const tRot = gate * easeInOut(phase(p, 0.16, 0.33));
  const tPos = gate * easeInOut(phase(p, 0.26, 0.46));
  const tFill = easeInOut(phase(p, 0.3, 0.55)); // the day fills in around them
  const tCopy = easeInOut(phase(p, 0.54, 0.74)); // headline arrives
  const tHandoff = easeInOut(phase(p, 0.72, 1)); // dashboard takes over

  const isBooking = tRot > 0.6; // strokes have become appointments
  const stageOpacity = 1 - tHandoff;

  return (
    <section ref={ref} id="top" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ---------------------------------------------------------- */}
        {/* The stage: the mark, and what it turns into                */}
        {/* ---------------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center px-5"
          style={{
            opacity: stageOpacity,
            transform: `scale(${lerp(1, 0.94, tHandoff)})`,
            pointerEvents: "none",
          }}
        >
          <svg
            viewBox={narrow ? "150 128 692 448" : "0 0 1000 620"}
            className="h-auto w-full max-w-[820px]"
            style={{ maxHeight: narrow ? "56vh" : "72vh" }}
          >
            {/* the left gutter of the day */}
            <line
              x1="256"
              y1="150"
              x2="256"
              y2="548"
              stroke="#263245"
              strokeWidth={narrow ? 2.5 : 1.5}
              opacity={tFill}
            />

            {/* time labels down the side */}
            {TIMES.map((t, i) => (
              <text
                key={t}
                x={narrow ? 245 : 238}
                y={ROW_Y[i] + (narrow ? 8 : 4)}
                textAnchor="end"
                fill="#616f87"
                fontSize={narrow ? 26 : 15}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                opacity={tFill}
              >
                {t}
              </text>
            ))}

            {/* the blocks that join later */}
            {FILL_BLOCKS.map((b, i) => {
              const stagger = clamp01((tFill - i * 0.13) / 0.6);
              return (
                <line
                  key={b.cy}
                  x1={270}
                  y1={b.cy}
                  x2={270 + b.len * stagger}
                  y2={b.cy}
                  stroke={b.color}
                  strokeWidth={narrow ? 40 : 30}
                  strokeLinecap="round"
                  opacity={stagger * 0.55}
                />
              );
            })}

            {/* the three strokes of the K */}
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
                  stroke={isBooking ? s.color : "#5ea3f0"}
                  strokeWidth={lerp(narrow ? 34 : 26, narrow ? 40 : 30, tPos)}
                  strokeLinecap="round"
                  strokeDasharray={len}
                  strokeDashoffset={drawing ? 0 : len}
                  style={{
                    transition: reduced
                      ? "none"
                      : `stroke-dashoffset 1200ms cubic-bezier(0.22,1,0.36,1) ${
                          150 + i * 200
                        }ms,
                         stroke 700ms ease`,
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* the wordmark, under the mark, before it unfolds */}
        <div
          aria-hidden={tRot > 0.3}
          className="absolute inset-x-0 flex flex-col items-center px-5"
          style={{
            top: "calc(50% + 15vh)",
            opacity: (1 - clamp01(tRot / 0.5)) * stageOpacity,
          }}
        >
          <p
            className="text-[clamp(30px,5vw,52px)] font-extrabold tracking-[-0.04em]"
            style={{
              animation: reduced
                ? "none"
                : "fade-up 900ms cubic-bezier(0.22,1,0.36,1) 900ms both",
            }}
          >
            Kairo
          </p>
          <p
            className="mt-3 text-center text-[13.5px] text-ink-2 sm:text-[15px]"
            style={{
              animation: reduced
                ? "none"
                : "fade-up 900ms cubic-bezier(0.22,1,0.36,1) 1150ms both",
            }}
          >
            The software a salon runs its whole day on
          </p>

          <div
            className="mt-9 flex items-center gap-2.5 text-ink-3"
            style={{
              animation: reduced
                ? "none"
                : "fade-up 900ms cubic-bezier(0.22,1,0.36,1) 1500ms both",
            }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Scroll
            </span>
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* a quiet caption while the day assembles */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[8vh] flex justify-center px-5"
          style={{ opacity: Math.min(tFill, 1 - tCopy) * 0.9 }}
        >
          <p className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
            One Thursday · Luxe Hair Studio
          </p>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* The resting state: headline, actions, and the real thing    */}
        {/* ---------------------------------------------------------- */}
        <div className="absolute inset-0 flex flex-col justify-start pt-24 sm:pt-28">
          <div className="shell">
            <div
              style={{
                opacity: tCopy,
                transform: `translateY(${lerp(26, 0, tCopy)}px)`,
                pointerEvents: tCopy > 0.5 ? "auto" : "none",
              }}
            >
              <h1
                className="mx-auto max-w-[20ch] text-center text-[clamp(32px,5.2vw,60px)]
                           font-extrabold leading-[1.02] tracking-[-0.04em]"
                style={{ textWrap: "balance" } as React.CSSProperties}
              >
                The diary that answers the phone, chases the money, and never
                double-books.
              </h1>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a href={mailtoHref} className="btn-primary">
                  Talk to us
                </a>
                <a href="#journey" className="btn-ghost">
                  Walk through a day
                </a>
              </div>
            </div>

            {/* the dashboard rises as the schematic day retires */}
            <div
              className="mx-auto mt-10 max-w-4xl"
              style={{
                opacity: tHandoff,
                transform: `translateY(${lerp(60, 0, tHandoff)}px)`,
              }}
            >
              {narrow ? (
                <PhoneFrame className="mx-auto w-[62%] max-w-[240px]">
                  <img
                    src={shot("23-phone-dashboard.jpg")}
                    alt="The Kairo dashboard on a phone: the day's figures and who is in the chair right now."
                    loading="eager"
                    fetchPriority="high"
                    className="block w-full"
                  />
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
