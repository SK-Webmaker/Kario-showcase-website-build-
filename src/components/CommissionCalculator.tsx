import { useMemo, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { mailtoHref } from "@/site.config";

/**
 * What a percentage actually costs you.
 *
 * Deliberately, every rate here is the visitor's own input rather than a
 * figure asserted about a named competitor: platform terms differ and
 * change, and a sales page that quotes them goes stale or misleads. The
 * visitor puts in what they are actually charged, and the arithmetic
 * does the rest — which is both honest and far more persuasive than a
 * number they'd have to take on trust.
 */

const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });

type FieldProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
};

function Field({ label, hint, value, min, max, step, onChange, format }: FieldProps) {
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
        className="mt-4 h-1 w-full cursor-pointer appearance-none rounded-full bg-line-2
                   accent-brand
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:border
                   [&::-webkit-slider-thumb]:border-ink
                   [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                   [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand
                   [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-ink"
      />
      <p className="mt-2 text-[12px] leading-relaxed text-ink-3">{hint}</p>
    </div>
  );
}

export function CommissionCalculator() {
  const [bookings, setBookings] = useState(160);
  const [ticket, setTicket] = useState(85);
  const [newClientShare, setNewClientShare] = useState(20);
  const [commission, setCommission] = useState(20);

  const result = useMemo(() => {
    const monthlyRevenue = bookings * ticket;
    const newClientRevenue = monthlyRevenue * (newClientShare / 100);
    const monthlyCut = newClientRevenue * (commission / 100);
    return {
      monthlyRevenue,
      monthlyCut,
      yearlyCut: monthlyCut * 12,
      newClients: Math.round(bookings * (newClientShare / 100)),
    };
  }, [bookings, ticket, newClientShare, commission]);

  return (
    <div className="grid gap-px border border-line bg-line lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      {/* the inputs */}
      <div className="bg-ground p-7 sm:p-10">
        <p className="chrome mb-8">Your numbers</p>

        <Field
          label="Bookings a month"
          hint="Across the whole team, everything you take in a month."
          value={bookings}
          min={20}
          max={600}
          step={10}
          onChange={setBookings}
          format={(n) => String(n)}
        />
        <Field
          label="Average ticket"
          hint="What a typical visit is worth, services and retail together."
          value={ticket}
          min={20}
          max={300}
          step={5}
          onChange={setTicket}
          format={money}
        />
        <Field
          label="Share that are new clients"
          hint="Marketplace commission usually applies to clients the platform introduced."
          value={newClientShare}
          min={0}
          max={60}
          step={1}
          onChange={setNewClientShare}
          format={(n) => `${n}%`}
        />
        <Field
          label="The rate you're charged"
          hint="Put in whatever your current platform actually takes — check your last statement."
          value={commission}
          min={0}
          max={35}
          step={1}
          onChange={setCommission}
          format={(n) => `${n}%`}
        />
      </div>

      {/* the answer */}
      <div className="flex flex-col justify-between bg-raised p-7 sm:p-10">
        <div>
          <p className="chrome mb-8">What that costs you</p>

          <p className="chrome-2 mb-2">A year of commission</p>
          <p className="tabular display text-[clamp(44px,6vw,84px)] leading-[0.86] text-ink">
            {money(result.yearlyCut)}
          </p>

          <div className="mt-8 space-y-3 border-t border-line pt-6">
            {[
              ["Turnover a month", money(result.monthlyRevenue)],
              ["New clients a month", String(result.newClients)],
              ["Taken from you a month", money(result.monthlyCut)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4">
                <span className="text-[13.5px] text-ink-2">{k}</span>
                <span className="tabular text-[15px] font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="border border-ink bg-brand p-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/70">
              On Kairo
            </p>
            <p className="mt-2 text-[19px] font-extrabold leading-tight text-white">
              {money(0)} of that.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/80">
              One flat price, quoted for your salon. It doesn't move when you
              have a good month, and it doesn't care where the client came from.
            </p>
          </div>

          <a href={mailtoHref} className="btn-line mt-4 w-full">
            Get your number
          </a>
        </div>
      </div>
    </div>
  );
}

export function CalculatorNote() {
  return (
    <Reveal>
      <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-ink-3">
        Every figure above is yours, not ours — we don't assert what any
        platform charges, because terms differ between providers, plans and
        countries, and they change. Put in the rate from your own statement.
        Kairo's own price is quoted per salon and carries no per-booking fee or
        commission.
      </p>
    </Reveal>
  );
}
