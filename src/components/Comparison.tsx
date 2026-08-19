import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * The feature-level comparison, kept deliberately generic on the right:
 * it describes the arrangement common across salon booking platforms as
 * a category, not any one named product's current terms.
 */
const ROWS = [
  ["Who your client list belongs to", "Yours. Your own file, on your own link.", "Often held in a shared platform account."],
  ["When a booking moves", "Asks: email, text, both or nothing — then does exactly that.", "Frequently silent, or a fresh confirmation that reads like a duplicate."],
  ["Undoing a cancellation", "15 seconds to undo, message held two minutes.", "Rarely offered — by the time you notice, it has gone."],
  ["What it costs to run", "$400 once, then nothing monthly. No cut of what you charge.", "Usually a monthly subscription, and often a per-booking fee on top."],
  ["Where customers find you", "Your own branded link, your name at the top.", "Often a marketplace listing your competitors too."],
  ["On a phone", "The same full workspace, installs to the home screen.", "Usually a cut-down companion app."],
  ["Built for", "Hair, barbering, beauty — written in a salon.", "Every kind of business, from one codebase."],
];

export function Comparison() {
  return (
    <section id="compare" className="border-t border-line py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="09"
          eyebrow="Side by side"
          lines={["What you get,", "next to what", "you're used to."]}
          className="max-w-3xl"
        />

        <Reveal>
          <div className="mt-14 border-t border-line">
            {/* header */}
            <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)] gap-8 border-b border-line py-4 sm:grid">
              <span className="chrome" />
              <span className="chrome text-ink">Kairo</span>
              <span className="chrome">The usual setup</span>
            </div>

            {ROWS.map(([q, k, u], i) => (
              <div
                key={q}
                className="grid gap-2 border-b border-line py-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)] sm:gap-8"
              >
                <div className="flex gap-3">
                  <span className="chrome tabular shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[14px] font-semibold leading-snug">{q}</span>
                </div>
                <p className="flex gap-2.5 text-[14px] leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 bg-brand" />
                  {k}
                </p>
                <p className="flex gap-2.5 text-[14px] leading-relaxed text-ink-3">
                  <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 bg-ink-4" />
                  {u}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-6 max-w-3xl text-[12px] leading-relaxed text-ink-3">
            “The usual setup” describes the arrangement common across salon
            booking platforms as a category, not any one named product. Terms
            differ between providers, plans and countries, and change over time
            — worth checking your current one's before you decide.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
