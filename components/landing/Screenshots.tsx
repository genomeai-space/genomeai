import { type ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Reveal, Pill, GeneRange } from "@/components/ui/primitives";
import {
  DNAStrand,
  SequenceStrip,
  GeneBar,
  geneColor,
} from "@/components/ui/dna";
import {
  GENES,
  CATEGORY_META,
  PRESETS,
  normalizeGenes,
  type GeneCategory,
  type Genes,
} from "@/lib/dna";
import { generate, describeGenome } from "@/lib/engine";
import { OutputView } from "@/components/ui/OutputView";
import { Highlights } from "@/components/ui/Analysis";

const CATS: GeneCategory[] = ["cognitive", "creative", "personality"];

// Fixed demo data — deterministic, so every screenshot is consistent.
const engineer: Genes = normalizeGenes(PRESETS[0].genes); // Engineer
const creative: Genes = normalizeGenes(PRESETS[2].genes); // Creative
const TASK = "Should our team rewrite the legacy backend or keep patching it?";
const engineerOut = generate(TASK, engineer);
const creativeOut = generate(TASK, creative);

function Stage({
  title,
  dim,
  children,
}: {
  title: string;
  dim: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-sand bg-paper shadow-xl shadow-forest/10">
      <div className="flex items-center justify-between border-b border-sand bg-cream/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-clay/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-honey/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-moss/70" />
          <span className="ml-2.5 font-display text-sm font-semibold text-forest">
            {title}
          </span>
        </div>
        <span className="font-mono text-[11px] text-mist">{dim}</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function Screenshots() {
  return (
    <>
      <PageHeader
        page="screenshots"
        eyebrow="Screenshot Studio"
        title={
          <>
            Real product,{" "}
            <span className="text-moss">ready to capture</span>
          </>
        }
        subtitle="Auth-free, self-contained views of the Editor, Playground, Compare and Benchmark. Capture at 1440 × 900 (2× retina) and crop to subject."
      />

      <section className="space-y-10 py-12">
        <div className="mx-auto max-w-5xl space-y-10 px-5">
          {/* ── Editor ── */}
          <Reveal>
            <Stage title="DNA Editor" dim="editor.png">
              <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
                <div className="space-y-5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: PRESETS[0].color }}
                    />
                    <span className="font-display text-base font-semibold text-forest">
                      Engineer DNA
                    </span>
                    <Pill tone="green" className="ml-auto">
                      v2 · saved
                    </Pill>
                  </div>
                  {CATS.map((cat) => (
                    <div key={cat}>
                      <div className="mb-2.5 flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: CATEGORY_META[cat].dot }}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone">
                          {CATEGORY_META[cat].label}
                        </span>
                      </div>
                      <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                        {GENES.filter((g) => g.category === cat).map((g) => {
                          const v = engineer[g.id];
                          return (
                            <div key={g.id}>
                              <div className="mb-1 flex items-center justify-between">
                                <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-forest">
                                  <span>{g.icon}</span>
                                  {g.name}
                                </span>
                                <span
                                  className="font-mono text-[12px] font-bold tabular-nums"
                                  style={{ color: geneColor(v) }}
                                >
                                  {v}
                                </span>
                              </div>
                              <GeneRange value={v} onChange={() => {}} color={geneColor(v)} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-sand bg-gradient-to-b from-fog to-paper p-4 text-center">
                    <DNAStrand
                      genes={engineer}
                      width={100}
                      height={190}
                      className="mx-auto"
                    />
                    <SequenceStrip genes={engineer} className="mt-2" />
                  </div>
                  <div className="rounded-xl border border-moss/40 bg-mint/20 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-moss">
                      Behavioral readout
                    </div>
                    <p className="mt-1 text-[12.5px] leading-snug text-forest">
                      {describeGenome(engineer)}
                    </p>
                  </div>
                </div>
              </div>
            </Stage>
          </Reveal>

          {/* ── Playground ── */}
          <Reveal>
            <Stage title="Playground" dim="playground.png">
              <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
                <div className="space-y-4">
                  <div className="rounded-xl border border-sand bg-cream/40 px-3.5 py-2.5 text-[13px] text-ink">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                      Task ·{" "}
                    </span>
                    {TASK}
                  </div>
                  <OutputView output={engineerOut} />
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-sand bg-paper p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: PRESETS[0].color }}
                      />
                      <span className="font-display text-sm font-semibold text-forest">
                        Engineer DNA
                      </span>
                    </div>
                    <p className="mb-3 text-[12px] italic text-moss">
                      {describeGenome(engineer)}
                    </p>
                    {["reasoning", "verification", "precision", "risk", "creativity", "verbosity"].map(
                      (id) => (
                        <GeneBar key={id} id={id} value={engineer[id]} />
                      )
                    )}
                  </div>
                </div>
              </div>
            </Stage>
          </Reveal>

          {/* ── Compare ── */}
          <Reveal>
            <Stage title="Compare" dim="compare.png">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { g: PRESETS[0], genes: engineer, out: engineerOut },
                  { g: PRESETS[2], genes: creative, out: creativeOut },
                ].map((row) => (
                  <div
                    key={row.g.name}
                    className="flex flex-col rounded-xl border border-sand bg-cream/30 p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: row.g.color }}
                      />
                      <span className="font-display text-sm font-semibold text-forest">
                        {row.g.name} DNA
                      </span>
                    </div>
                    <p className="mb-2 text-[12px] italic text-moss">
                      {describeGenome(row.genes)}
                    </p>
                    <div className="mb-2 rounded-lg border border-moss/30 bg-mint/15 p-2.5">
                      <Highlights genes={row.genes} max={3} compact />
                    </div>
                    {row.out.blocks
                      .filter((b) => b.type === "para")
                      .slice(0, 1)
                      .map((b, i) => (
                        <p key={i} className="text-[12.5px] leading-relaxed text-ink">
                          {b.text}
                        </p>
                      ))}
                  </div>
                ))}
              </div>

              {/* metrics table */}
              <div className="mt-4 overflow-hidden rounded-xl border border-sand">
                <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-sand bg-cream/60 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-mist">
                  <span>Metric</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: PRESETS[0].color }} />
                    Engineer
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: PRESETS[2].color }} />
                    Creative
                  </span>
                </div>
                {[
                  { l: "Latency", a: `${(engineerOut.metrics.latencyMs / 1000).toFixed(2)}s`, b: `${(creativeOut.metrics.latencyMs / 1000).toFixed(2)}s` },
                  { l: "Tokens", a: engineerOut.metrics.tokens.toLocaleString(), b: creativeOut.metrics.tokens.toLocaleString() },
                  { l: "Est. cost", a: `${engineerOut.metrics.costCents}¢`, b: `${creativeOut.metrics.costCents}¢` },
                  { l: "Coherence", a: engineerOut.metrics.coherence, b: creativeOut.metrics.coherence },
                ].map((r) => (
                  <div
                    key={r.l}
                    className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-sand/60 px-4 py-2 last:border-0"
                  >
                    <span className="text-[13px] text-stone">{r.l}</span>
                    <span className="font-mono text-[13px] font-semibold text-forest">{r.a}</span>
                    <span className="font-mono text-[13px] font-semibold text-forest">{r.b}</span>
                  </div>
                ))}
              </div>
            </Stage>
          </Reveal>

          {/* caption */}
          <Reveal>
            <div className="rounded-xl border border-sand bg-cream/50 px-4 py-3 text-center text-[13px] text-stone">
              Captured from the live app via{" "}
              <span className="font-semibold text-forest">genomeai.space/screenshots</span>{" "}
              · all outputs are deterministic for a given (prompt + genome).
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
