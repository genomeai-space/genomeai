import { useState } from "react";
import { type GeneratedOutput } from "@/lib/engine";
import { GENE_MAP } from "@/lib/dna";
import { Pill } from "@/components/ui/primitives";
import { WhyThisAnswer } from "@/components/ui/Analysis";
import { outputToText, genomeShareLink } from "@/lib/share";
import { cn } from "@/utils/cn";

export function OutputView({ output }: { output: GeneratedOutput }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outputToText(output));
    } catch {
      /* clipboard may be blocked */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    const url = genomeShareLink(output);
    const text = outputToText(output);
    if (navigator.share) {
      try {
        await navigator.share({ title: "GenomeAI result", text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
    setShared(true);
    setTimeout(() => setShared(false), 1800);
  };

  return (
    <div className="space-y-4">
      {/* toolbar */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-mist">
          <span className="h-1.5 w-1.5 rounded-full bg-moss animate-pulse-soft" />
          Generated response
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={copy}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors",
              copied
                ? "border-moss/50 bg-mint/40 text-forest"
                : "border-sand bg-cream/60 text-stone hover:border-moss hover:text-forest"
            )}
          >
            {copied ? (
              <>
                <CheckIcon /> Copied
              </>
            ) : (
              <>
                <CopyIcon /> Copy output
              </>
            )}
          </button>
          <button
            onClick={share}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-medium transition-colors",
              shared
                ? "border-moss/50 bg-mint/40 text-forest"
                : "border-sand bg-cream/60 text-stone hover:border-moss hover:text-forest"
            )}
          >
            {shared ? (
              <>
                <CheckIcon /> Link copied
              </>
            ) : (
              <>
                <ShareIcon /> Share
              </>
            )}
          </button>
        </div>
      </div>

      {/* behavior tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-mist">
          Traits
        </span>
        {output.tags.map((t) => (
          <Pill key={t.geneId} tone={t.tone === "high" ? "green" : "honey"}>
            {GENE_MAP[t.geneId].icon} {t.label}
          </Pill>
        ))}
      </div>

      {/* trace */}
      {output.trace.length > 0 && (
        <div className="rounded-xl border border-sand bg-cream/50 p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-moss">
            <span className="h-1.5 w-1.5 rounded-full bg-spring animate-pulse-soft" />
            Reasoning trace
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {output.trace.map((step, i) => (
              <div key={i} className="rounded-lg border border-sand bg-paper p-2.5">
                <div className="mb-1 flex items-center gap-1.5 text-[12px] font-semibold text-forest">
                  <span>{step.icon}</span>
                  {step.title}
                </div>
                <ul className="space-y-0.5">
                  {step.lines.map((l, j) => (
                    <li key={j} className="text-[12px] leading-snug text-stone">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* content */}
      <div className="prose-genome space-y-3">
        {output.blocks.map((b, i) => {
          if (b.type === "para")
            return (
              <p key={i} className="text-[14px] leading-relaxed text-ink">
                {b.text}
              </p>
            );
          if (b.type === "list")
            return (
              <ul key={i} className="space-y-1.5">
                {b.items?.map((it, j) => (
                  <li key={j} className="flex gap-2 text-[14px] text-ink">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
                    {it}
                  </li>
                ))}
              </ul>
            );
          if (b.type === "quote")
            return (
              <blockquote
                key={i}
                className="border-l-4 border-moss bg-fog px-4 py-2 text-[14px] italic text-forest"
              >
                {b.text}
              </blockquote>
            );
          if (b.type === "caveat")
            return (
              <div
                key={i}
                className="flex gap-2 rounded-lg border border-honey/40 bg-honey/10 px-3 py-2 text-[12.5px] text-[#7a5612]"
              >
                <span>⚠️</span>
                <span>{b.text}</span>
              </div>
            );
          return null;
        })}
      </div>

      {/* metrics */}
      <div className="grid grid-cols-2 gap-2 border-t border-sand pt-3 sm:grid-cols-4">
        {[
          { l: "Tokens", v: output.metrics.tokens.toLocaleString() },
          { l: "Latency", v: `${(output.metrics.latencyMs / 1000).toFixed(2)}s` },
          { l: "Cost", v: `${output.metrics.costCents}¢` },
          { l: "Coherence", v: output.metrics.coherence },
        ].map((s) => (
          <div key={s.l} className="rounded-lg bg-cream/60 px-2.5 py-1.5 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-mist">
              {s.l}
            </div>
            <div className="font-display text-base font-bold text-forest">{s.v}</div>
          </div>
        ))}
      </div>

      {/* cause-and-effect: why THIS answer, driven by the genome */}
      <WhyThisAnswer genes={output.genes} />
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
