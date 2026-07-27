// ─────────────────────────────────────────────────────────────
// Site config — canonical URLs for Genome AI.
// Launching at genomeai.space.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: "Genome AI",
  domain: "genomeai.space",
  url: "https://genomeai.space",
  email: "contact@genomeai.space",
  betaEmail: "beta@genomeai.space",
  founded: 2026,
  keywords: [
    "Digital DNA",
    "genome",
    "AI behavior",
    "prompt engineering",
    "agent engineering",
    "AI agents",
    "benchmark",
    "CrewAI",
    "LangGraph",
    "model-agnostic",
    "AI behavior engineering",
  ],
  social: {
    twitter: "https://x.com/genomeai",
    twitterHandle: "@genomeai",
    github: "https://github.com/GenomeAI-space",
    githubHandle: "GenomeAI-space",
  },
  seo: {
    defaultTitle: "Genome AI — Engineer AI Behavior with Digital DNA",
    defaultDescription:
      "Genome AI helps teams design, test, benchmark, and version AI behavior with Digital DNA instead of prompt-only engineering.",
    // JPEG preferred over SVG for OG/Twitter crawlers and Ahrefs social previews
    ogImage: "/og-image.jpg",
    ogImageType: "image/jpeg",
    ogImageWidth: 1024,
    ogImageHeight: 1024,
    favicon: "/favicon.svg",
    robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  },
  // GitHub repo — resolves today (renders GitHub's own 404 if a path is pending),
  // so these links always OPEN instead of dead-ending on an unprovisioned subdomain.
  repo: "https://github.com/GenomeAI-space/genomeai",
  // external resources (open in new tab). Pointed at resolving hosts so nothing
  // produces a "can't be reached" error; swap to docs.genomeai.space when live.
  resources: {
    docs: "https://github.com/GenomeAI-space/genomeai#readme",
    standard: "https://github.com/GenomeAI-space/genomeai#-the-one-idea",
    changelog: "https://github.com/GenomeAI-space/genomeai/releases",
    roadmap: "https://github.com/GenomeAI-space/genomeai#-roadmap",
    // Avoid linking a non-existent /blog (Ahrefs broken-page / 404 debt)
    blog: "https://github.com/GenomeAI-space/genomeai/releases",
    api: "https://github.com/GenomeAI-space/genomeai",
  },
} as const;

export type SiteResource = keyof typeof SITE.resources;
