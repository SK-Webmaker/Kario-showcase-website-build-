import { Orbs } from "./primitives";
import { Reveal, Torch } from "./motion";
import { WordLines } from "./cinematic";

const ORBS = [
  { x: "8%", y: "72%", size: "46vw", tone: "a" as const },
  { x: "92%", y: "8%", size: "34vw", tone: "b" as const },
  { x: "62%", y: "88%", size: "26vw", tone: "a" as const },
];

/**
 * The opening. Three enormous lines, the last one bloomed, and a single
 * quiet row of support text far below — the whole first screen is one
 * sentence and a lot of air.
 *
 * The lines rise out of masks rather than fading in, and the whole frame
 * settles out of a slight overscale as the title card leaves, so the
 * first thing a visitor sees is a camera coming to rest. Both are baked
 * into the server-rendered HTML (play="now"), so the open plays at parse
 * time rather than waiting for hydration.
 *
 * Delays are timed against the title card in styles.css: it holds until
 * 400ms and is clear of the hero by roughly 900ms.
 */
export function V2Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-between overflow-hidden"
    >
      <Orbs spec={ORBS} parallax={0.14} />
      <Torch />

      <div
        className="v2-settle relative z-10 flex flex-1 items-center justify-center text-center"
        style={{ padding: "calc(10 * var(--u)) var(--pad) 0" }}
      >
        <h1 className="v2-display v2-h1" style={{ maxWidth: "calc(86 * var(--u))" }}>
          {/* Word by word rather than line by line. At this size the
              difference is the whole opening: the sentence arrives as
              something being said, not as three slabs sliding up. The
              delays still sit against the title card, which holds until
              400ms and is clear of the hero by roughly 900ms. */}
          <WordLines
            play="now"
            delay={620}
            step={48}
            lineStep={110}
            lines={["The software a", "business runs its"]}
          />
          <WordLines
            play="now"
            delay={1020}
            step={54}
            lineClassName="v2-bloom"
            lines={["whole day on"]}
          />
        </h1>
      </div>

      {/* Three across on a desktop; stacked on a phone, where 390px of
          width turned the two chrome labels into three-line columns
          squeezing the sentence between them. */}
      <div
        className="relative z-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:text-left"
        style={{ padding: "0 var(--pad) calc(4 * var(--u))" }}
      >
        <Reveal
          play="now"
          as="p"
          delay={1240}
          opacity={0.8}
          className="v2-body order-1 max-w-[42ch] text-center sm:order-2"
        >
          Bookings, payments, client records and every message — one system, one login. $400 once,
          then nothing per month.
        </Reveal>
        <Reveal
          play="now"
          as="span"
          delay={1400}
          opacity={0.6}
          className="v2-eyebrow order-2 whitespace-nowrap sm:order-1"
        >
          Built in a working business
        </Reveal>
        <Reveal
          play="now"
          as="span"
          delay={1520}
          opacity={0.6}
          className="v2-eyebrow order-3 whitespace-nowrap"
        >
          Scroll ↓
        </Reveal>
      </div>
    </section>
  );
}
