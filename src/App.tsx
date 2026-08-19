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
        <Hero />
        {/* The sell, straight after the hook. */}
        <WhyNotThem />
        <ProofWall />
        <Contrast />
        <Journey />
        <SignatureMoment />
        <Bento />
        <PhoneTrio />
        <BuiltDifferently />
        <Comparison />
        <TalkToUs />
      </main>

      <Footer />
      <StatusBar />
    </>
  );
}
