// ─────────────────────────────────────────────────────────────
// Pricing tiers — single source of truth.
// Used by the Request Early Access form selector AND the Pricing page.
// ─────────────────────────────────────────────────────────────

export type TierId = "explorer" | "builder" | "professional" | "enterprise";

export interface Tier {
  id: TierId;
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  /** headline metric shown prominently on cards */
  headline: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export const TIERS: Tier[] = [
  {
    id: "explorer",
    name: "Explorer",
    price: "Free",
    cadence: "during beta",
    blurb: "Build & experiment with genomes.",
    headline: "Up to 4 genomes",
    highlight: true,
    cta: "Start free",
    features: [
      "Up to 4 genomes",
      "Playground",
      "Compare",
      "Version History",
      "Local storage only",
    ],
  },
  {
    id: "builder",
    name: "Builder",
    price: "$19",
    cadence: "/ mo",
    blurb: "Ship your first production agents.",
    headline: "50 genomes",
    cta: "Choose Builder",
    features: [
      "50 genomes",
      "Benchmark",
      "Cloud sync",
      "Sharing",
      "Import / Export",
      "Templates",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$49",
    cadence: "/ mo",
    blurb: "Full toolkit for serious engineering.",
    headline: "Unlimited genomes",
    cta: "Choose Professional",
    features: [
      "Unlimited genomes",
      "Team workspaces",
      "API",
      "SDK",
      "Benchmark suites",
      "Private templates",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "For teams & regulated environments.",
    headline: "Deploy anywhere",
    cta: "Contact us",
    features: [
      "SSO",
      "RBAC",
      "Audit logs",
      "Custom models",
      "On-premise deployment",
    ],
  },
];

export const TIER_MAP: Record<TierId, Tier> = Object.fromEntries(
  TIERS.map((t) => [t.id, t])
) as Record<TierId, Tier>;
