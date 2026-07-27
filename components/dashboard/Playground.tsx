import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { normalizeGenes } from "@/lib/dna";
import { generate, type GeneratedOutput } from "@/lib/engine";
import { DashboardLayout } from "./DashboardLayout";
import { Button, Pill } from "@/components/ui/primitives";
import { GeneReadout } from "@/components/ui/dna";
import { OutputView } from "@/components/ui/OutputView";
import { Highlights } from "@/components/ui/Analysis";
import { describeGenome } from "@/lib/engine";
import { cn } from "@/utils/cn";

const SAMPLES = [
  "Write a launch announcement for a privacy-first email app",
  "Debug why my CI pipeline is flaky on Mondays",
  "Plan a 3-month roadmap for a solo SaaS founder",
  "Explain the trade-offs of microservices to a junior dev",
];

/** Quick profiles for the first-run path — matched by name against seeded genomes. */
const QUICK_PROFILES = [
  { key: "engineer", label: "🧪 Engineer", match: /engineer/i, hint: "Rigorous & precise" },
  { key: "creative", label: "🎨 Creative", match: /creative/i, hint: "Expressive & bold" },
  { key: "support", label: "💬 Support", match: /support/i, hint: "Warm & careful" },
] as const;

const ONBOARD_KEY = "genome-ai:playground-onboarded";

export function Playground() {
  const { route, genomes, getGenome, go, openAuth, user } = useStore();
  const [genomeId, setGenomeId] = useState(route.genomeId || genomes[0]?.id || "");
  const [prompt, setPrompt] = useState(SAMPLES[0]);
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; out: GeneratedOutput; name: string }[]>([]);
  const [runCount, setRunCount] = useState(0);
  const [showGuide, setShowGuide] = useState(() => {
    try {
      return localStorage.getItem(ONBOARD_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [dismissPostRun, setDismissPostRun] = useState(false);

  // Keep selection in sync when navigating with a genomeId
  useEffect(() => {
    if (route.genomeId && route.genomeId !== genomeId) {
      setGenomeId(route.genomeId);
    }
  }, [route.genomeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prefer a seeded preset if current id is empty
  useEffect(() => {
    if (!genomeId && genomes[0]) setGenomeId(genomes[0].id);
  }, [genomes, genomeId]);

  const genome = getGenome(genomeId) || genomes[0];
  const genes = useMemo(() => normalizeGenes(genome?.genes || {}), [genome]);

  const isDemoUser = Boolean(user?.email?.includes("@local") || user?.name?.startsWith("Demo"));

  const activeProfile = QUICK_PROFILES.find((p) => p.match.test(genome?.name || ""));

  const pickProfile = (match: RegExp) => {
    const found = genomes.find((g) => match.test(g.name));
    if (found) {
      setGenomeId(found.id);
      setOutput(null);
    }
  };

  const run = () => {
    if (!prompt.trim() || running || !genome) return;
    setRunning(true);
    setOutput(null);
    setTimeout(() => {
      const out = generate(prompt, genes);
      setOutput(out);
      setHistory((h) => [{ prompt, out, name: genome.name }, ...h].slice(0, 4));
      setRunCount((c) => c + 1);
      setRunning(false);
      try {
        localStorage.setItem(ONBOARD_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 850);
  };

  const dismissGuide = () => {
    setShowGuide(false);
    try {
      localStorage.setItem(ONBOARD_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <DashboardLayout
      title="Playground"
      subtitle="Tune DNA → run a task → see behavior change"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {isDemoUser && (
            <span className="hidden rounded-full border border-moss/30 bg-mint/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-forest sm:inline-flex">
              Demo mode
            </span>
          )}
          {genome && (
            <Button size="sm" variant="secondary" onClick={() => go({ tab: "editor", genomeId: genome.id })}>
              ✎ Edit genes
            </Button>
          )}
        </div>
      }
    >
      {/* First-run coach */}
      {showGuide && (
        <div className="mb-5 overflow-hidden rounded-2xl border border-moss/30 bg-gradient-to-br from-fog to-mint/30 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-moss">
                30-second start
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-forest sm:text-xl">
                See how DNA shapes an answer
              </h2>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-stone">
                Pick a profile, keep the same task, hit Execute — then swap DNA and run again.
                That delta is the whole product.
              </p>
            </div>
            <button
              type="button"
              onClick={dismissGuide}
              className="rounded-lg px-2 py-1 text-[12px] font-medium text-mist hover:bg-paper hover:text-forest"
            >
              Dismiss
            </button>
          </div>

          <ol className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { n: 1, label: "Pick a DNA profile", done: Boolean(genome) },
              { n: 2, label: "Choose or write a task", done: Boolean(prompt.trim()) },
              { n: 3, label: "Execute & compare", done: runCount > 0 },
            ].map((s) => (
              <li
                key={s.n}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border bg-paper/80 px-3 py-2.5 text-[13px]",
                  s.done ? "border-moss/40 text-forest" : "border-sand text-stone"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    s.done ? "bg-moss text-paper" : "bg-cream text-mist"
                  )}
                >
                  {s.done ? "✓" : s.n}
                </span>
                <span className="font-medium">{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          {/* quick profiles */}
          <div className="rounded-2xl border border-sand bg-paper p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                1 · DNA profile
              </label>
              {activeProfile && (
                <span className="text-[11px] text-moss">{activeProfile.hint}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROFILES.map((p) => {
                const found = genomes.find((g) => p.match.test(g.name));
                const active = found && found.id === genome?.id;
                return (
                  <button
                    key={p.key}
                    type="button"
                    disabled={!found}
                    onClick={() => pickProfile(p.match)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition",
                      active
                        ? "border-transparent bg-forest text-paper shadow-sm"
                        : "border-sand bg-cream/60 text-stone hover:border-moss hover:text-forest",
                      !found && "opacity-40"
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
              <select
                value={genomeId}
                onChange={(e) => {
                  setGenomeId(e.target.value);
                  setOutput(null);
                }}
                className="h-9 rounded-full border border-sand bg-cream/60 px-3 text-[12.5px] font-medium text-forest outline-none focus:border-moss"
                aria-label="All genomes"
              >
                {genomes.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* task */}
          <div className="rounded-2xl border border-sand bg-paper p-5">
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-mist">
              2 · Task or prompt
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
                  type="button"
                  onClick={() => setPrompt(s)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] hover:border-moss hover:text-forest",
                    prompt === s
                      ? "border-moss/50 bg-mint/30 text-forest"
                      : "border-sand bg-cream/60 text-stone"
                  )}
                >
                  {s.length > 34 ? s.slice(0, 32) + "…" : s}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={run} disabled={running || !prompt.trim() || !genome} size="lg">
                {running ? (
                  <>
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
                    Executing…
                  </>
                ) : (
                  <>▶ 3 · Execute</>
                )}
              </Button>
              {genome && (
                <p className="text-[12px] text-mist">
                  Running as <span className="font-semibold text-forest">{genome.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* output */}
          <div className="min-h-[220px] rounded-2xl border border-sand bg-paper p-5">
            {!output && !running && (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center px-4 text-center text-stone">
                <span className="mb-2 text-3xl" aria-hidden>
                  🧬
                </span>
                <p className="text-sm font-medium text-forest">
                  Run a task to see how {genome?.name || "this genome"} behaves
                </p>
                <p className="mt-1 max-w-sm text-[12.5px] leading-relaxed text-mist">
                  After the first run, switch DNA and execute again — compare tone, length,
                  reasoning, and cost.
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

          {/* After first run — soft conversion */}
          {runCount > 0 && !dismissPostRun && (
            <div className="rounded-2xl border border-moss/25 bg-mint/20 p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-moss">
                    Nice — you just ran Digital DNA
                  </p>
                  <p className="mt-1 max-w-lg text-[13.5px] leading-relaxed text-forest">
                    Next: swap to another profile and re-run the <em>same</em> task, open the
                    Editor to tweak a gene, or join the waitlist for updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDismissPostRun(true)}
                  className="text-[12px] text-mist hover:text-forest"
                >
                  Dismiss
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const next = genomes.find((g) => g.id !== genome?.id);
                    if (next) {
                      setGenomeId(next.id);
                      setOutput(null);
                    }
                  }}
                >
                  Swap DNA & re-run
                </Button>
                {genome && (
                  <Button size="sm" variant="secondary" onClick={() => go({ tab: "editor", genomeId: genome.id })}>
                    Tune a gene
                  </Button>
                )}
                <Button size="sm" onClick={() => openAuth("request")}>
                  Join waitlist
                </Button>
              </div>
            </div>
          )}

          {/* recent runs */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-sand bg-paper p-5">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-mist">
                Recent runs — compare
              </h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPrompt(h.prompt);
                      setOutput(h.out);
                      const g = genomes.find((x) => x.name === h.name);
                      if (g) setGenomeId(g.id);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border border-sand bg-cream/40 px-3 py-2 text-left hover:border-moss"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium text-forest">
                        {h.prompt}
                      </span>
                      <span className="text-[11px] text-mist">
                        {h.name} · {h.out.metrics.tokens} tok
                      </span>
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
          {isDemoUser && (
            <div className="rounded-2xl border border-sand bg-cream/70 px-3.5 py-2.5 text-[12px] text-stone">
              <span className="font-semibold text-forest">Demo mode</span>
              <span className="text-mist"> · simulated engine, data stays in this browser</span>
            </div>
          )}
          {genome && (
            <div className="rounded-2xl border border-sand bg-paper p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: genome.color }} />
                <span className="font-display text-sm font-semibold text-forest">{genome.name}</span>
              </div>
              <p className="mb-3 text-[12px] italic text-moss">{describeGenome(genes)}</p>
              <GeneReadout genes={genes} compact />

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
              <span aria-hidden>💡</span>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-mint">
                Tip
              </span>
            </div>
            <p className="text-[12.5px] leading-relaxed text-mint">
              Swap the genome and re-run the same task. Reasoning, tone, length, and cost all
              change with the DNA — that's the whole point.
            </p>
            <Pill tone="green" className="mt-3 bg-mint/20">
              DNA → Behavior
            </Pill>
            <Button
              size="sm"
              variant="secondary"
              className="mt-3 w-full bg-paper text-forest hover:bg-mint"
              onClick={() => go({ tab: "compare" })}
            >
              Open Compare
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
