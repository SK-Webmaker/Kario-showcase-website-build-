import { MaskLines, Reveal, Rule } from "@/components/v2/motion";

export type Faq = { question: string; answer: string };

/**
 * Native <details> accordion: keyboard-operable and fully rendered in the
 * server HTML, so the answers are readable with no JavaScript at all —
 * and so an AI crawler, none of which run JavaScript, sees every answer.
 */
export function FaqBlock({
  items,
  heading = "Questions",
}: {
  items: readonly Faq[];
  heading?: string;
}) {
  return (
    <section
      id="faq"
      className="mx-auto"
      style={{ maxWidth: "calc(100 * var(--u))", paddingInline: "var(--pad)" }}
    >
      <Rule />
      <div style={{ paddingBlock: "calc(4.5 * var(--u))" }}>
        <h2 className="v2-display v2-t2" style={{ maxWidth: "calc(44 * var(--u))" }}>
          <MaskLines lines={[heading]} />
        </h2>
        <div className="border-t border-white/10" style={{ marginTop: "calc(2 * var(--u))" }}>
          {items.map((f, i) => (
            <Reveal key={f.question} delay={Math.min(i, 6) * 60}>
              <details className="group border-b border-white/10">
                <summary
                  className="flex cursor-pointer list-none items-baseline gap-5 [&::-webkit-details-marker]:hidden"
                  style={{ paddingBlock: "calc(1.4 * var(--u))" }}
                >
                  <span className="v2-eyebrow opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v2-display v2-t4 flex-1">{f.question}</span>
                  <span
                    aria-hidden="true"
                    className="v2-accent v2-t4 shrink-0 transition-transform duration-500 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p
                  className="v2-body max-w-[66ch] opacity-70"
                  style={{
                    paddingBottom: "calc(1.8 * var(--u))",
                    marginLeft: "calc(2.4 * var(--u))",
                  }}
                >
                  {f.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
