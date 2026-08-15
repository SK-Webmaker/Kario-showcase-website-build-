import { Odometer } from "./ui/Odometer";
import { Reveal } from "./ui/Reveal";

/**
 * The HydraDB stat treatment — big rolling figures on a tight grid.
 *
 * Every number here is a verifiable fact about how the software is built
 * or behaves, not a market statistic. Nothing on this wall is a claim
 * about revenue, customers or industry averages.
 */
const STATS = [
  {
    value: "0",
    unit: "",
    label: "Dependencies",
    note: "No frameworks, no packages, no build step",
  },
  {
    value: "1",
    unit: "",
    label: "Login",
    note: "Diary, payments and messages in one place",
  },
  {
    value: "15",
    unit: "s",
    label: "To undo a cancellation",
    note: "The message is held back for two minutes",
  },
  {
    value: "30",
    unit: "s",
    label: "Live refresh",
    note: "“With you now” re-derives from the clock",
  },
] as const;

/** The things one Kairo login replaces on a salon's front desk. */
const REPLACES = [
  "the paper diary",
  "the phone-tag",
  "the spreadsheet of client numbers",
  "the card machine that talks to nothing",
  "the reminder texts you send by hand",
  "the second app for stock",
  "the review-request you always forget",
];

export function ProofWall() {
  return (
    <section className="relative border-y border-edge bg-panel/40 py-20 sm:py-24">
      <div className="shell">
        <div className="grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="lg:border-l lg:border-edge lg:pl-6">
                <div className="flex items-baseline text-[clamp(46px,7vw,76px)] font-extrabold leading-none tracking-[-0.05em]">
                  <Odometer value={s.value} />
                  {s.unit && (
                    <span className="ml-0.5 text-accent-2">{s.unit}</span>
                  )}
                </div>
                <p className="mt-4 text-[15px] font-semibold text-ink">{s.label}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-3">
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rule my-14" />

        <Reveal>
          <p className="eyebrow mb-6 text-center">One login replaces</p>
        </Reveal>

        {/* Marquee of the things Kairo removes from the front desk. */}
        <div className="mask-fade-x overflow-hidden">
          <div className="flex w-max animate-marquee gap-3">
            {[...REPLACES, ...REPLACES].map((item, i) => (
              <span
                key={i}
                className="flex shrink-0 items-center gap-2 rounded-full border
                           border-edge bg-panel-2/60 px-4 py-2 text-[13.5px] text-ink-2"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 shrink-0 text-ink-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
