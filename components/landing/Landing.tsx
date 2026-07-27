import { useStore } from "@/lib/store";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { WhatIsGenome } from "./WhatIsGenome";
import { CompilerDiagram } from "./CompilerDiagram";
import { PlaygroundPreview } from "./PlaygroundPreview";
import { InteractiveDemo } from "./InteractiveDemo";
import { WhyDNA, CTA, Footer } from "./LandingSections";
import { BenchmarkShowcase } from "./BenchmarkShowcase";

export function Landing() {
  const { openAuth, startDemo } = useStore();

  const playScroll = () =>
    document.getElementById("playground")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero onEnter={() => startDemo()} onPlay={playScroll} onWaitlist={() => openAuth("request")} />
        <WhatIsGenome />
        <CompilerDiagram />
        <PlaygroundPreview />
        <InteractiveDemo />
        <WhyDNA />
        <BenchmarkShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
