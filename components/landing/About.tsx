import { PageHeader } from "./PageHeader";
import { Reveal, Eyebrow } from "@/components/ui/primitives";
import { DNAStrand } from "@/components/ui/dna";
import { normalizeGenes } from "@/lib/dna";
import { SITE } from "@/lib/site";

const VALUES = [
  {
    icon: "🧬",
    title: "Structure over prose",
    body: "Behavior should be engineered with explicit, tunable parameters — not buried in a paragraph of prompt text.",
  },
  {
    icon: "📐",
    title: "Measure, don't guess",
    body: "If you can't benchmark it, you can't improve it. Every genome is scored, costed, and comparable.",
  },
  {
    icon: "🔁",
    title: "Reproducible by default",
    body: "Behavior must be versioned, auditable, and restorable — like any other engineering artifact.",
  },
  {
    icon: "🌍",
    title: "Open & model-agnostic",
    body: "Digital DNA is a standard, not a lock-in. Genomes compile to run on any compatible model.",
  },
];

const TIMELINE = [
  {
    phase: "Hypothesis",
    when: "Where it started",
    body: "Prompt engineering is brittle. There had to be a structured way to define how an AI behaves.",
  },
  {
    phase: "MVP",
    when: "Now",
    body: "A working Genome Engine, Editor, Playground, Compare, and Benchmark — proving DNA beats prompts.",
  },
  {
    phase: "Standard",
    when: "Next",
    body: "Publish the Genome Standard so any framework can compile and run DNA-defined behavior.",
  },
];

export function About() {
  const genes = normalizeGenes({});

  return (
    <>
      <PageHeader
        page="about"
        eyebrow="About"
        title={
          <>
            Behavior is{" "}
            <span className="text-moss">programmable.</span>
          </>
        }
        subtitle={`Genome AI is building the engineering discipline for AI behavior. We believe the way an agent reasons, plans, and communicates should be designed, measured, and reused — not improvised one prompt at a time.`}
      />

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-5">
          {/* mission split */}
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_220px]">
            <Reveal>
              <Eyebrow>Our mission</Eyebrow>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-forest text-balance">
                Turn AI behavior from guesswork into genome engineering.
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-stone">
                <p>
                  Today, shaping an AI's behavior means writing and rewriting prompts —
                  long strings of prose that drift, can't be measured, and barely
                  survive being shared between two people. It's the assembly era of AI.
                </p>
                <p>
                  We're introducing the next abstraction: the <strong className="font-semibold text-forest">Genome</strong> —
                  a structured, reusable blueprint of tunable genes that defines exactly
                  how an AI behaves. A Genome Engine compiles those genes into the
                  instructions, memory, and tool policies a model runs.
                </p>
                <p>
                  The result: behavior you can <strong className="font-semibold text-forest">design, measure,
                  version, and port</strong> — across models and across teams. Founded in {SITE.founded}, Genome AI
                  is on a mission to make AI behavior a first-class engineering discipline.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120} className="hidden justify-center lg:flex">
              <DNAStrand genes={genes} width={140} height={300} className="animate-floaty" />
            </Reveal>
          </div>

          {/* values */}
          <div className="mt-16">
            <Reveal className="mb-6 text-center">
              <Eyebrow>What we believe</Eyebrow>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-sand bg-paper p-5 card-hover hover:border-moss/40 hover:shadow-lg hover:shadow-forest/10">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-fog text-xl">
                      {v.icon}
                    </span>
                    <h3 className="mt-3 font-display text-base font-bold text-forest">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-stone">
                      {v.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* timeline */}
          <div className="mt-16">
            <Reveal className="mb-6 text-center">
              <Eyebrow>Where we are</Eyebrow>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {TIMELINE.map((t, i) => (
                <Reveal key={t.phase} delay={i * 100}>
                  <div className="relative h-full rounded-2xl border border-sand bg-paper p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-forest">
                        {t.phase}
                      </span>
                      <span
                        className={
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
                          (i === 1
                            ? "bg-moss/15 text-moss"
                            : "bg-cream text-mist")
                        }
                      >
                        {t.when}
                      </span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-stone">
                      {t.body}
                    </p>
                    {i < TIMELINE.length - 1 && (
                      <div className="absolute right-0 top-1/2 hidden h-px w-4 translate-x-full bg-sand md:block" />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* closing CTA */}
          <Reveal>
            <div className="mt-14 rounded-2xl border border-moss/30 bg-gradient-to-br from-fog to-mint/20 p-6 text-center">
              <h3 className="font-display text-xl font-bold text-forest">
                We're early. Come help define the standard.
              </h3>
              <p className="mx-auto mt-2 max-w-md text-[13.5px] text-stone">
                We're a small team inviting builders who want to engineer AI behavior.
                Join the beta and shape what Genome AI becomes.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
