import { Reveal } from "./ui/Reveal";
import { mailtoHref, site } from "@/site.config";

const INCLUDED = [
  "Your own Kairo, on your own booking link",
  "Bookings, calendar, clients, payments and stock",
  "Confirmations, reminders and review requests",
  "Unlimited team members and services",
  "Your data in a file that belongs to you",
  "Setup wizard, and your existing client list imported",
];

const HOW = [
  {
    n: "01",
    title: "Tell us about the business",
    body: "What you do, how many chairs, how you work now. Ten minutes on the phone.",
  },
  {
    n: "02",
    title: "We set your Kairo up",
    body: "Your hours, your team, your service menu and prices. Your client spreadsheet imported, duplicates merged.",
  },
  {
    n: "03",
    title: "You open it on the floor",
    body: "Add it to the home screen and run a day on it. The booking link goes live when you're ready, not before.",
  },
];

export function TalkToUs() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-edge py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px]
                   bg-[radial-gradient(60%_100%_at_50%_0%,rgba(59,130,246,0.16),transparent_70%)]"
      />

      <div className="shell relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          {/* the panel */}
          <Reveal>
            <div className="rounded-2xl border border-accent/30 bg-panel/80 p-7 backdrop-blur sm:p-9">
              <p className="eyebrow">What it costs</p>
              <h2 className="mt-4 text-[clamp(26px,3.6vw,38px)] font-extrabold leading-[1.08] tracking-[-0.03em]">
                Quoted per salon, because every salon is a different size.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                Kairo is sold white-label — one instance per business, set up
                for how you actually work. There's no per-booking fee and no cut
                of what you charge, so the number doesn't move when you have a
                good month. Tell us the shape of the business and we'll tell you
                the price.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a href={mailtoHref} className="btn-primary">
                  Talk to us
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a href="#journey" className="btn-ghost">
                  See it working again
                </a>
              </div>

              <p className="mt-4 font-mono text-[11.5px] text-ink-3">
                or email {site.contactEmail}
              </p>

              <div className="rule my-7" />

              <p className="eyebrow mb-4">Every Kairo includes</p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {INCLUDED.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-money"
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

          {/* how it starts */}
          <div className="lg:pt-6">
            <Reveal>
              <p className="eyebrow mb-4">// getting started //</p>
              <h3 className="text-[clamp(22px,2.8vw,30px)] font-extrabold leading-[1.12] tracking-[-0.03em]">
                You'll be running a real day on it inside a week
              </h3>
            </Reveal>

            <div className="mt-9 space-y-8">
              {HOW.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="relative flex gap-5">
                    {i < HOW.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[19px] top-11 h-[calc(100%+18px)] w-px bg-edge"
                      />
                    )}
                    <span
                      className="relative z-10 grid h-10 w-10 shrink-0 place-items-center
                                 rounded-full border border-edge-2 bg-panel-2
                                 font-mono text-[12px] font-bold text-accent-2"
                    >
                      {s.n}
                    </span>
                    <div className="pt-1.5">
                      <h4 className="text-[15.5px] font-bold text-ink">{s.title}</h4>
                      <p className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-ink-2">
                        {s.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={280}>
              <div className="mt-10 rounded-2xl border border-edge bg-panel/60 p-5">
                <p className="text-[14px] leading-relaxed text-ink-2">
                  <b className="text-ink">Not a demo.</b> Kairo has been running a
                  Melbourne salon's bookings, payments and customer emails in
                  production since day one. The screens on this page are that
                  same system, filled with invented clients so no real
                  business's data appears anywhere on this site.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
