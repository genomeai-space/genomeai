import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { type Genome } from "@/lib/dna";
import { generate, describeGenome } from "@/lib/engine";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "@/components/ui/primitives";
import { Highlights } from "@/components/ui/Analysis";
import { cn } from "@/utils/cn";

const SAMPLE = "Should our team rewrite the legacy backend or keep patching it?";

interface Result {
  genome: Genome;
  out: ReturnType<typeof generate>;
  rating: number;
}

function ratingFor(genes: Record<string, number>, prompt: string) {
  // pseudo "user rating" — coherence + empathy weighting + deterministic jitter
  const base =
    (genes.verification ?? 50) * 0.22 +
    (genes.reasoning ?? 50) * 0.22 +
    (genes.precision ?? 50) * 0.18 +
    (genes.empathy ?? 50) * 0.18 +
    (genes.creativity ?? 50) * 0.2;
  const jitter = ((prompt.length * 7) % 9) - 4;
  return Math.max(20, Math.min(99, Math.round(base + jitter)));
}

export function Compare() {
  const { genomes } = useStore();
  const [selected, setSelected] = useState<string[]>(() => genomes.slice(0, 3).map((g) => g.id));
  const [prompt, setPrompt] = useState(SAMPLE);
  const [results, setResults] = useState<Result[] | null>(null);
  const [running, setRunning] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s
    );

  const run = () => {
    if (running || selected.length < 2) return;
    setRunning(true);
    setResults(null);
    setTimeout(() => {
      const chosen = genomes.filter((g) => selected.includes(g.id));
      setResults(
        chosen.map((g) => ({
          genome: g,
          out: generate(prompt, g.genes),
          rating: ratingFor(g.genes, prompt),
        }))
      );
      setRunning(false);
    }, 1000);
  };

  const best = useMemo(() => {
    if (!results) return {} as Record<string, string>;
    const m: Record<string, string> = {};
    const metrics = ["latency", "tokens", "cost", "coherence", "rating"];
    for (const key of metrics) {
      let bestId = "";
      let bestVal = key === "latency" || key === "tokens" || key === "cost" ? Infinity : -Infinity;
      for (const r of results) {
        const v =
          key === "rating" ? r.rating : (r.out.metrics as any)[key];
        if (key === "latency" || key === "tokens" || key === "cost") {
          if (v < bestVal) {
            bestVal = v;
            bestId = r.genome.id;
          }
        } else {
          if (v > bestVal) {
            bestVal = v;
            bestId = r.genome.id;
          }
        }
      }
      m[key] = bestId;
    }
    return m;
  }, [results]);

  return (
    <DashboardLayout
      title="Compare"
      subtitle="Run multiple genomes on the same task — side by side"
    >
      {/* setup */}
      <div className="rounded-2xl border border-sand bg-paper p-5">
        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-mist">
          Shared task
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-xl border border-sand bg-cream/40 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-moss focus:bg-paper"
        />

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
              Genomes ({selected.length}/3)
            </span>
            <span className="text-[11px] text-mist">Pick 2–3 to compare</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {genomes.map((g) => {
              const on = selected.includes(g.id);
              const disabled = !on && selected.length >= 3;
              return (
                <button
                  key={g.id}
                  onClick={() => toggle(g.id)}
                  disabled={disabled}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 text-[12.5px] font-medium transition-all disabled:opacity-40",
                    on ? "border-transparent text-paper shadow-sm" : "border-sand bg-cream/60 text-stone hover:border-moss"
                  )}
                  style={on ? { background: g.color } : undefined}
                >
                  {on ? "✓ " : ""}
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button onClick={run} disabled={running || selected.length < 2}>
            {running ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                Comparing…
              </>
            ) : (
              <>⚖ Compare {selected.length} genomes</>
            )}
          </Button>
          {selected.length < 2 && <span className="text-[12px] text-mist">Select at least 2</span>}
        </div>
      </div>

      {/* results */}
      {running && (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-sand bg-paper py-16 text-stone">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-moss/30 border-t-moss" />
          Running the same task across genomes…
        </div>
      )}

      {results && (
        <>
          {/* outputs */}
          <div className={cn("mt-6 grid gap-4", results.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
            {results.map((r) => (
              <div key={r.genome.id} className="flex flex-col rounded-2xl border border-sand bg-paper p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: r.genome.color }} />
                  <span className="font-display text-sm font-semibold text-forest">{r.genome.name}</span>
                </div>
                <p className="mb-3 text-[12px] italic text-moss">{describeGenome(r.genome.genes)}</p>

                {/* what makes THIS genome different */}
                <div className="mb-3 rounded-lg border border-moss/30 bg-mint/15 p-2.5">
                  <Highlights genes={r.genome.genes} max={3} compact className="gap-1" />
                </div>

                {/* condensed output */}
                <div className="flex-1 space-y-2">
                  {r.out.trace.length > 0 && (
                    <div className="rounded-lg bg-cream/50 px-2.5 py-1.5 text-[11px] text-stone">
                      <span className="font-semibold text-forest">
                        {r.out.trace.length} trace steps
                      </span>{" "}
                      · {r.out.trace.map((t) => t.icon).join(" ")}
                    </div>
                  )}
                  {r.out.blocks
                    .filter((b) => b.type === "para")
                    .slice(0, 2)
                    .map((b, i) => (
                      <p key={i} className="text-[12.5px] leading-relaxed text-ink">
                        {b.text}
                      </p>
                    ))}
                  {r.out.blocks.some((b) => b.type === "caveat") && (
                    <p className="text-[11px] text-[#7a5612]">⚠️ Included caveats / verification</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* metrics table */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-sand bg-paper">
            <div className="border-b border-sand bg-cream/60 px-5 py-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-forest">
                Comparison metrics
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand text-left text-[11px] font-semibold uppercase tracking-wider text-mist">
                    <th className="px-5 py-3">Metric</th>
                    {results.map((r) => (
                      <th key={r.genome.id} className="px-5 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.genome.color }} />
                          {r.genome.name.replace(" DNA", "")}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { k: "latency", label: "Latency", fmt: (v: number) => `${(v / 1000).toFixed(2)}s`, get: (r: Result) => r.out.metrics.latencyMs },
                    { k: "tokens", label: "Token usage", fmt: (v: number) => v.toLocaleString(), get: (r: Result) => r.out.metrics.tokens },
                    { k: "cost", label: "Est. cost", fmt: (v: number) => `${v}¢`, get: (r: Result) => r.out.metrics.costCents },
                    { k: "coherence", label: "Output quality", fmt: (v: number) => `${v}/100`, get: (r: Result) => r.out.metrics.coherence },
                    { k: "rating", label: "User rating", fmt: (v: number) => `${v}/100`, get: (r: Result) => r.rating },
                  ].map((row) => (
                    <tr key={row.k} className="border-b border-sand/60 last:border-0">
                      <td className="px-5 py-3 font-medium text-stone">{row.label}</td>
                      {results.map((r) => {
                        const val = row.get(r);
                        const isBest = best[row.k] === r.genome.id;
                        return (
                          <td key={r.genome.id} className="px-5 py-3">
                            <span
                              className={cn(
                                "font-mono font-semibold tabular-nums",
                                isBest ? "rounded-md bg-mint px-1.5 py-0.5 text-forest-700" : "text-forest"
                              )}
                            >
                              {row.fmt(val)}
                              {isBest && <span className="ml-1 text-[10px]">★</span>}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-cream/40 px-5 py-2.5 text-[11px] text-mist">
              ★ best in column · lower is better for latency, tokens & cost
            </div>
          </div>
        </>
      )}

      {!results && !running && (
        <div className="mt-6 rounded-2xl border border-dashed border-sand bg-paper/50 py-14 text-center text-stone">
          <span className="mb-2 block text-3xl">⚖️</span>
          Pick 2–3 genomes and run a shared task to compare their behavior, cost & quality.
        </div>
      )}
    </DashboardLayout>
  );
}
