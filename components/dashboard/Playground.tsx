import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { normalizeGenes } from "@/lib/dna";
import { generate, type GeneratedOutput } from "@/lib/engine";
import { DashboardLayout } from "./DashboardLayout";
import { Button, Pill } from "@/components/ui/primitives";
import { GeneReadout } from "@/components/ui/dna";
import { OutputView } from "@/components/ui/OutputView";
import { Highlights } from "@/components/ui/Analysis";
import { describeGenome } from "@/lib/engine";

const SAMPLES = [
  "Write a launch announcement for a privacy-first email app",
  "Debug why my CI pipeline is flaky on Mondays",
  "Plan a 3-month roadmap for a solo SaaS founder",
  "Explain the trade-offs of microservices to a junior dev",
];

export function Playground() {
  const { route, genomes, getGenome, go } = useStore();
  const [genomeId, setGenomeId] = useState(route.genomeId || genomes[0]?.id || "");
  const [prompt, setPrompt] = useState(SAMPLES[0]);
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; out: GeneratedOutput; name: string }[]>([]);

  const genome = getGenome(genomeId) || genomes[0];
  const genes = useMemo(() => normalizeGenes(genome?.genes || {}), [genome]);

  const run = () => {
    if (!prompt.trim() || running || !genome) return;
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      const out = generate(prompt, genes);
      setOutput(out);
      setHistory((h) => [{ prompt, out, name: genome.name }, ...h].slice(0, 4));
      setRunning(false);
    }, 850);
  };

  return (
    <DashboardLayout
      title="Playground"
      subtitle="See how a genome's DNA shapes its behavior on any task"
      actions={
        genome && (
          <Button size="sm" variant="secondary" onClick={() => go({ tab: "editor", genomeId: genome.id })}>
            ✎ Edit genome
          </Button>
        )
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          {/* task */}
          <div className="rounded-2xl border border-sand bg-paper p-5">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-mist">
              Task or prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-sand bg-cream/40 px-3.5 py-3 text-sm text-ink outline-none focus:border-moss focus:bg-paper"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SAMPLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setPrompt(s)}
                  className="rounded-full border border-sand bg-cream/60 px-2.5 py-1 text-[11px] text-stone hover:border-moss hover:text-forest"
                >
                  {s.length > 34 ? s.slice(0, 32) + "…" : s}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <select
                value={genomeId}
                onChange={(e) => setGenomeId(e.target.value)}
                className="h-10 rounded-xl border border-sand bg-cream/60 px-3 text-sm font-medium text-forest outline-none focus:border-moss"
              >
                {genomes.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <Button onClick={run} disabled={running || !prompt.trim()}>
                {running ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                    Executing…
                  </>
                ) : (
                  <>▶ Execute</>
                )}
              </Button>
            </div>
          </div>

          {/* output */}
          <div className="min-h-[220px] rounded-2xl border border-sand bg-paper p-5">
            {!output && !running && (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-center text-stone">
                <span className="mb-2 text-3xl">🧬</span>
                <p className="text-sm">
                  Run a task to see how{" "}
                  <strong className="text-forest">{genome?.name}</strong> behaves.
                </p>
              </div>
            )}
            {running && (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-stone">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-moss/30 border-t-moss" />
                <p className="text-sm">Sequencing response from {genome?.name}…</p>
              </div>
            )}
            {output && (
              <div className="animate-fade-up">
                <OutputView output={output} />
              </div>
            )}
          </div>

          {/* recent runs */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-sand bg-paper p-5">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-mist">
                Recent runs
              </h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(h.prompt);
                      setOutput(h.out);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-sand bg-cream/40 px-3 py-2 text-left hover:border-moss"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium text-forest">{h.prompt}</span>
                      <span className="text-[11px] text-mist">{h.name} · {h.out.metrics.tokens} tok</span>
                    </span>
                    <span className="text-[11px] text-mist">↺</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* genome panel */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {genome && (
            <div className="rounded-2xl border border-sand bg-paper p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: genome.color }} />
                <span className="font-display text-sm font-semibold text-forest">{genome.name}</span>
              </div>
              <p className="mb-3 text-[12px] italic text-moss">{describeGenome(genes)}</p>
              <GeneReadout genes={genes} compact />

              {/* what makes this genome different vs a default agent */}
              <div className="mt-3 rounded-xl border border-sand bg-cream/50 p-3">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-mist">
                  What's different
                </div>
                <Highlights genes={genes} max={3} compact />
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-sand bg-gradient-to-br from-forest to-forest-700 p-4 text-paper">
            <div className="mb-2 flex items-center gap-2">
              <span>💡</span>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-mint">Tip</span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-mint">
              Swap the genome and re-run the same task. The reasoning trace, tone,
              length and cost all change with the DNA — that's the whole point.
            </p>
            <Pill tone="green" className="mt-3 bg-mint/20">
              DNA → Behavior
            </Pill>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
