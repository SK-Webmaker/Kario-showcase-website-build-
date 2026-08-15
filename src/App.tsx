import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
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

export default function App() {
  return (
    <>
      <a
        href="#journey"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4
                   focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4
                   focus:py-2 focus:text-white"
      >
        Skip to the walkthrough
      </a>

      <Nav />

      <main>
        {/* the hook */}
        <Hero />
        <ProofWall />

        {/* why it matters */}
        <Contrast />

        {/* the journey — a salon's day in eight steps */}
        <Journey />

        {/* the feature no competitor screenshots */}
        <SignatureMoment />

        {/* everything else */}
        <Bento />
        <PhoneTrio />

        {/* proof and decision */}
        <BuiltDifferently />
        <Comparison />
        <TalkToUs />
      </main>

      <Footer />
    </>
  );
}
