import { Odometer } from "./ui/Odometer";
import { Reveal } from "./ui/Reveal";

/**
 * Figures that are facts about how the software is built and behaves —
 * never market statistics, which Kairo has no basis to claim.
 */
const STATS = [
  { v: "0", u: "%", k: "Commission", n: "Every booking you take is yours in full" },
  { v: "0", u: "", k: "Per month", n: "A one-off $400 to set up, then nothing" },
  { v: "750", u: "", k: "Automated checks", n: "Across 28 suites, on every release" },
  { v: "1", u: "", k: "Click to export", n: "Your whole client list, no permission asked" },
];

const REPLACES = [
  "the paper diary",
  "the phone-tag",
  "the spreadsheet of client numbers",
  "the card machine that talks to nothing",
  "reminder texts sent by hand",
  "the second app for stock",
  "the review request you forget",
  "the marketplace commission",
];

export function ProofWall() {
  return (
    <section className="border-t border-line">
      <div className="shell">
        <div className="grid border-b border-line sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.k} delay={i * 80}>
              <div className="border-line py-10 sm:border-l sm:pl-6 sm:first:border-l-0 sm:first:pl-0 lg:py-14">
                <div className="flex items-start tabular display text-[clamp(48px,6.5vw,92px)]">
                  <Odometer value={s.v} />
                  {s.u && <span className="text-ink-3">{s.u}</span>}
                </div>
                <p className="mt-4 text-[14px] font-semibold">{s.k}</p>
                <p className="mt-1 max-w-[28ch] text-[12.5px] leading-relaxed text-ink-3">{s.n}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="py-7">
        <p className="chrome shell mb-5">One login replaces</p>
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-10 pr-10">
            {[...REPLACES, ...REPLACES].map((item, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-3 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-3"
              >
                <span aria-hidden="true" className="text-ink-4">
                  ×
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
