import { PRESETS, normalizeGenes, GENE_MAP } from "@/lib/dna";
import { benchmark } from "@/lib/benchmark";
import { Eyebrow, Reveal } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

const rows = [...PRESETS]
  .map((p) => ({ p, rep: benchmark(normalizeGenes(p.genes)) }))
  .sort((a, b) => b.rep.overall - a.rep.overall);

const top = rows[0];
const topReport = top.rep;

const MEDALS = ["🥇", "🥈", "🥉"];

export function BenchmarkShowcase() {
  return (
    <section id="benchmark" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-mint/40 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Benchmark · demonstrated</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-forest sm:text-5xl text-balance">
            The scores, front and center
          </h2>
          <p className="mt-4 text-lg text-stone">
            Every Genome runs against a standardized suite of 7 task families.
            There's no guesswork — strengths, weaknesses, speed, and cost are all
            measured, ranked, and comparable.
          </p>
        </Reveal>

        {/* ── Leaderboard: front and center ── */}
        <Reveal delay={100} className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row, i) => {
              const isTop = i === 0;
              const score = row.rep.overall;
              return (
                <div
                  key={row.p.name}
                  className={cn(
                    "relative flex flex-col overflow-hidden rounded-2xl border p-5 card-hover",
                    isTop
                      ? "border-transparent bg-gradient-to-br from-forest to-forest-700 text-paper shadow-xl shadow-forest/25"
                      : "border-sand bg-paper hover:border-moss/40 hover:shadow-lg hover:shadow-forest/10"
                  )}
                >
                  {/* rank badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-9 items-center gap-1.5 rounded-full px-3 font-display text-sm font-bold",
                        isTop ? "bg-spring/20 text-spring" : "bg-cream text-stone"
                      )}
                    >
                      {i < 3 ? (
                        <span className="text-base">{MEDALS[i]}</span>
                      ) : (
                        <span className="text-mist">#{i + 1}</span>
                      )}
                      rank
                    </span>
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: row.p.color }}
                    />
                  </div>

                  {/* name + score */}
                  <div className={cn("mt-4 flex items-end justify-between", isTop && "flex-1")}>
                    <div>
                      <h3
                        className={cn(
                          "font-display font-bold leading-tight",
                          isTop ? "text-2xl" : "text-lg",
                          isTop ? "text-paper" : "text-forest"
                        )}
                      >
                        {row.p.name}
                      </h3>
                      <p
                        className={cn(
                          "mt-0.5 text-[12px]",
                          isTop ? "text-mint" : "text-stone"
                        )}
                      >
                        {row.p.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={cn(
                          "font-display font-bold leading-none tabular-nums",
                          isTop ? "text-6xl" : "text-4xl",
                          isTop ? "text-paper" : "text-forest"
                        )}
                      >
                        {score}
                      </div>
                      <div
                        className={cn(
                          "text-[10px] font-semibold uppercase tracking-wider",
                          isTop ? "text-spring" : "text-mist"
                        )}
                      >
                        / 100
                      </div>
                    </div>
                  </div>

                  {/* progress bar */}
                  <div
                    className={cn(
                      "mt-4 h-2 overflow-hidden rounded-full",
                      isTop ? "bg-forest-700" : "bg-sand"
                    )}
                  >
                    <div
                      className="gene-bar h-full rounded-full bg-gradient-to-r from-leaf to-spring"
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  {/* meta row */}
                  <div
                    className={cn(
                      "mt-3 flex items-center justify-between text-[11px]",
                      isTop ? "text-mint" : "text-stone"
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      Best at {row.rep.best.category.icon} {row.rep.best.category.label}
                    </span>
                    <span className="font-mono">{row.rep.metrics.avgCostCents}¢/run</span>
                  </div>

                  {isTop && (
                    <p className="mt-3 text-[12.5px] leading-relaxed text-mint">
                      {row.p.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── Detail: top genome category breakdown ── */}
        <Reveal delay={150} className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* category performance */}
            <div className="rounded-2xl border border-sand bg-paper p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-forest">
                  {top.p.name} · category performance
                </h3>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-bold",
                    "bg-mint/40 text-forest-700"
                  )}
                >
                  🏆 overall {topReport.overall}
                </span>
              </div>
              <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {topReport.scores.map((s) => {
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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* strengths / weaknesses */}
            <div className="rounded-2xl border border-sand bg-gradient-to-br from-forest to-forest-700 p-5 text-paper">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-spring">
                Strengths
              </div>
              <div className="mt-2 space-y-1.5 text-[13px] text-mint">
                {topReport.strengths.map((id) => (
                  <div key={id}>
                    {GENE_MAP[id].icon} {GENE_MAP[id].name}
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-forest-700 pt-3 text-[11px] font-semibold uppercase tracking-wider text-honey">
                Weak spots
              </div>
              <div className="mt-2 space-y-1.5 text-[13px] text-mint/80">
                {topReport.weaknesses.map((id) => (
                  <div key={id}>
                    {GENE_MAP[id].icon} {GENE_MAP[id].name}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1 border-t border-forest-700 pt-3 text-[12px] text-mint">
                <div className="flex justify-between">
                  <span>Avg latency</span>
                  <span className="font-mono text-spring">
                    {(topReport.metrics.avgLatencyMs / 1000).toFixed(2)}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tokens / run</span>
                  <span className="font-mono text-spring">
                    {topReport.metrics.tokens.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
