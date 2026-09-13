/**
 * The offer ribbon.
 *
 * A single belt across the top of the page, moving continuously so it
 * reads as live rather than as a static banner somebody forgot to take
 * down. It runs above the nav and stays there, because an offer that
 * scrolls away has stopped being an offer by the time anybody reaches
 * the price.
 *
 * Two decisions worth keeping:
 *
 *  - The offer phrase is set in the accent and the value propositions
 *    are not, so the eye lands on the claim and then reads the reasons.
 *    Everything alternating in colour would just be noise moving.
 *  - There is no countdown and no "only N left". A deadline the site
 *    cannot honour is misleading conduct under the ACL, and a fake timer
 *    is the fastest way to make the rest of the page look untrue.
 *
 * The belt is duplicated once and translated by exactly -50%, which is
 * what makes the loop seamless — the second copy is in the first copy's
 * place at the moment the animation resets.
 */

const ITEMS: readonly { text: string; lead?: boolean }[] = [
  { text: "Limited time only offer", lead: true },
  { text: "No monthly fees" },
  { text: "No commission" },
  { text: "$410 once" },
  { text: "Setup done with you" },
  { text: "Your own booking link" },
  { text: "Your client list stays yours" },
];

export function Ticker() {
  // Two identical runs: the animation moves the track by half its width,
  // so the second run lands exactly where the first began.
  const run = [...ITEMS, ...ITEMS];

  return (
    <div className="v2-ticker" role="complementary" aria-label="Current offer">
      <div className="v2-ticker__track">
        {run.map((item, i) => (
          <span
            className="v2-ticker__item"
            key={i}
            // The duplicate run is decorative; a screen reader should hear
            // the list once, not twice.
            aria-hidden={i >= ITEMS.length ? "true" : undefined}
          >
            <span className={item.lead ? "v2-ticker__lead" : undefined}>{item.text}</span>
            <span className="v2-ticker__star" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
