import { Eyebrow, Orbs } from "./primitives";
import { MaskLines, Reveal } from "./motion";

/**
 * The pain section. The reference pins its heading in a sticky left
 * column and lets four cards scroll past it, so the argument stays on
 * screen the whole time the evidence goes by. Cheaper than a full pin
 * and it reads better.
 *
 * The four losses are Kairo's own, already written in Contrast.tsx.
 */
const CARDS = [
  {
    n: "01",
    label: "The empty chair",
    body: "A slot nobody filled, because nobody had time to notice it was open.",
  },
  {
    n: "02",
    label: "The client who drifted",
    body: "They did not leave. They just stopped booking, and nobody followed up.",
  },
  {
    n: "03",
    label: "The no-show",
    body: "The appointment nobody reminded them about, in a diary nobody had time to work.",
  },
  {
    n: "04",
    label: "The change nobody passed on",
    body: "A time moved, and the only person who knew was the one who moved it.",
  },
];

const ORBS = [
  { x: "6%", y: "30%", size: "38vw", tone: "b" as const },
  { x: "96%", y: "76%", size: "30vw", tone: "a" as const },
];

export function V2Pain() {
  return (
    <section
      id="pain"
      className="relative overflow-hidden"
      style={{ padding: "calc(13 * var(--u)) 0" }}
    >
      <Orbs spec={ORBS} />
      <div
        className="relative z-10 mx-auto grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        {/* the pinned side of the argument */}
        <div className="lg:sticky lg:top-[calc(8*var(--u))] lg:self-start">
          <Reveal>
            <Eyebrow>The problem</Eyebrow>
          </Reveal>
          <h2 className="v2-display v2-h2" style={{ marginTop: "calc(1.4 * var(--u))" }}>
            {/* Broken to the column, not to the sentence: a mask holding a
                line that wraps reveals both halves at once. */}
            <MaskLines lines={["You don't lose", "money on the", "appointment."]} />
            <MaskLines lines={["You lose it", "between."]} lineClassName="v2-accent" delay={330} />
          </h2>
          <Reveal
            as="p"
            delay={360}
            opacity={0.7}
            className="v2-body max-w-[36ch]"
            style={{ marginTop: "calc(2.4 * var(--u))" }}
          >
            Most of the admin in a business that runs on appointments happens in the gaps. Every one
            of these costs money, and none of them is anyone's actual job.
          </Reveal>
        </div>

        {/* the evidence, scrolling past it */}
        <ul
          className="flex flex-col"
          style={{ gap: "calc(2.6 * var(--u))", paddingTop: "calc(8 * var(--u))" }}
        >
          {CARDS.map((c) => (
            <Reveal
              as="li"
              key={c.n}
              className="relative overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-sm"
              style={{ borderRadius: "calc(1.4 * var(--u))", padding: "calc(3.2 * var(--u))" }}
            >
              <span
                className="v2-display v2-accent block"
                style={{ fontSize: "calc(3.4 * var(--u))", lineHeight: 1 }}
              >
                {c.n}
              </span>
              <h3
                className="v2-display"
                style={{ fontSize: "calc(2.2 * var(--u))", marginTop: "calc(1.2 * var(--u))" }}
              >
                {c.label}
              </h3>
              <p className="v2-body opacity-70" style={{ marginTop: "calc(0.9 * var(--u))" }}>
                {c.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
