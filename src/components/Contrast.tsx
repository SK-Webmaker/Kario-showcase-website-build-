import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const WITHOUT = [
  "The diary is on paper, and it's the only copy",
  "Client numbers live in a spreadsheet, or in your head",
  "Reminders get sent by hand, when there's a gap — so mostly they don't",
  "Someone moves an appointment and forgets to say so",
  "The card machine doesn't know what the diary knows",
  "Stock is counted when you notice a shelf is empty",
  "Rebooking is whoever you happen to remember to chase",
];

const WITH = [
  "One system, one login, on every device you own",
  "A profile per client, with notes that resurface at the next visit",
  "Confirmations, reminders and review requests send themselves",
  "Every change asks who to tell, and tells them",
  "Payments, invoices and receipts settle against the booking itself",
  "Stock warns you before the shelf is empty, not after",
  "A win-back list of regulars who've quietly drifted",
];

export function Contrast() {
  return (
    <section id="why" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeading
          eyebrow="the problem"
          title="A salon doesn't lose money on the haircut. It loses it between the haircuts."
          lede="The empty chair nobody filled, the client who drifted off, the no-show nobody reminded, the change nobody passed on. Most of it is admin nobody had time for."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <Reveal>
            <div className="h-full rounded-2xl border border-edge bg-panel-2/40 p-6 sm:p-8">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-amber" />
                <h3 className="text-[15px] font-bold tracking-tight text-ink">
                  The front desk without it
                </h3>
              </div>
              <ul className="mt-6 space-y-3.5">
                {WITHOUT.map((t) => (
                  <li key={t} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
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
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="relative h-full overflow-hidden rounded-2xl border border-edge-2
                         bg-panel p-6 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-accent"
              />
              <div className="relative flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-money" />
                <h3 className="text-[15px] font-bold tracking-tight text-ink">
                  The front desk with Kairo
                </h3>
              </div>
              <ul className="relative mt-6 space-y-3.5">
                {WITH.map((t) => (
                  <li key={t} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
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
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
