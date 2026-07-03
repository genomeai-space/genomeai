import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "./PageHeader";
import { Reveal } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

const FAQS: { q: string; a: string; group: string }[] = [
  {
    group: "The concept",
    q: "What exactly is a Genome?",
    a: "A Genome is a structured set of 10 tunable genes — each a behavior trait scored 0–100. Together they define how an AI reasons, plans, verifies, remembers, and communicates. It's a reusable behavioral blueprint, not a paragraph of prompt text.",
  },
  {
    group: "The concept",
    q: "How is this different from prompt engineering?",
    a: "A prompt describes one answer; a Genome describes a mind. Prompts drift, can't be measured, and are hard to reuse. Genomes are structured, versioned, benchmarked, and reproducible — change a gene and the behavior changes predictably.",
  },
  {
    group: "The concept",
    q: "Do I ever write a raw prompt?",
    a: "Not to define behavior. You tune genes through visual controls. The Genome Engine compiles those genes into the system instructions, memory policy, and tool policy the model actually runs.",
  },
  {
    group: "How it works",
    q: "What does the Genome Engine actually do?",
    a: "It compiles your genome into a structured runtime config: System Instructions (persona & rules), Memory Policy (context retention), and Tool Policy (which tools and when). That config is then handed to the LLM. It's model-agnostic.",
  },
  {
    group: "How it works",
    q: "Is it tied to a specific LLM?",
    a: "No. Because the behavior lives in the genome config, it can run on any compatible model. You engineer the behavior once and port it across models.",
  },
  {
    group: "Using it",
    q: "Can I save and reuse genomes?",
    a: "Yes — every genome lives in your DNA Library. You can duplicate, categorize, search, and apply presets. Reusable across tasks and projects.",
  },
  {
    group: "Using it",
    q: "What is benchmarking?",
    a: "Every genome runs against a standardized suite of 7 task families (Coding, Writing, Reasoning, Mathematics, Planning, Research, Safety). You get an overall score, per-category scores, strengths, weaknesses, and cost — turning behavior into measurable engineering.",
  },
  {
    group: "Using it",
    q: "Does every change create a version?",
    a: "When you save, a new version is recorded. You can browse history, restore older versions, and diff gene changes between any two versions — so behavior is always reproducible and auditable.",
  },
  {
    group: "Pricing & access",
    q: "Is there a free plan?",
    a: "Yes — GenomeAI is in Free Beta during the MVP. You can build, edit, run, benchmark, and version unlimited genomes at no cost. See the Pricing page for what's included.",
  },
  {
    group: "Pricing & access",
    q: "Where is my data stored?",
    a: "During the beta, genomes persist locally in your browser. Nothing leaves your device unless you explicitly share a result.",
  },
];

export function FAQ() {
  const { goPage, openAuth } = useStore();
  const [open, setOpen] = useState<number | null>(0);
  const groups = [...new Set(FAQS.map((f) => f.group))];

  return (
    <>
      <PageHeader
        page="faq"
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything about Digital DNA, the engine, benchmarking, and access — in plain language."
      />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5">
          {groups.map((g) => (
            <div key={g} className="mb-8">
              <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-moss">
                {g}
              </h3>
              <div className="space-y-2.5">
                {FAQS.filter((f) => f.group === g).map((f, i) => {
                  const idx = FAQS.indexOf(f);
                  const isOpen = open === idx;
                  return (
                    <Reveal key={idx} delay={Math.min(i * 40, 200)}>
                      <div
                        className={cn(
                          "overflow-hidden rounded-xl border bg-paper transition-colors",
                          isOpen ? "border-moss/50" : "border-sand"
                        )}
                      >
                        <button
                          onClick={() => setOpen(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                        >
                          <span className="font-display text-[15px] font-semibold text-forest">
                            {f.q}
                          </span>
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-stone transition-all",
                              isOpen && "rotate-45 bg-mint text-forest"
                            )}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </span>
                        </button>
                        <div
                          className={cn(
                            "grid transition-all duration-300",
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          )}
                        >
                          <div className="overflow-hidden">
                            <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-stone">
                              {f.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-sand bg-cream/50 px-4 py-4 text-center sm:flex-row sm:text-left">
            <p className="text-[13px] text-stone">
              Still curious? See{" "}
              <button
                onClick={() => goPage("pricing")}
                className="font-semibold text-moss hover:underline"
              >
                plans & features
              </button>{" "}
              or try the playground.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => goPage("home")}
                className="rounded-lg border border-sand bg-paper px-3 py-2 text-[12px] font-medium text-forest hover:border-moss"
              >
                Back to home
              </button>
              <button
                onClick={() => openAuth("request")}
                className="rounded-lg bg-moss px-3 py-2 text-[12px] font-medium text-paper hover:bg-forest-700"
              >
                Request access
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
