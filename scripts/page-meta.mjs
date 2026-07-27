/**
 * Per-route SEO metadata used by seo-static-paths.mjs at build time.
 * Keep titles/descriptions aligned with lib/seo.ts PAGE_METADATA.
 */
export const SITE_URL = "https://genomeai.space";
export const SITE_NAME = "Genome AI";
export const DEFAULT_OG = `${SITE_URL}/og-image.jpg`;

/** @typedef {{ title: string, description: string, robots?: string, brandInTitle?: boolean }} PageMeta */

/** @type {Record<string, PageMeta>} */
export const PAGE_META = {
  home: {
    title: "Genome AI — Engineer AI Behavior with Digital DNA",
    description:
      "Genome AI helps teams design, test, benchmark, and version AI behavior with Digital DNA instead of prompt-only engineering.",
    brandInTitle: true,
  },
  what: {
    title: "What is a Genome?",
    description:
      "Learn how Digital DNA turns AI behavior design into a structured, reusable, and measurable workflow.",
  },
  compiler: {
    title: "The Genome Compiler",
    description:
      "See how Genome AI compiles tunable genes into system instructions, memory policy, and tool policy.",
  },
  playground: {
    title: "Try the Playground",
    description:
      "Explore genomes interactively and shape AI behavior in real time with Digital DNA.",
  },
  editor: {
    title: "Genome Editor",
    description:
      "Refine genes, compare versions, and tune AI behavior with the visual Genome Editor.",
  },
  why: {
    title: "Why Digital DNA Matters",
    description:
      "Understand why structured genomes improve reliability, reuse, and observability for AI systems.",
  },
  benchmark: {
    title: "Benchmark AI Behavior",
    description:
      "Measure how DNA changes affect reasoning, planning, memory, verification, and more.",
  },
  pricing: {
    title: "Pricing",
    description:
      "Explore free beta and upcoming plans for individuals and teams building with Genome AI.",
  },
  faq: {
    title: "Frequently Asked Questions",
    description:
      "Answers about Genome AI, Digital DNA, benchmarking, pricing, and getting started.",
  },
  catalog: {
    title: "Gene Catalog",
    description:
      "Browse the 10 tunable genes that shape AI behavior in Genome AI Digital DNA.",
  },
  about: {
    title: "About Genome AI",
    description:
      "Discover the mission behind Genome AI and the idea of Digital DNA for agent engineering.",
  },
  contact: {
    title: "Contact Genome AI",
    description:
      "Reach the Genome AI team for questions, pilots, partnerships, and product feedback.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "Review Genome AI privacy practices and how product data is handled.",
  },
  terms: {
    title: "Terms of Service",
    description: "Read the terms governing your use of Genome AI.",
  },
  learn: {
    title: "Learn Digital DNA",
    description:
      "Guides on Digital DNA, genome vs prompt engineering, the Genome Engine, and benchmarking AI behavior.",
  },
  "learn/what-is-digital-dna": {
    title: "What is Digital DNA?",
    description:
      "Digital DNA is a structured way to define AI behavior with tunable genes instead of brittle prompt prose.",
    crawlBody:
      "Digital DNA is a structured way to define AI behavior with tunable genes instead of brittle prompt prose. A Genome is a set of genes scored 0–100 that shape reasoning, planning, verification, memory, creativity, and communication. The Genome Engine compiles those genes into system instructions, memory policy, and tool policy so behavior can be saved, versioned, benchmarked, and ported across models.",
  },
  "learn/genome-vs-prompt-engineering": {
    title: "Genome Engineering vs Prompt Engineering",
    description:
      "Compare prompt engineering and genome engineering: reproducibility, measurement, reuse, and team workflows.",
    crawlBody:
      "Prompt engineering shapes one answer with free-form text. Genome engineering treats behavior as a durable product artifact: change a gene, run a fixed benchmark suite, compare scores and cost, ship or roll back. Genomes improve reproducibility, measurement, and team scale while prompts remain useful for exploration.",
  },
  "learn/how-the-genome-engine-works": {
    title: "How the Genome Engine Compiles Behavior",
    description:
      "Learn how Genome AI compiles tunable genes into system instructions, memory policy, and tool policy.",
    crawlBody:
      "The Genome Engine compiles Digital DNA into runtime config: normalize genes, derive persona and rules, derive memory and tool policies, then execute against a model backend. Behavior lives in the genome so the same profile can target different models without rewriting product personality.",
  },
  "learn/benchmarking-ai-behavior": {
    title: "Benchmarking AI Behavior with Genomes",
    description:
      "How to measure AI behavior changes with task-family benchmarks, scores, cost, and version diffs.",
    crawlBody:
      "Benchmarking AI behavior means fixed task families, comparable scores, and versioned regressions. Suites span coding, writing, reasoning, planning, research, and safety. Cost and latency are first-class signals alongside quality so teams can ship genomes that fit product constraints.",
  },
  screenshots: {
    title: "Screenshots",
    description: "See the Genome AI interface and workflow in action.",
    robots: "noindex,follow",
  },
  notfound: {
    title: "Page Not Found",
    description: "The requested page could not be found on Genome AI.",
    robots: "noindex,follow",
  },
  app: {
    title: "DNA Library",
    description: "Use the Genome AI DNA Library to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
  "app/library": {
    title: "DNA Library",
    description: "Use the Genome AI DNA Library to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
  "app/editor": {
    title: "Editor",
    description: "Use the Genome AI Editor to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
  "app/playground": {
    title: "Playground",
    description: "Use the Genome AI Playground to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
  "app/compare": {
    title: "Compare",
    description: "Use the Genome AI Compare tool to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
  "app/benchmark": {
    title: "Benchmark",
    description: "Use the Genome AI Benchmark suite to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
  "app/history": {
    title: "Version History",
    description: "Use Genome AI Version History to design, test, and version Digital DNA.",
    robots: "noindex,nofollow",
  },
};

export const INDEXABLE_PATHS = [
  "what",
  "compiler",
  "playground",
  "editor",
  "why",
  "benchmark",
  "pricing",
  "faq",
  "catalog",
  "about",
  "contact",
  "privacy",
  "terms",
  "learn",
  "learn/what-is-digital-dna",
  "learn/genome-vs-prompt-engineering",
  "learn/how-the-genome-engine-works",
  "learn/benchmarking-ai-behavior",
];

export const ALL_SHELL_PATHS = [
  ...INDEXABLE_PATHS,
  "screenshots",
  "404",
  "app",
  "app/library",
  "app/editor",
  "app/playground",
  "app/compare",
  "app/benchmark",
  "app/history",
];

/**
 * @param {string} pathKey e.g. "pricing" | "app/editor" | "404"
 */
export function resolveMeta(pathKey) {
  const key = pathKey === "404" ? "notfound" : pathKey;
  const meta = PAGE_META[key] ?? PAGE_META.home;
  const title = meta.brandInTitle
    ? meta.title
    : `${meta.title} | ${SITE_NAME}`;
  const robots =
    meta.robots ??
    "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

  // Trailing-slash canonicals match GitHub Pages directory URLs (avoids 301 noise).
  let canonicalPath;
  if (pathKey === "home" || pathKey === "" || pathKey === "/") {
    canonicalPath = "/";
  } else if (pathKey === "404") {
    canonicalPath = "/404/";
  } else {
    canonicalPath = `/${pathKey}/`;
  }
  const canonicalUrl =
    canonicalPath === "/" ? `${SITE_URL}/` : `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description: meta.description,
    robots,
    canonicalUrl,
    imageUrl: DEFAULT_OG,
    crawlBody: meta.crawlBody || "",
  };
}
