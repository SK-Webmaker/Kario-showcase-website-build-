import { Reveal, RiseLines } from "./ui/Reveal";
import { mailtoHref, site } from "@/site.config";

const INCLUDED = [
  "Your own Kairo, on your own booking link",
  "Bookings, calendar, clients, payments and stock",
  "Confirmations, reminders and review requests",
  "Unlimited team members and services",
  "Your data in a file that belongs to you",
  "Setup, and your existing client list imported",
];

const HOW = [
  ["01", "Tell us about the business", "What you do, how many chairs, how you work now. Ten minutes on the phone."],
  ["02", "We set your Kairo up", "Your hours, your team, your menu and prices. Your client spreadsheet imported, duplicates merged."],
  ["03", "You open it on the floor", "Add it to the home screen and run a day on it. The booking link goes live when you're ready, not before."],
];

export function TalkToUs() {
  return (
    <section id="contact" className="border-t border-line py-20 sm:py-28">
      <div className="shell">
        <Reveal>
          <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
            <span className="chrome text-ink">[10]</span>
            <span className="chrome">What it costs</span>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <RiseLines
              lines={["$400 once.", "Then nothing,", "every month."]}
              className="display-lg"
            />

            <Reveal delay={180}>
              <p className="lede mt-7">
                Kairo is sold white-label — one instance per business, set up for
                how you actually work. A one-off {"\u0024"}400 to get you running, and
                then no subscription, no per-booking fee and no commission. The
                cost doesn't move when you have a good month, and it doesn't
                come back next month either.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href={mailtoHref} className="btn-brand">
                  Talk to us
                </a>
                <a href="#journey" className="btn-line">
                  See it working again
                </a>
              </div>
              <p className="chrome mt-5 normal-case tracking-normal">
                or email {site.contactEmail}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-12 border-t border-line pt-8">
                <p className="chrome mb-5">Every Kairo includes</p>
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {INCLUDED.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2.5 border-b border-line py-3 text-[13.5px] leading-snug text-ink-2"
                    >
                      <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 bg-brand" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="chrome mb-8 border-b border-line pb-3">Getting started</p>
            </Reveal>

            {HOW.map(([n, t, b], i) => (
              <Reveal key={n} delay={i * 90}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-b border-line py-7">
                  <span className="chrome pt-1">[{n}]</span>
                  <div>
                    <h4 className="text-[15.5px] font-bold">{t}</h4>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{b}</p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={280}>
              <div className="mt-8 border border-line bg-raised p-6">
                <p className="chrome mb-3">Not a demo</p>
                <p className="text-[13.5px] leading-relaxed text-ink-2">
                  Kairo has been running a Melbourne salon's bookings, payments
                  and customer emails in production since day one. The screens on
                  this page are that same system, filled with invented clients so
                  no real business's data appears anywhere on this site.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
