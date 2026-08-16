import { BrowserFrame, PhoneFrame } from "./ui/DeviceFrame";
import { Reveal } from "./ui/Reveal";
import { STEPS, type Step } from "@/data/journey";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { shot } from "@/site.config";

/** The screenshot in its device chrome, sized for the pinned stage. */
function StepShot({ step, eager }: { step: Step; eager?: boolean }) {
  const img = (
    <img
      src={shot(step.shot)}
      alt={step.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="block w-full"
    />
  );

  return step.device === "phone" ? (
    <PhoneFrame className="mx-auto w-[54%] max-w-[260px]">
      {img}
    </PhoneFrame>
  ) : (
    <BrowserFrame url={step.url}>{img}</BrowserFrame>
  );
}

/** Title, line, body and capability chips for one step. */
function StepCopy({ step }: { step: Step }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[13px] font-bold tracking-[0.1em] text-accent-2">
          {step.n}
        </span>
        <span className="h-px flex-1 bg-edge-2" />
        <span className="eyebrow">{step.rail}</span>
      </div>

      <h3
        className="mt-6 text-[clamp(24px,3.2vw,38px)] font-extrabold leading-[1.1] tracking-[-0.03em]"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {step.title}
      </h3>

      <p className="mt-3 text-[15px] font-medium italic text-accent-2/90">
        {step.line}
      </p>

      <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-ink-2">
        {step.body}
      </p>

      <ul className="mt-7 flex flex-wrap gap-2">
        {step.chips.map((c) => (
          <li key={c} className="chip">
            <span className="h-1 w-1 rounded-full bg-accent-2" />
            {c}
          </li>
        ))}
      </ul>
    </>
  );
}

export function Journey() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const reduced = useReducedMotion();

  // Split the section's travel evenly between the steps. The last step
  // gets to hold the stage until the section releases.
  const raw = progress * STEPS.length;
  const active = Math.min(STEPS.length - 1, Math.max(0, Math.floor(raw)));

  return (
    <section id="journey" className="relative">
      {/* lead-in, so the pinned stage doesn't begin without warning */}
      <div className="shell pb-4 pt-24 sm:pb-8 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="eyebrow mb-4">// one day, eight steps //</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="h-section">
                A Thursday at Luxe Hair Studio, from the first coffee to the
                last invoice
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-2 sm:text-[17.5px]">
                Every frame below is the real system running, set on the same
                morning at 11:40 — four visits done, one in the chair, the
                afternoon filling up. Keep scrolling and the day plays out.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex items-center gap-3 text-ink-3">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em]">
                  Scroll
                </span>
                <span className="h-px w-16 bg-edge-2" />
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path
                    d="M12 5v14M6 13l6 6 6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </Reveal>
          </div>

          {/* index of what's coming */}
          <Reveal delay={140}>
            <div className="rounded-2xl border border-edge bg-panel/60 p-5 sm:p-6">
              <p className="eyebrow mb-4">What you're about to see</p>
              <ol className="space-y-2.5">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex items-baseline gap-3">
                    <span className="font-mono text-[10.5px] text-accent-2">
                      {s.n}
                    </span>
                    <span className="text-[14px] text-ink-2">{s.rail}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---------------------------------------------------------------
          Desktop: the pinned stage. The section is tall; the stage inside
          it is sticky, so the page scrolls while the stage stays put and
          swaps its contents.
      --------------------------------------------------------------- */}
      <div
        ref={ref}
        className="relative hidden lg:block"
        style={{ height: `${STEPS.length * 90 + 40}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="shell w-full">
            <div className="grid grid-cols-[auto_minmax(0,0.92fr)_minmax(0,1.3fr)] items-center gap-x-8 xl:gap-x-12">
              {/* numbered rail */}
              <div className="relative flex flex-col gap-5 pr-2">
                <div
                  aria-hidden="true"
                  className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-edge"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-[7px] top-1 w-px bg-accent-2 transition-[height] duration-200"
                  style={{ height: `${progress * 100}%` }}
                />
                {STEPS.map((s, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <div key={s.n} className="relative flex items-center gap-3">
                      <span
                        className="relative z-10 grid h-[15px] w-[15px] place-items-center
                                   rounded-full border transition-colors duration-300"
                        style={{
                          borderColor: on || done ? "#5ea3f0" : "#1b2433",
                          background: on ? "#5ea3f0" : "#05070c",
                        }}
                      >
                        {done && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-2" />
                        )}
                      </span>
                      <span
                        className="whitespace-nowrap font-mono text-[10.5px] uppercase
                                   tracking-[0.13em] transition-colors duration-300"
                        style={{ color: on ? "#e9edf4" : "#616f87" }}
                      >
                        {s.n} {s.rail}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* copy — all steps stacked, only the active one lit */}
              <div className="relative min-h-[420px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        reduced || i === active
                          ? "translateY(0)"
                          : `translateY(${i < active ? -22 : 22}px)`,
                      pointerEvents: i === active ? "auto" : "none",
                      transition: reduced
                        ? "none"
                        : "opacity 420ms ease, transform 560ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <StepCopy step={s} />
                  </div>
                ))}
              </div>

              {/* the stage */}
              <div className="relative h-[62vh] max-h-[600px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.n}
                    aria-hidden={i !== active}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform:
                        reduced || i === active
                          ? "translateY(0) scale(1)"
                          : `translateY(${i < active ? -18 : 18}px) scale(0.97)`,
                      pointerEvents: i === active ? "auto" : "none",
                      transition: reduced
                        ? "none"
                        : "opacity 480ms ease, transform 640ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div className="w-full">
                      <StepShot step={s} eager={i === 0} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------
          Mobile and tablet: the same eight beats, stacked. Pinning a
          stage on a short screen leaves no room for either half, so the
          journey unrolls normally instead.
      --------------------------------------------------------------- */}
      <div className="lg:hidden">
        <div className="shell space-y-24 py-20">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i === 0 ? 0 : 60}>
              <div>
                <StepCopy step={s} />
                <div className="mt-9">
                  <StepShot step={s} eager={i === 0} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
