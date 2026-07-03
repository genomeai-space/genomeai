import { useMemo, useState } from "react";
import {
  GENES,
  GENE_MAP,
  CATEGORY_META,
  geneExplanation,
  geneIntensity,
  normalizeGenes,
  type GeneCategory,
  type Genes,
} from "@/lib/dna";
import { describeGenome, behaviorTags } from "@/lib/engine";
import { DNAStrand, SequenceStrip, geneColor } from "@/components/ui/dna";
import { Eyebrow, GeneRange, Pill, Reveal } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

const QUICK = [
  { label: "🧪 Engineer", genes: { reasoning: 90, verification: 100, precision: 95, risk: 15, creativity: 35 } },
  { label: "🎨 Creative", genes: { creativity: 98, empathy: 88, risk: 72, verbosity: 78 } },
  { label: "🔬 Researcher", genes: { memory: 96, verification: 92, precision: 88 } },
  { label: "⚡ Strategist", genes: { autonomy: 95, planning: 94, reasoning: 78 } },
  { label: "🧊 Reset", genes: {} },
];

function predict(genes: Genes) {
  const r = genes.reasoning, p = genes.planning, v = genes.verification, m = genes.memory, c = genes.creativity, b = genes.verbosity;
  const think = Math.round((r + p + v) * 1.4);
  const out = Math.round(120 + b * 3.5 + c * 1.2);
  const tokens = think + out;
  const latency = Math.round(260 + r * 7 + p * 6 + v * 5 + m * 3 + c * 2);
  const cost = Math.round((out * 0.0009 + think * 0.0014) * 100) / 100;
  const coherence = Math.max(12, Math.min(99, Math.round(m * 0.3 + v * 0.26 + r * 0.24 + (genes.precision ?? 50) * 0.2)));
  return { tokens, latency, cost, coherence };
}

// Prominent panel that teaches what the active gene does at its current value.
// Format mirrors the spec: "Reasoning 70 ↓ The agent performs deeper analysis…"
function LiveExplainPanel({ geneId, value }: { geneId: string; value: number }) {
  const def = GENE_MAP[geneId];
  if (!def) return null;
  const tier = geneIntensity(value);
  const color = geneColor(value);
  const verb = tier === "high" ? "↑ high" : tier === "low" ? "↓ low" : "· mid";

  return (
    <div className="w-full animate-fade-up overflow-hidden rounded-xl border border-moss/40 bg-mint/25 p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-moss">
          Live explanation
        </span>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold",
            tier === "high" && "bg-moss/15 text-forest-700",
            tier === "mid" && "bg-sand text-stone",
            tier === "low" && "bg-honey/15 text-[#8a6315]"
          )}
        >
          {verb}
        </span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg">{def.icon}</span>
        <span className="font-display text-sm font-bold text-forest">{def.name}</span>
        <span className="font-mono text-lg font-bold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="mt-1.5 flex items-start gap-2">
        <span className="mt-0.5 font-mono text-sm font-bold" style={{ color }}>
          ↓
        </span>
        <p className="text-[12.5px] leading-snug text-forest">
          {geneExplanation(geneId, value)}
        </p>
      </div>
    </div>
  );
}

export function InteractiveDemo() {
  const [genes, setGenes] = useState<Genes>(() =>
    normalizeGenes({ reasoning: 70, verification: 55, creativity: 60, risk: 40, empathy: 50, precision: 60, planning: 50, memory: 55, verbosity: 55, autonomy: 55 })
  );
  const [activeGene, setActiveGene] = useState<string>("reasoning");

  const set = (id: string, v: number) => {
    setGenes((g) => ({ ...g, [id]: v }));
    setActiveGene(id);
  };
  const apply = (patch: Partial<Genes>) =>
    setGenes((g) => normalizeGenes({ ...g, ...patch }));

  const tags = useMemo(() => behaviorTags(genes, 3), [genes]);
  const m = useMemo(() => predict(genes), [genes]);
  const desc = useMemo(() => describeGenome(genes), [genes]);

  const cats: GeneCategory[] = ["cognitive", "creative", "personality"];

  return (
    <section id="editor" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-mint/40 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-72 w-72 rounded-full bg-spring/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>The Genome Editor</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-forest sm:text-5xl text-balance">
            Shape the mind with sliders, not syntax
          </h2>
          <p className="mt-4 text-lg text-stone">
            This is the heart of the platform. Every gene is a behavior dial. Move
            them and the AI's personality, cost, and speed update instantly — no
            prompt editing, ever.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-sand bg-paper shadow-xl shadow-forest/10">
            <div className="grid lg:grid-cols-[320px_1fr]">
              {/* helix + readout */}
              <div className="relative flex flex-col items-center justify-center gap-4 border-b border-sand bg-gradient-to-b from-fog to-paper p-8 lg:border-b-0 lg:border-r">
                <DNAStrand genes={genes} width={140} height={270} />
                <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-spring/70">LIVE GENOME</div>
                <SequenceStrip genes={genes} />

                {/* live explanation panel — teaches the active gene */}
                <LiveExplainPanel
                  key={activeGene}
                  geneId={activeGene}
                  value={genes[activeGene]}
                />

                <div className="w-full rounded-xl border border-sand bg-cream/70 p-3 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                    Behavioral readout
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-forest">{desc}</p>
                </div>
              </div>

              {/* controls */}
              <div className="p-6 sm:p-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-forest">
                    Genome controls
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK.map((q) => (
                      <button
                        key={q.label}
                        onClick={() =>
                          q.label.includes("Reset")
                            ? setGenes(normalizeGenes({}))
                            : apply(q.genes)
                        }
                        className="rounded-lg border border-sand bg-cream px-2.5 py-1.5 text-[12px] font-medium text-stone transition-colors hover:border-moss hover:text-forest"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* tags */}
                <div className="mb-6 flex min-h-[28px] flex-wrap gap-2">
                  {tags.length === 0 && (
                    <span className="text-[12px] italic text-mist">
                      Push genes toward extremes to see traits emerge…
                    </span>
                  )}
                  {tags.map((t) => (
                    <Pill key={t.geneId} tone={t.tone === "high" ? "green" : "honey"}>
                      {GENE_MAP[t.geneId].icon} {t.label}
                    </Pill>
                  ))}
                </div>

                {/* gene sliders by category */}
                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {cats.map((cat) => (
                    <div key={cat}>
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: CATEGORY_META[cat].dot }}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone">
                          {CATEGORY_META[cat].label}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {GENES.filter((g) => g.category === cat).map((g) => {
                          const v = genes[g.id];
                          const isActive = activeGene === g.id;
                          return (
                            <div
                              key={g.id}
                              className={cn(
                                "rounded-lg px-2 py-1.5 transition-colors",
                                isActive ? "bg-mint/30 ring-1 ring-moss/30" : "hover:bg-cream/40"
                              )}
                            >
                              <div className="mb-1.5 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
                                  <span aria-hidden>{g.icon}</span>
                                  {g.name}
                                </span>
                                <span
                                  className="font-mono text-[12px] font-bold tabular-nums"
                                  style={{ color: geneColor(v) }}
                                >
                                  {v}
                                </span>
                              </div>
                              <GeneRange value={v} onChange={(nv) => set(g.id, nv)} color={geneColor(v)} />
                              <p
                                className={cn(
                                  "mt-1.5 overflow-hidden text-[11.5px] leading-snug transition-all",
                                  isActive ? "max-h-16 text-stone opacity-100" : "max-h-0 opacity-0"
                                )}
                              >
                                {geneExplanation(g.id, v)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* predicted metrics */}
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { l: "Latency", v: `${(m.latency / 1000).toFixed(2)}s`, c: "#2f6b43" },
                    { l: "Tokens", v: m.tokens.toLocaleString(), c: "#4e9f6d" },
                    { l: "Cost", v: `${m.cost}¢`, c: "#d6a23a" },
                    { l: "Coherence", v: m.coherence, c: "#3a7d9b" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-sand bg-cream/60 px-3 py-2.5"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-mist">
                        {s.l}
                      </div>
                      <div
                        className="font-display text-lg font-bold tabular-nums"
                        style={{ color: s.c }}
                      >
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-mist">
                  ↑ These metrics are derived live from the gene values — the same
                  engine that powers the Playground & Benchmark.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
