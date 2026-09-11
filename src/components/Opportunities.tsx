import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { BrowserFrame } from "./ui/DeviceFrame";
import { shot } from "@/site.config";

/**
 * The hero demo. Every other dashboard reports what already happened,
 * which the owner mostly knew. This one reports what didn't happen and
 * is still recoverable — so it gets its own section, high on the page.
 *
 * Nothing here is a market statistic. Each finding is described by the
 * rows it is derived from, which is also the reason it can be trusted.
 */

const FINDINGS = [
  {
    n: "01",
    head: "Empty time this week",
    body: "Gaps between real bookings, priced at the cheapest service that would fit them.",
  },
  {
    n: "02",
    head: "Cancellations nobody filled",
    body: "Money already earned and handed back, in a slot somebody had chosen.",
  },
  {
    n: "03",
    head: "Regulars late coming back",
    body: "Measured against each client's own rhythm — not a blanket eight-week rule.",
  },
  {
    n: "04",
    head: "Repeat no-shows",
    body: "The handful of people causing most of it, by name.",
  },
  {
    n: "05",
    head: "Your weakest trading period",
    body: "The hours that are dead every single week, so you can stop staffing them.",
  },
];

const RULES = [
  ["It never guesses", "Not enough history means the finding is withheld, not softened."],
  [
    "It values conservatively",
    "A gap is worth the cheapest service that fits it, never the dearest.",
  ],
  ["It shows its working", "Every number opens onto the bookings that produced it."],
];

export function Opportunities() {
  return (
    <section id="money" className="border-t border-line py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="The part nothing else does"
          lines={["Your diary already", "knows where the", "money went."]}
          lede="Under the day's work sits Opportunities: five findings drawn from your own bookings, each one priced, each one still recoverable this week."
          className="max-w-3xl"
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
          <div className="grid gap-px self-start border border-line bg-line">
            {FINDINGS.map((f, i) => (
              <Reveal key={f.n} delay={i * 60} className="bg-ground">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 p-5 sm:p-6">
                  <span className="chrome pt-1">[{f.n}]</span>
                  <div>
                    <h3 className="text-[15.5px] font-bold leading-tight">{f.head}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{f.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div>
            <Reveal delay={120}>
              <BrowserFrame url="luxehairstudio.kairo.app">
                <img
                  src={shot("02-dashboard-insights.jpg")}
                  alt="The Opportunities panel under the dashboard, listing recoverable money with the bookings behind each figure."
                  loading="lazy"
                  decoding="async"
                  className="block w-full"
                />
              </BrowserFrame>
            </Reveal>

            <div className="mt-8 border border-line bg-raised">
              {RULES.map(([head, body], i) => (
                <Reveal key={head} delay={i * 70}>
                  <div className="border-b border-line p-5 last:border-b-0 sm:p-6">
                    <p className="text-[14px] font-bold">{head}</p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">{body}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="/get-in-touch" className="btn-brand">
                  Contact us
                </a>
                <span className="text-[13px] text-ink-2">
                  We'll show you this on your own numbers.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
