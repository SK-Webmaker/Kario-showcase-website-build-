import { LEGAL } from "@/data/legal";
import { Link } from "@tanstack/react-router";

import { site } from "@/site.config";
import { Eyebrow } from "./primitives";
import { Reveal } from "./motion";
import { KairoMark } from "./KairoMark";

/**
 * The footer, in the same language as the rest of the page.
 *
 * Not decoration: the legal column is how the privacy policy and terms
 * stay reachable from every page, which they have to be, and the demo-salon
 * line substantiates a marketing claim the screenshots would otherwise
 * make on their own. Both carried over from the previous footer verbatim.
 */
/* Rooted at "/", not bare hashes: the footer also renders on the inquiry
   page, where a bare #features points at nothing. */
const PRODUCT: readonly (readonly [string, string])[] = [
  ["/#features", "What you get"],
  ["/#pricing", "What it costs"],
  ["/#faq", "Questions"],
  ["/#pain", "Why change"],
];

export function V2Footer() {
  return (
    <footer
      className="relative border-t border-white/10"
      style={{ paddingBlock: "calc(6 * var(--u))" }}
    >
      <div
        className="mx-auto"
        style={{ padding: "0 var(--pad)", maxWidth: "calc(100 * var(--u))" }}
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,1fr)]">
          <Reveal>
            <p
              className="v2-display inline-flex items-center"
              style={{ fontSize: "calc(3.4 * var(--u))" }}
            >
              <KairoMark size="0.86em" style={{ marginRight: "0.26em" }} />
              {site.name}
            </p>
            <p
              className="v2-body max-w-[34ch] opacity-60"
              style={{ marginTop: "calc(1.2 * var(--u))" }}
            >
              {site.tagline}
            </p>
            <Link
              to="/get-in-touch"
              className="v2-btn"
              style={{ marginTop: "calc(2.4 * var(--u))" }}
            >
              Contact us
            </Link>
          </Reveal>

          <nav aria-label="The product">
            <Eyebrow>The product</Eyebrow>
            <ul style={{ marginTop: "calc(1.2 * var(--u))" }}>
              {PRODUCT.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="v2-body block border-b border-white/10 opacity-60 transition-opacity hover:opacity-100"
                    style={{ paddingBlock: "calc(0.9 * var(--u))" }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <Eyebrow>Legal</Eyebrow>
            <ul
              className="grid sm:grid-cols-2"
              style={{ marginTop: "calc(1.2 * var(--u))", columnGap: "calc(2 * var(--u))" }}
            >
              {LEGAL.map((d) => (
                <li key={d.slug}>
                  <a
                    href={`/legal/${d.slug}`}
                    className="v2-body block border-b border-white/10 opacity-60 transition-opacity hover:opacity-100"
                    style={{ paddingBlock: "calc(0.9 * var(--u))" }}
                  >
                    {d.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div
          className="flex flex-col gap-3 border-t border-white/10 sm:flex-row sm:items-center sm:justify-between"
          style={{ marginTop: "calc(4 * var(--u))", paddingTop: "calc(2 * var(--u))" }}
        >
          <p className="v2-eyebrow opacity-50">
            © {new Date().getFullYear()} {site.name}. For anyone who sells time.
          </p>
          <p className="v2-eyebrow opacity-50">
            Every screenshot shows a demo salon with invented clients.{" "}
            <a href="/legal" className="v2-tap underline underline-offset-2 hover:opacity-100">
              Legal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
