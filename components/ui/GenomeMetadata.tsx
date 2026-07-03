import { type Genome } from "@/lib/dna";
import { cn } from "@/utils/cn";

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Visual version tag like "1.2" — major = total saves, minor = unsaved edits hint
export function versionLabel(genome: Genome): string {
  const major = genome.versions.length;
  // minor reflects how far the latest version drifted from the working genes
  return `${major}`;
}

export interface MetaItem {
  label: string;
  value: string;
}

export function genomeMeta(genome: Genome): MetaItem[] {
  return [
    { label: "Name", value: genome.name.replace(/\s*DNA$/i, "").trim() || genome.name },
    { label: "Category", value: genome.category },
    { label: "Version", value: `v${versionLabel(genome)}` },
    { label: "Author", value: genome.author },
    { label: "Updated", value: timeAgo(genome.updatedAt) },
  ];
}

// Compact inline row of metadata chips — used on cards & panels
export function GenomeMetaBar({
  genome,
  className,
}: {
  genome: Genome;
  className?: string;
}) {
  const items = genomeMeta(genome);
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone",
        className
      )}
    >
      {items.map((it, i) => (
        <span key={it.label} className="inline-flex items-center gap-1">
          {i > 0 && <span className="text-mist">·</span>}
          <span className="font-semibold uppercase tracking-wide text-mist">
            {it.label}:
          </span>
          <span className="font-medium text-forest">{it.value}</span>
        </span>
      ))}
    </div>
  );
}

// Structured definition list — used in the Editor / detail views
export function GenomeMetaTable({
  genome,
  className,
}: {
  genome: Genome;
  className?: string;
}) {
  const items = genomeMeta(genome);
  return (
    <dl className={cn("grid grid-cols-2 gap-x-4 gap-y-2.5", className)}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-mist">
            {it.label}
          </dt>
          <dd className="truncate font-display text-[14px] font-semibold text-forest">
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
