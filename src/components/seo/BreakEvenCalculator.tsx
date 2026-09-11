import { useState } from "react";

import { CountUp, MaskLines } from "@/components/v2/motion";

const SETUP = 410;

function money(n: number): string {
  return `$${n.toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
}

/**
 * Flat one-off fee against a subscription plus commission.
 *
 * Server-rendered with sensible defaults, so the numbers are in the HTML
 * before any JavaScript runs; the inputs then become live on hydration.
 */
export function BreakEvenCalculator({
  defaultTicket = 85,
  defaultMonthly = 49,
  defaultCommission = 20,
  heading = "How long before a subscription costs more than $410?",
}: {
  defaultTicket?: number;
  defaultMonthly?: number;
  defaultCommission?: number;
  heading?: string;
}) {
  const [ticket, setTicket] = useState(defaultTicket);
  const [monthly, setMonthly] = useState(defaultMonthly);
  const [commission, setCommission] = useState(defaultCommission);

  const months = monthly > 0 ? Math.ceil(SETUP / monthly) : null;
  const perNewClient = (ticket * commission) / 100;
  const visits = perNewClient > 0 ? Math.ceil(SETUP / perNewClient) : null;
  const threeYear = monthly * 36;

  const field =
    "mt-2 w-full border border-line bg-sunk px-3 py-3 text-[16px] tabular text-ink " +
    "focus:border-brand focus:outline-none";

  return (
    <section
      className="mx-auto border-t border-white/10"
      style={{ padding: "calc(4.5 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
    >
      <h2 className="v2-display v2-t2" style={{ maxWidth: "calc(46 * var(--u))" }}>
        <MaskLines lines={[heading]} />
      </h2>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form
          className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="block">
            <span className="chrome">Average ticket (AUD)</span>
            <input
              type="number"
              min={1}
              inputMode="decimal"
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value) || 0)}
              className={field}
            />
          </label>
          <label className="block">
            <span className="chrome">Monthly subscription (AUD)</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value) || 0)}
              className={field}
            />
          </label>
          <label className="block">
            <span className="chrome">New-client commission (%)</span>
            <input
              type="number"
              min={0}
              max={100}
              inputMode="decimal"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value) || 0)}
              className={field}
            />
          </label>
        </form>

        <dl className="grid gap-px self-start bg-line">
          <div className="bg-raised p-6">
            <dt className="chrome mb-2">Months until the subscription passes Kairo's $410</dt>
            <dd className="tabular display-md text-brand">
              {months === null ? "—" : <CountUp value={months} suffix=" months" />}
            </dd>
            <p className="mt-2 text-[13.5px] text-ink-2">
              And it keeps charging after that. Kairo stops at {money(SETUP)}.
            </p>
          </div>
          <div className="bg-raised p-6">
            <dt className="chrome mb-2">New-client visits whose commission equals $410</dt>
            <dd className="tabular display-md text-brand">
              {visits === null ? "—" : <CountUp value={visits} suffix=" visits" />}
            </dd>
            <p className="mt-2 text-[13.5px] text-ink-2">
              At {money(ticket)} a visit, {commission}% is {money(perNewClient)} handed over each
              time.
            </p>
          </div>
          <div className="bg-raised p-6">
            <dt className="chrome mb-2">Subscription cost over three years</dt>
            <dd className="tabular display-md">{money(threeYear)}</dd>
            <p className="mt-2 text-[13.5px] text-ink-2">
              Before any commission. Kairo over the same three years: {money(SETUP)}.
            </p>
          </div>
        </dl>
      </div>

      <p className="mt-6 max-w-[68ch] text-[13px] text-ink-3">
        Your own numbers, worked out live. Card processing fees are charged by your payment provider
        either way and are not included here.
      </p>
    </section>
  );
}
