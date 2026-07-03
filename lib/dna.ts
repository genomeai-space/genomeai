// ─────────────────────────────────────────────────────────────
// Digital DNA — core domain model
// A "genome" is a structured set of genes (0-100) that engineer
// AI behavior. No raw prompts. Just tunable behavior.
// ─────────────────────────────────────────────────────────────

export type GeneCategory = "cognitive" | "creative" | "personality";

export interface GeneExplain {
  low: string;
  mid: string;
  high: string;
}

export interface GeneDef {
  id: string;
  name: string;
  symbol: string; // single char for DNA strand
  icon: string; // emoji
  category: GeneCategory;
  blurb: string;
  /** how this gene's HIGH value reads in behavior */
  highLabel: string;
  lowLabel: string;
  /** teaching copy shown live as the slider moves */
  explain: GeneExplain;
}

export type Genes = Record<string, number>;

export const GENES: GeneDef[] = [
  {
    id: "reasoning",
    name: "Reasoning",
    symbol: "R",
    icon: "🧠",
    category: "cognitive",
    blurb: "Depth of logical, step-by-step thought.",
    highLabel: "Deep chain-of-thought",
    lowLabel: "Surface intuition",
    explain: {
      high: "The agent performs deep, step-by-step analysis before answering — weighing premises and showing its work.",
      mid: "The agent thinks through the main points, then answers with moderate deliberation.",
      low: "The agent answers fast, leaning on quick, surface-level intuition.",
    },
  },
  {
    id: "planning",
    name: "Planning",
    symbol: "P",
    icon: "🗂️",
    category: "cognitive",
    blurb: "Strategic foresight & structured sequencing.",
    highLabel: "Multi-step strategist",
    lowLabel: "Reactive",
    explain: {
      high: "The agent breaks the task into a clear, sequenced plan before producing anything.",
      mid: "The agent loosely organizes its approach as it goes.",
      low: "The agent reacts to each step without an overall plan.",
    },
  },
  {
    id: "verification",
    name: "Verification",
    symbol: "V",
    icon: "✅",
    category: "cognitive",
    blurb: "Self-checking, fact-keeping & caveats.",
    highLabel: "Rigorous self-checks",
    lowLabel: "Confident & unchecked",
    explain: {
      high: "The agent rigorously self-checks its claims, flags assumptions, and adds caveats.",
      mid: "The agent does a light sanity check on its own answer.",
      low: "The agent answers confidently without double-checking anything.",
    },
  },
  {
    id: "memory",
    name: "Memory",
    symbol: "M",
    icon: "🧩",
    category: "cognitive",
    blurb: "Context retention & long-range coherence.",
    highLabel: "Holds full context",
    lowLabel: "Tunnel vision",
    explain: {
      high: "The agent retains and references full context across the entire session.",
      mid: "The agent keeps the recent context in view.",
      low: "The agent focuses narrowly on just the latest message.",
    },
  },
  {
    id: "creativity",
    name: "Creativity",
    symbol: "C",
    icon: "🎨",
    category: "creative",
    blurb: "Originality, metaphor & lateral leaps.",
    highLabel: "Inventive & vivid",
    lowLabel: "Literal & dry",
    explain: {
      high: "The agent reaches for vivid metaphors and original, lateral ideas.",
      mid: "The agent adds the occasional creative flourish.",
      low: "The agent stays literal, conventional, and dry.",
    },
  },
  {
    id: "precision",
    name: "Precision",
    symbol: "X",
    icon: "🎯",
    category: "creative",
    blurb: "Exactness, specificity & accuracy.",
    highLabel: "Pinpoint accuracy",
    lowLabel: "Approximate",
    explain: {
      high: "The agent is exact and specific, pinning down every detail and number.",
      mid: "The agent is reasonably specific where it matters.",
      low: "The agent gives approximate, high-level answers.",
    },
  },
  {
    id: "verbosity",
    name: "Verbosity",
    symbol: "B",
    icon: "📝",
    category: "creative",
    blurb: "Length & detail of the response.",
    highLabel: "Thorough & long-form",
    lowLabel: "Terse & punchy",
    explain: {
      high: "The agent writes thorough, long-form responses with full detail.",
      mid: "The agent keeps things moderately detailed.",
      low: "The agent is terse and punchy — short by default.",
    },
  },
  {
    id: "risk",
    name: "Risk",
    symbol: "K",
    icon: "🎲",
    category: "personality",
    blurb: "Boldness, unconventional & contrarian moves.",
    highLabel: "Bold & contrarian",
    lowLabel: "Safe & conservative",
    explain: {
      high: "The agent makes bold, unconventional, even contrarian calls.",
      mid: "The agent weighs safe vs. bold moves case by case.",
      low: "The agent plays it safe and sticks to conservative, proven answers.",
    },
  },
  {
    id: "empathy",
    name: "Empathy",
    symbol: "E",
    icon: "💛",
    category: "personality",
    blurb: "Warmth, tone & human-centric framing.",
    highLabel: "Warm & relatable",
    lowLabel: "Clinical & neutral",
    explain: {
      high: "The agent is warm, relatable, and human-centric in tone.",
      mid: "The agent is friendly but measured.",
      low: "The agent is clinical, neutral, and to-the-point.",
    },
  },
  {
    id: "autonomy",
    name: "Autonomy",
    symbol: "A",
    icon: "⚡",
    category: "personality",
    blurb: "Decisiveness & initiative without hedging.",
    highLabel: "Decisive & proactive",
    lowLabel: "Hedging & cautious",
    explain: {
      high: "The agent is decisive — it commits to a recommendation and takes initiative.",
      mid: "The agent offers options, then leans toward a recommendation.",
      low: "The agent hedges and defers, asking for direction.",
    },
  },
];

export const GENE_IDS = GENES.map((g) => g.id);
export const GENE_MAP: Record<string, GeneDef> = Object.fromEntries(
  GENES.map((g) => [g.id, g])
);

export const CATEGORY_META: Record<
  GeneCategory,
  { label: string; color: string; dot: string }
> = {
  cognitive: { label: "Cognitive", color: "moss", dot: "#2f6b43" },
  creative: { label: "Expression", color: "leaf", dot: "#4e9f6d" },
  personality: { label: "Personality", color: "honey", dot: "#d6a23a" },
};

export const emptyGenes = (): Genes =>
  Object.fromEntries(GENE_IDS.map((id) => [id, 50]));

export const clampGene = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export function normalizeGenes(g?: Partial<Genes>): Genes {
  const base = emptyGenes();
  if (g) for (const id of GENE_IDS) if (g[id] != null) base[id] = clampGene(g[id]);
  return base;
}

export function geneIntensity(v: number): "low" | "mid" | "high" {
  if (v >= 66) return "high";
  if (v <= 33) return "low";
  return "mid";
}

// Live teaching copy for a gene at a given value — "Reasoning 70 ↓ deeper analysis"
export function geneExplanation(id: string, value: number): string {
  const def = GENE_MAP[id];
  if (!def) return "";
  return def.explain[geneIntensity(value)];
}

export function geneVerb(value: number): "leans" | "balanced" | "pushes" {
  const t = geneIntensity(value);
  if (t === "high") return "pushes";
  if (t === "low") return "leans";
  return "balanced";
}

// Average gene value — used for "genotype strength"
export function genomePower(genes: Genes): number {
  const vals = GENE_IDS.map((id) => genes[id] ?? 0);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ── Genome + versioning ──────────────────────────────────────

export interface GenomeVersion {
  version: number;
  createdAt: number;
  genes: Genes;
  note: string;
}

export interface Genome {
  id: string;
  name: string;
  category: string;
  description: string;
  genes: Genes;
  versions: GenomeVersion[];
  createdAt: number;
  updatedAt: number;
  starred: boolean;
  color: string; // accent for cards
  author: string;
}

export const GENOME_COLORS = [
  "#2f6b43",
  "#4e9f6d",
  "#d6a23a",
  "#3a7d9b",
  "#b9573f",
  "#7a5cb8",
  "#2f8f7a",
  "#9b6b3a",
];

export const CATEGORIES = [
  "Engineering",
  "Research",
  "Creative",
  "Support",
  "Analysis",
  "Strategy",
  "Safety",
  "General",
];

export function seqHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function uid(prefix = "g"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

// A faux nucleotide sequence derived from the genome — pure flavor
export function genomeSequence(genes: Genes, len = 24): string {
  const bases = ["A", "C", "G", "T"];
  let out = "";
  let seed = 7;
  for (const id of GENE_IDS) seed += (genes[id] ?? 50) * (id.length + 1);
  for (let i = 0; i < len; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    out += bases[seed % 4];
  }
  return out;
}

// ── Presets / seed library ───────────────────────────────────

interface Preset {
  name: string;
  category: string;
  description: string;
  color: string;
  genes: Partial<Genes>;
}

export const PRESETS: Preset[] = [
  {
    name: "Engineer",
    category: "Engineering",
    color: "#2f6b43",
    description:
      "Methodical builder. Deep reasoning, rigorous verification, low risk.",
    genes: {
      reasoning: 90,
      planning: 82,
      verification: 100,
      memory: 70,
      creativity: 35,
      precision: 95,
      verbosity: 60,
      risk: 15,
      empathy: 30,
      autonomy: 70,
    },
  },
  {
    name: "Researcher",
    category: "Research",
    color: "#3a7d9b",
    description:
      "Cautious analyst. High memory, verification & precision, measured tone.",
    genes: {
      reasoning: 80,
      planning: 65,
      verification: 92,
      memory: 96,
      creativity: 45,
      precision: 88,
      verbosity: 72,
      risk: 20,
      empathy: 40,
      autonomy: 55,
    },
  },
  {
    name: "Creative",
    category: "Creative",
    color: "#d6a23a",
    description:
      "Expressive storyteller. Max creativity & warmth, comfortable with risk.",
    genes: {
      reasoning: 55,
      planning: 48,
      verification: 35,
      memory: 60,
      creativity: 98,
      precision: 50,
      verbosity: 78,
      risk: 72,
      empathy: 88,
      autonomy: 75,
    },
  },
  {
    name: "Analyst",
    category: "Analysis",
    color: "#7a5cb8",
    description:
      "Numbers-first thinker. Precision & reasoning lead, terse and exact.",
    genes: {
      reasoning: 88,
      planning: 70,
      verification: 85,
      memory: 74,
      creativity: 28,
      precision: 96,
      verbosity: 38,
      risk: 25,
      empathy: 32,
      autonomy: 64,
    },
  },
  {
    name: "Support Agent",
    category: "Support",
    color: "#2f8f7a",
    description:
      "Warm concierge. High empathy & memory, safe and human-centric.",
    genes: {
      reasoning: 62,
      planning: 58,
      verification: 70,
      memory: 90,
      creativity: 60,
      precision: 66,
      verbosity: 64,
      risk: 12,
      empathy: 98,
      autonomy: 58,
    },
  },
  {
    name: "Strategist",
    category: "Strategy",
    color: "#b9573f",
    description:
      "Bold planner. High autonomy & planning, willing to make decisive calls.",
    genes: {
      reasoning: 78,
      planning: 94,
      verification: 60,
      memory: 72,
      creativity: 66,
      precision: 70,
      verbosity: 58,
      risk: 60,
      empathy: 45,
      autonomy: 95,
    },
  },
];

export function presetToGenome(p: Preset, now = Date.now()): Genome {
  const genes = normalizeGenes(p.genes);
  return {
    id: uid("gen"),
    name: `${p.name} DNA`,
    category: p.category,
    description: p.description,
    genes,
    color: p.color,
    starred: p.name === "Engineer",
    author: "GenomeAI",
    createdAt: now - Math.floor(Math.random() * 9) * 86400000,
    updatedAt: now,
    versions: [
      {
        version: 1,
        createdAt: now - 9 * 86400000,
        genes: normalizeGenes({}),
        note: "Initial blank genome seeded",
      },
      {
        version: 2,
        createdAt: now - 4 * 86400000,
        genes,
        note: `Tuned to ${p.name} profile`,
      },
    ],
  };
}

export function seedGenomes(): Genome[] {
  const now = Date.now();
  return PRESETS.map((p) => presetToGenome(p, now));
}
