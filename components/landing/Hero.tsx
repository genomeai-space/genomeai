import { PRESETS, normalizeGenes } from "@/lib/dna";
import { describeGenome } from "@/lib/engine";
import { DNAStrand, GeneBar, SequenceStrip, geneColor } from "@/components/ui/dna";
import { Button, Eyebrow } from "@/components/ui/primitives";

const preset = PRESETS[0]; // Engineer DNA
const genes = normalizeGenes(preset.genes);

export function Hero({ onEnter, onPlay }: { onEnter: () => void; onPlay: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grain opacity-60" />
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-mint/50 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-spring/30 blur-3xl" />
        
        {/* Subtle floating particles */}
        <div className="absolute top-[20%] left-[20%] h-1.5 w-1.5 rounded-full bg-spring/60 animate-pulse-soft" />
        <div className="absolute top-[40%] right-[30%] h-2 w-2 rounded-full bg-moss/40 animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[60%] left-[10%] h-1 w-1 rounded-full bg-forest/30 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[10%] right-[10%] h-1.5 w-1.5 rounded-full bg-leaf/50 animate-pulse-soft" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* copy */}
        <div className="animate-fade-up">
          <Eyebrow>Engineer behavior, not prompts</Eyebrow>
          <h1 className="mt-5 font-display text-[2.6rem] font-bold leading-[1.04] tracking-tight text-forest text-balance sm:text-6xl">
            Build AI agents by engineering their{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10 text-moss">Genome</span>
              <svg
                className="absolute -bottom-2 left-0 z-0 w-full"
                viewBox="0 0 300 16"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 11c50-8 100-8 148-3s100 6 146-2"
                  stroke="#6fc290"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-draw"
                />
              </svg>
            </span>
            .
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">
            Every Genome is a{" "}
            <strong className="font-semibold text-forest">reusable behavioral blueprint</strong>{" "}
            that defines how an AI reasons, plans, verifies, remembers, and
            communicates.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" onClick={onPlay}>
              Try the live playground
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Button>
            <Button size="lg" variant="secondary" onClick={onEnter}>
              Request early access
            </Button>
          </div>

          <div className="mt-6">
            <a
              href="https://orynth.dev/projects/genomeai-7078"
              target="_blank"
              rel="noopener"
              className="inline-flex rounded-full border border-sand bg-paper/80 p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <img
                src="https://orynth.dev/api/badge/genomeai-7078?theme=light&style=default"
                alt="Featured on Orynth"
                width="260"
                height="80"
                className="h-auto w-[220px] sm:w-[260px]"
              />
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone">
            <span className="font-medium text-forest">10 tunable genes</span>
            <span className="h-4 w-px bg-sand" />
            <span>Reproducible versions</span>
            <span className="h-4 w-px bg-sand" />
            <span>Benchmark scoring</span>
          </div>
        </div>

        {/* live genome card */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-mint/60 to-transparent blur-xl" />
          <div className="overflow-hidden rounded-3xl border border-sand bg-paper shadow-2xl shadow-forest/15">
            {/* header */}
            <div className="flex items-center justify-between border-b border-sand bg-gradient-to-r from-forest to-forest-700 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-spring animate-pulse-soft" />
                <span className="font-display text-sm font-semibold text-paper">
                  {preset.name} DNA
                </span>
              </div>
              <span className="font-mono text-[11px] text-spring/80">genome · live</span>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-5 p-5">
              {/* helix */}
              <div className="flex flex-col items-center">
                <DNAStrand genes={genes} width={92} height={210} className="animate-floaty" />
                <SequenceStrip genes={genes} className="mt-1 max-w-[92px] text-center" />
              </div>

              {/* genes */}
              <div className="grid grid-cols-1 gap-2.5">
                {["reasoning", "verification", "precision", "risk", "creativity", "autonomy"].map(
                  (id) => (
                    <GeneBar key={id} id={id} value={genes[id]} />
                  )
                )}
              </div>
            </div>

            {/* behavior readout */}
            <div className="border-t border-sand bg-cream/60 px-5 py-3.5">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-base">🧬</span>
                <p className="text-[13px] leading-relaxed text-forest">
                  <span className="font-semibold">Behavioral readout:</span>{" "}
                  <span style={{ color: geneColor(90) }}>{describeGenome(genes)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* floating chips */}
          <div className="absolute -right-3 -top-3 rounded-xl border border-sand bg-paper px-3 py-1.5 text-[11px] font-semibold text-moss shadow-lg">
            ✅ 100% Verification
          </div>
          <div className="absolute -bottom-3 left-6 rounded-xl border border-sand bg-paper px-3 py-1.5 text-[11px] font-semibold text-stone shadow-lg">
            ⚙️ No prompts edited
          </div>
        </div>
      </div>

      {/* logo strip */}
      <div className="mx-auto mt-20 max-w-7xl px-5">
        <p className="text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-mist">
          A new primitive for AI engineering
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-stone/70">
          {["Prompts → Genomes", "Guesswork → Metrics", "One-offs → Reusable", "Black-box → Auditable"].map(
            (t) => (
              <span key={t} className="font-display text-sm font-medium">
                {t.split(" → ")[0]} <span className="text-mist">→</span>{" "}
                <span className="text-forest">{t.split(" → ")[1]}</span>
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
