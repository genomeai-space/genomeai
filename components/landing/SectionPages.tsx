import { PageHeader } from "./PageHeader";
import { WhatIsGenome } from "./WhatIsGenome";
import { CompilerDiagram } from "./CompilerDiagram";
import { PlaygroundPreview } from "./PlaygroundPreview";
import { InteractiveDemo } from "./InteractiveDemo";
import { WhyDNA } from "./LandingSections";
import { BenchmarkShowcase } from "./BenchmarkShowcase";

/** Standalone marketing pages — former homepage sections. */

export function WhatPage() {
  return (
    <>
      <PageHeader
        page="what"
        eyebrow="What is a Genome?"
        title={
          <>
            A behavioral blueprint,{" "}
            <span className="text-moss">not a paragraph</span>
          </>
        }
        subtitle="A Genome is a structured set of genes — tunable traits from 0 to 100 — that together define exactly how an AI behaves. Design a mind you can save, version, and reuse."
      />
      <WhatIsGenome hideHeader />
    </>
  );
}

export function CompilerPage() {
  return (
    <>
      <PageHeader
        page="compiler"
        eyebrow="How it compiles"
        title={
          <>
            From genes to{" "}
            <span className="text-moss">runtime config</span>
          </>
        }
        subtitle="The Genome Engine compiles Digital DNA into system instructions, memory policy, and tool policy — model-agnostic and auditable."
      />
      <CompilerDiagram hideHeader />
    </>
  );
}

export function PlaygroundPage() {
  return (
    <>
      <PageHeader
        page="playground"
        eyebrow="Interactive Playground"
        title={
          <>
            Same prompt. Different DNA.{" "}
            <span className="text-moss">Different answer.</span>
          </>
        }
        subtitle="Pick a genome, run a task, and see exactly how the genes shape the response, its reasoning, and its cost."
      />
      <PlaygroundPreview hideHeader />
    </>
  );
}

export function EditorPage() {
  return (
    <>
      <PageHeader
        page="editor"
        eyebrow="Genome Editor"
        title={
          <>
            Tune genes.{" "}
            <span className="text-moss">Watch behavior shift.</span>
          </>
        }
        subtitle="Adjust traits live and see how reasoning, tone, cost, and coherence respond — without rewriting prompts."
      />
      <InteractiveDemo hideHeader />
    </>
  );
}

export function WhyPage() {
  return (
    <>
      <PageHeader
        page="why"
        eyebrow="A new category"
        title={
          <>
            Not another agent framework.{" "}
            <span className="text-moss">A layer beneath them all.</span>
          </>
        }
        subtitle="CrewAI and LangGraph orchestrate agents. GenomeAI is where the agent's behavior itself is engineered — structured, measurable, and reusable."
      />
      <WhyDNA hideHeader />
    </>
  );
}

export function BenchmarkPage() {
  return (
    <>
      <PageHeader
        page="benchmark"
        eyebrow="Benchmark"
        title={
          <>
            The scores,{" "}
            <span className="text-moss">front and center</span>
          </>
        }
        subtitle="Every Genome runs against a standardized suite of task families. Strengths, weaknesses, speed, and cost are measured and comparable."
      />
      <BenchmarkShowcase hideHeader />
    </>
  );
}
