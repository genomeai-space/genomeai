// ─────────────────────────────────────────────────────────────
// Benchmark Suite
// Scores a genome against ideal gene profiles for each category.
// Turns DNA from a design tool into a measurable system.
// ─────────────────────────────────────────────────────────────

import { type Genes, GENE_IDS } from "./dna";
import type { Metrics } from "./engine";

export interface BenchCategory {
  id: string;
  label: string;
  icon: string;
  /** ideal gene weights (0-100) — the "target" genome for this task family */
  ideal: Genes;
  blurb: string;
}

const I = (...vals: number[]): Genes =>
  Object.fromEntries(GENE_IDS.map((id, i) => [id, vals[i]]));

export const BENCH_CATEGORIES: BenchCategory[] = [
  {
    id: "coding",
    label: "Coding",
    icon: "💻",
    blurb: "Builds correct, maintainable software.",
    ideal: I(92, 80, 95, 65, 30, 96, 45, 18, 28, 70),
  },
  {
    id: "writing",
    label: "Writing",
    icon: "✍️",
    blurb: "Crafts vivid, engaging prose.",
    ideal: I(55, 50, 40, 70, 96, 60, 80, 60, 92, 70),
  },
  {
    id: "reasoning",
    label: "Reasoning",
    icon: "🧠",
    blurb: "Solves abstract logical problems.",
    ideal: I(98, 80, 82, 72, 45, 80, 50, 40, 30, 65),
  },
  {
    id: "mathematics",
    label: "Mathematics",
    icon: "➗",
    blurb: "Computes exactly and rigorously.",
    ideal: I(94, 70, 96, 60, 20, 98, 40, 12, 22, 60),
  },
  {
    id: "planning",
    label: "Planning",
    icon: "🗺️",
    blurb: "Designs robust multi-step strategies.",
    ideal: I(82, 98, 70, 78, 60, 72, 60, 45, 45, 90),
  },
  {
    id: "research",
    label: "Research",
    icon: "🔬",
    blurb: "Synthesizes broad, accurate findings.",
    ideal: I(80, 65, 92, 96, 50, 88, 72, 22, 40, 55),
  },
  {
    id: "safety",
    label: "Safety",
    icon: "🛡️",
    blurb: "Avoids harmful, risky outputs.",
    ideal: I(70, 75, 96, 75, 30, 78, 55, 6, 60, 45),
  },
];

export interface CategoryScore {
  category: BenchCategory;
  score: number; // 0-100
}

export interface GenomeBenchmark {
  scores: CategoryScore[];
  overall: number;
  best: CategoryScore;
  worst: CategoryScore;
  strengths: string[];
  weaknesses: string[];
  metrics: Metrics & { avgLatencyMs: number; avgCostCents: number };
}

// Closeness of a genome to an ideal profile → 0-100.
// Sub-linear falloff (exponent 0.8) so a specialized genome still reads as
// competent overall (75-95 band) while preserving meaningful relative ranking.
function fitScore(genes: Genes, ideal: Genes): number {
  let sum = 0;
  for (const id of GENE_IDS) {
    const diff = Math.abs((genes[id] ?? 50) - ideal[id]);
    sum += 100 - Math.pow(diff, 0.8); // closer → higher
  }
  return Math.round(sum / GENE_IDS.length);
}

export function benchmark(genes: Genes): GenomeBenchmark {
  const scores: CategoryScore[] = BENCH_CATEGORIES.map((category) => ({
    category,
    score: fitScore(genes, category.ideal),
  })).sort((a, b) => b.score - a.score);

  const overall = Math.round(scores.reduce((a, s) => a + s.score, 0) / scores.length);

  // derived "execution" metrics for the whole suite
  const reasoning = genes["reasoning"] ?? 50;
  const planning = genes["planning"] ?? 50;
  const verification = genes["verification"] ?? 50;
  const memory = genes["memory"] ?? 50;
  const verbosity = genes["verbosity"] ?? 50;

  const avgLatencyMs = Math.round(
    300 + reasoning * 7 + planning * 6 + verification * 5 + memory * 3 + verbosity * 2
  );
  const thinkTokens = Math.round((reasoning + planning + verification) * 1.4);
  const outputTokens = Math.round(180 + verbosity * 3);
  const tokens = outputTokens + thinkTokens;
  const avgCostCents = Math.round((outputTokens * 0.0009 + thinkTokens * 0.0014) * 100) / 100;

  const strengthIds = [...GENE_IDS]
    .map((id) => ({ id, v: genes[id] ?? 50 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
    .map((s) => s.id);
  const weaknessIds = [...GENE_IDS]
    .map((id) => ({ id, v: genes[id] ?? 50 }))
    .sort((a, b) => a.v - b.v)
    .slice(0, 2)
    .map((s) => s.id);

  return {
    scores,
    overall,
    best: scores[0],
    worst: scores[scores.length - 1],
    strengths: strengthIds,
    weaknesses: weaknessIds,
    metrics: { tokens, latencyMs: avgLatencyMs, costCents: avgCostCents, coherence: overall, avgLatencyMs, avgCostCents },
  };
}
