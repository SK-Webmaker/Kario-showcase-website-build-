import { useEffect, useRef, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Channel = "email" | "text" | "both" | "none";

const CHOICES: {
  id: Channel;
  label: string;
  detail: string;
}[] = [
  { id: "email", label: "Email them", detail: "chantelle.d@example.com" },
  { id: "text", label: "Text them", detail: "(555) 377-8810" },
  { id: "both", label: "Email and text them", detail: "Both of the above" },
  { id: "none", label: "Don't send anything", detail: "You'll tell them yourself" },
];

/** A rendered email, the way the client receives it. */
function EmailPreview() {
  return (
    <div className="overflow-hidden border border-line bg-raised">
      <div className="border-b border-line px-4 py-2.5">
        <p className="chrome">Email · to chantelle.d@example.com</p>
      </div>
      <div className="space-y-3 px-4 py-4">
        <p className="text-[14px] font-bold">Your appointment has moved</p>
        <p className="text-[13.5px] leading-relaxed text-ink-2">
          Hi Chantelle — your{" "}
          <span className="text-ink line-through decoration-alert/70">
            Thursday 20 Aug, 1:00 PM
          </span>{" "}
          appointment at Luxe Hair Studio has been moved to{" "}
          <span className="font-semibold text-money">Thursday 20 Aug, 1:30 PM</span>.
        </p>
        <p className="text-[13.5px] leading-relaxed text-ink-2">
          Braids — Full Head with Sha · 4 hours
        </p>
        <div className="border border-line bg-ground px-3 py-2">
          <p className="text-[12px] text-ink-3">
            Can't make the new time? Cancel here — the slot reopens straight away.
          </p>
        </div>
      </div>
    </div>
  );
}

/** The same change as an SMS. */
function TextPreview() {
  return (
    <div className="overflow-hidden border border-line bg-raised">
      <div className="border-b border-line px-4 py-2.5">
        <p className="chrome">SMS · to (555) 377-8810</p>
      </div>
      <div className="px-4 py-4">
        <div className="max-w-[85%] border border-line bg-ground px-3.5 py-2.5">
          <p className="text-[13.5px] leading-relaxed text-ink">
            Luxe Hair Studio: your appt has <b>moved</b> from Thu 20 Aug{" "}
            <span className="line-through decoration-alert/70">1:00 PM</span> to{" "}
            <b className="text-money">1:30 PM</b>. Braids — Full Head with Sha. Reply or call (03)
            9041 8820 if that doesn't suit.
          </p>
        </div>
      </div>
    </div>
  );
}

function NothingPreview() {
  return (
    <div className="border border-dashed border-line-2 bg-raised px-4 py-8 text-center">
      <p className="text-[14px] font-semibold">Nothing was sent.</p>
      <p className="mx-auto mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-ink-2">
        The booking moves and the calendar records that no message went out — so when you look at it
        tomorrow you'll know Chantelle still needs telling.
      </p>
    </div>
  );
}

/**
 * The undo demo.
 *
 * Cancelling holds the client's message back for two minutes and puts a
 * 15-second Undo in the confirmation. This runs at the real 15 seconds —
 * tap Undo and the booking returns exactly as it was, with the message
 * stopped before it sends.
 */
function UndoDemo() {
  type Phase = "idle" | "counting" | "restored" | "sent";
  const [phase, setPhase] = useState<Phase>("idle");
  const [left, setLeft] = useState(15);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "counting") return;

    timer.current = window.setInterval(() => {
      setLeft((n) => {
        if (n <= 1) {
          window.clearInterval(timer.current!);
          setPhase("sent");
          return 0;
        }
        return n - 1;
      });
    }, 1000);

    return () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    };
  }, [phase]);

  const start = () => {
    setLeft(15);
    setPhase("counting");
  };
  const undo = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    setPhase("restored");
  };
  const reset = () => {
    setLeft(15);
    setPhase("idle");
  };

  const cancelled = phase === "counting" || phase === "sent";

  return (
    <div className="border border-line bg-raised p-5 sm:p-6">
      <p className="chrome mb-4">Undo a cancellation</p>

      {/* the booking row */}
      <div
        className="flex items-center gap-3 border border-line bg-raised/70 px-4 py-3
                   transition-opacity duration-300"
        style={{ opacity: cancelled ? 0.45 : 1 }}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center bg-alert/20 font-mono text-[11px] font-bold text-alert">
          CD
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[14px] font-semibold ${
              cancelled ? "text-ink-2 line-through" : "text-ink"
            }`}
          >
            Chantelle Dube · 1:30 PM
          </p>
          <p className="truncate text-[12.5px] text-ink-3">Braids — Full Head · 4h · Sha</p>
        </div>
        <span
          className="shrink-0 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]"
          style={{
            borderColor: cancelled ? "rgba(185,118,13,.45)" : "rgba(15,157,99,.45)",
            color: cancelled ? "#b9760d" : "#0f9d63",
          }}
        >
          {cancelled ? "Cancelled" : "Confirmed"}
        </span>
      </div>

      {/* the confirmation strip */}
      <div className="mt-4 min-h-[92px]">
        {phase === "idle" && (
          <button onClick={start} className="btn-line w-full">
            Cancel this booking
          </button>
        )}

        {phase === "counting" && (
          <div className="flex items-center gap-4 border border-line-2 bg-ground px-4 py-3">
            <div className="relative h-9 w-9 shrink-0">
              <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="rgb(var(--ink) / 0.18)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15}
                  strokeDashoffset={2 * Math.PI * 15 * (1 - left / 15)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="absolute inset-0 grid place-items-center font-mono text-[11px] tabular text-ink-2">
                {left}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-ink">Cancelled. Slot reopened.</p>
              <p className="text-[12.5px] text-ink-3">
                Chantelle's message is held for two minutes.
              </p>
            </div>
            <button
              onClick={undo}
              className="shrink-0 bg-brand px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white
                         transition-colors hover:bg-brand-deep"
            >
              Undo
            </button>
          </div>
        )}

        {phase === "restored" && (
          <div className="border border-money/40 bg-money/[0.08] px-4 py-3">
            <p className="text-[13.5px] font-semibold text-money">Put back exactly as it was.</p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
              The message was stopped before it sent — Chantelle never knew. Had someone else taken
              the freed slot in the meantime, Kairo would have refused the undo rather than
              double-book you.
            </p>
            <button
              onClick={reset}
              className="mt-3 text-[12.5px] text-ink-3 underline hover:text-ink"
            >
              Run it again
            </button>
          </div>
        )}

        {phase === "sent" && (
          <div className="border border-alert/40 bg-alert/[0.08] px-4 py-3">
            <p className="text-[13.5px] font-semibold text-alert">
              Too late — the message went out.
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">
              And Kairo says so plainly, instead of pretending it can be taken back. Now you know to
              make a phone call.
            </p>
            <button
              onClick={reset}
              className="mt-3 text-[12.5px] text-ink-3 underline hover:text-ink"
            >
              Run it again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SignatureMoment() {
  const [choice, setChoice] = useState<Channel>("email");
  const reduced = useReducedMotion();

  return (
    <section
      id="signature"
      className="relative overflow-hidden border-t border-line py-20 sm:py-28"
    >
      <div className="shell relative">
        <SectionHeading
          index="06"
          eyebrow="The moment that matters"
          lines={["Plans change.", "That's when most", "booking systems lose", "you the customer."]}
          lede="Every booking and every move stops to ask one question — who to tell, and how. Only the channels that client can actually receive are offered. Try it."
          className="max-w-4xl"
        />

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          {/* the prompt */}
          <Reveal>
            <div className="border border-line bg-raised p-5 sm:p-6">
              <p className="text-[15px] font-bold text-ink">Moving this appointment</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                <b className="text-ink">Chantelle Dube</b> moves from{" "}
                <span className="whitespace-nowrap">Thu, Aug 20 at 1:00 PM</span> to{" "}
                <span className="whitespace-nowrap">Thu, Aug 20 at 1:30 PM</span>.
              </p>

              <div className="mt-5 space-y-2.5" role="radiogroup" aria-label="Who to tell">
                {CHOICES.map((c) => {
                  const on = choice === c.id;
                  return (
                    <button
                      key={c.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setChoice(c.id)}
                      className="flex w-full items-center gap-3 border px-4 py-3 text-left
                                 transition-all duration-200"
                      style={{
                        borderColor: on ? "#3b82f6" : "rgb(var(--ink) / 0.14)",
                        background: on ? "rgba(59,130,246,0.12)" : "transparent",
                      }}
                    >
                      <span
                        className="grid h-[18px] w-[18px] shrink-0 place-items-center border-2 transition-colors"
                        style={{ borderColor: on ? "#3b82f6" : "rgb(var(--ink) / 0.3)" }}
                      >
                        {on && <span className="h-2 w-2 bg-brand-deep" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold">{c.label}</span>
                        <span className="block truncate text-[12.5px] text-ink-3">{c.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-5 text-[12.5px] leading-relaxed text-ink-3">
                A client with no mobile number never sees “Text them”. Kairo only offers what it can
                actually deliver.
              </p>
            </div>

            {/* the second half of the same promise */}
            <div className="mt-6">
              <UndoDemo />
            </div>
          </Reveal>

          {/* what the client gets */}
          <Reveal delay={90}>
            <div>
              <p className="chrome mb-3">What Chantelle receives</p>
              <div
                key={choice}
                className="space-y-3"
                style={{
                  animation: reduced ? "none" : "fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both",
                }}
              >
                {(choice === "email" || choice === "both") && <EmailPreview />}
                {(choice === "text" || choice === "both") && <TextPreview />}
                {choice === "none" && <NothingPreview />}
              </div>

              <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-3">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v5" strokeLinecap="round" />
                  <path d="M12 16h.01" strokeLinecap="round" />
                </svg>
                <span>
                  Notice the message leads with the <b className="text-ink-2">old</b> time. A client
                  skimming their phone sees a change — not a second confirmation they'll scroll
                  past.
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
