import { createFileRoute } from "@tanstack/react-router";

import { GetInTouchFlow } from "@/components/GetInTouchFlow";
import { V2Nav } from "@/components/v2/V2Nav";
import { V2Footer } from "@/components/v2/V2Footer";
import { Lens, MaskLines, Reveal } from "@/components/v2/motion";
import { NoMotionFallback } from "@/components/v2/NoMotionFallback";
import { Eyebrow, Orbs } from "@/components/v2/primitives";
import { jsonLdScript, pageGraph } from "@/data/schema";
import { ORIGIN } from "@/site.config";

const TITLE = "Contact us — Kairo | Booking, payments & client management software";
const DESCRIPTION =
  "Tell us how your business books today and we'll reply within one business day. $400 once, no commission and no monthly fee.";

export const Route = createFileRoute("/get-in-touch")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${ORIGIN}/get-in-touch` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/get-in-touch` }],
    scripts: [
      jsonLdScript(
        pageGraph({
          path: "/get-in-touch",
          name: TITLE,
          description: DESCRIPTION,
          breadcrumb: [
            { name: "Kairo", path: "/" },
            { name: "Contact us", path: "/get-in-touch" },
          ],
        }),
      ),
    ],
  }),
  component: GetInTouchPage,
});

/**
 * What the visitor gets for filling this in. Deliberately three: any more
 * and the column starts competing with the form for attention, which is
 * the only thing on this page that matters.
 */
const ASSURANCE: readonly (readonly [string, string])[] = [
  ["A reply within one business day", "From a person who has read it, not an autoresponder."],
  ["$400 once, then nothing", "No subscription, no per-booking fee, no commission."],
  ["Nothing is charged here", "This is a conversation, not a checkout."],
];

const ORBS = [
  { x: "6%", y: "28%", size: "42vw", tone: "a" as const },
  { x: "94%", y: "82%", size: "30vw", tone: "b" as const },
];

function GetInTouchPage() {
  return (
    <div className="v2 v2-grid min-h-screen">
      <NoMotionFallback />
      <Lens />
      <V2Nav variant="inquiry" />

      <main className="relative overflow-hidden">
        <Orbs spec={ORBS} parallax={0.08} />

        <div
          className="relative z-10 mx-auto"
          style={{
            padding: "calc(11 * var(--u)) var(--pad) calc(7 * var(--u))",
            maxWidth: "calc(100 * var(--u))",
          }}
        >
          <Reveal>
            <Eyebrow>Get in touch</Eyebrow>
          </Reveal>
          <h1
            className="v2-display v2-h2"
            style={{ marginTop: "calc(1.2 * var(--u))", maxWidth: "calc(70 * var(--u))" }}
          >
            <MaskLines play="now" lines={["Tell us how you"]} />
            <MaskLines play="now" delay={130} lineClassName="v2-accent" lines={["book today."]} />
          </h1>

          <div
            className="grid gap-x-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
            style={{ marginTop: "calc(4 * var(--u))", rowGap: "calc(4 * var(--u))" }}
          >
            {/* The case for filling it in, kept short. */}
            <div className="lg:sticky lg:top-[calc(9*var(--u))] lg:self-start">
              <Reveal as="p" delay={200} opacity={0.7} className="v2-body max-w-[42ch]">
                Four short steps — most people finish in under a minute. The more we know about how
                the business actually runs, the more useful our reply is, and the faster your Kairo
                can be set up the way you already work.
              </Reveal>

              <ul style={{ marginTop: "calc(3 * var(--u))" }}>
                {ASSURANCE.map(([title, note], i) => (
                  <Reveal
                    as="li"
                    key={title}
                    delay={320 + i * 90}
                    className="border-t border-white/10"
                    style={{ paddingBlock: "calc(1.4 * var(--u))" }}
                  >
                    <p className="v2-display v2-t4">{title}</p>
                    <p className="v2-body opacity-60" style={{ marginTop: "calc(0.5 * var(--u))" }}>
                      {note}
                    </p>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* The form carries its own frame, so this adds none — two
                nested borders read as a card inside a card. It only fixes
                the type scale: the flow is built in fixed pixels, and
                letting it inherit the page's viewport-relative base would
                make every field grow with the window. */}
            <Reveal delay={140} className="min-w-0" style={{ fontSize: "16px" }}>
              <GetInTouchFlow />
            </Reveal>
          </div>
        </div>
      </main>

      <V2Footer />
    </div>
  );
}
