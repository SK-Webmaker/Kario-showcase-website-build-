import { MaskLines, Reveal } from "@/components/v2/motion";

/** The close on every inner page, in the same language as the home page's. */
export function CtaBanner({
  heading = "Tell us about your business — we set your Kairo up",
  body = "One conversation, then we build the diary, the services, the team and the booking link for you. $410 once, $0 per month, no commission on anything you charge.",
  ctaLabel = "Contact us",
  ctaHref = "/get-in-touch",
}: {
  heading?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <section
      className="mx-auto"
      style={{ padding: "calc(5 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
    >
      <div
        className="flex flex-col gap-6 border border-white/10 bg-white/[0.03] backdrop-blur-sm lg:flex-row lg:items-center lg:justify-between"
        style={{ borderRadius: "calc(1.4 * var(--u))", padding: "calc(3 * var(--u))" }}
      >
        <div>
          <h2 className="v2-display v2-t2" style={{ maxWidth: "calc(44 * var(--u))" }}>
            <MaskLines lines={[heading]} />
          </h2>
          <Reveal
            as="p"
            delay={180}
            opacity={0.7}
            className="v2-body max-w-[60ch]"
            style={{ marginTop: "calc(1.2 * var(--u))" }}
          >
            {body}
          </Reveal>
        </div>
        <Reveal delay={300} className="shrink-0">
          <a href={ctaHref} className="v2-btn">
            {ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
