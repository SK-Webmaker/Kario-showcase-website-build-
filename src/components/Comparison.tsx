import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

/**
 * The honest comparison.
 *
 * The right-hand column describes the arrangement common across salon
 * booking platforms as a category — it is deliberately not a claim about
 * any one named product, and the footnote says so.
 */
const ROWS = [
  {
    q: "Who your client list belongs to",
    kairo: "Yours. Your own database file, on your own booking link.",
    usual: "Often held in a shared platform account, alongside every other business on it.",
  },
  {
    q: "When a booking moves",
    kairo: "Stops and asks: email, text, both, or nothing — then does exactly that.",
    usual: "Frequently silent, or sends a fresh confirmation that reads like a duplicate.",
  },
  {
    q: "Undoing a cancellation",
    kairo: "15 seconds to undo, with the client's message held back for two minutes.",
    usual: "Rarely offered — by the time you notice, the message has gone.",
  },
  {
    q: "What it costs per booking",
    kairo: "Nothing. Kairo takes no cut of what you charge.",
    usual: "Commonly a per-booking fee, a marketplace commission, or both.",
  },
  {
    q: "Where customers find you",
    kairo: "Your own branded link. Your name at the top, not a directory listing.",
    usual: "Often a marketplace that lists your competitors on the same page.",
  },
  {
    q: "On a phone",
    kairo: "The same full workspace. Installs to the home screen, no app store.",
    usual: "Usually a cut-down companion app with a subset of the desktop features.",
  },
  {
    q: "What it's built on",
    kairo: "Zero third-party packages. Nothing to break when a library updates.",
    usual: "Typically hundreds of dependencies, each one a thing that can change under you.",
  },
];

export function Comparison() {
  return (
    <section id="compare" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="// why this one //"
          title={
            <>
              What you actually get,{" "}
              <span className="text-accent-2">next to what you're used to</span>
            </>
          }
        />

        <Reveal>
          <div className="mt-12 overflow-hidden rounded-2xl border border-edge">
            {/* header */}
            <div
              className="grid grid-cols-[1fr] gap-px bg-edge sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)]"
            >
              <div className="hidden bg-panel-2/70 px-5 py-4 sm:block" />
              <div className="bg-accent/[0.10] px-5 py-4">
                <p className="flex items-center gap-2 text-[14.5px] font-bold text-ink">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-accent text-[11px] font-extrabold text-white">
                    K
                  </span>
                  Kairo
                </p>
              </div>
              <div className="bg-panel-2/70 px-5 py-4">
                <p className="text-[14.5px] font-bold text-ink-2">
                  The usual setup
                </p>
              </div>
            </div>

            {/* rows */}
            <div className="grid gap-px bg-edge">
              {ROWS.map((r) => (
                <div
                  key={r.q}
                  className="grid grid-cols-[1fr] gap-px bg-edge sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_minmax(0,1.15fr)]"
                >
                  <div className="bg-panel/80 px-5 py-4">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.06em] text-ink-3 sm:normal-case sm:tracking-normal sm:text-[14px] sm:text-ink">
                      {r.q}
                    </p>
                  </div>

                  <div className="bg-accent/[0.05] px-5 py-4">
                    <p className="flex gap-2.5 text-[14px] leading-relaxed text-ink">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-money"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        aria-hidden="true"
                      >
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {r.kairo}
                    </p>
                  </div>

                  <div className="bg-panel/80 px-5 py-4">
                    <p className="flex gap-2.5 text-[14px] leading-relaxed text-ink-2">
                      <svg
                        viewBox="0 0 24 24"
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        aria-hidden="true"
                      >
                        <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                      </svg>
                      {r.usual}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="mt-5 max-w-3xl text-[12.5px] leading-relaxed text-ink-3">
            “The usual setup” describes the arrangement common across salon
            booking platforms as a category, not any one named product. Terms
            differ between providers and change over time — worth checking your
            current one's before you decide.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
