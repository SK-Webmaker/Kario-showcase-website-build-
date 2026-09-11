import { INCLUDED } from "@/data/included";
import { Link } from "@tanstack/react-router";

import { Eyebrow, Orbs } from "./primitives";
import { MaskLines, Reveal } from "./motion";

const ORBS = [
  { x: "12%", y: "22%", size: "34vw", tone: "a" as const },
  { x: "88%", y: "80%", size: "30vw", tone: "b" as const },
];

/**
 * The pricing slot.
 *
 * The reference fills this with three tiers across a 36-row comparison
 * matrix. Kairo has one price, and that simplicity is the argument — so
 * the slot keeps the reference's sticky header treatment and hands the
 * space to the payback calculator instead, which is interactive in the
 * same way the matrix is and says something true.
 */
export function V2Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden"
      style={{ paddingBlock: "calc(10.5 * var(--u))" }}
    >
      <Orbs spec={ORBS} />
      <div
        className="relative z-10 mx-auto"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        {/* Opaque, or the copy below scrolls up through the letters. */}
        <div
          className="sticky z-[2]"
          style={{
            top: "calc(7 * var(--u))",
            paddingBlock: "calc(1.4 * var(--u))",
            // Reaches past the container's gutters, or the opaque backing
            // reads as a floating rectangle sitting on the grid.
            marginInline: "calc(-1 * var(--pad))",
            paddingInline: "var(--pad)",
            background: "var(--v2-ground)",
          }}
        >
          <Reveal>
            <Eyebrow>What it costs</Eyebrow>
          </Reveal>
          {/* Explicit lines: at this size a reflow moves the whole
              composition, so the break is a decision, not a consequence. */}
          <h2 className="v2-display v2-h2" style={{ marginTop: "calc(0.8 * var(--u))" }}>
            <MaskLines lines={["$410 once."]} />
            <MaskLines lines={["Then nothing."]} lineClassName="v2-accent" delay={160} />
          </h2>
        </div>

        <Reveal
          as="p"
          delay={280}
          opacity={0.7}
          className="v2-body max-w-[54ch]"
          style={{ marginTop: "calc(1.6 * var(--u))" }}
        >
          No monthly subscription, no per-booking fee, no commission, and no cut of anything you
          charge. One payment to set the business up, and then the software is simply yours to run.
        </Reveal>

        {/* What the one fee actually buys. The reference uses a 36-row
            comparison matrix here; this is the honest equivalent. */}
        <div style={{ marginTop: "calc(5 * var(--u))" }}>
          <Reveal>
            <Eyebrow>Every Kairo includes</Eyebrow>
          </Reveal>
          <ul className="mt-6 grid gap-x-16 sm:grid-cols-2">
            {INCLUDED.map((t, i) => (
              <Reveal
                as="li"
                key={t}
                delay={Math.min(i, 7) * 45}
                opacity={0.7}
                className="v2-body flex gap-4 border-b border-white/10"
                style={{ paddingBlock: "calc(1.3 * var(--u))" }}
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] h-[0.35em] w-[0.35em] shrink-0 rounded-full"
                  style={{ background: "var(--v2-a)" }}
                />
                <span>{t}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={140} style={{ marginTop: "calc(3 * var(--u))" }}>
            <Link to="/get-in-touch" className="v2-btn">
              Contact us
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
