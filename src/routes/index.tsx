import { createFileRoute } from "@tanstack/react-router";

import { V2Nav } from "@/components/v2/V2Nav";
import { V2Hero } from "@/components/v2/V2Hero";
import { V2Pain } from "@/components/v2/V2Pain";
import { V2Statements } from "@/components/v2/V2Statements";
import { V2Features } from "@/components/v2/V2Features";
import { V2Marquee } from "@/components/v2/V2Marquee";
import { V2Growth, V2Kai, V2Records, V2Sentence } from "@/components/v2/V2Deep";
import { V2Pricing } from "@/components/v2/V2Pricing";
import { V2Cta } from "@/components/v2/V2Cta";
import { V2Faq } from "@/components/v2/V2Faq";
import { V2Footer } from "@/components/v2/V2Footer";
import { Chapters, Lens, Opening } from "@/components/v2/motion";
import { Watermark } from "@/components/v2/KairoMark";
import { Seam } from "@/components/v2/Seam";
import { Ambience, Stage } from "@/components/v2/cinematic";
import { NoMotionFallback } from "@/components/v2/NoMotionFallback";
import { useLenis } from "@/hooks/useLenis";
import { homeGraph, jsonLdScript } from "@/data/schema";
import { DESCRIPTION, ORIGIN, TITLE, site } from "@/site.config";

const OG_IMAGE = `${ORIGIN}/screenshots/01-dashboard.jpg`;

/** The parts of the argument, in the order the page makes them. */
const CHAPTERS = [
  { id: "pain", label: "The problem" },
  { id: "terms", label: "The terms" },
  { id: "features", label: "What you get" },
  { id: "assistant", label: "The assistant" },
  { id: "one-sentence", label: "One sentence" },
  { id: "records", label: "The paperwork" },
  { id: "growth", label: "Where they came from" },
  { id: "promises", label: "What it never does" },
  { id: "pricing", label: "What it costs" },
  { id: "contact", label: "Get started" },
  { id: "faq", label: "Questions" },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${ORIGIN}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${ORIGIN}/` }],
    // The entity graph. It goes through the router's head so it lands in
    // the HTML the server sends — no major AI crawler runs JavaScript, so
    // markup injected on the client is invisible to every one of them.
    scripts: [jsonLdScript(homeGraph())],
  }),
  component: Index,
});

function Index() {
  useLenis();

  return (
    <div className="v2 v2-grid min-h-screen">
      <NoMotionFallback />
      {/* Fixed to the viewport and always drifting, so the ground is
          alive even when the reader has stopped. It sits beneath every
          section; the sections that paint their own background simply
          cover it, which is correct. */}
      <Ambience />
      <Opening name={site.name} />
      <Lens />
      <Watermark />
      <Chapters items={CHAPTERS} />

      <a
        href="#pain"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
                   focus:z-[1001] focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to the case for Kairo
      </a>

      <V2Nav />
      <main>
        {/* The hero does not simply end. It sinks into the ground behind
            a soft veil while one hairline draws outward across the seam
            and leaves with it — a cut, not a curtain. See Seam.tsx. */}
        <div className="relative">
          <V2Hero />
          <Seam className="z-20 -bottom-[35vh] h-[70vh]" />
        </div>
        <V2Pain />
        <V2Statements />
        <V2Features />
        {/* Four sections that go a level deeper than the showcase, each
            moving on a different axis so the page does not repeat itself. */}
        <V2Kai />
        {/* Stage gives a section a focus pull as it takes the screen. It
            works by transforming the wrapper, which makes that wrapper the
            containing block for any position:sticky inside — so it goes
            only on the sections that have none. Everything pinned (Pain,
            Statements, Features, Kai, Records, Pricing, Faq) is left
            alone: the pin already is its transition. */}
        <Stage className="overflow-hidden">
          <V2Sentence />
        </Stage>
        {/* The second act break. The film gets two of these and no more —
            one coming out of the opening, one before the closing
            argument — so the device still means something when it lands.
            `relative` rather than a transform: position:relative does not
            create a containing block for the sticky column inside. */}
        <div className="relative">
          <V2Records />
          <Seam className="z-20 -bottom-[30vh] h-[60vh]" />
        </div>
        <Stage className="overflow-hidden">
          <V2Growth />
        </Stage>
        <Stage strength={0.55} className="overflow-hidden">
          <V2Marquee />
        </Stage>
        <V2Pricing />
        <Stage className="overflow-hidden">
          <V2Cta />
        </Stage>
        <V2Faq />
      </main>
      <V2Footer />
    </div>
  );
}
