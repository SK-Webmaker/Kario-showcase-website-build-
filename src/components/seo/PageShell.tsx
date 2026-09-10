import type { ReactNode } from "react";

import { NoMotionFallback } from "@/components/v2/NoMotionFallback";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2Nav } from "@/components/v2/V2Nav";
import { Lens, MaskLines, Reveal, Rule } from "@/components/v2/motion";
import { Watermark } from "@/components/v2/KairoMark";

import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Shared chrome for every marketing page.
 *
 * This is the one place the rest of the site joins the home page's visual
 * language: the same near-black ground and dashed grid, the same nav and
 * footer, the same lens. Restyling here rather than page by page is what
 * makes the site read as one journey instead of a landing page bolted to
 * a set of articles.
 */
export function PageShell({ crumbs, children }: { crumbs: readonly Crumb[]; children: ReactNode }) {
  return (
    <div className="v2 v2-grid min-h-screen">
      <NoMotionFallback />
      <Lens />
      <Watermark />
      <V2Nav variant="inner" />

      <main className="relative" style={{ paddingTop: "calc(9 * var(--u))" }}>
        <div
          className="mx-auto"
          style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
        >
          <Breadcrumbs crumbs={crumbs} />
        </div>
        {children}
      </main>

      <V2Footer />
    </div>
  );
}

/**
 * A content section. The title rises out of a mask and the body lifts
 * behind it, so scrolling one of these pages has the same cadence as
 * scrolling the home page.
 */
export function Section({
  id,
  title,
  kicker,
  children,
}: {
  id?: string;
  title?: string;
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="mx-auto"
      style={{ maxWidth: "calc(100 * var(--u))", paddingInline: "var(--pad)" }}
    >
      <Rule />
      <div style={{ paddingBlock: "calc(4.5 * var(--u))" }}>
        {kicker ? (
          <Reveal>
            <p className="v2-eyebrow v2-accent font-semibold">{kicker}</p>
          </Reveal>
        ) : null}
        {title ? (
          <h2
            className="v2-display v2-t2"
            style={{
              marginTop: kicker ? "calc(0.8 * var(--u))" : 0,
              maxWidth: "calc(58 * var(--u))",
            }}
          >
            <MaskLines lines={[title]} />
          </h2>
        ) : null}
        <Reveal delay={160} style={{ marginTop: "calc(1.6 * var(--u))" }}>
          <div className="space-y-4">{children}</div>
        </Reveal>
      </div>
    </section>
  );
}

/** Body copy at a readable measure. */
export function P({ children }: { children: ReactNode }) {
  return <p className="v2-body max-w-[68ch] opacity-70">{children}</p>;
}

/** A clearly marked gap. Any page carrying one of these stays noindex. */
export function Todo({ children }: { children: ReactNode }) {
  return (
    <p
      className="v2-eyebrow border border-dashed px-4 py-3"
      style={{ borderColor: "rgb(185 118 13 / 0.6)", background: "rgb(185 118 13 / 0.1)" }}
    >
      TODO: {children}
    </p>
  );
}
