import { PageHeader } from "./PageHeader";
import { Reveal, Pill } from "@/components/ui/primitives";
import { GENES, CATEGORY_META, type GeneCategory } from "@/lib/dna";
import { cn } from "@/utils/cn";

const CATS: GeneCategory[] = ["cognitive", "creative", "personality"];

export function GeneCatalog() {
  return (
    <>
      <PageHeader
        page="catalog"
        eyebrow="Gene Catalog"
        title={
          <>
            The 10 genes that{" "}
            <span className="text-moss">define a mind</span>
          </>
        }
        subtitle="Every Genome is built from these ten tunable genes. Each one controls a distinct axis of AI behavior — from how deeply it reasons to how warmly it communicates."
      />

      <section className="py-14">
        <div className="mx-auto max-w-4xl px-5">
          {/* intro stats */}
          <Reveal>
            <div className="mb-10 grid grid-cols-3 gap-3">
              {[
                { n: GENES.length, l: "Total genes" },
                { n: "0–100", l: "Range each" },
                { n: "3", l: "Categories" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl border border-sand bg-paper p-4 text-center"
                >
                  <div className="font-display text-3xl font-bold text-moss">
                    {s.n}
                  </div>
                  <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-mist">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {CATS.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="mb-10">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: meta.dot }}
                  />
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-forest">
                    {meta.label}
                  </h2>
                  <span className="text-[12px] text-mist">
                    · {GENES.filter((g) => g.category === cat).length} genes
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {GENES.filter((g) => g.category === cat).map((g, i) => (
                    <Reveal key={g.id} delay={Math.min(i * 50, 200)}>
                      <div className="flex h-full flex-col rounded-2xl border border-sand bg-paper p-4 card-hover hover:border-moss/40 hover:shadow-lg hover:shadow-forest/10">
                        <div className="flex items-center justify-between">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fog text-xl">
                            {g.icon}
                          </span>
                          <span className="rounded-md border border-sand bg-cream px-2 py-0.5 font-mono text-[11px] font-bold text-stone">
                            {g.symbol}
                          </span>
                        </div>
                        <h3 className="mt-3 font-display text-base font-bold text-forest">
                          {g.name}
                        </h3>
                        <p className="mt-1 text-[12.5px] leading-snug text-stone">
                          {g.blurb}
                        </p>

                        {/* low / mid / high */}
                        <div className="mt-3 space-y-1.5 border-t border-sand pt-3">
                          {(["low", "mid", "high"] as const).map((tier) => (
                            <div key={tier} className="flex items-start gap-2">
                              <span
                                className={cn(
                                  "mt-0.5 flex h-4 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase",
                                  tier === "high" &&
                                    "bg-moss/15 text-moss",
                                  tier === "mid" && "bg-sand text-stone",
                                  tier === "low" &&
                                    "bg-honey/15 text-[#8a6315]"
                                )}
                              >
                                {tier}
                              </span>
                              <span className="text-[12px] leading-snug text-forest">
                                {g.explain[tier]}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <Pill tone="green">{g.highLabel}</Pill>
                          <Pill tone="honey">{g.lowLabel}</Pill>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}

          {/* footer note */}
          <Reveal>
            <div className="rounded-2xl border border-moss/30 bg-gradient-to-br from-fog to-mint/20 p-5 text-center">
              <p className="font-display text-base font-semibold text-forest">
                10 genes → billions of possible behaviors
              </p>
              <p className="mx-auto mt-1 max-w-md text-[13px] text-stone">
                Combine and tune these genes to engineer any AI persona — each one a
                reusable, measurable, versioned blueprint.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
