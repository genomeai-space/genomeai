import { type Genes, GENE_IDS, GENE_MAP, genomeSequence } from "@/lib/dna";
import { cn } from "@/utils/cn";

// intensity → color
export function geneColor(v: number): string {
  if (v >= 66) return "#2f6b43";
  if (v >= 40) return "#4e9f6d";
  if (v >= 22) return "#d6a23a";
  return "#b07a3a";
}

// ── Horizontal gene bar (read + edit modes) ──────────────────
export function GeneBar({
  id,
  value,
  showValue = true,
  animated = true,
  className,
}: {
  id: string;
  value: number;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}) {
  const def = GENE_MAP[id];
  if (!def) return null;
  const color = geneColor(value);
  return (
    <div className={cn("group", className)}>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium text-forest">
          <span aria-hidden className="text-sm">
            {def.icon}
          </span>
          {def.name}
        </span>
        {showValue && (
          <span
            className="font-mono text-[13px] font-bold tabular-nums"
            style={{ color }}
          >
            {value}
          </span>
        )}
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-sand/70">
        <div
          className={cn("gene-bar h-full rounded-full", animated && "gene-bar")}
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

// Compact gene readout grid (used in cards / compare)
export function GeneReadout({
  genes,
  compact = false,
  className,
}: {
  genes: Genes;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-x-5 gap-y-2.5", compact ? "sm:grid-cols-2" : "sm:grid-cols-2", className)}>
      {GENE_IDS.map((id) => (
        <GeneBar key={id} id={id} value={genes[id] ?? 0} />
      ))}
    </div>
  );
}

// ── Animated DNA double helix (SVG) ──────────────────────────
export function DNAStrand({
  genes,
  width = 220,
  height = 320,
  className,
  animate = true,
}: {
  genes: Genes;
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
}) {
  const rungs = 14;
  const cx = width / 2;
  const stepY = height / (rungs + 1);
  const points = Array.from({ length: rungs }, (_, i) => {
    const y = stepY * (i + 1);
    const phase = (i / rungs) * Math.PI * 2;
    const amp = width * 0.34;
    return { y, x1: cx + Math.sin(phase) * amp, x2: cx - Math.sin(phase) * amp, depth: Math.cos(phase) };
  });

  const strand1 = points.map((p) => `${p.x1.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const strand2 = points.map((p) => `${p.x2.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label="DNA double helix"
    >
      <defs>
        <linearGradient id="dnaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6fc290" />
          <stop offset="50%" stopColor="#2f6b43" />
          <stop offset="100%" stopColor="#4e9f6d" />
        </linearGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>

      <g className={animate ? "" : ""}>
        {/* back strand faded */}
        <polyline
          points={strand2}
          fill="none"
          stroke="#4e9f6d"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.55}
        />
        {/* rungs colored by gene */}
        {points.map((p, i) => {
          const geneId = GENE_IDS[i % GENE_IDS.length];
          const v = genes[geneId] ?? 50;
          const c = geneColor(v);
          return (
            <line
              key={i}
              x1={p.x1}
              y1={p.y}
              x2={p.x2}
              y2={p.y}
              stroke={c}
              strokeWidth={Math.max(1.5, 2 + (v / 100) * 2.2)}
              strokeLinecap="round"
              opacity={0.45 + (p.depth + 1) * 0.27}
            />
          );
        })}
        {/* front strand */}
        <polyline
          points={strand1}
          fill="none"
          stroke="url(#dnaGrad)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* nodes */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x1} cy={p.y} r={p.depth > 0 ? 4 : 2.6} fill="#2f6b43" opacity={0.55 + (p.depth + 1) * 0.22} />
        ))}
      </g>
    </svg>
  );
}

// Small inline helix mark for logos
export function HelixMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <mask id="helix-cut-top">
          <rect width="24" height="24" fill="white" stroke="none" />
          <path d="M 17 2 C 17 7, 7 7, 7 12" stroke="black" strokeWidth="7" fill="none" />
        </mask>
        <mask id="helix-cut-bot">
          <rect width="24" height="24" fill="white" stroke="none" />
          <path d="M 17 12 C 17 17, 7 17, 7 22" stroke="black" strokeWidth="7" fill="none" />
        </mask>
      </defs>
      
      {/* Bottom Layer */}
      <path d="M 7 2 C 7 7, 17 7, 17 12" mask="url(#helix-cut-top)" />
      <path d="M 7 12 C 7 17, 17 17, 17 22" mask="url(#helix-cut-bot)" />

      {/* Top Layer */}
      <path d="M 17 2 C 17 7, 7 7, 7 12" />
      <path d="M 17 12 C 17 17, 7 17, 7 22" />
    </svg>
  );
}

// Brand lockup
export function BrandLogo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <HelixMark size={24} className={light ? "text-spring" : "text-forest"} />
      <span
        className={cn(
          "font-display text-[19px] font-semibold tracking-tight",
          light ? "text-paper" : "text-forest"
        )}
      >
        Genome<span className="text-leaf">AI</span>
      </span>
    </span>
  );
}

// nucleotide sequence strip (flavor)
export function SequenceStrip({ genes, className }: { genes: Genes; className?: string }) {
  const seq = genomeSequence(genes, 32);
  return (
    <div className={cn("font-mono text-[11px] tracking-[0.3em] text-spring/80", className)}>
      {seq.match(/.{1,4}/g)?.join(" ")}
    </div>
  );
}
