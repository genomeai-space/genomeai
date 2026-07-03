import { PRESETS, normalizeGenes, GENE_MAP, type Genes } from "@/lib/dna";
import { describeGenome } from "@/lib/engine";
import { DNAStrand, GeneBar, SequenceStrip, geneColor } from "@/components/ui/dna";
import { Eyebrow, Reveal } from "@/components/ui/primitives";

const genes: Genes = normalizeGenes(PRESETS[0].genes);

const PILLARS = [
  {
    icon: "🧠",
    title: "Reasons",
    gene: "reasoning",
    body: "How deeply it thinks through a problem step by step before answering.",
  },
  {
    icon: "🗂️",
    title: "Plans",
    gene: "planning",
    body: "How strategically it sequences work and anticipates dependencies.",
  },
  {
    icon: "✅",
    title: "Verifies",
    gene: "verification",
    body: "How rigorously it self-checks, flags assumptions, and hedges risk.",
  },
  {
    icon: "🧩",
    title: "Remembers",
    gene: "memory",
    body: "How well it retains context and keeps long conversations coherent.",
  },
  {
    icon: "💬",
    title: "Communicates",
    gene: "verbosity",
    body: "How it expresses itself — tone, length, creativity, and empathy.",
  },
];

export function WhatIsGenome({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="what" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-40" />
      <div className="mx-auto max-w-7xl px-5">
        {!hideHeader && (
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>What is a Genome?</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-forest sm:text-5xl text-balance">
            A behavioral blueprint, not a paragraph
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone">
            A <strong className="font-semibold text-forest">Genome</strong> is a
            structured set of <em>genes</em> — tunable traits from 0 to 100 — that
            together define exactly how an AI behaves. Instead of writing a prompt,
            you design a mind you can save, version, and reuse.
          </p>
        </Reveal>
        )}

        <div className={hideHeader ? "mt-4" : "mt-14"}>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px]">
          {/* pillars */}
          <Reveal className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => {
              const v = genes[p.gene] ?? 50;
              return (
                <div
                  key={p.title}
                  className="group rounded-2xl border border-sand bg-paper p-5 card-hover hover:shadow-lg hover:shadow-forest/10 hover:border-moss/40"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-fog text-xl">
                      {p.icon}
                    </span>
                    <span
                      className="font-mono text-sm font-bold tabular-nums"
                      style={{ color: geneColor(v) }}
                    >
                      {v}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-forest">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-stone">{p.body}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sand">
                    <div
                      className="gene-bar h-full rounded-full"
                      style={{ width: `${v}%`, background: geneColor(v) }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-mist">
                    gene: {GENE_MAP[p.gene].name}
                  </div>
                </div>
              );
            })}
            {/* definition tile */}
            <div className="flex flex-col justify-center rounded-2xl border border-moss/30 bg-gradient-to-br from-fog to-mint/30 p-5">
              <span className="font-display text-3xl">🧬</span>
              <p className="mt-2 font-display text-base font-semibold leading-snug text-forest">
                10 genes → 1 reusable blueprint → unlimited consistent behaviors.
              </p>
              <p className="mt-1 text-[12px] text-stone">
                Change a gene and the agent changes. No prompt editing required.
              </p>
            </div>
          </Reveal>

          {/* genome card visual */}
          <Reveal delay={120}>
            <div className="relative">
              <div className="absolute -inset-2 -z-10 rounded-[1.75rem] bg-gradient-to-br from-mint/50 to-transparent blur-lg" />
              <div className="overflow-hidden rounded-2xl border border-sand bg-paper shadow-xl shadow-forest/10">
                <div className="flex flex-col items-center border-b border-sand bg-gradient-to-b from-fog to-paper py-6">
                  <DNAStrand genes={genes} width={110} height={210} className="animate-floaty" />
                  <SequenceStrip genes={genes} className="mt-2" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: PRESETS[0].color }} />
                    <span className="font-display text-sm font-semibold text-forest">
                      {PRESETS[0].name} Genome
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {PILLARS.map((p) => (
                      <GeneBar key={p.gene} id={p.gene} value={genes[p.gene]} />
                    ))}
                  </div>
                  <p className="mt-4 rounded-lg bg-cream/60 px-3 py-2 text-[12px] italic leading-snug text-moss">
                    {describeGenome(genes)}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        </div>
      </div>
    </section>
  );
}
