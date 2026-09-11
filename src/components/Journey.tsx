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
    <PhoneFrame className="mx-auto w-[54%] max-w-[260px]">{img}</PhoneFrame>
  ) : (
    <BrowserFrame url={step.url}>{img}</BrowserFrame>
  );
}

/** Title, line, body and capability chips for one step. */
function StepCopy({ step }: { step: Step }) {
  return (
    <>
      <div className="flex items-center gap-4 border-b border-line pb-3">
        <span className="chrome text-ink">[{step.n}]</span>
        <span className="chrome">{step.rail}</span>
      </div>

      <h3 className="mt-7 display text-[clamp(23px,2.6vw,42px)]">{step.title}</h3>

      <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink-3">
        {step.line}
      </p>

      <p className="mt-5 max-w-[52ch] text-[14.5px] leading-[1.6] text-ink-2">{step.body}</p>

      <ul className="mt-7 grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {step.chips.map((c) => (
          <li key={c} className="flex items-start gap-2.5 text-[13px] leading-snug text-ink-2">
            <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 bg-brand" />
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
  // The rail fills to the current step rather than tracking the scroll
  // exactly, so it moves in eight eased jumps instead of re-rendering
  // this component on every frame.
  const railFill = ((active + 1) / STEPS.length) * 100;

  return (
    <section id="journey" className="relative">
      {/* lead-in, so the pinned stage doesn't begin without warning */}
      <div className="shell border-t border-line pb-4 pt-20 sm:pb-8 sm:pt-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-4 border-b border-line pb-3">
                <span className="chrome text-ink">[05]</span>
                <span className="chrome">One day, eight steps</span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="display-lg">
                A Thursday at
                <br />
                Luxe Hair Studio
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="lede mt-6">
                From the first coffee to the last invoice. Every frame below is the real system
                running, set on the same morning at 11:40 — four visits done, one in the chair, the
                afternoon filling up. Keep scrolling and the day plays out.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex items-center gap-3">
                <span className="chrome">Scroll</span>
                <span className="h-px w-16 bg-line-2" />
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 animate-bounce text-ink-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Reveal>
          </div>

          {/* index of what's coming */}
          <Reveal delay={140}>
            <div className="border border-line bg-raised p-5 sm:p-6">
              <p className="chrome mb-5 border-b border-line pb-3">What you're about to see</p>
              <ol className="space-y-2.5">
                {STEPS.map((s) => (
                  <li key={s.n} className="flex items-baseline gap-3">
                    <span className="chrome text-ink">{s.n}</span>
                    <span className="text-[13.5px] text-ink-2">{s.rail}</span>
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
                  className="absolute left-0 top-1 h-[calc(100%-8px)] w-px bg-line"
                />
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-1 w-px bg-brand transition-[height] duration-[660ms] ease-66"
                  style={{ height: `${railFill}%` }}
                />
                {STEPS.map((s, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <div key={s.n} className="relative pl-5">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1.5 h-1.5 w-1.5 -translate-x-[3px] transition-colors duration-[660ms] ease-66"
                        style={{ background: on || done ? "#3b82f6" : "rgb(var(--ink) / 0.3)" }}
                      />
                      <span
                        className="chrome block whitespace-nowrap transition-colors duration-[660ms] ease-66"
                        style={{ color: on ? "rgb(var(--ink))" : undefined }}
                      >
                        {s.n} {s.rail}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* copy — all steps stacked, only the active one lit */}
              <div className="relative min-h-[520px]">
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
