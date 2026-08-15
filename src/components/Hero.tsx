import { useEffect, useState } from "react";
import { BrowserFrame } from "./ui/DeviceFrame";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { mailtoHref, shot } from "@/site.config";

/**
 * The rotating line under the headline. ChainGPT cycles AI prompts here;
 * the salon equivalent is the things Kairo actually did today — each one
 * a real capability stated as an event, so the hook is the product
 * working rather than a slogan.
 */
const MOMENTS = [
  { time: "9:02", tone: "money", text: "Naomi's cut & finish — paid, receipt sent" },
  { time: "9:47", tone: "accent", text: "New booking online — Balayage, Thursday 2pm" },
  { time: "10:15", tone: "amber", text: "Grace moved to 1:30 — she's been emailed" },
  { time: "11:00", tone: "accent", text: "With you now — Tanya, root colour + blow dry" },
  { time: "11:20", tone: "money", text: "Reminder sent to 6 clients for tomorrow" },
  { time: "11:38", tone: "amber", text: "Cancellation undone — slot was still free" },
] as const;

const TONE: Record<string, string> = {
  money: "bg-money",
  accent: "bg-accent-2",
  amber: "bg-amber",
};

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const { ref, progress } = useScrollProgress<HTMLDivElement>();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MOMENTS.length);
    }, 2900);
    return () => clearInterval(id);
  }, [reduced]);

  // The dashboard starts laid back and slightly small, then stands up and
  // settles as the visitor scrolls the first screen — the "arrival" beat.
  const settle = Math.min(1, progress * 2.1);
  const rotateX = reduced ? 0 : 15 * (1 - settle);
  const scale = reduced ? 1 : 0.9 + 0.1 * settle;

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[190vh] grid-lines"
    >
      {/* soft vignette so the grid never reaches the page edges hard */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0
                   bg-[radial-gradient(120%_70%_at_50%_0%,transparent_35%,#05070c_92%)]"
      />

      <div className="sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-10">
        <div className="shell relative">
          {/* status pill */}
          <div className="flex justify-center">
            <a
              href="#journey"
              className="group inline-flex items-center gap-2.5 rounded-full border
                         border-edge-2 bg-panel-2/70 py-1.5 pl-2 pr-4 text-[12.5px]
                         text-ink-2 backdrop-blur transition-colors
                         hover:border-accent/60 hover:text-ink"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <span className="absolute h-2 w-2 rounded-full bg-money animate-pulse-ring" />
                <span className="h-2 w-2 rounded-full bg-money" />
              </span>
              Running a real salon's day, live, since day one
              <span className="text-ink-3 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>

          <h1
            className="mx-auto mt-6 max-w-[20ch] text-center text-[clamp(33px,5.5vw,62px)]
                       font-extrabold leading-[1.0] tracking-[-0.04em]"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            The diary that{" "}
            <span className="text-accent-2 text-glow">answers the phone</span>,
            chases the money, and never double-books.
          </h1>

          <p className="mx-auto mt-5 max-w-[60ch] text-center text-[15px] leading-relaxed text-ink-2 sm:text-[17px]">
            Kairo is the software a salon runs its whole day on. Bookings, the
            calendar, the client book, payments, stock and every message that
            goes to a customer — one system, one login, no add-ons.
          </p>

          {/* the live moment ticker */}
          <div className="mt-7 flex justify-center px-2">
            <div
              className="relative h-11 w-full max-w-xl overflow-hidden rounded-xl
                         border border-edge bg-panel/70 backdrop-blur"
            >
              {MOMENTS.map((m, i) => (
                <div
                  key={m.time}
                  aria-hidden={i !== index}
                  className="absolute inset-0 flex items-center gap-3 px-4"
                  style={{
                    opacity: i === index ? 1 : 0,
                    transform: `translateY(${(i - index) * 100}%)`,
                    transition: reduced
                      ? "none"
                      : "opacity 500ms ease, transform 620ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE[m.tone]}`} />
                  <span className="shrink-0 font-mono text-[11px] tabular text-ink-3">
                    {m.time}
                  </span>
                  <span className="truncate text-[13.5px] text-ink-2">{m.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
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
              Walk through a day
            </a>
          </div>

          {/* the dashboard, standing up as you scroll */}
          <div
            className="mx-auto mt-11 max-w-4xl px-1 sm:mt-12"
            style={{ perspective: "1600px" }}
          >
            <div
              className="origin-top will-change-transform"
              style={{
                transform: `rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)})`,
              }}
            >
              <BrowserFrame url="luxehairstudio.kairo.app">
                <img
                  src={shot("01-dashboard.jpg")}
                  alt="The Kairo dashboard: twelve appointments today, four done, takings against expected, and who is in the chair right now."
                  width={1600}
                  height={1000}
                  loading="eager"
                  fetchPriority="high"
                  className="block w-full"
                />
              </BrowserFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
