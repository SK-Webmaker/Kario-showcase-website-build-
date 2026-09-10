import { FAQ } from "@/data/faq";
import { Eyebrow, Orbs } from "./primitives";
import { MaskLines, Reveal } from "./motion";

const ORBS = [{ x: "94%", y: "18%", size: "30vw", tone: "a" as const }];

/**
 * The FAQ. The reference uses a custom click accordion with a rotating
 * arrow; native <details> does the same job, keeps every answer in the
 * server-rendered HTML whether open or shut, and needs no state.
 *
 * The questions come from data/faq.ts — the same array the FAQPage
 * JSON-LD is built from, so the markup cannot drift from the page.
 */
export function V2Faq() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden"
      style={{ paddingBlock: "calc(9 * var(--u))" }}
    >
      <Orbs spec={ORBS} />
      <div
        className="relative z-10 mx-auto grid gap-x-16 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <div className="lg:sticky lg:top-[calc(8*var(--u))] lg:self-start">
          <Reveal>
            <Eyebrow>Straight answers</Eyebrow>
          </Reveal>
          <h2 className="v2-display v2-h2" style={{ marginTop: "calc(0.8 * var(--u))" }}>
            <MaskLines lines={["Before", "you"]} />
            <MaskLines lines={["ask."]} lineClassName="v2-accent" delay={140} />
          </h2>
        </div>

        <dl className="border-t border-white/10">
          {FAQ.map((f, i) => (
            <details
              key={f.q}
              name="v2-faq"
              open={i === 0}
              className="group border-b border-white/10"
            >
              <summary
                className="flex cursor-pointer list-none items-baseline gap-5 [&::-webkit-details-marker]:hidden"
                style={{ paddingBlock: "calc(1.6 * var(--u))" }}
              >
                <span className="v2-eyebrow opacity-50">{String(i + 1).padStart(2, "0")}</span>
                <dt
                  className="v2-display flex-1"
                  style={{ fontSize: "calc(1.9 * var(--u))", lineHeight: 1.16 }}
                >
                  {f.q}
                </dt>
                <span
                  aria-hidden="true"
                  className="v2-accent shrink-0 transition-transform duration-500 group-open:rotate-45"
                  style={{ fontSize: "calc(1.8 * var(--u))" }}
                >
                  +
                </span>
              </summary>
              <dd
                className="v2-body max-w-[62ch] opacity-70"
                style={{ paddingBottom: "calc(2 * var(--u))", marginLeft: "calc(2.4 * var(--u))" }}
              >
                {f.a}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
