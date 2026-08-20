import { useMemo, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { mailtoHref } from "@/site.config";

/**
 * What Kairo costs, and how fast it clears.
 *
 * The only two figures this page asserts are Kairo's own: nothing per
 * month, and a one-off setup. Everything else is the visitor's own
 * arithmetic on their own numbers — their ticket price, what they pay
 * their current platform, and two scenarios they switch on themselves.
 * Nothing here claims a saving on another company's behalf.
 */

const SETUP = 400;
const WEEKS_PER_MONTH = 52 / 12;

// Validated as a categorical pair against both surfaces
// (light #F7F8FB, dark #0A0E17): chroma, CVD separation and contrast
// all pass, worst-case ΔE 25.8 protan / 29.3 normal vision.
const KAIRO = "#3b82f6";
const OTHER = "#c2664a";

const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
}) {
  return (
    <div className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={label} className="chrome-2">
          {label}
        </label>
        <span className="tabular font-sans text-[26px] font-extrabold leading-none tracking-[-0.02em]">
          {format(value)}
        </span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-line-2 accent-brand
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-brand
                   [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                   [&::-moz-range-thumb]:bg-brand"
      />
      <p className="mt-2 text-[12px] leading-relaxed text-ink-3">{hint}</p>
    </div>
  );
}

function Toggle({
  on,
  onToggle,
  label,
  hint,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex w-full items-start gap-3 border border-line px-4 py-3 text-left
                 transition-colors duration-[660ms] ease-66 hover:border-line-2"
      style={{ background: on ? "rgb(59 130 246 / 0.08)" : "transparent" }}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors duration-[660ms] ease-66"
        style={{ background: on ? KAIRO : "rgb(var(--ink) / 0.22)" }}
      >
        <span
          className="h-3 w-3 rounded-full bg-white transition-transform duration-[660ms] ease-66"
          style={{ transform: on ? "translateX(12px)" : "translateX(0)" }}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[13.5px] font-semibold leading-snug">{label}</span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-ink-3">{hint}</span>
      </span>
    </button>
  );
}

/**
 * Three years of cumulative cost, two series.
 *
 * Bars are thin, rounded only at the data end, anchored to a common
 * baseline, with a 2px gap between the pair. Every bar is directly
 * labelled, so identity never rests on colour alone.
 */
function CostBars({ monthly }: { monthly: number }) {
  const years = [1, 2, 3];
  const rows = years.map((y) => ({
    y,
    kairo: SETUP,
    other: monthly * 12 * y,
  }));
  const max = Math.max(SETUP, ...rows.map((r) => r.other), 1);

  return (
    <figure className="mt-8">
      <figcaption className="chrome mb-4">What you'd have spent by then</figcaption>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
        {[
          ["Kairo", KAIRO],
          ["Your current platform", OTHER],
        ].map(([name, c]) => (
          <span key={name} className="flex items-center gap-2 text-[11.5px] text-ink-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-[1px]" style={{ background: c }} />
            {name}
          </span>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((r) => (
          <div key={r.y}>
            <p className="chrome mb-2">Year {r.y}</p>
            <div className="space-y-[2px]">
              {[
                { v: r.kairo, c: KAIRO, n: "Kairo" },
                { v: r.other, c: OTHER, n: "Your current platform" },
              ].map((bar) => (
                <div key={bar.n} className="flex items-center gap-3">
                  <div className="h-2.5 min-w-[2px] flex-1">
                    <div
                      className="h-full rounded-r-[4px]"
                      style={{ width: `${Math.max(1.5, (bar.v / max) * 100)}%`, background: bar.c }}
                    >
                      <span className="sr-only">
                        {bar.n}, year {r.y}: {money(bar.v)}
                      </span>
                    </div>
                  </div>
                  <span className="tabular w-[74px] shrink-0 text-right text-[12.5px] font-semibold">
                    {money(bar.v)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function PaybackCalculator() {
  const [ticket, setTicket] = useState(85);
  const [monthly, setMonthly] = useState(50);
  const [noShow, setNoShow] = useState(true);
  const [winBack, setWinBack] = useState(false);

  const r = useMemo(() => {
    const visits = Math.ceil(SETUP / ticket);
    const weekly = (noShow ? ticket : 0) + (winBack ? ticket / WEEKS_PER_MONTH : 0);
    const weeks = weekly > 0 ? SETUP / weekly : null;
    const crossover = monthly > 0 ? SETUP / monthly : null;
    return {
      visits,
      weeks,
      days: weeks !== null ? Math.ceil(weeks * 7) : null,
      crossover,
      threeYear: monthly * 36,
    };
  }, [ticket, monthly, noShow, winBack]);

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* inputs */}
      <div className="bg-ground p-7 sm:p-10">
        <p className="chrome mb-8">Your salon</p>

        <Slider
          label="Average ticket"
          hint="What a typical visit is worth — services and retail together."
          value={ticket}
          min={20}
          max={300}
          step={5}
          onChange={setTicket}
          format={money}
        />
        <Slider
          label="What you pay now, a month"
          hint="Your current booking platform's monthly fee. Set it to zero if you don't pay one."
          value={monthly}
          min={0}
          max={250}
          step={5}
          onChange={setMonthly}
          format={money}
        />

        <div className="border-t border-line pt-6">
          <p className="chrome mb-4">And if you like, assume</p>
          <div className="space-y-2.5">
            <Toggle
              on={noShow}
              onToggle={() => setNoShow((v) => !v)}
              label="Reminders save one no-show a week"
              hint="Deliberately conservative — one chair, one week."
            />
            <Toggle
              on={winBack}
              onToggle={() => setWinBack((v) => !v)}
              label="The win-back list brings one regular back a month"
              hint="From the clients who've quietly drifted."
            />
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-ink-3">
            Both are scenarios you switch on yourself, priced at your own
            ticket. Turn them off and the visits figure still stands on its own.
          </p>
        </div>
      </div>

      {/* the answer */}
      <div className="flex flex-col justify-between bg-raised p-7 sm:p-10">
        <div>
          <p className="chrome mb-8">Setup pays for itself in</p>

          <p className="tabular display text-[clamp(52px,7vw,104px)] leading-[0.84]">
            {r.visits}
          </p>
          <p className="mt-3 text-[17px] font-semibold">
            {r.visits === 1 ? "visit" : "visits"}.
          </p>

          <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-ink-2">
            {money(SETUP)} to set up, once. At {money(ticket)} a visit that's{" "}
            {r.visits} {r.visits === 1 ? "client" : "clients"} through the chair
            — then nothing per month, for as long as you use it.
            {r.days !== null && (
              <>
                {" "}
                On the assumptions you've ticked, that's about{" "}
                <b className="text-ink">
                  {r.days < 14 ? `${r.days} days` : `${Math.ceil(r.weeks!)} weeks`}
                </b>
                .
              </>
            )}
          </p>

          <CostBars monthly={monthly} />
        </div>

        <div className="mt-10">
          <div className="border border-line-2 bg-ground p-5">
            <p className="chrome mb-2">The whole price</p>
            <p className="text-[19px] font-extrabold leading-tight">
              {money(SETUP)} once. {money(0)} a month.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
              No subscription, no per-booking fee, no commission, no cut of what
              you charge.
              {r.crossover !== null && r.crossover > 0 && (
                <>
                  {" "}
                  A platform at {money(monthly)} a month passes {money(SETUP)} in{" "}
                  <b className="text-ink">
                    {Math.ceil(r.crossover)} month{Math.ceil(r.crossover) === 1 ? "" : "s"}
                  </b>{" "}
                  — and keeps charging after that.
                </>
              )}
            </p>
          </div>

          <a href={mailtoHref} className="btn-brand mt-4 w-full">
            Get set up
          </a>
        </div>
      </div>
    </div>
  );
}

export function PaybackNote() {
  return (
    <Reveal>
      <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-ink-3">
        The only figures asserted here are Kairo's own: {money(SETUP)} to set
        up, and nothing per month. The ticket price, the monthly fee and the two
        scenarios are yours to set, and the arithmetic is plain — we don't
        estimate what another platform costs you, because that depends on terms
        we can't see.
      </p>
    </Reveal>
  );
}
