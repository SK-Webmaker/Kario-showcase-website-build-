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
    body: "It notices a misconfigured time zone, a database sitting on a disk that will be wiped, and a default password still in use — and it says so, out loud, instead of waiting for the day it matters.",
  },
];

/** The self-check readout — the fourth pillar, made visible. */
const CHECKS = [
  { label: "Time zone", value: "Australia/Melbourne", state: "ok" },
  { label: "Database", value: "Persistent volume · backed up 04:00", state: "ok" },
  { label: "Session cookies", value: "Signed · HttpOnly · SameSite", state: "ok" },
  { label: "Admin password", value: "Changed from default", state: "ok" },
  { label: "Outbound email", value: "Verified sender · SPF + DKIM", state: "ok" },
  { label: "Dependencies", value: "0 installed", state: "note" },
] as const;

export function BuiltDifferently() {
  return (
    <section
      id="built"
      className="relative overflow-hidden border-y border-edge bg-panel/30 py-24 sm:py-32"
    >
      <div aria-hidden="true" className="absolute inset-0 grid-lines opacity-60" />

      <div className="shell relative">
        <SectionHeading
          eyebrow="// under the bonnet //"
          title={
            <>
              Built differently, on purpose —{" "}
              <span className="text-accent-2">and it shows up in your week</span>
            </>
          }
          lede="You will never think about any of this. It is here because it is the reason the software stays fast, stays up, and doesn't quietly lose your Tuesday."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
          <div className="space-y-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 70}>
                <div className="rounded-2xl border border-edge bg-panel/70 p-6">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[12px] font-bold tracking-[0.1em] text-accent-2">
                      {p.n}
                    </span>
                    <h3 className="text-[17px] font-bold tracking-[-0.015em] text-ink">
                      {p.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-[calc(1.5rem+12px)] text-[14.5px] leading-relaxed text-ink-2">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* the readout */}
          <Reveal delay={120}>
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-2xl border border-edge-2 bg-ground/90 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2.5 border-b border-edge bg-panel-2/80 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-money" />
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-2">
                    System self-check
                  </p>
                  <span className="ml-auto font-mono text-[10.5px] text-ink-3">
                    Thu 11:40
                  </span>
                </div>

                <div className="divide-y divide-edge">
                  {CHECKS.map((c) => (
                    <div key={c.label} className="flex items-center gap-3 px-4 py-3">
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 shrink-0 ${
                          c.state === "ok" ? "text-money" : "text-accent-2"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="w-[38%] shrink-0 font-mono text-[11.5px] text-ink-3">
                        {c.label}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[13px] text-ink">
                        {c.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-edge bg-panel-2/50 px-4 py-3.5">
                  <p className="text-[12.5px] leading-relaxed text-ink-3">
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
