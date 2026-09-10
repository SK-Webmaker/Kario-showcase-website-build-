import type { ReactNode } from "react";
import { Orbs } from "@/components/v2/primitives";
import { MaskLines, Plate, Reveal, Torch } from "@/components/v2/motion";

const ORBS = [
  { x: "10%", y: "24%", size: "40vw", tone: "a" as const },
  { x: "92%", y: "78%", size: "28vw", tone: "b" as const },
];

/**
 * The opening of every inner page.
 *
 * The headline arrives as a masked rise rather than a fade, and because
 * it plays on load rather than on scroll the page has already started
 * moving by the time the first screen settles — the same entrance the
 * home page makes, at a smaller scale.
 *
 * The headline is broken to its own lines on the way in: a mask holding a
 * line that wraps reveals both halves at once, which is not the effect.
 */
export function PageHero({
  kicker,
  headline,
  subhead,
  ctaLabel = "Contact us",
  ctaHref = "/get-in-touch",
  secondary,
  screenshot,
}: {
  kicker?: string;
  headline: string;
  subhead: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  secondary?: { label: string; href: string };
  screenshot?: { src: string; alt: string } | null;
}) {
  return (
    <section
      className="relative mx-auto overflow-hidden"
      style={{
        padding: "calc(3 * var(--u)) var(--pad) calc(5 * var(--u))",
        maxWidth: "calc(100 * var(--u))",
      }}
    >
      <Orbs spec={ORBS} parallax={0.09} />
      <Torch />

      <div className="relative z-10">
        {kicker ? (
          <Reveal play="now">
            <p className="v2-eyebrow v2-accent font-semibold">{kicker}</p>
          </Reveal>
        ) : null}

        <h1
          className="v2-display v2-t1"
          style={{
            marginTop: kicker ? "calc(1 * var(--u))" : 0,
            maxWidth: "calc(74 * var(--u))",
          }}
        >
          <MaskLines play="now" delay={120} step={110} lines={breakHeadline(headline)} />
        </h1>

        <Reveal
          play="now"
          delay={520}
          opacity={0.75}
          className="v2-body max-w-[62ch]"
          style={{ marginTop: "calc(1.8 * var(--u))" }}
        >
          {subhead}
        </Reveal>

        <Reveal
          play="now"
          delay={680}
          className="flex flex-wrap gap-3"
          style={{ marginTop: "calc(2.4 * var(--u))" }}
        >
          <a href={ctaHref} className="v2-btn">
            {ctaLabel}
          </a>
          {secondary ? (
            <a
              href={secondary.href}
              className="v2-btn"
              style={{
                background: "transparent",
                color: "var(--v2-ink)",
                boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.18)",
              }}
            >
              {secondary.label}
            </a>
          ) : null}
        </Reveal>

        {screenshot ? (
          <figure
            className="overflow-hidden border border-white/10"
            style={{ marginTop: "calc(3.4 * var(--u))", borderRadius: "calc(1.2 * var(--u))" }}
          >
            <Plate src={screenshot.src} alt={screenshot.alt} eager />
          </figure>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Splits a headline into lines of roughly even length, at word
 * boundaries, so each one gets its own mask. Three lines at most: past
 * that the stagger stops reading as one sentence arriving.
 */
function breakHeadline(text: string): string[] {
  const words = text.split(" ");
  if (words.length <= 3) return [text];
  const target = Math.ceil(text.length / (text.length > 46 ? 3 : 2));
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (line && next.length > target && lines.length < 2) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}
