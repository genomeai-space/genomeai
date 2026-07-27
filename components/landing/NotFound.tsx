import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/primitives";
import { DNAStrand } from "@/components/ui/dna";
import { normalizeGenes } from "@/lib/dna";

export function NotFound() {
  const { goPage } = useStore();
  const genes = normalizeGenes({
    reasoning: 70,
    verification: 55,
    creativity: 80,
    risk: 30,
  });

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-mint/50 blur-3xl" />

      <div className="animate-floaty">
        <DNAStrand genes={genes} width={120} height={210} className="mx-auto opacity-90" />
      </div>

      <p className="mt-4 font-display text-7xl font-bold tracking-tight text-forest">
        4<span className="text-moss">0</span>4
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-forest">
        This sequence doesn't exist
      </h1>
      <p className="mt-2 max-w-md text-[14px] text-stone">
        The page or genome you're looking for isn't in the library. Let's get you back
        to engineering behavior.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            goPage("home");
          }}
        >
          <Button size="lg">Back to home</Button>
        </a>
        <a
          href="/catalog/"
          onClick={(e) => {
            e.preventDefault();
            goPage("catalog");
          }}
        >
          <Button size="lg" variant="secondary">
            Browse genes
          </Button>
        </a>
      </div>
    </section>
  );
}
