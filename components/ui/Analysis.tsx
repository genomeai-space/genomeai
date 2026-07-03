import { type Genes, GENE_MAP } from "@/lib/dna";
import {
  genomeHighlights,
  whyThisAnswer,
  type Highlight,
} from "@/lib/engine";
import { cn } from "@/utils/cn";

// ── Genome difference checklist (Engineer ✓ More structured …) ──
// Shows what makes a genome distinct vs. a default agent.
export function Highlights({
  genes,
  max = 3,
  className,
  compact = false,
}: {
  genes: Genes;
  max?: number;
  className?: string;
  compact?: boolean;
}) {
  const items = genomeHighlights(genes, max);
  if (items.length === 0) {
    return (
      <div className={cn("text-[12px] italic text-mist", className)}>
        Balanced genome — no trait strongly above or below default.
      </div>
    );
  }
  return (
    <ul className={cn("space-y-1.5", className)}>
      {items.map((h) => (
        <HighlightRow key={h.geneId} item={h} compact={compact} />
      ))}
    </ul>
  );
}

function HighlightRow({ item, compact }: { item: Highlight; compact?: boolean }) {
  const up = item.direction === "up";
  return (
    <li className="flex items-center gap-2">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-paper",
          up ? "bg-moss" : "bg-honey"
        )}
      >
        {up ? "↑" : "↓"}
      </span>
      <span
        className={cn(
          "leading-tight",
          compact ? "text-[12px]" : "text-[13px]",
          up ? "text-forest" : "text-stone"
        )}
      >
        {item.label}
      </span>
      <span className="ml-auto font-mono text-[10px] font-semibold uppercase tracking-wide text-mist">
        {GENE_MAP[item.geneId].icon} {GENE_MAP[item.geneId].name}
      </span>
    </li>
  );
}

// ── "Why this answer?" — cause-and-effect panel ───────────────
export function WhyThisAnswer({ genes }: { genes: Genes }) {
  const { influences, summary } = whyThisAnswer(genes);

  return (
    <div className="rounded-xl border border-moss/40 bg-mint/20 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-base">🔬</span>
        <h4 className="font-display text-[13px] font-bold uppercase tracking-wide text-moss">
          Why this answer?
        </h4>
      </div>

      {/* diverging gene-influence bars */}
      <div className="space-y-2">
        {influences.map((inf) => {
          const up = inf.deltaPct >= 0;
          const mag = Math.min(100, Math.abs(inf.deltaPct));
          return (
            <div key={inf.geneId} className="grid grid-cols-[110px_1fr_auto] items-center gap-2">
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-forest">
                <span>{GENE_MAP[inf.geneId].icon}</span>
                {GENE_MAP[inf.geneId].name}
              </span>
              <div className="relative h-2 rounded-full bg-sand/70">
                {/* center line */}
                <span className="absolute left-1/2 top-1/2 h-3 w-px -translate-y-1/2 bg-mist/50" />
                <span
                  className={cn(
                    "absolute top-0 h-full rounded-full",
                    up ? "left-1/2 bg-moss" : "right-1/2 bg-honey"
                  )}
                  style={{ width: `${mag / 2}%` }}
                />
              </div>
              <span
                className={cn(
                  "w-12 text-right font-mono text-[12px] font-bold tabular-nums",
                  up ? "text-moss" : "text-clay"
                )}
              >
                {up ? "+" : ""}
                {inf.deltaPct}%
              </span>
            </div>
          );
        })}
      </div>

      {/* cause-and-effect summary */}
      <p className="mt-3 border-t border-moss/20 pt-3 text-[12.5px] leading-relaxed text-forest">
        {summary}
      </p>
    </div>
  );
}
