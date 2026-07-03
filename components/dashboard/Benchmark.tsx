import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { GENE_MAP } from "@/lib/dna";
import { benchmark, BENCH_CATEGORIES } from "@/lib/benchmark";
import { DashboardLayout } from "./DashboardLayout";
import { Button, Pill, Segmented } from "@/components/ui/primitives";
import { geneColor } from "@/components/ui/dna";
import { cn } from "@/utils/cn";

type Mode = "single" | "leaderboard";

export function Benchmark() {
  const { route, genomes, getGenome } = useStore();
  const [mode, setMode] = useState<Mode>("single");
  const [genomeId, setGenomeId] = useState(route.genomeId || genomes[0]?.id || "");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const genome = getGenome(genomeId) || genomes[0];
  const report = useMemo(() => (genome ? benchmark(genome.genes) : null), [genome]);

  const leaderboard = useMemo(
    () =>
      genomes
        .map((g) => ({ g, rep: benchmark(g.genes) }))
        .sort((a, b) => b.rep.overall - a.rep.overall),
    [genomes]
  );

  const run = () => {
    setRunning(true);
    setDone(false);
    setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, 1100);
  };

  return (
    <DashboardLayout
      title="Benchmark"
      subtitle="Score every genome against a standardized task suite"
      actions={
        <Segmented
          size="sm"
          value={mode}
          onChange={setMode}
          options={[
            { value: "single", label: "Report" },
            { value: "leaderboard", label: "Leaderboard" },
          ]}
        />
      }
    >
      {mode === "single" ? (
        <>
          {/* controls */}
          <div className="flex flex-col gap-3 rounded-2xl border border-sand bg-paper p-5 sm:flex-row sm:items-center">
            <select
              value={genomeId}
              onChange={(e) => {
                setGenomeId(e.target.value);
                setDone(false);
              }}
              className="h-10 flex-1 rounded-xl border border-sand bg-cream/60 px-3 text-sm font-medium text-forest outline-none focus:border-moss"
            >
              {genomes.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <Button onClick={run} disabled={running}>
              {running ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                  Running suite…
                </>
              ) : (
                <>🧪 Run benchmark</>
              )}
            </Button>
          </div>

          {/* running state */}
          {running && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {BENCH_CATEGORIES.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-sand bg-paper p-3 text-center"
                  style={{ animation: `pulse-soft 1.2s ${i * 0.08}s infinite` }}
                >
                  <div className="text-xl">{c.icon}</div>
                  <div className="mt-1 text-[11px] text-mist">{c.label}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-moss" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {report && !running && (
            <div className="mt-5 animate-fade-up space-y-5">
              {/* summary */}
              <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                <div className="rounded-2xl border border-sand bg-gradient-to-br from-forest to-forest-700 p-5 text-paper">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: genome.color }} />
                    <span className="font-display text-sm font-semibold">{genome.name}</span>
                  </div>
                  <div className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-mint">
                    Overall score
                  </div>
                  <div className="font-display text-6xl font-bold leading-none text-paper">
                    {report.overall}
                  </div>
                  <div className="mt-1 text-[12px] text-mint">out of 100 · across 7 categories</div>
                  <div className="mt-4 space-y-1.5 text-[12px] text-mint">
                    <div className="flex justify-between">
                      <span>Avg latency</span>
                      <span className="font-mono text-spring">{(report.metrics.avgLatencyMs / 1000).toFixed(2)}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg cost / run</span>
                      <span className="font-mono text-spring">{report.metrics.avgCostCents}¢</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tokens / run</span>
                      <span className="font-mono text-spring">{report.metrics.tokens.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* strengths / weaknesses */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-sand bg-paper p-5">
                    <div className="mb-3 flex items-center gap-2 text-moss">
                      <span>💪</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Strengths</span>
                    </div>
                    <div className="space-y-2.5">
                      {report.strengths.map((id) => (
                        <div key={id}>
                          <div className="flex items-center justify-between text-[12.5px]">
                            <span className="text-forest">
                              {GENE_MAP[id].icon} {GENE_MAP[id].name}
                            </span>
                            <span className="font-mono font-bold" style={{ color: geneColor(genome.genes[id] ?? 0) }}>
                              {genome.genes[id] ?? 0}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                            <div
                              className="gene-bar h-full rounded-full"
                              style={{ width: `${genome.genes[id] ?? 0}%`, background: geneColor(genome.genes[id] ?? 0) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-sand bg-paper p-5">
                    <div className="mb-3 flex items-center gap-2 text-clay">
                      <span>⚠️</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider">Weaknesses</span>
                    </div>
                    <div className="space-y-2.5">
                      {report.weaknesses.map((id) => (
                        <div key={id}>
                          <div className="flex items-center justify-between text-[12.5px]">
                            <span className="text-forest">
                              {GENE_MAP[id].icon} {GENE_MAP[id].name}
                            </span>
                            <span className="font-mono font-bold" style={{ color: geneColor(genome.genes[id] ?? 0) }}>
                              {genome.genes[id] ?? 0}
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand">
                            <div
                              className="gene-bar h-full rounded-full"
                              style={{ width: `${genome.genes[id] ?? 0}%`, background: geneColor(genome.genes[id] ?? 0) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* category scores */}
              <div className="rounded-2xl border border-sand bg-paper p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-forest">
                    Category performance
                  </h3>
                  <div className="flex items-center gap-2">
                    <Pill tone="green">🏆 {report.best.category.label}</Pill>
                    <Pill tone="honey">↓ {report.worst.category.label}</Pill>
                  </div>
                </div>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {report.scores.map((s) => {
                    const v = s.score;
                    const c = v >= 75 ? "#2f6b43" : v >= 55 ? "#4e9f6d" : v >= 38 ? "#d6a23a" : "#b07a3a";
                    return (
                      <div key={s.category.id}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
                            <span>{s.category.icon}</span>
                            {s.category.label}
                          </span>
                          <span className="font-mono text-[13px] font-bold" style={{ color: c }}>
                            {v}
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-sand">
                          <div
                            className="gene-bar h-full rounded-full"
                            style={{ width: `${v}%`, background: c }}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-mist">{s.category.blurb}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              {done && (
                <p className="text-center text-[12px] text-moss">
                  ✓ Report regenerated · behavior is now measurable, not subjective.
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        /* leaderboard */
        <div className="overflow-hidden rounded-2xl border border-sand bg-paper">
          <div className="border-b border-sand bg-cream/60 px-5 py-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-forest">
              All genomes · ranked by overall score
            </h3>
          </div>
          <div className="divide-y divide-sand">
            {leaderboard.map((row, i) => (
              <div key={row.g.id} className="flex items-center gap-4 px-5 py-3.5">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg font-display text-sm font-bold",
                    i === 0 ? "bg-honey/20 text-honey" : "bg-cream text-mist"
                  )}
                >
                  {i + 1}
                </span>
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: row.g.color }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold text-forest">{row.g.name}</div>
                  <div className="text-[11px] text-mist">{row.g.category}</div>
                </div>
                <div className="hidden flex-1 sm:block">
                  <div className="h-2 overflow-hidden rounded-full bg-sand">
                    <div
                      className="gene-bar h-full rounded-full bg-gradient-to-r from-leaf to-moss"
                      style={{ width: `${row.rep.overall}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right font-display text-lg font-bold text-forest">
                  {row.rep.overall}
                </span>
                <span className="hidden w-28 text-right text-[11px] text-mist sm:block">
                  best: {row.rep.best.category.icon} {row.rep.best.category.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
