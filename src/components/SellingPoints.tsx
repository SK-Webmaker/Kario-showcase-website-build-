import { Reveal, RiseLines } from "./ui/Reveal";

/**
 * The spine of the pitch: the five things that actually differentiate
 * Kairo, in the order that lands hardest for an owner. Deliberately
 * short — each line is a claim the rest of the page proves.
 */

const POINTS = [
  {
    n: "01",
    head: "You keep everything you earn",
    body: "No commission. No per-booking fee. No cut of card payments. $410 once, then nothing every month.",
  },
  {
    n: "02",
    head: "It's yours, not a listing",
    body: "Your own address, your own database, your own client list. No marketplace showing your clients a rival.",
  },
  {
    n: "03",
    head: "It shows where money leaks",
    body: "Empty gaps, unfilled cancellations, regulars drifting off. Priced, with the bookings behind every number.",
  },
  {
    n: "04",
    head: "It never spends without asking",
    body: "Texting off on every install. You see the recipients and the dollar cost before anything sends.",
  },
  {
    n: "05",
    head: "It lives on your home screen",
    body: "Nothing to install, nothing to update, no version to fall behind on. Open it, and it's today's diary.",
  },
];

export function SellingPoints() {
  return (
    <section id="what-you-get" className="border-t border-line py-16 sm:py-24">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
                <span className="chrome text-ink">[00]</span>
                <span className="chrome">The short version</span>
              </div>
            </Reveal>
            <RiseLines
              as="h2"
              lines={["Five reasons,", "before the detail."]}
              className="display-lg"
            />
          </div>
          <Reveal delay={160}>
            <p className="lede lg:pb-2">
              Booking, payments and clients for one business — yours. If you only read one thing on
              this page, read these five.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {POINTS.map((p, i) => (
            <Reveal key={p.n} delay={i * 70} className="bg-ground">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <span aria-hidden="true" className="mb-5 block h-px w-10 bg-brand" />
                <p className="chrome mb-4">[{p.n}]</p>
                <h3 className="text-[18px] font-bold leading-[1.15] tracking-[-0.015em] sm:text-[19px]">
                  {p.head}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="/get-in-touch" className="btn-brand">
              Contact us
            </a>
            <a href="#money" className="btn-line">
              See it find the money
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
