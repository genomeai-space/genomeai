import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { GENE_IDS, GENE_MAP } from "@/lib/dna";
import { DashboardLayout } from "./DashboardLayout";
import { Button, Pill } from "@/components/ui/primitives";
import { geneColor } from "@/components/ui/dna";
import { cn } from "@/utils/cn";

function fmt(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VersionHistory() {
  const { route, genomes, getGenome, restoreVersion, go } = useStore();
  const genome = getGenome(route.genomeId) || genomes[0];

  const versions = genome?.versions || [];
  const [from, setFrom] = useState(versions[0]?.version ?? 1);
  const [to, setTo] = useState(versions[versions.length - 1]?.version ?? 1);

  const fromV = useMemo(() => versions.find((v) => v.version === from), [versions, from]);
  const toV = useMemo(() => versions.find((v) => v.version === to), [versions, to]);

  if (!genome) {
    return (
      <DashboardLayout title="Version History" subtitle="No genome selected">
        <div className="rounded-2xl border border-dashed border-sand py-16 text-center text-stone">
          Select a genome from the library.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Version History"
      subtitle={`${genome.name} · every change is a new, restorable version`}
      actions={
        <Button size="sm" variant="secondary" onClick={() => go({ tab: "editor", genomeId: genome.id })}>
          ✎ Edit
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* timeline */}
        <div className="rounded-2xl border border-sand bg-paper p-5">
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-mist">
            Timeline
          </h3>
          <ol className="relative space-y-1 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-sand">
            {[...versions].reverse().map((v) => {
              const isTo = to === v.version;
              const isFrom = from === v.version;
              return (
                <li key={v.version} className="relative">
                  <button
                    onClick={() => setTo(v.version)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl px-2 py-2.5 text-left transition-colors",
                      isTo ? "bg-fog" : "hover:bg-cream/50"
                    )}
                  >
                    <span
                      className={cn(
                        "relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold",
                        isTo
                          ? "border-moss bg-moss text-paper"
                          : isFrom
                          ? "border-honey bg-paper text-honey"
                          : "border-sand bg-paper text-mist"
                      )}
                    >
                      v{v.version}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-medium leading-snug text-forest">
                        {v.note}
                      </span>
                      <span className="text-[11px] text-mist">{fmt(v.createdAt)}</span>
                    </span>
                  </button>
                  {isTo && to !== versions[versions.length - 1]?.version && (
                    <div className="ml-12 mb-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restoreVersion(genome.id, v.version)}
                        className="h-7 text-[11px]"
                      >
                        ↺ Restore this version
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {/* diff */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-sand bg-paper p-5">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mist">
                Compare
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={from}
                  onChange={(e) => setFrom(Number(e.target.value))}
                  className="h-9 rounded-lg border border-sand bg-cream/60 px-2.5 text-[13px] text-honey outline-none focus:border-honey"
                >
                  {versions.map((v) => (
                    <option key={v.version} value={v.version}>
                      v{v.version}
                    </option>
                  ))}
                </select>
                <span className="text-mist">→</span>
                <select
                  value={to}
                  onChange={(e) => setTo(Number(e.target.value))}
                  className="h-9 rounded-lg border border-sand bg-cream/60 px-2.5 text-[13px] text-moss outline-none focus:border-moss"
                >
                  {versions.map((v) => (
                    <option key={v.version} value={v.version}>
                      v{v.version}
                    </option>
                  ))}
                </select>
              </div>
              <div className="ml-auto flex gap-2">
                <Pill tone="honey">from v{from}</Pill>
                <Pill tone="green">to v{to}</Pill>
              </div>
            </div>

            <div className="space-y-2.5">
              {GENE_IDS.map((id) => {
                const a = fromV?.genes[id] ?? 0;
                const b = toV?.genes[id] ?? 0;
                const d = b - a;
                const changed = d !== 0;
                return (
                  <div key={id} className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3">
                    <div className="flex items-center justify-end gap-2 text-right">
                      <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: geneColor(a) }}>
                        {a}
                      </span>
                      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-sand sm:block">
                        <div className="h-full rounded-full" style={{ width: `${a}%`, background: geneColor(a) }} />
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-forest">
                      {GENE_MAP[id].icon} {GENE_MAP[id].name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-sand sm:block">
                        <div className="h-full rounded-full" style={{ width: `${b}%`, background: geneColor(b) }} />
                      </div>
                      <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: geneColor(b) }}>
                        {b}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "w-10 text-right font-mono text-[12px] font-bold tabular-nums",
                        !changed && "text-mist",
                        changed && d > 0 && "text-moss",
                        changed && d < 0 && "text-clay"
                      )}
                    >
                      {changed ? `${d > 0 ? "+" : ""}${d}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-4 border-t border-sand pt-3 text-[11px] text-mist">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-honey" /> from</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-moss" /> to</span>
              <span className="flex items-center gap-1"><span className="font-bold text-moss">+n</span> increased</span>
              <span className="flex items-center gap-1"><span className="font-bold text-clay">−n</span> decreased</span>
            </div>
          </div>

          {/* notes */}
          <div className="grid gap-4 sm:grid-cols-2">
            {fromV && (
              <div className="rounded-2xl border border-sand bg-paper p-4">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-honey">
                  v{fromV.version} · {fmt(fromV.createdAt)}
                </div>
                <p className="text-[13px] text-forest">{fromV.note}</p>
              </div>
            )}
            {toV && (
              <div className="rounded-2xl border border-sand bg-paper p-4">
                <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-moss">
                  v{toV.version} · {fmt(toV.createdAt)}
                </div>
                <p className="text-[13px] text-forest">{toV.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
