import { createFileRoute, notFound } from "@tanstack/react-router";

import { NoMotionFallback } from "@/components/v2/NoMotionFallback";
import { V2Footer } from "@/components/v2/V2Footer";
import { V2Nav } from "@/components/v2/V2Nav";
import { Lens, MaskLines, Reveal } from "@/components/v2/motion";
import { Blocks } from "@/components/legal/LegalText";
import { LEGAL, findLegalDoc, headingId, type LegalDoc } from "@/data/legal";
import { jsonLdScript, pageGraph } from "@/data/schema";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const doc = findLegalDoc(params.slug);
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => {
    const doc = loaderData as LegalDoc | undefined;
    if (!doc) return {};
    const title = `${doc.title} — Kairo`;
    return {
      meta: [
        { title },
        { name: "description", content: doc.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: doc.summary },
      ],
      scripts: [
        jsonLdScript(
          pageGraph({
            path: `/legal/${doc.slug}`,
            name: doc.title,
            description: doc.summary,
            breadcrumb: [
              { name: "Kairo", path: "/" },
              { name: "Legal", path: "/legal" },
              { name: doc.title, path: `/legal/${doc.slug}` },
            ],
          }),
        ),
      ],
    };
  },
  component: LegalDocPage,
});

function LegalDocPage() {
  const doc = Route.useLoaderData();
  // The in-page rail is built from the document's own headings, so it can
  // never drift out of sync with the text.
  const headings = doc.blocks.filter((b) => b.kind === "h");
  const index = LEGAL.findIndex((d) => d.slug === doc.slug);
  const next = LEGAL[(index + 1) % LEGAL.length];

  return (
    <div className="v2 v2-grid min-h-screen">
      <NoMotionFallback />
      <Lens />
      <V2Nav variant="inner" />

      <main className="relative" style={{ paddingTop: "calc(9 * var(--u))" }}>
        <div
          className="mx-auto border-b border-white/10"
          style={{
            padding: "calc(3 * var(--u)) var(--pad) calc(3.6 * var(--u))",
            maxWidth: "calc(100 * var(--u))",
          }}
        >
          <Reveal play="now">
            <a
              href="/legal"
              className="v2-eyebrow v2-tap inline-block opacity-60 transition-opacity hover:opacity-100"
            >
              ← All policies
            </a>
          </Reveal>
          <h1
            className="v2-display v2-t2"
            style={{ marginTop: "calc(1.2 * var(--u))", maxWidth: "24ch" }}
          >
            <MaskLines play="now" delay={120} lines={[doc.title]} />
          </h1>
          <Reveal
            play="now"
            delay={400}
            opacity={0.75}
            className="v2-body max-w-[62ch]"
            style={{ marginTop: "calc(1.2 * var(--u))" }}
          >
            {doc.summary}
          </Reveal>
          <Reveal
            play="now"
            delay={560}
            opacity={0.45}
            className="v2-eyebrow"
            style={{ marginTop: "calc(1.6 * var(--u))" }}
          >
            Last updated {doc.updated}
          </Reveal>
        </div>

        <div
          className="mx-auto grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16"
          style={{ padding: "calc(3.6 * var(--u)) var(--pad)", maxWidth: "calc(100 * var(--u))" }}
        >
          {headings.length > 1 ? (
            <nav
              aria-label="On this page"
              className="lg:sticky lg:top-[calc(8*var(--u))] lg:self-start"
            >
              <p className="v2-eyebrow v2-accent border-b border-white/10 pb-2 font-semibold">
                On this page
              </p>
              <ul className="mt-3 space-y-1">
                {headings.map((h) => (
                  <li key={h.text}>
                    <a
                      href={`#${headingId(h.text)}`}
                      className="v2-body block py-2 opacity-60 transition-opacity hover:opacity-100"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : (
            <div aria-hidden="true" className="hidden lg:block" />
          )}

          <article>
            <Blocks blocks={doc.blocks} />

            <Reveal className="mt-16 border-t border-white/10 pt-6">
              <p className="v2-eyebrow v2-accent font-semibold">Next</p>
              <a
                href={`/legal/${next?.slug ?? "privacy"}`}
                className="v2-display v2-t4 v2-tap group mt-2 inline-block transition-opacity hover:opacity-70"
              >
                {next?.title ?? "Privacy Policy"}{" "}
                <span className="v2-accent inline-block transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Reveal>
          </article>
        </div>
      </main>

      <V2Footer />
    </div>
  );
}
