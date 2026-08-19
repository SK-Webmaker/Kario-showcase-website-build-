import { Nav } from "./components/Nav";
import { Blueprint, StatusBar } from "./components/Chrome";
import { Hero } from "./components/Hero";
import { WhyNotThem } from "./components/WhyNotThem";
import { ProofWall } from "./components/ProofWall";
import { Contrast } from "./components/Contrast";
import { Journey } from "./components/Journey";
import { SignatureMoment } from "./components/SignatureMoment";
import { Bento } from "./components/Bento";
import { PhoneTrio } from "./components/PhoneTrio";
import { BuiltDifferently } from "./components/BuiltDifferently";
import { Comparison } from "./components/Comparison";
import { TalkToUs } from "./components/TalkToUs";
import { Footer } from "./components/Footer";
import { ScrollStage } from "./components/ui/ScrollStage";
import { useLenis } from "./hooks/useLenis";

export default function App() {
  useLenis();

  return (
    <>
      <a
        href="#why"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
                   focus:z-[60] focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to the case for Kairo
      </a>

      <Blueprint />
      <Nav />

      <main className="relative z-10">
        {/* The three pinned sections are deliberately NOT staged: a
            transform on their wrapper would kill the `sticky` that makes
            the pin work, and the pin is already their transition. */}
        <Hero />
        <WhyNotThem />

        {/* Everything else rises in and recedes out as it passes. The
            fixed blueprint grid behind shows through at the seams while
            a panel is scaled back, which is the point of the effect. */}
        <ScrollStage className="bg-ground">
          <ProofWall />
        </ScrollStage>
        <ScrollStage className="bg-ground">
          <Contrast />
        </ScrollStage>

        <Journey />

        <ScrollStage className="bg-ground">
          <SignatureMoment />
        </ScrollStage>
        <ScrollStage className="bg-ground">
          <Bento />
        </ScrollStage>
        <ScrollStage className="bg-ground">
          <PhoneTrio />
        </ScrollStage>
        <ScrollStage className="bg-ground">
          <BuiltDifferently />
        </ScrollStage>
        <ScrollStage className="bg-ground">
          <Comparison />
        </ScrollStage>
        <ScrollStage className="bg-ground">
          <TalkToUs />
        </ScrollStage>
      </main>

      <ScrollStage className="bg-ground">
        <Footer />
      </ScrollStage>

      <StatusBar />
    </>
  );
}
