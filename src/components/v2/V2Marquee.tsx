/**
 * The banner strips. The reference runs three, each a continuous
 * horizontal scroll of short claims separated by a star glyph, with
 * alternating direction so the block reads as motion rather than as one
 * belt. Pure CSS transform — no scroll listener, no cost.
 */
const STRIPS: readonly { items: readonly string[]; reverse: boolean }[] = [
  { items: ["No commission", "No monthly fee", "$410 once", "Your own link"], reverse: false },
  { items: ["Your client list stays yours", "Its own database", "No marketplace"], reverse: true },
  {
    items: ["Reminders that send themselves", "Paid in one tap", "Nothing sends silently"],
    reverse: false,
  },
];

function Strip({ items, reverse }: { items: readonly string[]; reverse: boolean }) {
  const run = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden" style={{ paddingBlock: "calc(0.9 * var(--u))" }}>
      <div
        className="flex w-max items-center"
        style={{
          gap: "calc(2.2 * var(--u))",
          animation: `marquee ${reverse ? "38s" : "46s"} linear infinite${reverse ? " reverse" : ""}`,
        }}
      >
        {run.map((t, i) => (
          <span key={i} className="flex items-center" style={{ gap: "calc(2.2 * var(--u))" }}>
            <span
              className="v2-display whitespace-nowrap"
              style={{ fontSize: "calc(2.4 * var(--u))" }}
            >
              {t}
            </span>
            <span
              className="v2-accent"
              style={{ fontSize: "calc(1.6 * var(--u))" }}
              aria-hidden="true"
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function V2Marquee() {
  return (
    <section
      id="promises"
      aria-label="What Kairo does not charge for"
      className="relative border-y border-white/10"
      style={{ paddingBlock: "calc(2 * var(--u))" }}
    >
      {STRIPS.map((s, i) => (
        <Strip key={i} items={s.items} reverse={s.reverse} />
      ))}
    </section>
  );
}
