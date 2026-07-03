import { useState } from "react";
import { PRESETS, normalizeGenes, type Genes } from "@/lib/dna";
import { generate, type GeneratedOutput } from "@/lib/engine";
import { GeneBar } from "@/components/ui/dna";
import { Button, Eyebrow, Reveal } from "@/components/ui/primitives";
import { OutputView } from "@/components/ui/OutputView";
import { Highlights } from "@/components/ui/Analysis";
import { cn } from "@/utils/cn";

const SAMPLES = [
  "Design a reliable onboarding flow for a fintech app",
  "Explain quantum entanglement to a curious 12-year-old",
  "Draft a recovery plan for a project that's two weeks behind",
  "Should our startup take a bridge round or cut burn?",
];

export function PlaygroundPreview() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [prompt, setPrompt] = useState(SAMPLES[0]);
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [running, setRunning] = useState(false);

  const genes: Genes = normalizeGenes(PRESETS[presetIdx].genes);

  const run = () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      setOutput(generate(prompt, genes));
      setRunning(false);
    }, 850);
  };

  return (
    <section id="playground" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Interactive Playground</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-forest sm:text-5xl text-balance">
            Same prompt. Different DNA. Different answer.
          </h2>
          <p className="mt-4 text-lg text-stone">
            Pick a genome, run a task, and see exactly how the genes shape the
            response, its reasoning, and its cost.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-sand bg-paper shadow-xl shadow-forest/10">
            {/* profile selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand bg-cream/50 px-5 py-3.5">
              <span className="text-[12px] font-semibold uppercase tracking-wider text-stone">
                DNA profile
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p, i) => (
                  <button
                    key={p.name}
                    onClick={() => setPresetIdx(i)}
                    className={cn(
                      "rounded-lg border px-2.5 py-1.5 text-[12px] font-medium transition-all",
                      presetIdx === i
                        ? "border-transparent text-paper shadow-sm"
                        : "border-sand bg-paper text-stone hover:border-moss hover:text-forest"
                    )}
                    style={presetIdx === i ? { background: p.color } : undefined}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-[260px_1fr]">
              {/* genes */}
              <div className="border-b border-sand bg-gradient-to-b from-fog/60 to-paper p-5 lg:border-b-0 lg:border-r">
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: PRESETS[presetIdx].color }}
                  />
                  <span className="font-display text-sm font-semibold text-forest">
                    {PRESETS[presetIdx].name} DNA
                  </span>
                </div>
                <p className="mb-4 text-[12px] leading-relaxed text-stone">
                  {PRESETS[presetIdx].description}
                </p>
                <div className="space-y-2.5">
                  {["reasoning", "creativity", "precision", "risk", "verification", "verbosity"].map(
                    (id) => (
                      <GeneBar key={id} id={id} value={genes[id]} />
                    )
                  )}
                </div>

                {/* what makes this genome different */}
                <div className="mt-4 rounded-xl border border-sand bg-cream/50 p-3">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-mist">
                    What's different
                  </div>
                  <Highlights genes={genes} max={3} compact />
                </div>
              </div>

              {/* task + output */}
              <div className="p-5 sm:p-6">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider text-stone">
                  Task
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-sand bg-cream/40 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-moss focus:bg-paper"
                  placeholder="Enter a task…"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SAMPLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="rounded-full border border-sand bg-cream/60 px-2.5 py-1 text-[11px] text-stone hover:border-moss hover:text-forest"
                    >
                      {s.length > 38 ? s.slice(0, 36) + "…" : s}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Button onClick={run} disabled={running}>
                    {running ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                        Executing…
                      </>
                    ) : (
                      <>
                        ▶ Run with {PRESETS[presetIdx].name} DNA
                      </>
                    )}
                  </Button>
                  {output && (
                    <span className="text-[12px] text-mist">
                      Generated in {(output.metrics.latencyMs / 1000).toFixed(2)}s
                    </span>
                  )}
                </div>

                <div className="mt-4 min-h-[160px] rounded-xl border border-dashed border-sand bg-cream/30 p-4">
                  {!output && !running && (
                    <div className="flex h-full min-h-[120px] flex-col items-center justify-center text-center text-sm text-mist">
                      <span className="mb-1 text-2xl">🧬</span>
                      Hit <strong className="text-forest">Run</strong> to see how this genome answers.
                    </div>
                  )}
                  {running && (
                    <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-sm text-stone">
                      <span className="h-6 w-6 animate-spin rounded-full border-2 border-moss/30 border-t-moss" />
                      Sequencing response from genome…
                    </div>
                  )}
                  {output && (
                    <div className="animate-fade-up">
                      <OutputView output={output} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
