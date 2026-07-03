// ─────────────────────────────────────────────────────────────
// Behavior Engine
// Given a genome (genes) + a task, simulate an AI response whose
// STRUCTURE, TONE, LENGTH and METRICS are driven by the genes.
// This is what makes "Digital DNA controls behavior" tangible.
// Deterministic per (prompt + genes) → reproducible & auditable.
// ─────────────────────────────────────────────────────────────

import {
  GENE_IDS,
  GENE_MAP,
  type Genes,
  seqHash,
  geneIntensity,
} from "./dna";

// Seeded PRNG (mulberry32) for deterministic output
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STOP = new Set([
  "the","a","an","to","of","for","and","or","in","on","with","how","what","why",
  "when","is","are","my","me","i","you","your","please","write","create","make",
  "give","explain","do","can","should","would","about","into","this","that","it",
  "be","as","at","by","from","using","help","need","want","get","us","our","we",
]);

function topic(prompt: string): string {
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .slice(0, 7);
  const t = words.join(" ") || "the request";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export type Tone = "high" | "mid" | "low";

export interface TraceStep {
  kind: "recall" | "plan" | "reason" | "verify" | "decide";
  title: string;
  icon: string;
  lines: string[];
}

export interface ContentBlock {
  type: "para" | "list" | "quote" | "caveat" | "callout";
  text?: string;
  items?: string[];
}

export interface BehaviorTag {
  geneId: string;
  label: string;
  tone: Tone;
}

export interface Metrics {
  tokens: number;
  latencyMs: number;
  costCents: number;
  coherence: number;
}

export interface GeneratedOutput {
  topic: string;
  trace: TraceStep[];
  blocks: ContentBlock[];
  tags: BehaviorTag[];
  metrics: Metrics;
  genes: Genes;
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}
function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── phrase banks ──────────────────────────────────────────────

const LEADS = {
  warm: [
    "Happy to dig into {t} with you — let's work through it together.",
    "Great question on {t}. Let me lay this out clearly.",
    "Let's unpack {t} step by step so it actually sticks.",
  ],
  decisive: [
    "Here's the direct read on {t}.",
    "Cutting to it — {t} comes down to three things.",
    "No fluff: here's exactly how I'd handle {t}.",
  ],
  bold: [
    "Let's be honest about {t} — most takes on this miss the point.",
    "Bold claim up front: {t} rewards the unconventional move.",
    "I'll go against the grain here on {t}, and here's why.",
  ],
  neutral: [
    "On {t}, here's how I'd approach it.",
    "Breaking down {t} into its essentials.",
    "A structured take on {t} below.",
  ],
};

const POINTS = [
  "The core of {t} is getting a few moving parts to line up cleanly.",
  "Start by isolating the single constraint that matters most for {t}.",
  "Most teams underestimate how much {t} depends on sequencing.",
  "{t} rarely fails because of effort — it fails because of unclear priorities.",
  "Treat {t} as a system, not a one-off task, and it gets far easier.",
  "The fastest win on {t} is usually removing something, not adding it.",
  "Get the feedback loop tight on {t} and the rest compounds.",
  "{t} rewards whoever defines success first.",
];

const PRECISE = [
  "Specifically, attach a measurable signal to it — anything you can't measure, you can't improve.",
  "Pin a number and a deadline to each step; vagueness is where {t} quietly dies.",
  "Define the done-state in one sentence so there's no ambiguity.",
];

const CREATIVE = [
  "Think of {t} like tending a garden: small, consistent inputs compound into something resilient.",
  "Picture {t} as a current — work with its direction instead of fighting the flow.",
  "Imagine {t} is a story you're telling a friend; clarity beats complexity every time.",
];

const BOLD = [
  "Frankly, the conventional playbook here is mostly recycled advice that stalls progress.",
  "I'd argue the 'safe' move on {t} is actually the riskiest one long-term.",
  "Most people optimize for looking busy on {t} instead of moving the real metric.",
];

const RELATE = [
  "If you've ever felt stuck on {t}, you're not alone — it trips up almost everyone at first.",
  "Be patient with yourself here; {t} clicks once the pattern clicks, not before.",
];

const PLAN_STEPS = [
  "Clarify the goal and the single metric that defines done.",
  "Map the constraints and the dependencies between them.",
  "Sequence the work so the riskiest unknown gets resolved first.",
  "Ship a thin end-to-end slice before polishing any one part.",
  "Instrument a feedback loop and decide what 'good' looks like.",
  "Review against the original metric, then iterate.",
];

const VERIFY = [
  "Confirm each claim against a primary source before trusting it.",
  "Stress-test the conclusion with one counter-example.",
  "Double-check the numbers — estimates rounded, not invented.",
  "Flag any assumption that isn't backed by evidence.",
];

const CAVEAT =
  "Verify the specifics against your own data and constraints before committing — these are reasoned defaults, not guarantees.";

const CLOSING = {
  decisive: ["Bottom line: start now, refine as you go.", "Pick the smallest next step and take it today."],
  warm: ["Hope this gives you a clear path forward — you've got this.", "Take it one step at a time; you're closer than it feels."],
  neutral: ["That should give you a solid foundation to build on.", "Use this as a starting point and adapt to your context."],
};

// ── public API ───────────────────────────────────────────────

export function describeGenome(genes: Genes): string {
  const ranked = [...GENE_IDS]
    .map((id) => ({ id, v: genes[id] ?? 50 }))
    .sort((a, b) => Math.abs(b.v - 50) - Math.abs(a.v - 50));
  const top = ranked.slice(0, 3);
  const parts = top.map(({ id, v }) => {
    const g = GENE_MAP[id];
    const label = v >= 50 ? g.highLabel.toLowerCase() : g.lowLabel.toLowerCase();
    return label;
  });
  const joiner = parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts[0];
  return cap(`Favors ${joiner}.`);
}

export function behaviorTags(genes: Genes, max = 4): BehaviorTag[] {
  const tagged = [...GENE_IDS]
    .map((id) => ({ id, v: genes[id] ?? 50, def: GENE_MAP[id] }))
    .filter((g) => g.v >= 68 || g.v <= 28)
    .sort((a, b) => Math.abs(b.v - 50) - Math.abs(a.v - 50));
  return tagged.slice(0, max).map((g) => ({
    geneId: g.id,
    label: g.v >= 50 ? g.def.highLabel : g.def.lowLabel,
    tone: geneIntensity(g.v),
  }));
}

export function generate(prompt: string, genes: Genes): GeneratedOutput {
  const seed = seqHash(prompt.trim().toLowerCase() + "|" + GENE_IDS.map((i) => genes[i]).join(","));
  const rng = mulberry32(seed);
  const t = topic(prompt);
  const g = (id: string) => genes[id] ?? 50;

  // ── trace (visible thinking) ──
  const trace: TraceStep[] = [];

  if (g("memory") >= 45) {
    const n = Math.max(1, Math.round(g("memory") / 30));
    trace.push({
      kind: "recall",
      title: "Context recall",
      icon: "🧩",
      lines: [
        `User goal: ${t.toLowerCase()}.`,
        ...Array.from({ length: n }, () => pick(rng, [
          "Loaded prior constraints from the active session.",
          "Cross-referenced related decisions already on file.",
          "Retained the tone & format preferences established earlier.",
        ])),
      ],
    });
  }
  if (g("planning") >= 45) {
    const steps = Math.min(6, Math.max(2, Math.round(g("planning") / 18)));
    trace.push({
      kind: "plan",
      title: "Plan",
      icon: "🗂️",
      lines: PLAN_STEPS.slice(0, steps).map((s, i) => `${i + 1}. ${s}`),
    });
  }
  if (g("reasoning") >= 40) {
    const n = Math.min(4, Math.max(1, Math.round(g("reasoning") / 28)));
    const chain = [
      `Premise: ${t.toLowerCase()} has a clear dominant variable.`,
      "If we control that variable first, the rest becomes tractable.",
      "Therefore sequence matters more than raw effort.",
      "Q.E.D. — prioritize the highest-leverage step.",
    ];
    trace.push({
      kind: "reason",
      title: "Reasoning",
      icon: "🧠",
      lines: chain.slice(0, n),
    });
  }
  if (g("verification") >= 50) {
    const n = Math.min(4, Math.max(1, Math.round(g("verification") / 26)));
    trace.push({
      kind: "verify",
      title: "Verification",
      icon: "✅",
      lines: VERIFY.slice(0, n),
    });
  }
  if (g("autonomy") >= 70) {
    trace.push({
      kind: "decide",
      title: "Decision",
      icon: "⚡",
      lines: ["Committing to the highest-leverage path now rather than hedging."],
    });
  }

  // ── body ──
  const blocks: ContentBlock[] = [];

  const warm = g("empathy") >= 62;
  const decisive = g("autonomy") >= 60;
  const bold = g("risk") >= 60;
  const leadKey = warm ? "warm" : bold ? "bold" : decisive ? "decisive" : "neutral";
  blocks.push({ type: "para", text: pick(rng, LEADS[leadKey]).replace("{t}", t.toLowerCase()) });

  const paras = Math.min(5, Math.max(1, Math.round(1 + g("verbosity") / 26)));
  for (let i = 0; i < paras; i++) {
    let para = pick(rng, POINTS).replace("{t}", t.toLowerCase());

    if (g("precision") >= 60 && rng() < 0.7) para += " " + pick(rng, PRECISE).replace("{t}", t.toLowerCase());
    if (g("creativity") >= 58 && rng() < 0.6) para += " " + pick(rng, CREATIVE).replace("{t}", t.toLowerCase());
    if (bold && rng() < 0.5) para += " " + pick(rng, BOLD).replace("{t}", t.toLowerCase());
    if (warm && rng() < 0.45) para += " " + pick(rng, RELATE).replace("{t}", t.toLowerCase());
    blocks.push({ type: "para", text: para });
  }

  // optional structured list if planning/precision leans structured
  if (g("planning") >= 55 && g("verbosity") >= 40) {
    blocks.push({
      type: "list",
      items: PLAN_STEPS.slice(0, Math.min(4, Math.max(2, Math.round(g("planning") / 22)))).map(cap),
    });
  }

  if (g("creativity") >= 70) {
    blocks.push({ type: "quote", text: `"${pick(rng, CREATIVE).replace("{t}", t.toLowerCase())}"` });
  }
  if (g("verification") >= 55) {
    blocks.push({ type: "caveat", text: CAVEAT });
  }

  const closeKey = decisive ? "decisive" : warm ? "warm" : "neutral";
  blocks.push({ type: "para", text: pick(rng, CLOSING[closeKey]) });

  // ── metrics ──
  let charCount = 0;
  for (const b of blocks) {
    if (b.text) charCount += b.text.length;
    if (b.items) charCount += b.items.join(" ").length;
  }
  for (const tr of trace) charCount += tr.lines.join(" ").length;

  const thinkTokens = Math.round((g("reasoning") + g("planning") + g("verification")) * 1.4);
  const outputTokens = Math.round(charCount / 4) + 20;
  const tokens = outputTokens + thinkTokens;

  const latencyMs = Math.round(
    260 +
      g("reasoning") * 7.2 +
      g("planning") * 6.4 +
      g("verification") * 5.1 +
      g("memory") * 3.3 +
      g("creativity") * 2.2 +
      (rng() * 140 - 70)
  );

  const costCents = Math.round((outputTokens * 0.0009 + thinkTokens * 0.0014) * 100) / 100;

  const coherence = Math.max(
    12,
    Math.min(
      99,
      Math.round(g("memory") * 0.3 + g("verification") * 0.26 + g("reasoning") * 0.24 + g("precision") * 0.2)
    )
  );

  return {
    topic: t,
    trace,
    blocks,
    tags: behaviorTags(genes),
    metrics: { tokens, latencyMs, costCents, coherence },
    genes,
  };
}

// ─────────────────────────────────────────────────────────────
// Cause-and-effect: tie gene values to *observable output traits*.
// This is what teaches the user that genes ⇒ behavior.
// Baseline = 50 ("a generic default agent"); delta is % of baseline.
// ─────────────────────────────────────────────────────────────

const BASELINE = 50;

/** what each gene adds (high) or removes (low) from the output */
const EFFECTS: Record<string, { high: string; low: string }> = {
  reasoning: { high: "Deeper analysis", low: "Faster, surface answers" },
  planning: { high: "More structured", low: "More reactive" },
  verification: { high: "More verification", low: "Less validation" },
  memory: { high: "Holds more context", low: "Narrower focus" },
  creativity: { high: "More novel ideas", low: "More literal" },
  precision: { high: "More specific detail", low: "More approximate" },
  verbosity: { high: "Longer response", low: "More concise" },
  risk: { high: "Bolder takes", low: "More conservative" },
  empathy: { high: "Warmer tone", low: "More clinical" },
  autonomy: { high: "More decisive", low: "More hedging" },
};

/** noun phrases used to build the "why this answer" sentence */
const CAUSE: Record<string, string> = {
  reasoning: "implementation detail",
  planning: "structure",
  verification: "validation",
  memory: "context recall",
  creativity: "novelty",
  precision: "specificity",
  verbosity: "length",
  risk: "boldness",
  empathy: "warmth",
  autonomy: "decisiveness",
};

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
}

export interface Highlight {
  geneId: string;
  label: string;
  direction: "up" | "down";
  value: number;
}

// Distinctive traits of a genome vs. a default agent — for the ✓ checklists.
export function genomeHighlights(genes: Genes, max = 3): Highlight[] {
  return GENE_IDS.map((id) => {
    const v = genes[id] ?? 50;
    const diff = v - BASELINE;
    const dir: "up" | "down" = diff >= 0 ? "up" : "down";
    const label = dir === "up" ? EFFECTS[id].high : EFFECTS[id].low;
    return { geneId: id, label, direction: dir, value: v };
  })
    .filter((h) => Math.abs(h.value - BASELINE) >= 16)
    .sort((a, b) => Math.abs(b.value - BASELINE) - Math.abs(a.value - BASELINE))
    .slice(0, max);
}

export interface GeneInfluence {
  geneId: string;
  value: number;
  deltaPct: number; // signed % deviation from baseline (−100..+100)
}

export interface WhyAnswer {
  influences: GeneInfluence[];
  summary: string;
}

export function whyThisAnswer(genes: Genes): WhyAnswer {
  const influences: GeneInfluence[] = GENE_IDS.map((id) => {
    const value = genes[id] ?? 50;
    const deltaPct = Math.round(((value - BASELINE) / BASELINE) * 100);
    return { geneId: id, value, deltaPct };
  })
    .filter((i) => Math.abs(i.deltaPct) >= 10)
    .sort((a, b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct))
    .slice(0, 4);

  const increased = influences.filter((i) => i.deltaPct > 0);
  const decreased = influences.filter((i) => i.deltaPct < 0);

  // keep the sentence focused on the most influential genes
  const inc = increased.slice(0, 2);
  const dec = decreased.slice(0, 1);

  let summary: string;
  if (inc.length === 0 && dec.length === 0) {
    summary =
      "This response reflects a balanced genome — no single gene pulled the output strongly in either direction.";
  } else {
    const incEffects = joinList(inc.map((i) => CAUSE[i.geneId]));
    const incNames = joinList(inc.map((i) => GENE_MAP[i.geneId].name));
    let s = `This response contained more ${incEffects} because ${incNames} ${
      inc.length > 1 ? "were" : "was"
    } raised above the default`;
    if (dec.length) {
      const decName = GENE_MAP[dec[0].geneId].name;
      s += `, while ${decName} was lowered to reduce ${CAUSE[dec[0].geneId]}`;
    }
    summary = s + ".";
  }

  return { influences, summary };
}
