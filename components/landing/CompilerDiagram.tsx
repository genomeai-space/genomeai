import { Eyebrow, Reveal } from "@/components/ui/primitives";
import { HelixMark } from "@/components/ui/dna";
import { cn } from "@/utils/cn";

interface Stage {
  id: string;
  icon: string;
  label: string;
  desc: string;
  tag: string;
  kind: "input" | "compile" | "output";
}

const STAGES: Stage[] = [
  {
    id: "genome",
    icon: "🧬",
    label: "Genome",
    desc: "Your 10 tunable genes — the reusable behavioral blueprint.",
    tag: ".genome",
    kind: "input",
  },
  {
    id: "engine",
    icon: "⚙️",
    label: "Genome Engine",
    desc: "The compiler that turns genes into a structured runtime config.",
    tag: "compile()",
    kind: "compile",
  },
  {
    id: "system",
    icon: "📋",
    label: "System Instructions",
    desc: "Persona, role and rules — generated from the genome, never hand-written.",
    tag: "system:",
    kind: "compile",
  },
  {
    id: "memory",
    icon: "🧩",
    label: "Memory Policy",
    desc: "How much context to retain and what to keep coherent.",
    tag: "memory:",
    kind: "compile",
  },
  {
    id: "tool",
    icon: "🔧",
    label: "Tool Policy",
    desc: "Which tools are enabled, and the rules for when to call them.",
    tag: "tools:",
    kind: "compile",
  },
  {
    id: "llm",
    icon: "🤖",
    label: "LLM",
    desc: "Any compatible model runs the compiled config — it's model-agnostic.",
    tag: "→ model",
    kind: "compile",
  },
  {
    id: "response",
    icon: "💬",
    label: "Response",
    desc: "Behavior shaped entirely by the DNA — reproducible every time.",
    tag: "→ behavior",
    kind: "output",
  },
];

function Connector({ delay }: { delay: number }) {
  return (
    <div className="relative mx-auto h-9 w-px bg-sand">
      <span
        className="flow-dot absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-moss"
        style={{ animationDelay: `${delay}s` }}
      />
      <svg
        className="absolute -left-[5px] -bottom-1 text-moss/60"
        width="11"
        height="8"
        viewBox="0 0 11 8"
        fill="none"
      >
        <path d="M1 1l4.5 5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function CompilerDiagram({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section id="compiler" className={hideHeader ? "relative py-12" : "relative py-24"}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-25" />
      <div className="mx-auto max-w-7xl px-5">
{!hideHeader && (
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>How a Genome compiles</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-forest sm:text-5xl text-balance">
            From genes to a running agent
          </h2>
          <p className="mt-4 text-lg text-stone">
            A Genome isn't a prompt — it's a spec. The engine compiles it into the
            exact config the model runs. No behavior is left to interpretation.
          </p>
        </Reveal>
        )}

        <div className="mx-auto mt-14 max-w-xl">
          {STAGES.map((s, i) => (
            <div key={s.id}>
              <Reveal delay={Math.min(i * 70, 350)}>
                <StageCard stage={s} />
              </Reveal>
              {i < STAGES.length - 1 && <Connector delay={(i % 3) * 0.4} />}
            </div>
          ))}

          {/* footer note */}
          <Reveal delay={300}>
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-moss/30 bg-mint/30 px-4 py-3 text-center">
              <HelixMark size={16} className="text-moss" />
              <p className="text-[13px] font-medium text-forest">
                Change one gene upstream → the whole downstream behavior changes.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function StageCard({ stage }: { stage: Stage }) {
  const isInput = stage.kind === "input";
  const isOutput = stage.kind === "output";

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4 transition-all",
        isInput && "border-moss/40 bg-gradient-to-r from-fog to-mint/20 glow-pulse",
        isOutput && "border-forest bg-forest text-paper shadow-lg shadow-forest/20",
        !isInput && !isOutput && "border-sand bg-paper hover:border-moss/40"
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl",
          isInput ? "bg-paper" : isOutput ? "bg-forest-700" : "bg-cream"
        )}
      >
        {stage.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "font-display text-[15px] font-semibold",
              isOutput ? "text-paper" : "text-forest"
            )}
          >
            {stage.label}
          </h3>
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold",
              isOutput ? "bg-forest-700 text-spring" : "bg-cream text-mist"
            )}
          >
            {stage.tag}
          </span>
        </div>
        <p
          className={cn(
            "mt-0.5 text-[12.5px] leading-snug",
            isOutput ? "text-mint" : "text-stone"
          )}
        >
          {stage.desc}
        </p>
      </div>
      {isInput && (
        <span className="rounded-full bg-moss px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-paper">
          Input
        </span>
      )}
      {isOutput && (
        <span className="rounded-full bg-spring px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest">
          Output
        </span>
      )}
    </div>
  );
}
