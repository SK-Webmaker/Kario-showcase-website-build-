import { Link } from "@tanstack/react-router";

import { useProgressBar } from "@/hooks/useScrollProgress";
import { KairoMark } from "./KairoMark";

import { site } from "@/site.config";

/**
 * Fixed nav. The reference's never changes on scroll — no shrink, no
 * background, no shadow — which is unusual and worth keeping: with a
 * page this loud, a nav that also moves is one thing too many.
 *
 * On the inquiry page the right-hand action would otherwise point at the
 * page you are already on, so it becomes the way back instead.
 */
export function V2Nav({ variant = "home" }: { variant?: "home" | "inner" | "inquiry" }) {
  // Everywhere except the enquiry page itself, the action is the enquiry.
  const home = variant !== "inquiry";
  // How far through the page you are. Written straight to the node inside
  // a rAF: this changes every frame, and re-rendering the nav sixty times
  // a second to set one transform would be pure waste.
  const read = useProgressBar<HTMLDivElement>();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[1000]">
      {/* A scrim, because the nav passes over the features section — a
          full-bleed colour block — where white type on its own washed out.
          Fades to nothing so it never reads as a bar. */}
      <div
        aria-hidden="true"
        className="v2-navscrim absolute inset-x-0 top-0"
        style={{
          height: "calc(11 * var(--u))",
          background:
            "linear-gradient(to bottom, rgb(5 7 12 / 0.97) 0%, rgb(5 7 12 / 0.92) 48%, rgb(5 7 12 / 0.55) 74%, rgb(5 7 12 / 0) 100%)",
        }}
      />
      {/* Reading progress. One hairline, at the foot of the bar. */}
      <div ref={read} aria-hidden="true" className="v2-read" style={{ transform: "scaleX(0)" }} />
      <div
        className="pointer-events-auto relative mx-auto flex items-center justify-between"
        style={{ padding: "calc(2.2 * var(--u)) var(--pad)" }}
      >
        <Link
          to="/"
          aria-label={`${site.name} — home`}
          className="v2-display group/mark inline-flex items-center"
          style={{ fontSize: "calc(2.2 * var(--u))" }}
        >
          <KairoMark
            size="0.86em"
            className="transition-transform duration-500 group-hover/mark:rotate-[-8deg]"
            style={{ marginRight: "0.26em" }}
          />
          {site.name}
        </Link>
        {home ? (
          <Link to="/get-in-touch" className="v2-btn ring-1 ring-black/25">
            Contact us
          </Link>
        ) : (
          <Link
            to="/"
            className="v2-eyebrow v2-tap font-semibold opacity-70 transition-opacity hover:opacity-100"
          >
            ← Back to the site
          </Link>
        )}
      </div>
    </header>
  );
}
