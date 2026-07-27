// Shared FAQ content — UI + FAQPage JSON-LD stay in lockstep (Ahrefs/schema).

export interface FaqItem {
  q: string;
  a: string;
  group: string;
}

export const FAQS: FaqItem[] = [
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
