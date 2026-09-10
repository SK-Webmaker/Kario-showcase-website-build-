/** Formats an ISO date as a plain Australian date, or nothing if absent. */
export function formatVerified(date: string | null | undefined): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });
}

export function PricingVerificationNotice({ date }: { date: string | null | undefined }) {
  const pretty = formatVerified(date);

  if (!pretty) {
    return (
      <p
        className="border border-dashed border-alert/60 bg-alert/10 px-4 py-3 font-mono
                   text-[11px] uppercase tracking-[0.1em] text-ink-2"
      >
        TODO: no pricing has been verified against vendor sites yet — this page stays unpublished
        until it has.
      </p>
    );
  }

  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
      Prices checked against vendor sites on {pretty}.
    </p>
  );
}
