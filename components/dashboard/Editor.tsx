import { useEffect, useMemo, useRef, useState } from "react";
import { useStore, CATEGORIES } from "@/lib/store";
import {
  GENES,
  GENE_MAP,
  CATEGORY_META,
  PRESETS,
  geneExplanation,
  geneIntensity,
  type GeneCategory,
  type Genes,
  genomePower,
} from "@/lib/dna";
import { describeGenome, behaviorTags } from "@/lib/engine";
import { DashboardLayout } from "./DashboardLayout";
import { Button, GeneRange, Pill, Toggle } from "@/components/ui/primitives";
import { DNAStrand, SequenceStrip, geneColor } from "@/components/ui/dna";
import { GenomeMetaTable } from "@/components/ui/GenomeMetadata";
import { cn } from "@/utils/cn";

const CATS: GeneCategory[] = ["cognitive", "creative", "personality"];

function genesEqual(a: Genes, b: Genes) {
  return Object.keys(a).every((k) => a[k] === b[k]);
}

export function Editor() {
  const { route, go, genomes, getGenome, setGenes, updateGenome } = useStore();

  const genome = getGenome(route.genomeId) || genomes[0];

  const [work, setWork] = useState<Genes>(genome?.genes || {});
  const [name, setName] = useState(genome?.name || "");
  const [category, setCategory] = useState(genome?.category || "General");
  const [description, setDescription] = useState(genome?.description || "");
  const [liveUpdate, setLiveUpdate] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [activeGene, setActiveGene] = useState<string>("reasoning");
  const firstLoad = useRef(genome?.id);

  // re-sync when switching genomes
  useEffect(() => {
    if (!genome) return;
    setWork(genome.genes);
    setName(genome.name);
    setCategory(genome.category);
    setDescription(genome.description);
    firstLoad.current = genome.id;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genome?.id]);

  // optional live push to store (so playground mirrors without saving)
  useEffect(() => {
    if (liveUpdate && genome && !genesEqual(work, genome.genes)) {
      setGenes(genome.id, work);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [work, liveUpdate]);

  const dirty = genome ? !genesEqual(work, genome.genes) || name !== genome.name || category !== genome.category || description !== genome.description : false;

  const set = (id: string, v: number) => {
    setWork((w) => ({ ...w, [id]: v }));
    setActiveGene(id);
  };

  const tags = useMemo(() => behaviorTags(work, 4), [work]);
  const desc = useMemo(() => describeGenome(work), [work]);
  const power = genomePower(work);

  // live predicted metrics
  const metrics = useMemo(() => {
    const r = work.reasoning ?? 50, p = work.planning ?? 50, v = work.verification ?? 50;
    const m = work.memory ?? 50, c = work.creativity ?? 50, b = work.verbosity ?? 50, x = work.precision ?? 50;
    const think = Math.round((r + p + v) * 1.4);
    const out = Math.round(120 + b * 3.5 + c * 1.2);
    const tokens = think + out;
    const latency = Math.round(260 + r * 7 + p * 6 + v * 5 + m * 3 + c * 2);
    const cost = Math.round((out * 0.0009 + think * 0.0014) * 100) / 100;
    const coherence = Math.max(12, Math.min(99, Math.round(m * 0.3 + v * 0.26 + r * 0.24 + x * 0.2)));
    return { tokens, latency, cost, coherence };
  }, [work]);

  const save = () => {
    if (!genome) return;
    updateGenome(
      genome.id,
      { genes: work, name, category, description },
      `Tuned: ${desc}`,
      true
    );
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  const discard = () => {
    if (!genome) return;
    setWork(genome.genes);
    setName(genome.name);
    setCategory(genome.category);
    setDescription(genome.description);
  };

  if (!genome) {
    return (
      <DashboardLayout title="DNA Editor" subtitle="No genome selected">
        <div className="rounded-2xl border border-dashed border-sand py-16 text-center">
          <p className="text-stone">Create a genome to start editing.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="DNA Editor"
      subtitle="Tune genes — never raw prompts"
      actions={
        <>
          <select
            value={genome.id}
            onChange={(e) => go({ tab: "editor", genomeId: e.target.value })}
            className="hidden h-9 rounded-lg border border-sand bg-paper px-2.5 text-[13px] text-forest outline-none sm:block"
          >
            {genomes.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <Button size="sm" variant="dark" onClick={() => go({ tab: "playground", genomeId: genome.id })}>
            ▶ Run
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* editor */}
        <div className="space-y-5">
          {/* meta */}
          <div className="rounded-2xl border border-sand bg-paper p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-mist">
                  Genome name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-sand bg-cream/40 px-3 py-2 font-display text-base font-semibold text-forest outline-none focus:border-moss focus:bg-paper"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-mist">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-sand bg-cream/40 px-3 py-2 text-sm text-forest outline-none focus:border-moss"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-mist">
                  Description
                </label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-sand bg-cream/40 px-3 py-2 text-sm text-ink outline-none focus:border-moss focus:bg-paper"
                />
              </div>
            </div>
          </div>

          {/* genes */}
          {CATS.map((cat) => (
            <div key={cat} className="rounded-2xl border border-sand bg-paper p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_META[cat].dot }} />
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-forest">
                  {CATEGORY_META[cat].label} genes
                </h3>
              </div>
              <div className="space-y-3">
                {GENES.filter((g) => g.category === cat).map((g) => {
                  const v = work[g.id] ?? 50;
                  const def = GENE_MAP[g.id];
                  const hi = v >= 50;
                  const isActive = activeGene === g.id;
                  return (
                    <div
                      key={g.id}
                      className={cn(
                        "rounded-lg px-2 py-1.5 transition-colors",
                        isActive ? "bg-mint/30 ring-1 ring-moss/30" : "hover:bg-cream/40"
                      )}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{g.icon}</span>
                          <div>
                            <span className="text-[13.5px] font-semibold text-forest">{g.name}</span>
                            <span className="ml-2 text-[11px] text-mist">{g.blurb}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium uppercase tracking-wide text-mist">
                            {hi ? def.highLabel : def.lowLabel}
                          </span>
                          <span
                            className="w-9 text-right font-mono text-[13px] font-bold tabular-nums"
                            style={{ color: geneColor(v) }}
                          >
                            {v}
                          </span>
                        </div>
                      </div>
                      <GeneRange value={v} onChange={(nv) => set(g.id, nv)} color={geneColor(v)} />
                      <p
                        className={cn(
                          "mt-1.5 overflow-hidden text-[12px] leading-snug transition-all",
                          isActive ? "max-h-16 text-stone opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <span className="font-semibold text-moss">↓ </span>
                        {geneExplanation(g.id, v)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* live preview sidebar */}
        <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-sand bg-paper">
            <div className="flex flex-col items-center border-b border-sand bg-gradient-to-b from-fog to-paper px-5 py-6">
              <DNAStrand genes={work} width={120} height={230} className="animate-floaty" />
              <SequenceStrip genes={work} className="mt-2" />
            </div>
            <div className="p-4">
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
                Behavioral readout
              </div>
              <p className="text-[13px] leading-relaxed text-forest">{desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.length === 0 && <span className="text-[12px] italic text-mist">Balanced profile</span>}
                {tags.map((t) => (
                  <Pill key={t.geneId} tone={t.tone === "high" ? "green" : "honey"}>
                    {GENE_MAP[t.geneId].icon} {t.label}
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          {/* live explanation of the gene you're editing */}
          {(() => {
            const def = GENE_MAP[activeGene];
            const av = work[activeGene] ?? 50;
            const tier = geneIntensity(av);
            const color = geneColor(av);
            const verb = tier === "high" ? "↑ high" : tier === "low" ? "↓ low" : "· mid";
            return (
              <div key={activeGene} className="animate-fade-up rounded-2xl border border-moss/40 bg-mint/20 p-4">
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
                    {av}
                  </span>
                </div>
                <div className="mt-1.5 flex items-start gap-2">
                  <span className="mt-0.5 font-mono text-sm font-bold" style={{ color }}>↓</span>
                  <p className="text-[12.5px] leading-snug text-forest">{geneExplanation(activeGene, av)}</p>
                </div>
              </div>
            );
          })()}

          {/* metadata */}
          <div className="rounded-2xl border border-sand bg-paper p-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-mist">
              Genome metadata
            </div>
            <GenomeMetaTable genome={genome} />
          </div>

          {/* metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { l: "Power index", v: power, c: "#2f6b43" },
              { l: "Latency", v: `${(metrics.latency / 1000).toFixed(2)}s`, c: "#4e9f6d" },
              { l: "Tokens", v: metrics.tokens.toLocaleString(), c: "#3a7d9b" },
              { l: "Est. cost", v: `${metrics.cost}¢`, c: "#d6a23a" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-sand bg-paper p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-mist">{s.l}</div>
                <div className="font-display text-lg font-bold" style={{ color: s.c }}>
                  {s.v}
                </div>
              </div>
            ))}
          </div>

          {/* presets */}
          <div className="rounded-2xl border border-sand bg-paper p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
              Apply preset
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() =>
                    setWork((w) => {
                      const merged = { ...w };
                      for (const [k, v] of Object.entries(p.genes))
                        if (typeof v === "number") merged[k] = v;
                      return merged;
                    })
                  }
                  className="rounded-lg border border-sand bg-cream/60 px-2.5 py-1.5 text-[12px] font-medium text-stone hover:border-moss hover:text-forest"
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="mt-3 border-t border-sand pt-3">
              <Toggle checked={liveUpdate} onChange={setLiveUpdate} label="Live-sync to store" />
            </div>
          </div>

          {/* save */}
          <div className="rounded-2xl border border-sand bg-forest p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-mint">
                Version {genome.versions.length}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  dirty ? "bg-honey/20 text-honey" : "bg-moss/30 text-spring"
                )}
              >
                {dirty ? "Unsaved" : "Saved"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={save} disabled={!dirty && !savedFlash}>
                {savedFlash ? "✓ Saved as new version" : "Save new version"}
              </Button>
              <Button variant="secondary" onClick={discard} disabled={!dirty} className="bg-forest-700 text-paper border-forest-600 hover:bg-forest-600">
                Reset
              </Button>
            </div>
            <button
              onClick={() => go({ tab: "history", genomeId: genome.id })}
              className="mt-2.5 w-full text-center text-[12px] text-mint hover:text-spring"
            >
              View version history →
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
