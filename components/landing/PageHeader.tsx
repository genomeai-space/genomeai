import { type ReactNode } from "react";
import { useStore, type LandingPage } from "@/lib/store";
import { HelixMark } from "@/components/ui/dna";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  page,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  page?: LandingPage;
}) {
  const { goPage } = useStore();
  return (
    <section className="relative overflow-hidden border-b border-sand bg-gradient-to-b from-fog to-cream pt-28 pb-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="mx-auto max-w-4xl px-5">
        <button
          onClick={() => goPage("home")}
          className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-stone transition-colors hover:text-forest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to home
        </button>
        <div className="flex items-center gap-2">
          <HelixMark size={20} className="text-moss" />
          <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-moss">
            {eyebrow}
          </span>
        </div>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-forest text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone">{subtitle}</p>
        )}
        {page && (
          <div className="mt-6 flex items-center gap-2 text-[12px] text-mist">
            <span className="text-mist">GenomeAI</span>
            <span>/</span>
            <span className="font-medium text-forest">{eyebrow}</span>
          </div>
        )}
      </div>
    </section>
  );
}
