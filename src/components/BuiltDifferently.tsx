import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const PILLARS = [
  {
    n: "01",
    title: "Zero dependencies",
    body: "The entire platform is hand-written. No frameworks, no packages, no build step. Nothing breaks when a library updates, and there is no supply chain to be compromised through.",
  },
  {
    n: "02",
    title: "One file per business",
    body: "Your salon is a single database file. It can be copied, backed up or moved in one move. Nothing is pooled with another business, because there is no shared pool.",
  },
  {
    n: "03",
    title: "Security taken seriously",
    body: "Parameterised queries throughout. Signed HttpOnly session cookies, never localStorage. Server-side authorisation on every route, rate limiting on login and password changes, a password policy with breach checking, and public links that verify a token rather than trusting an ID in the URL.",
  },
  {
    n: "04",
    title: "Honest about its own state",
    body: "It notices a misconfigured time zone, a database on a disk that will be wiped, and a default password still in use — and says so, out loud, instead of waiting for the day it matters.",
  },
];

const CHECKS = [
  ["Time zone", "Australia/Melbourne"],
  ["Database", "Persistent · backed up 04:00"],
  ["Session cookies", "Signed · HttpOnly · SameSite"],
  ["Admin password", "Changed from default"],
  ["Outbound email", "Verified · SPF + DKIM"],
  ["Dependencies", "0 installed"],
];

export function BuiltDifferently() {
  return (
    <section id="built" className="border-t border-line bg-raised py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          index="08"
          eyebrow="Under the bonnet"
          lines={["Built differently,", "on purpose."]}
          lede="You will never think about any of this. It is here because it is the reason the software stays fast, stays up, and doesn't quietly lose your Tuesday."
          className="max-w-3xl"
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 70}>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-6 border-t border-line py-7 last:border-b">
                  <span className="chrome pt-1">[{p.n}]</span>
                  <div>
                    <h3 className="text-[17px] font-bold tracking-[-0.01em]">{p.title}</h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div>
              <div className="border border-line-2 bg-ground">
                <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
                  <span className="h-1.5 w-1.5 bg-brand" aria-hidden="true" />
                  <p className="chrome">System self-check</p>
                  <span className="chrome ml-auto tabular">Thu 11:40</span>
                </div>
                {CHECKS.map(([k, v]) => (
                  <div key={k} className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-0">
                    <span className="chrome w-[40%] shrink-0 normal-case tracking-normal">{k}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink">{v}</span>
                    <span className="text-[11px] text-brand-deep" aria-hidden="true">OK</span>
                  </div>
                ))}
                <div className="px-4 py-4">
                  <p className="text-[12px] leading-relaxed text-ink-3">
                    When one of these is wrong, Kairo says so on the dashboard —
                    in plain English, on the day it becomes true, not in a log
                    file nobody opens.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
