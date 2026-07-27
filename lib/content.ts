// Long-form Learn content — indexable pages for organic SEO surface area.

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readMinutes: number;
  tags: string[];
  /** Short teaser for cards */
  teaser: string;
  /** Paragraphs of body copy (plain text; rendered as <p>) */
  body: string[];
  /** Optional H2 sections */
  sections?: { heading: string; paragraphs: string[] }[];
}

export const ARTICLES: Article[] = [
  {
    slug: "what-is-digital-dna",
    title: "What is Digital DNA?",
    description:
      "Digital DNA is a structured way to define AI behavior with tunable genes instead of brittle prompt prose.",
    date: "2026-07-27",
    readMinutes: 6,
    tags: ["Digital DNA", "fundamentals"],
    teaser:
      "A reusable behavioral blueprint: ten genes, scored 0–100, that shape how an AI reasons, plans, and communicates.",
    body: [
      "Most teams still shape AI behavior by writing longer and longer prompts. That works until the prompt drifts, gets copied with silent edits, or fails when you switch models. Digital DNA is a different abstraction: behavior as structured, measurable parameters.",
      "A Genome is a set of tunable genes. Each gene is a single axis of behavior — reasoning depth, verification rigor, memory policy, creativity, verbosity, risk tolerance, and more — scored from 0 to 100. Together they describe a mind you can save, share, version, and benchmark.",
      "Instead of burying instructions in free-form text, you design the profile once and let a Genome Engine compile it into system instructions, memory policy, and tool policy for the model runtime. The result is behavior you can engineer like software.",
    ],
    sections: [
      {
        heading: "Why structure beats prose",
        paragraphs: [
          "Prompts are excellent for one-off tasks and terrible as the long-term source of truth for product behavior. They are hard to diff, hard to A/B test fairly, and nearly impossible to score consistently across releases.",
          "Genes give you knobs you can change deliberately. Move verification up and risk down; re-run the same benchmark suite; keep a version history. That loop — change, measure, restore — is the core of behavior engineering.",
        ],
      },
      {
        heading: "What Digital DNA is not",
        paragraphs: [
          "It is not a replacement for your model or agent framework. Digital DNA sits above the model: a portable behavior layer that can compile toward CrewAI-style roles, graph agents, custom GPTs, or a direct chat runtime.",
          "It is also not magic personality. Genes encode tradeoffs. High creativity with low precision is a different product than high precision with low verbosity. Explicit tradeoffs are the point.",
        ],
      },
    ],
  },
  {
    slug: "genome-vs-prompt-engineering",
    title: "Genome Engineering vs Prompt Engineering",
    description:
      "Compare prompt engineering and genome engineering: reproducibility, measurement, reuse, and team workflows.",
    date: "2026-07-27",
    readMinutes: 7,
    tags: ["prompt engineering", "genomes"],
    teaser:
      "Prompts describe one answer. Genomes describe a mind you can measure, version, and port across models.",
    body: [
      "Prompt engineering taught the industry that wording matters. Genome engineering asks a bigger question: how do we treat AI behavior as a durable product artifact?",
      "With prompts, improvement is often anecdotal — “this version felt better.” With genomes, improvement is operational: change a gene, run a fixed task suite, compare scores and cost, ship or roll back.",
    ],
    sections: [
      {
        heading: "Reproducibility",
        paragraphs: [
          "A prompt copied into three tools becomes three slightly different systems. A genome is a structured object: genes, metadata, and version notes. Restoring v3 is a deliberate action, not archaeology in a chat log.",
        ],
      },
      {
        heading: "Measurement",
        paragraphs: [
          "Prompt quality is usually judged by spot checks. Genome workflows assume a benchmark harness — coding, writing, reasoning, planning, research, safety — so regressions show up as numbers, not vibes.",
        ],
      },
      {
        heading: "Team scale",
        paragraphs: [
          "When multiple people own agent behavior, free-form prompts become tribal knowledge. Genomes give design systems a shared vocabulary: “raise verification,” “lower verbosity,” “tune empathy for support.” That language travels across roles and tools.",
        ],
      },
      {
        heading: "When prompts still win",
        paragraphs: [
          "Use raw prompts for exploration, throwaway tasks, and creative one-shots. Use genomes when behavior is part of the product — support agents, research copilots, coding assistants — and must stay stable under change.",
        ],
      },
    ],
  },
  {
    slug: "how-the-genome-engine-works",
    title: "How the Genome Engine Compiles Behavior",
    description:
      "Learn how Genome AI compiles tunable genes into system instructions, memory policy, and tool policy.",
    date: "2026-07-27",
    readMinutes: 8,
    tags: ["engine", "architecture"],
    teaser:
      "Genes in, runtime config out — model-agnostic compilation from Digital DNA to instructions models can follow.",
    body: [
      "The Genome Engine is the compiler in the stack. You do not hand the model a wall of gene numbers; the engine turns a genome into the artifacts a runtime actually needs.",
      "At a high level the pipeline is: normalize genes → derive persona and rules → derive memory and tool policies → emit a structured config → execute against a model backend (or a local mock for demos).",
    ],
    sections: [
      {
        heading: "System instructions",
        paragraphs: [
          "Reasoning, precision, empathy, and related genes map into instruction blocks: how thorough to be, how cautious, how warm, how autonomous. The compiler’s job is to make those traits consistent rather than contradictory.",
        ],
      },
      {
        heading: "Memory policy",
        paragraphs: [
          "Memory genes influence what to retain, how aggressively to compress context, and when to prefer recall versus fresh reasoning. That policy is as important as the prose in the system prompt.",
        ],
      },
      {
        heading: "Tool policy",
        paragraphs: [
          "Autonomy and verification genes shape when tools may be called and how results must be checked. High verification encourages confirm-before-act patterns; high autonomy allows longer unsupervised trajectories.",
        ],
      },
      {
        heading: "Model-agnostic by design",
        paragraphs: [
          "Because behavior lives in the genome and compiled config, the same profile can target different models. You recompile or rebind the backend without rewriting the product’s personality from scratch.",
        ],
      },
    ],
  },
  {
    slug: "benchmarking-ai-behavior",
    title: "Benchmarking AI Behavior with Genomes",
    description:
      "How to measure AI behavior changes with task-family benchmarks, scores, cost, and version diffs.",
    date: "2026-07-27",
    readMinutes: 6,
    tags: ["benchmarks", "measurement"],
    teaser:
      "Treat behavior like engineering: fixed task families, comparable scores, and versioned regressions you can roll back.",
    body: [
      "If you cannot measure behavior, you cannot improve it on purpose. Genome AI pairs every genome with a benchmark mindset: same tasks, comparable metrics, explicit tradeoffs.",
      "A typical suite spans task families such as coding, writing, reasoning, mathematics, planning, research, and safety. You get overall and per-category scores, strengths, weaknesses, and cost signals.",
    ],
    sections: [
      {
        heading: "Change one gene at a time",
        paragraphs: [
          "The most useful experiments are controlled. Raise verification, keep the rest fixed, re-run the suite. Side-by-side compare views make the behavioral delta obvious — not only the final answer, but tone, length, and tool use.",
        ],
      },
      {
        heading: "Cost is a behavior signal",
        paragraphs: [
          "Verbosity and deep reasoning often raise token use. Benchmarks that surface cost help product teams choose profiles that fit latency and budget constraints, not just quality scores.",
        ],
      },
      {
        heading: "Ship with a paper trail",
        paragraphs: [
          "Version history turns “what did we change last Tuesday?” into an auditable log. When a support genome regresses on safety tasks, restore the last green version and continue iterating.",
        ],
      },
    ],
  },
];

export function getArticle(slug: string | undefined): Article | undefined {
  if (!slug) return undefined;
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlePath(slug: string): string {
  return `/learn/${slug}/`;
}
