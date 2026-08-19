import { BrowserFrame, PhoneFrame } from "./ui/DeviceFrame";
import { Reveal, RiseLines } from "./ui/Reveal";
import { MarketplaceVsDirect } from "./diagrams/MarketplaceVsDirect";
import { CommissionCalculator, CalculatorNote } from "./CommissionCalculator";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { shot } from "@/site.config";

/**
 * The case for Kairo, told as three scroll-locked beats.
 *
 * A note on how the competitors are handled: the claims here are about
 * business *models* — a marketplace listing is structurally different
 * from your own link; a general-purpose tool is structurally different
 * from one built for chairs. Those are verifiable and stable. Specific
 * prices and rates are never asserted, because they differ by plan and
 * country and go out of date; the calculator below takes the visitor's
 * own numbers instead.
 */

type Beat = {
  n: string;
  rail: string;
  lines: string[];
  body: string;
  points: string[];
};

const BEATS: Beat[] = [
  {
    n: "01",
    rail: "Whose client is it",
    lines: ["They send you", "to a directory.", "We send them to you."],
    body: "Marketplace platforms — Fresha and the ones like it — put your salon in a listing. A client who searched for you by name lands on a page showing four other salons who'd happily take the booking, and the platform takes a cut of the ones it introduced. Kairo has no directory to be listed in. Your booking page is on your own link, under your own name, and nobody else is on it.",
    points: [
      "Your own branded link",
      "No competitors on your page",
      "No commission on any booking",
      "The client list stays yours",
    ],
  },
  {
    n: "02",
    rail: "Built for chairs",
    lines: ["Built for hair", "and blades. Not for", "every business."],
    body: "General-purpose booking tools — Square Appointments and its peers — come from companies serving restaurants, retail and trades from the same codebase. They handle a 30-minute slot fine. They struggle with a four-hour full head of braids, a price that varies with hair length, a colour that needs a patch test 48 hours before, and a client who books a cut and a colour as one visit. Kairo was written for those, because it was written in a salon.",
    points: [
      "Multi-service visits as one booking",
      "“From” pricing for anything hair-length dependent",
      "Colour formulas and allergies on the appointment",
      "A column per stylist or barber, colour-coded",
    ],
  },
  {
    n: "03",
    rail: "It looks like you",
    lines: ["A booking page", "that looks like you.", "Not a template."],
    body: "Your name at the top, your services, your prices, your hours, your cancellation terms in plain sight before they commit. Availability is computed from real bookings, blocked time and each person's working hours, then re-checked at the moment of confirming, so two people tapping at once still cannot double-book you. And the link never goes stale — it always reflects today's menu.",
    points: [
      "Branded to the business, not the platform",
      "Only genuine openings are offered",
      "Cancellation terms shown before booking",
      "Self-service cancel that reopens the slot",
    ],
  },
];

function BeatCopy({ beat }: { beat: Beat }) {
  return (
    <>
      <div className="mb-7 flex items-center gap-4 border-b border-line pb-3">
        <span className="chrome text-ink">[{beat.n}]</span>
        <span className="chrome">{beat.rail}</span>
      </div>

      <h3 className="display text-[clamp(24px,2.7vw,44px)]">
        {beat.lines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
      </h3>

      <p className="mt-6 max-w-[52ch] text-[14.5px] leading-[1.6] text-ink-2">{beat.body}</p>

      <ul className="mt-7 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {beat.points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-2">
            <span className="mt-[7px] h-1 w-1 shrink-0 bg-acid" />
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

function BeatVisual({ index, t }: { index: number; t: number }) {
  if (index === 0) {
    return (
      <div className="w-full max-w-[460px]">
        <MarketplaceVsDirect t={t} />
      </div>
    );
  }

  if (index === 1) {
    return (
      <BrowserFrame url="luxehairstudio.kairo.app/services">
        <img
          src={shot("10-services.jpg")}
          alt="The service menu: categories, durations, and fixed, from and free price types."
          loading="lazy"
          decoding="async"
          className="block w-full"
        />
      </BrowserFrame>
    );
  }

  return (
    <div className="relative">
      <BrowserFrame url="luxehairstudio.com/book">
        <img
          src={shot("19-booking-services.jpg")}
          alt="The public booking page for Luxe Hair Studio, branded to the salon."
          loading="lazy"
          decoding="async"
          className="block w-full"
        />
      </BrowserFrame>
      <PhoneFrame className="absolute -bottom-8 -right-4 w-[26%] max-w-[130px] sm:-right-8">
        <img
          src={shot("25-phone-booking.jpg")}
          alt="The same booking page on a phone, where most customers book."
          loading="lazy"
          decoding="async"
          className="block w-full"
        />
      </PhoneFrame>
    </div>
  );
}

export function WhyNotThem() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();

  const raw = progress * BEATS.length;
  const active = Math.min(BEATS.length - 1, Math.max(0, Math.floor(raw)));
  const local = raw - active;

  return (
    <section id="why" className="relative">
      {/* lead-in */}
      <div className="shell border-t border-line pt-20 sm:pt-28">
        <Reveal>
          <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
            <span className="chrome text-ink">[01]</span>
            <span className="chrome">Why not the ones you've heard of</span>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-16">
          <RiseLines
            lines={["You are not", "a search result", "on someone else's", "platform."]}
            className="display-xl"
          />
          <Reveal delay={200}>
            <div className="lg:pt-3">
              <p className="text-[15px] leading-[1.6] text-ink-2 sm:text-[16.5px]">
                Every booking platform will take your diary online. The question
                is what it costs you to get there — in commission, in clients
                shown your competitors, and in a system that was never built for
                a chair in the first place.
              </p>
              <p className="mt-5 text-[15px] leading-[1.6] text-ink-2 sm:text-[16.5px]">
                Three differences that show up in your takings, not your
                settings screen.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* -------- pinned: three beats -------- */}
      <div
        ref={ref}
        className="relative mt-16 hidden lg:block"
        style={{ height: `${BEATS.length * 100 + 30}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="shell w-full">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-10 xl:gap-x-16">
              {/* rail */}
              <div className="relative flex flex-col gap-6 pr-2">
                <span aria-hidden="true" className="absolute left-0 top-1 h-[calc(100%-8px)] w-px bg-line" />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 w-px bg-acid transition-[height] duration-200"
                  style={{ height: `${progress * 100}%` }}
                />
                {BEATS.map((b, i) => (
                  <div key={b.n} className="relative pl-5">
                    <span
                      className="absolute left-0 top-1.5 h-1.5 w-1.5 -translate-x-[3px] transition-colors duration-660 ease-66"
                      style={{ background: i <= active ? "#c0fe04" : "rgb(var(--ink) / 0.3)" }}
                    />
                    <span
                      className="chrome block whitespace-nowrap transition-colors duration-660 ease-66"
                      style={{ color: i === active ? "rgb(var(--ink))" : undefined }}
                    >
                      {b.n} {b.rail}
                    </span>
                  </div>
                ))}
              </div>

              {/* copy */}
              <div className="relative min-h-[560px]">
                {BEATS.map((b, i) => (
                  <div
                    key={b.n}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        reduced || i === active
                          ? "translateY(0)"
                          : `translateY(${i < active ? -26 : 26}px)`,
                      pointerEvents: i === active ? "auto" : "none",
                      transition: reduced
                        ? "none"
                        : "opacity 500ms cubic-bezier(.66,0,.01,1), transform 660ms cubic-bezier(.66,0,.01,1)",
                    }}
                  >
                    <BeatCopy beat={b} />
                  </div>
                ))}
              </div>

              {/* visual */}
              <div className="relative h-[64vh] max-h-[580px]">
                {BEATS.map((b, i) => (
                  <div
                    key={b.n}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        reduced || i === active
                          ? "translateY(0) scale(1)"
                          : `translateY(${i < active ? -20 : 20}px) scale(0.98)`,
                      pointerEvents: i === active ? "auto" : "none",
                      transition: reduced
                        ? "none"
                        : "opacity 520ms cubic-bezier(.66,0,.01,1), transform 700ms cubic-bezier(.66,0,.01,1)",
                    }}
                  >
                    <div className="w-full">
                      <BeatVisual index={i} t={i === active ? (reduced ? 1 : local) : 0} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------- stacked on smaller screens -------- */}
      <div className="lg:hidden">
        <div className="shell space-y-20 py-16">
          {BEATS.map((b, i) => (
            <Reveal key={b.n}>
              <div>
                <BeatCopy beat={b} />
                <div className="mt-8">
                  <BeatVisual index={i} t={1} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* -------- the calculator -------- */}
      <div className="shell border-t border-line py-20 sm:py-28">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
              <span className="chrome text-ink">[04]</span>
              <span className="chrome">What a percentage really costs</span>
            </div>
          </Reveal>
          <RiseLines
            lines={["A cut of every", "new client adds", "up faster than", "you think."]}
            className="display-lg"
          />
          <Reveal delay={160}>
            <p className="lede mt-6">
              Move the sliders to your own salon. The rate is yours to set —
              take it off your last statement.
            </p>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <CommissionCalculator />
        </Reveal>
        <CalculatorNote />
      </div>
    </section>
  );
}
