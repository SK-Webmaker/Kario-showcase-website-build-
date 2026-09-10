import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { enquirySchema, sendEnquiry } from "@/lib/contact.functions";

/* ------------------------------------------------------------------ */
/* Answers                                                             */
/* ------------------------------------------------------------------ */

type Answers = {
  businessType: string;
  teamSize: string;
  business: string;
  currentSoftware: string;
  softwareName: string;
  monthlySpend: string;
  frustration: string[];
  timeline: string;
  intent: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: Answers = {
  businessType: "",
  teamSize: "",
  business: "",
  currentSoftware: "",
  softwareName: "",
  monthlySpend: "",
  frustration: [],
  timeline: "",
  intent: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

const TYPES = [
  "Hair salon",
  "Barbershop",
  "Beauty / skin",
  "Nails",
  "Massage / clinic",
  "Something else",
];
const TEAM = ["Just me", "2–3", "4–8", "9+"];
const SOFTWARE = [
  "Yes, we use software",
  "Paper diary",
  "Phone notes / calendar",
  "Instagram & DMs",
];
const SPEND = [
  "Nothing",
  "Under $50 / mo",
  "$50–$150 / mo",
  "$150–$400 / mo",
  "$400+ / mo",
  "Commission per booking",
];
const PAIN = [
  "Empty gaps in the day",
  "No-shows and late cancels",
  "Chasing clients to rebook",
  "Paying commission on my own clients",
  "Reminders sent by hand",
  "Client list scattered everywhere",
  "Monthly fees creeping up",
  "Too fiddly to use on the floor",
];
const TIMELINE = ["As soon as possible", "Next month", "Just researching"];
const INTENT = ["See it running", "Ask a question", "Ready to get set up"];

/* ------------------------------------------------------------------ */
/* Small building blocks — one accent, one curve                       */
/* ------------------------------------------------------------------ */

const EASE = "cubic-bezier(0.22,1,0.36,1)";

const field =
  "w-full border border-line bg-transparent px-3.5 py-3 text-[16px] text-ink placeholder:text-ink-3 " +
  "outline-none transition-colors duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus:border-brand focus-visible:ring-1 focus-visible:ring-brand";

const label = "chrome mb-2 block";

function Chip({
  children,
  selected,
  onClick,
}: {
  children: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        "min-h-[44px] border px-4 py-2.5 text-left text-[13.5px] leading-snug " +
        "transition-colors duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand " +
        (selected
          ? "border-brand bg-brand/10 text-ink"
          : "border-line text-ink-2 hover:border-ink-3 hover:text-ink")
      }
    >
      {children}
    </button>
  );
}

function StepShell({
  index,
  title,
  blurb,
  children,
}: {
  index: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <div key={index} style={{ animation: `giftIn 660ms ${EASE} both` }} className="min-w-0">
      <div className="mb-6 flex items-center gap-4 border-b border-line pb-3">
        <span className="chrome text-ink">[{index}]</span>
        <span className="chrome">{title}</span>
      </div>
      <p className="mb-7 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{blurb}</p>
      <div className="grid gap-7">{children}</div>
    </div>
  );
}

function Group({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className={label}>{legend}</legend>
      {hint && <p className="mb-3 text-[13px] text-ink-3">{hint}</p>}
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* The flow                                                            */
/* ------------------------------------------------------------------ */

const STEPS = ["The business", "How you book now", "What it's costing", "Where to reply"];

export function GetInTouchFlow() {
  const send = useServerFn(sendEnquiry);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof Answers, string>>>({});
  const [failure, setFailure] = useState<string | null>(null);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  const togglePain = (p: string) =>
    setA((prev) => ({
      ...prev,
      frustration: prev.frustration.includes(p)
        ? prev.frustration.filter((x) => x !== p)
        : [...prev.frustration, p],
    }));

  const go = (next: number) => {
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFailure(null);

    const payload = {
      name: a.name,
      business: a.business,
      email: a.email,
      phone: a.phone,
      message: a.message,
      businessType: a.businessType,
      teamSize: a.teamSize,
      currentSoftware: a.currentSoftware,
      softwareName: a.softwareName,
      monthlySpend: a.monthlySpend,
      frustration: a.frustration,
      timeline: a.timeline,
      intent: a.intent,
      company: "",
    };

    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const next: Partial<Record<keyof Answers, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Answers;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setState("sending");
    try {
      await send({ data: parsed.data });
      setState("sent");
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setState("idle");
      setFailure(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again in a moment.",
      );
    }
  }

  /* --------------------------- sent state --------------------------- */
  if (state === "sent") {
    return (
      <div
        style={{ animation: `giftIn 660ms ${EASE} both` }}
        className="border border-line bg-raised p-8 sm:p-12"
      >
        <p className="chrome mb-4 text-brand">Enquiry received</p>
        <h2 className="display text-[clamp(26px,4vw,42px)] leading-[1.05]">
          Thanks{a.name ? `, ${a.name.split(" ")[0]}` : ""} — it's landed.
        </h2>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
          A real person reads every enquiry here. We'll come back to you
          <strong className="text-ink"> within one business day</strong>
          {a.phone ? " by email or on the number you left" : " by email"}.
        </p>

        <ul className="mt-8 grid gap-0 border-t border-line">
          {[
            ["01", "We read what you sent", "Your setup, your team and what's costing you time."],
            [
              "02",
              "We reply within a day",
              "With honest answers, and a look at Kairo running if you want one.",
            ],
            [
              "03",
              "Nothing happens until you say so",
              "No payment, no contract, no automated follow-up chain.",
            ],
          ].map(([n, t, b]) => (
            <li
              key={n}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 border-b border-line py-5"
            >
              <span className="chrome pt-1">[{n}]</span>
              <div>
                <p className="text-[15px] font-bold">{t}</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{b}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link to="/" className="btn-line mt-9 inline-flex">
          Back to the site
        </Link>
      </div>
    );
  }

  /* ----------------------------- steps ------------------------------ */
  return (
    <form onSubmit={submit} noValidate className="min-w-0">
      {/* progress rail — the same hairline as every rule on the site */}
      <div className="mb-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={"chrome " + (i === step ? "text-ink" : i < step ? "text-ink-2" : "")}
            >
              [{String(i + 1).padStart(2, "0")}] {s}
            </span>
          ))}
        </div>
        <div className="mt-3 h-px w-full bg-line">
          <div
            className="h-px bg-brand"
            style={{
              width: `${((step + 1) / STEPS.length) * 100}%`,
              transition: `width 660ms ${EASE}`,
            }}
          />
        </div>
      </div>

      <div className="border border-line bg-raised p-6 sm:p-9">
        {step === 0 && (
          <StepShell
            index="01"
            title="The business"
            blurb="Two taps and we already know how your Kairo should be set up. Nothing here is compulsory."
          >
            <Group legend="What kind of business is it?">
              {TYPES.map((t) => (
                <Chip
                  key={t}
                  selected={a.businessType === t}
                  onClick={() => set("businessType", t)}
                >
                  {t}
                </Chip>
              ))}
            </Group>

            <Group legend="How many people take bookings?">
              {TEAM.map((t) => (
                <Chip key={t} selected={a.teamSize === t} onClick={() => set("teamSize", t)}>
                  {t}
                </Chip>
              ))}
            </Group>

            <div>
              <label className={label} htmlFor="g-business">
                Business name{" "}
                <span className="normal-case tracking-normal text-ink-3">(optional)</span>
              </label>
              <input
                id="g-business"
                className={field}
                autoComplete="organization"
                placeholder="Luxe Hair Studio"
                value={a.business}
                onChange={(e) => set("business", e.target.value)}
              />
            </div>
          </StepShell>
        )}

        {step === 1 && (
          <StepShell
            index="02"
            title="How you book now"
            blurb="Most people we set up are moving off something — or off nothing at all. Both are easy; we import your client list either way."
          >
            <Group legend="Do you use booking software today?">
              {SOFTWARE.map((t) => (
                <Chip
                  key={t}
                  selected={a.currentSoftware === t}
                  onClick={() => set("currentSoftware", t)}
                >
                  {t}
                </Chip>
              ))}
            </Group>

            {a.currentSoftware === "Yes, we use software" && (
              <div style={{ animation: `giftIn 480ms ${EASE} both` }}>
                <label className={label} htmlFor="g-software">
                  Which one?
                </label>
                <input
                  id="g-software"
                  className={field}
                  placeholder="Whatever you use to take bookings today"
                  value={a.softwareName}
                  onChange={(e) => set("softwareName", e.target.value)}
                />
                <p className="mt-2 text-[13px] text-ink-3">
                  Useful to us: we'll tell you plainly what Kairo does differently, and what it
                  doesn't do.
                </p>
              </div>
            )}

            <Group
              legend="What does booking cost you at the moment?"
              hint="Subscription, commission, or nothing at all."
            >
              {SPEND.map((t) => (
                <Chip
                  key={t}
                  selected={a.monthlySpend === t}
                  onClick={() => set("monthlySpend", t)}
                >
                  {t}
                </Chip>
              ))}
            </Group>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell
            index="03"
            title="What it's costing"
            blurb="Pick anything that sounds like your week. These are the exact things Kairo's opportunities dashboard goes looking for."
          >
            <Group legend="What's costing you money or time?" hint="Choose as many as you like.">
              {PAIN.map((t) => (
                <Chip key={t} selected={a.frustration.includes(t)} onClick={() => togglePain(t)}>
                  {t}
                </Chip>
              ))}
            </Group>

            <Group legend="When would you want to be running on it?">
              {TIMELINE.map((t) => (
                <Chip key={t} selected={a.timeline === t} onClick={() => set("timeline", t)}>
                  {t}
                </Chip>
              ))}
            </Group>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell
            index="04"
            title="Where to reply"
            blurb="Last step. Email is how we reply — a number just means we can call if that's quicker for you."
          >
            <Group legend="What would you like from us?">
              {INTENT.map((t) => (
                <Chip key={t} selected={a.intent === t} onClick={() => set("intent", t)}>
                  {t}
                </Chip>
              ))}
            </Group>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="g-name">
                  Your name <span className="text-brand">*</span>
                </label>
                <input
                  id="g-name"
                  className={field}
                  autoComplete="name"
                  placeholder="Alex Nguyen"
                  aria-invalid={errors.name ? true : undefined}
                  value={a.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && <p className="mt-2 text-[13px] text-brand">{errors.name}</p>}
              </div>

              <div>
                <label className={label} htmlFor="g-email">
                  Email <span className="text-brand">*</span>
                </label>
                <input
                  id="g-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  className={field}
                  placeholder="you@yourbusiness.com"
                  value={a.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                {errors.email && <p className="mt-2 text-[13px] text-brand">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className={label} htmlFor="g-phone">
                  Phone <span className="normal-case tracking-normal text-ink-3">(optional)</span>
                </label>
                <input
                  id="g-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  className={field}
                  placeholder="04xx xxx xxx"
                  value={a.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={label} htmlFor="g-message">
                Anything you'd like to ask or add <span className="text-brand">*</span>
              </label>
              <textarea
                id="g-message"
                rows={4}
                className={field}
                placeholder="A question, or anything about the business we should know before we reply."
                aria-invalid={errors.message ? true : undefined}
                value={a.message}
                onChange={(e) => set("message", e.target.value)}
              />
              {errors.message && <p className="mt-2 text-[13px] text-brand">{errors.message}</p>}
            </div>

            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-px w-px opacity-0"
            />
          </StepShell>
        )}

        {/* controls */}
        <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-line pt-6">
          {step > 0 && (
            <button type="button" className="btn-line" onClick={() => go(step - 1)}>
              Back
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button type="button" className="btn-brand" onClick={() => go(step + 1)}>
              Continue
            </button>
          ) : (
            <button type="submit" className="btn-brand" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send my enquiry"}
            </button>
          )}

          <span className="chrome ml-auto">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {failure && (
          <p role="alert" className="mt-4 border-l-2 border-brand pl-3 text-[13.5px] text-ink-2">
            {failure}
          </p>
        )}
      </div>

      <p className="mt-5 text-[13px] leading-relaxed text-ink-3">
        We reply within one business day. No newsletter, no automated follow-up chain, and your
        details are never passed on.
      </p>
    </form>
  );
}
