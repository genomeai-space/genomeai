import { PRESETS, normalizeGenes } from "@/lib/dna";
import { describeGenome } from "@/lib/engine";
import { DNAStrand, GeneBar, SequenceStrip, geneColor } from "@/components/ui/dna";
import { Button, Eyebrow } from "@/components/ui/primitives";

const preset = PRESETS[0]; // Engineer DNA
const genes = normalizeGenes(preset.genes);

export function Hero({
  onEnter,
  onPlay,
  onWaitlist,
}: {
  onEnter: () => void;
  onPlay: () => void;
  onWaitlist?: () => void;
}) {
  return (
    <section id="top" className="relative overflow-x-clip overflow-y-visible pt-24 pb-14 sm:pt-32 sm:pb-16 lg:pt-36">
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
          <h1 className="mt-5 font-display text-[2.15rem] font-bold leading-[1.08] tracking-tight text-forest text-balance sm:text-5xl lg:text-6xl">
            Build AI agents by engineering their{" "}
            <span className="relative inline whitespace-nowrap">
              <span className="relative z-10 text-moss">Genome</span>
              <svg
                className="absolute -bottom-1.5 left-0 z-0 w-full sm:-bottom-2"
                viewBox="0 0 300 16"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden
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
          <p className="mt-5 max-w-xl text-base leading-relaxed text-stone sm:mt-6 sm:text-lg">
            Every Genome is a{" "}
            <strong className="font-semibold text-forest">reusable behavioral blueprint</strong>{" "}
            that defines how an AI reasons, plans, verifies, remembers, and
            communicates.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <Button size="lg" onClick={onEnter} className="w-full justify-center sm:w-auto">
              Try demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Button>
            <Button size="lg" variant="secondary" onClick={onPlay} className="w-full justify-center sm:w-auto">
              Open playground
            </Button>
            {onWaitlist && (
              <button
                type="button"
                onClick={onWaitlist}
                className="px-1 text-center text-sm font-medium text-moss underline-offset-4 hover:underline sm:text-left"
              >
                Join waitlist
              </button>
            )}
          </div>

          {/* Orynth badge — fluid stand so it never overflows mobile */}
          <div className="mt-6 w-full max-w-full sm:mt-7">
            <a
              href="https://orynth.dev/projects/genomeai-7078"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex max-w-full items-center rounded-2xl border border-sand bg-paper/90 p-1.5 shadow-sm transition hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-md sm:rounded-full sm:p-2"
              aria-label="Featured on Orynth — open project page"
            >
              <img
                src="https://orynth.dev/api/badge/genomeai-7078?theme=light&style=default"
                alt="Featured on Orynth"
                width="260"
                height="80"
                loading="lazy"
                decoding="async"
                className="h-auto w-full max-w-[min(100%,240px)] object-contain object-left sm:max-w-[260px]"
              />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-stone sm:mt-9 sm:gap-x-6 sm:text-sm">
            <span className="font-medium text-forest">10 tunable genes</span>
            <span className="hidden h-4 w-px bg-sand sm:block" aria-hidden />
            <span>Reproducible versions</span>
            <span className="hidden h-4 w-px bg-sand sm:block" aria-hidden />
            <span>Benchmark scoring</span>
          </div>
        </div>

        {/* live genome card */}
        <div className="relative mx-auto w-full max-w-lg animate-fade-up lg:max-w-none [animation-delay:120ms]">
          <div className="absolute -inset-2 -z-10 rounded-[2rem] bg-gradient-to-br from-mint/60 to-transparent blur-xl sm:-inset-3" />
          <div className="overflow-hidden rounded-2xl border border-sand bg-paper shadow-2xl shadow-forest/15 sm:rounded-3xl">
            {/* header */}
            <div className="flex items-center justify-between border-b border-sand bg-gradient-to-r from-forest to-forest-700 px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-spring animate-pulse-soft" />
                <span className="truncate font-display text-sm font-semibold text-paper">
                  {preset.name} DNA
                </span>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-spring/80 sm:text-[11px]">
                genome · live
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 min-[400px]:grid-cols-[auto_1fr] sm:gap-5 sm:p-5">
              {/* helix — centered on narrow phones */}
              <div className="flex flex-col items-center justify-center">
                <DNAStrand genes={genes} width={92} height={210} className="animate-floaty max-h-[180px] w-auto sm:max-h-none" />
                <SequenceStrip genes={genes} className="mt-1 max-w-[92px] text-center" />
              </div>

              {/* genes */}
              <div className="grid min-w-0 grid-cols-1 gap-2.5">
                {["reasoning", "verification", "precision", "risk", "creativity", "autonomy"].map(
                  (id) => (
                    <GeneBar key={id} id={id} value={genes[id]} />
                  )
                )}
              </div>
            </div>

            {/* behavior readout */}
            <div className="border-t border-sand bg-cream/60 px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-base" aria-hidden>
                  🧬
                </span>
                <p className="min-w-0 text-[12.5px] leading-relaxed text-forest sm:text-[13px]">
                  <span className="font-semibold">Behavioral readout:</span>{" "}
                  <span style={{ color: geneColor(90) }}>{describeGenome(genes)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* floating chips — stay inside viewport on mobile */}
          <div className="absolute right-2 top-2 rounded-lg border border-sand bg-paper px-2 py-1 text-[10px] font-semibold text-moss shadow-lg sm:-right-2 sm:-top-3 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-[11px]">
            ✅ 100% Verification
          </div>
          <div className="absolute bottom-2 left-3 rounded-lg border border-sand bg-paper px-2 py-1 text-[10px] font-semibold text-stone shadow-lg sm:-bottom-3 sm:left-6 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-[11px]">
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
