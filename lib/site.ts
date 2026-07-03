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
  social: {
    twitter: "https://x.com/genomeai",
    twitterHandle: "@genomeai",
    github: "https://github.com/GenomeAI-space",
    githubHandle: "GenomeAI-space",
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
    blog: "https://genomeai.space/blog",
    api: "https://github.com/GenomeAI-space/genomeai",
  },
} as const;

export type SiteResource = keyof typeof SITE.resources;
