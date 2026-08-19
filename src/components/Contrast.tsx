import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const WITHOUT = [
  "The diary is on paper, and it's the only copy",
  "Client numbers live in a spreadsheet, or in your head",
  "Reminders go by hand, when there's a gap — so mostly they don't",
  "Someone moves an appointment and forgets to say so",
  "The card machine doesn't know what the diary knows",
  "Stock is counted when you notice a shelf is empty",
  "Rebooking is whoever you happen to remember to chase",
];

const WITH = [
  "One system, one login, on every device you own",
  "A profile per client, with notes that resurface next visit",
  "Confirmations, reminders and review requests send themselves",
  "Every change asks who to tell, and tells them",
  "Payments and receipts settle against the booking itself",
  "Stock warns you before the shelf is empty, not after",
  "A win-back list of regulars who've quietly drifted",
];

function Column({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "off" | "on";
}) {
  return (
    <div className={tone === "on" ? "lg:border-l lg:border-line lg:pl-10" : ""}>
      <div className="mb-8 flex items-center gap-3 border-b border-line pb-3">
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 ${tone === "on" ? "bg-brand" : "bg-ink-4"}`}
        />
        <span className="chrome">{label}</span>
      </div>
      <ul className="space-y-0">
        {items.map((t, i) => (
          <Reveal key={t} delay={i * 45}>
            <li
              className={`flex gap-4 border-b border-line py-4 text-[14.5px] leading-snug ${
                tone === "on" ? "text-ink" : "text-ink-3"
              }`}
            >
              <span className="chrome mt-0.5 shrink-0 tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
              {t}
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

export function Contrast() {
  return (
    <section id="problem" className="border-t border-line py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow="The problem"
          lines={["A salon doesn't lose", "money on the haircut.", "It loses it between", "the haircuts."]}
          lede="The empty chair nobody filled, the client who drifted off, the no-show nobody reminded, the change nobody passed on. Most of it is admin nobody had time for."
          className="max-w-4xl"
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Column label="The front desk without it" items={WITHOUT} tone="off" />
          <Column label="The front desk with Kairo" items={WITH} tone="on" />
        </div>
      </div>
    </section>
  );
}
