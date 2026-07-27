import { useStore } from "@/lib/store";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { CTA, Footer } from "./LandingSections";
import { Reveal } from "@/components/ui/primitives";
import type { LandingPage } from "@/lib/store";

const HUB: {
  page: LandingPage;
  href: string;
  icon: string;
  title: string;
  blurb: string;
}[] = [
  {
    page: "what",
    href: "/what/",
    icon: "🧬",
    title: "What is a Genome?",
    blurb: "Behavioral blueprints made of tunable genes.",
  },
  {
    page: "compiler",
    href: "/compiler/",
    icon: "⚙️",
    title: "How it compiles",
    blurb: "Genes → instructions, memory, and tool policy.",
  },
  {
    page: "playground",
    href: "/playground/",
    icon: "▶",
    title: "Playground",
    blurb: "Same prompt, different DNA, different answer.",
  },
  {
    page: "editor",
    href: "/editor/",
    icon: "🎛",
    title: "Editor",
    blurb: "Tune genes and watch behavior shift live.",
  },
  {
    page: "why",
    href: "/why/",
    icon: "📐",
    title: "vs Platforms",
    blurb: "A behavior layer under agent frameworks.",
  },
  {
    page: "benchmark",
    href: "/benchmark/",
    icon: "📊",
    title: "Benchmark",
    blurb: "Score genomes across task families.",
  },
  {
    page: "catalog",
    href: "/catalog/",
    icon: "📚",
    title: "Gene Catalog",
    blurb: "The 10 genes that define a mind.",
  },
  {
    page: "learn",
    href: "/learn/",
    icon: "✦",
    title: "Learn",
    blurb: "Guides on Digital DNA and behavior engineering.",
  },
];

export function Landing() {
  const { openAuth, startDemo, goPage } = useStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero
          onEnter={() => startDemo()}
          onPlay={() => goPage("playground")}
          onWaitlist={() => openAuth("request")}
        />

        <section className="border-t border-sand py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-moss">
                Explore Genome AI
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-forest sm:text-4xl">
                Every concept has its own page
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">
                Jump into product surfaces, benchmarks, and guides — each with a clean URL for
                sharing and search.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {HUB.map((item, i) => (
                <Reveal key={item.page} delay={Math.min(i * 40, 200)}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      goPage(item.page);
                    }}
                    className="flex h-full flex-col rounded-2xl border border-sand bg-paper p-4 transition hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-lg hover:shadow-forest/10"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-fog text-lg">
                      {item.icon}
                    </span>
                    <h3 className="mt-3 font-display text-[15px] font-bold text-forest">
                      {item.title}
                    </h3>
                    <p className="mt-1 flex-1 text-[13px] leading-relaxed text-stone">
                      {item.blurb}
                    </p>
                    <span className="mt-3 text-[12px] font-semibold text-moss">Open →</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
