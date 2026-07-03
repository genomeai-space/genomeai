import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import {
  type Genome,
  CATEGORIES,
  GENE_IDS,
  GENE_MAP,
  genomePower,
  genomeSequence,
} from "@/lib/dna";
import { describeGenome } from "@/lib/engine";
import { DashboardLayout, NewGenomeButton } from "./DashboardLayout";
import { Button, Segmented } from "@/components/ui/primitives";
import { geneColor } from "@/components/ui/dna";
import { GenomeMetaBar } from "@/components/ui/GenomeMetadata";
import { cn } from "@/utils/cn";

type Sort = "recent" | "name" | "power";

function GenomeCard({ genome }: { genome: Genome }) {
  const { go, duplicateGenome, deleteGenome, toggleStar } = useStore();
  const [menu, setMenu] = useState(false);
  const power = genomePower(genome.genes);

  const act = (fn: () => void) => {
    setMenu(false);
    fn();
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-sand bg-paper p-5 card-hover hover:shadow-xl hover:shadow-forest/10 hover:border-moss/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full" style={{ background: genome.color }} />
          <div>
            <h3 className="font-display text-[15px] font-semibold leading-tight text-forest">
              {genome.name}
            </h3>
            <span className="text-[11px] text-mist">{genome.category}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleStar(genome.id)}
            className={cn("rounded-md p-1 text-base", genome.starred ? "text-honey" : "text-mist hover:text-honey")}
            title="Star"
          >
            {genome.starred ? "★" : "☆"}
          </button>
          <div className="relative">
            <button
              onClick={() => setMenu((m) => !m)}
              className="rounded-md p-1 text-mist hover:bg-fog hover:text-forest"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="19" cy="12" r="1.6" />
              </svg>
            </button>
            {menu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-xl border border-sand bg-paper py-1 shadow-xl">
                  {[
                    { l: "Run in Playground", fn: () => go({ tab: "playground", genomeId: genome.id }) },
                    { l: "Benchmark", fn: () => go({ tab: "benchmark", genomeId: genome.id }) },
                    { l: "Version history", fn: () => go({ tab: "history", genomeId: genome.id }) },
                    { l: "Duplicate", fn: () => duplicateGenome(genome.id) },
                  ].map((i) => (
                    <button
                      key={i.l}
                      onClick={() => act(i.fn)}
                      className="block w-full px-3 py-2 text-left text-[13px] text-stone hover:bg-fog hover:text-forest"
                    >
                      {i.l}
                    </button>
                  ))}
                  <div className="my-1 border-t border-sand" />
                  <button
                    onClick={() => act(() => {
                      if (confirm(`Delete ${genome.name}?`)) deleteGenome(genome.id);
                    })}
                    className="block w-full px-3 py-2 text-left text-[13px] text-clay hover:bg-clay/10"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-stone">
        {genome.description}
      </p>

      {/* behavior readout */}
      <p className="mt-2.5 text-[12px] italic text-moss">{describeGenome(genome.genes)}</p>

      {/* mini gene sparkline */}
      <div className="mt-3 flex h-7 items-end gap-[3px]">
        {GENE_IDS.map((id) => {
          const v = genome.genes[id] ?? 0;
          return (
            <div
              key={id}
              className="group/bar flex-1"
              title={`${GENE_MAP[id].name}: ${v}`}
            >
              <div
                className="w-full rounded-sm"
                style={{ height: `${10 + v * 0.42}px`, background: geneColor(v) }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-sand pt-3">
        <GenomeMetaBar genome={genome} className="flex-1" />
        <div className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-forest">
          <span className="text-mist">power</span>
          <span className="font-display text-sm">{power}</span>
        </div>
      </div>

      <Button
        size="sm"
        variant="secondary"
        className="mt-3 w-full"
        onClick={() => go({ tab: "editor", genomeId: genome.id })}
      >
        Edit genome →
      </Button>
    </div>
  );
}

export function Library() {
  const { genomes, createGenome, go } = useStore();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<Sort>("recent");

  const filtered = useMemo(() => {
    let list = genomes.filter(
      (g) =>
        (cat === "All" || g.category === cat) &&
        (g.name.toLowerCase().includes(query.toLowerCase()) ||
          g.description.toLowerCase().includes(query.toLowerCase()))
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "power") return genomePower(b.genes) - genomePower(a.genes);
      return b.updatedAt - a.updatedAt;
    });
    if (cat === "All" && sort === "recent") {
      list = [...list].sort((a, b) => Number(b.starred) - Number(a.starred) || b.updatedAt - a.updatedAt);
    }
    return list;
  }, [genomes, query, cat, sort]);

  const create = () => {
    const g = createGenome();
    go({ tab: "editor", genomeId: g.id });
  };

  const cats = ["All", ...CATEGORIES];

  return (
    <DashboardLayout
      title="DNA Library"
      subtitle="Your central repository for reusable AI behaviors"
      actions={<NewGenomeButton onClick={create} />}
    >
      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-mist"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search genomes…"
            className="w-full rounded-xl border border-sand bg-paper py-2.5 pl-9 pr-3 text-sm outline-none focus:border-moss"
          />
        </div>
        <Segmented
          size="sm"
          value={sort}
          onChange={setSort}
          options={[
            { value: "recent", label: "Recent" },
            { value: "name", label: "A–Z" },
            { value: "power", label: "Power" },
          ]}
        />
      </div>

      {/* category chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-all",
              cat === c
                ? "border-transparent bg-forest text-paper"
                : "border-sand bg-paper text-stone hover:border-moss hover:text-forest"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-sand bg-paper/50 py-16 text-center">
          <div className="mb-2 text-3xl">🧬</div>
          <p className="font-display text-lg font-semibold text-forest">No genomes found</p>
          <p className="mt-1 text-sm text-stone">Try a different search or create a new one.</p>
          <Button className="mt-4" onClick={create}>
            Create genome
          </Button>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((g) => (
            <GenomeCard key={g.id} genome={g} />
          ))}
        </div>
      )}

      {/* sequence strip footer */}
      <div className="mt-8 overflow-hidden rounded-xl border border-sand bg-forest px-4 py-2.5">
        <div className="font-mono text-[11px] tracking-[0.3em] text-spring/70">
          LIBRARY · {genomes.length} GENOMES · {genomeSequence(genomes[0]?.genes || {}, 20)}
        </div>
      </div>
    </DashboardLayout>
  );
}
