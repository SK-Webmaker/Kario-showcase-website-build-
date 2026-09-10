import type { CSSProperties } from "react";

import { GALLERY } from "@/data/gallery";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Eyebrow } from "./primitives";
import { Plate, Reveal } from "./motion";

/**
 * Five product screens on a pinned stage.
 *
 * The centrepiece of the reference, and the section worth getting right:
 * a full-bleed gradient, a dark card floating on it, a huge index number,
 * copy on the left, the product on the right, and a progress bar along the
 * foot so the visitor knows how many remain.
 *
 * The reference fills its right-hand side with Lottie animations. Kairo
 * has something better available — actual screenshots of the running
 * system — so those go in instead.
 */
const PICKS = ["calendar", "client", "pos", "messages", "booking"] as const;

/* The gallery's own captions are deliberately terse; at this size each
   card needs a line that carries the whole idea on its own. */
const HEADINGS = [
  "The diary that cannot double-book",
  "Everything you know about them, on one card",
  "From the chair to the bank",
  "Nothing sends silently",
  "Your own link, your name at the top",
];

/* The reference sets two columns of short declaratives under the body
   copy. They stop the lower half of the card reading as empty and they
   carry the detail the heading cannot. */
const POINTS: readonly (readonly string[])[] = [
  [
    "A column per person.",
    "Blocks the real length of the job.",
    "Drag to reschedule.",
    "Two people booking at once still cannot clash.",
  ],
  [
    "Every visit and invoice.",
    "Notes that follow the client.",
    "Allergies and patch tests on the appointment.",
    "Lifetime spend, at a glance.",
  ],
  [
    "Bill from the chair.",
    "Service and retail on one sale.",
    "Card payments through Stripe.",
    "Receipts sent automatically.",
  ],
  [
    "Confirmations, reminders, receipts.",
    "Email or text.",
    "Every message logged with its delivery status.",
    "Marketing separate from transactional.",
  ],
  [
    "Your name at the top, not a marketplace.",
    "Only the times you can actually take.",
    "Re-checked at the moment of confirming.",
    "Never goes stale.",
  ],
];

const CARDS = PICKS.map((key, i) => {
  const shot = GALLERY.find((g) => g.src.includes(`/${key}.jpg`));
  return {
    n: String(i + 1).padStart(2, "0"),
    label: shot?.label ?? key,
    heading: HEADINGS[i] ?? "",
    body: shot?.note ?? "",
    src: shot?.src ?? "",
    alt: shot?.alt ?? "",
    points: POINTS[i] ?? [],
  };
});

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * One element's entry on the live card. `i` is which beat it lands on;
 * the whole run is a little over half a second, which is about how long
 * a card holds before the next one starts arriving.
 */
function beat(on: boolean, i: number, settled = 1): CSSProperties {
  return {
    opacity: on ? settled : 0,
    transform: on ? "translateY(0)" : "translateY(calc(1.4 * var(--u)))",
    transition: `opacity 620ms ease ${i * 70}ms, transform 820ms cubic-bezier(0.16,1,0.3,1) ${i * 70}ms`,
  };
}

export function V2Features() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const span = 1 / CARDS.length;
  const active = Math.min(CARDS.length - 1, Math.floor(progress / span));

  return (
    <section id="features" className="relative">
      {/* the one flat colour block on the page; the card floats on it */}
      {/* Desktop: the pinned stage. A 100vh card cannot hold a heading,
          body, four points and a screenshot on a 390px screen, so below
          lg the same five cards stack and scroll instead — see below. */}
      <div ref={ref} className="hidden lg:block" style={{ height: `${CARDS.length * 100}vh` }}>
        <div
          className="sticky top-0 h-screen overflow-hidden"
          style={{ background: "var(--v2-panel)" }}
        >
          <div
            className="flex h-full items-center justify-center"
            style={{ padding: "calc(4 * var(--u))" }}
          >
            <div
              className="relative h-full w-full overflow-hidden"
              style={{ background: "var(--v2-ground)", borderRadius: "calc(1.7 * var(--u))" }}
            >
              {CARDS.map((c, i) => {
                const local = (progress - i * span) / span;
                const on = i === active;
                // Cards cross-fade and lift; only the live one takes pointer.
                const opacity = on ? clamp01(1 - Math.abs(local - 0.5) * 1.9) || 1 : 0;
                return (
                  <article
                    key={c.n}
                    aria-hidden={!on}
                    className="absolute inset-0 grid items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                    style={{
                      padding: "calc(4 * var(--u)) calc(4.4 * var(--u)) calc(6 * var(--u))",
                      opacity: on ? 1 : 0,
                      transition: "opacity 460ms ease",
                      pointerEvents: on ? "auto" : "none",
                    }}
                  >
                    {/* Each element of the live card arrives on its own
                        beat rather than the whole slab moving at once —
                        the difference between a slide change and a cut to
                        a new shot. Everything is a function of `on`, so a
                        card replays every time it takes the stage. */}
                    <div>
                      <span className="v2-display v2-num v2-accent block" style={beat(on, 0)}>
                        {c.n}
                      </span>
                      <div style={beat(on, 1)}>
                        <Eyebrow className="mt-2">{c.label}</Eyebrow>
                      </div>
                      <h3
                        className="v2-display"
                        style={{
                          fontSize: "calc(4 * var(--u))",
                          lineHeight: 0.94,
                          marginTop: "calc(1 * var(--u))",
                          ...beat(on, 2),
                        }}
                      >
                        {c.heading}
                      </h3>
                      <p
                        className="v2-body max-w-[40ch]"
                        style={{ marginTop: "calc(1.6 * var(--u))", ...beat(on, 3, 0.7) }}
                      >
                        {c.body}
                      </p>
                      <ul
                        className="grid grid-cols-2"
                        style={{
                          marginTop: "calc(2.6 * var(--u))",
                          gap: "calc(1 * var(--u)) calc(2 * var(--u))",
                        }}
                      >
                        {c.points.map((pt, j) => (
                          <li
                            key={pt}
                            className="v2-body flex gap-3"
                            style={beat(on, 4 + j * 0.5, 0.6)}
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.55em] h-[0.35em] w-[0.35em] shrink-0 rounded-full"
                              style={{ background: "var(--v2-a)" }}
                            />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative overflow-hidden">
                      {/* The screen opens from a slit and settles out of
                          an overscale as its card takes the stage. */}
                      <img
                        src={c.src}
                        alt={c.alt}
                        width={1600}
                        height={1000}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        className="block h-auto w-full border border-white/10"
                        style={{
                          borderRadius: "calc(0.9 * var(--u))",
                          clipPath: on ? "inset(0 0 0 0)" : "inset(12% 0 12% 0)",
                          transform: on ? "scale(1)" : "scale(1.07)",
                          transition:
                            "clip-path 1000ms cubic-bezier(0.16,1,0.3,1) 120ms, transform 1300ms cubic-bezier(0.16,1,0.3,1) 120ms",
                        }}
                      />
                    </div>
                  </article>
                );
              })}

              {/* progress along the foot */}
              <div
                className="absolute inset-x-0 overflow-hidden bg-white/10"
                style={{
                  bottom: "calc(2.4 * var(--u))",
                  marginInline: "calc(4.4 * var(--u))",
                  height: "calc(0.5 * var(--u))",
                  borderRadius: "999px",
                }}
              >
                <div
                  className="h-full origin-left"
                  style={{
                    background: "var(--v2-a)",
                    transform: `scaleX(${clamp01(progress)})`,
                    transition: "transform 220ms linear",
                    borderRadius: "999px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and tablet: the same five cards, unrolled. */}
      <div
        className="lg:hidden"
        style={{
          background: "var(--v2-panel)",
          padding: "calc(2 * var(--u)) calc(1.5 * var(--u))",
        }}
      >
        <ul className="flex flex-col" style={{ gap: "calc(1.5 * var(--u))" }}>
          {CARDS.map((c, i) => (
            <Reveal
              as="li"
              key={c.n}
              className="overflow-hidden"
              style={{
                background: "var(--v2-ground)",
                borderRadius: "calc(1.4 * var(--u))",
                padding: "calc(2 * var(--u))",
              }}
            >
              <span className="v2-display v2-num v2-accent block">{c.n}</span>
              <Eyebrow className="mt-1">{c.label}</Eyebrow>
              <h3
                className="v2-display"
                style={{
                  fontSize: "calc(2.1 * var(--u))",
                  lineHeight: 0.96,
                  marginTop: "calc(0.6 * var(--u))",
                }}
              >
                {c.heading}
              </h3>
              <p className="v2-body opacity-70" style={{ marginTop: "calc(0.9 * var(--u))" }}>
                {c.body}
              </p>
              <div className="mt-5">
                <Plate
                  src={c.src}
                  alt={c.alt}
                  eager={i === 0}
                  className="border border-white/10"
                  style={{ borderRadius: "calc(0.6 * var(--u))" }}
                />
              </div>
              <ul style={{ marginTop: "calc(1.2 * var(--u))" }}>
                {c.points.map((pt) => (
                  <li
                    key={pt}
                    className="v2-body flex gap-3 opacity-60"
                    style={{ paddingBlock: "calc(0.35 * var(--u))" }}
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] h-[0.32em] w-[0.32em] shrink-0 rounded-full"
                      style={{ background: "var(--v2-a)" }}
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
