import { createFileRoute } from "@tanstack/react-router";

import { NoMotionFallback } from "@/components/v2/NoMotionFallback";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2Nav } from "@/components/v2/V2Nav";
import { Lens, MaskLines, Reveal } from "@/components/v2/motion";
import { LEGAL } from "@/data/legal";
import { jsonLdScript, pageGraph } from "@/data/schema";

const TITLE = "Legal — Kairo";
const DESCRIPTION =
  "Kairo's privacy policy, customer terms, data processing addendum, messaging rules, security overview and the rest — in plain English.";

export const Route = createFileRoute("/legal/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    scripts: [
      jsonLdScript(
        pageGraph({
          path: "/legal",
          name: "Legal",
          description: DESCRIPTION,
          breadcrumb: [
            { name: "Kairo", path: "/" },
            { name: "Legal", path: "/legal" },
          ],
        }),
      ),
    ],
  }),
  component: LegalIndex,
});

function LegalIndex() {
  return (
    <div className="v2 v2-grid min-h-screen">
      <NoMotionFallback />
      <Lens />
      <V2Nav variant="inner" />

      <main className="relative" style={{ paddingTop: "calc(9 * var(--u))" }}>
        <div
          className="mx-auto border-b border-white/10"
          style={{ padding: "calc(4 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
        >
          <Reveal play="now">
            <p className="v2-eyebrow v2-accent font-semibold">Kairo · Legal</p>
          </Reveal>
          <h1 className="v2-display v2-t1" style={{ marginTop: "calc(1 * var(--u))" }}>
            <MaskLines play="now" delay={120} lines={["Everything", "in writing"]} />
          </h1>
          <Reveal
            play="now"
            delay={480}
            opacity={0.75}
            className="v2-body max-w-[62ch]"
            style={{ marginTop: "calc(1.8 * var(--u))" }}
          >
            Ten documents, written in plain English rather than boilerplate. If you only read one,
            make it the Privacy Policy — it explains the difference between your data and your
            clients' data, which is the part that matters most in software like this.
          </Reveal>
        </div>

        <div
          className="mx-auto"
          style={{ padding: "calc(4 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
        >
          <ul className="max-w-[900px] border-t border-white/10">
            {LEGAL.map((doc, i) => (
              <Reveal as="li" key={doc.slug} delay={Math.min(i, 8) * 55}>
                <a
                  href={`/legal/${doc.slug}`}
                  className="group grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5
                             gap-y-1 border-b border-white/10 transition-colors
                             duration-500 hover:bg-white/[0.04] sm:grid-cols-[auto_minmax(0,1fr)_auto]"
                  style={{ paddingBlock: "calc(1.3 * var(--u))" }}
                >
                  <span className="v2-eyebrow opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="v2-display v2-t4 block transition-transform duration-500 group-hover:translate-x-1">
                      {doc.title}
                    </span>
                    <span className="v2-body mt-1 block max-w-[60ch] opacity-60">
                      {doc.summary}
                    </span>
                  </span>
                  <span className="v2-eyebrow col-start-2 opacity-40 sm:col-start-3 sm:self-center">
                    {doc.updated}
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal
            as="p"
            opacity={0.55}
            className="v2-body max-w-[68ch]"
            style={{ marginTop: "calc(2.6 * var(--u))" }}
          >
            Questions about any of it? Get in touch — we'd rather answer before you sign up than
            after.
          </Reveal>
        </div>
      </main>

      <V2Footer />
    </div>
  );
}
