import { Button, Eyebrow, Reveal } from "@/components/ui/primitives";
import { HelixMark } from "@/components/ui/dna";
import { useStore } from "@/lib/store";
import { SITE } from "@/lib/site";

type Level = "full" | "partial" | "none";

const LEVELS: Record<Level, { mark: string; color: string; label: string }> = {
  full: { mark: "✓", color: "#2f6b43", label: "Native" },
  partial: { mark: "~", color: "#d6a23a", label: "Partial" },
  none: { mark: "✕", color: "#9aa498", label: "No" },
};

const PLATFORMS = [
  { name: "GenomeAI", tag: "Digital DNA", featured: true },
  { name: "CrewAI", tag: "Role agents" },
  { name: "LangGraph", tag: "Graph flows" },
  { name: "GPT Builder", tag: "Custom GPTs" },
  { name: "Claude Projects", tag: "Context packs" },
];

// capability → score per platform [GenomeAI, CrewAI, LangGraph, GPT Builder, Claude]
const CAPABILITIES: { label: string; sub: string; vals: Level[] }[] = [
  {
    label: "Behavior as tunable genes",
    sub: "Engineer traits, not prose",
    vals: ["full", "none", "none", "none", "none"],
  },
  {
    label: "Reproducible & versioned",
    sub: "Auditable behavior history",
    vals: ["full", "partial", "partial", "none", "none"],
  },
  {
    label: "Standardized benchmarks",
    sub: "Score across task families",
    vals: ["full", "none", "none", "none", "none"],
  },
  {
    label: "Side-by-side comparison",
    sub: "Same task, many behaviors",
    vals: ["full", "partial", "partial", "none", "none"],
  },
  {
    label: "Model-agnostic",
    sub: "Runs on any LLM",
    vals: ["full", "full", "full", "none", "none"],
  },
  {
    label: "Cost & latency per profile",
    sub: "Measure each behavior",
    vals: ["full", "partial", "none", "none", "none"],
  },
  {
    label: "Multi-agent orchestration",
    sub: "Compose many agents",
    vals: ["partial", "full", "full", "none", "none"],
  },
];

function Mark({ level }: { level: Level }) {
  const m = LEVELS[level];
  return (
    <span
      className="inline-flex items-center justify-center"
      title={m.label}
    >
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full text-[12px] font-bold"
        style={{ background: `${m.color}1f`, color: m.color }}
      >
        {m.mark}
      </span>
    </span>
  );
}

export function WhyDNA() {
  return (
    <section id="why" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>A new category</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-forest sm:text-5xl text-balance">
            Not another agent framework.
            <br />
            <span className="text-moss">A layer beneath them all.</span>
          </h2>
          <p className="mt-4 text-lg text-stone">
            CrewAI and LangGraph <em>orchestrate</em> agents. GPT Builder and Claude
            Projects <em>configure</em> one. GenomeAI is where the agent's{" "}
            <strong className="font-semibold text-forest">behavior itself</strong> is
            engineered — structured, measurable, and reusable across any of them.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-12 overflow-hidden rounded-3xl border border-sand bg-paper shadow-xl shadow-forest/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse">
              <thead>
                <tr className="border-b border-sand bg-cream/60">
                  <th className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-wider text-stone">
                    Capability
                  </th>
                  {PLATFORMS.map((p) => (
                    <th
                      key={p.name}
                      className={
                        "px-3 py-4 text-center " +
                        (p.featured ? "bg-mint/40" : "")
                      }
                    >
                      <div
                        className={
                          "font-display text-[13.5px] font-bold " +
                          (p.featured ? "text-forest" : "text-stone")
                        }
                      >
                        {p.name}
                      </div>
                      <div className="text-[10px] font-medium uppercase tracking-wide text-mist">
                        {p.tag}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAPABILITIES.map((cap, i) => (
                  <tr
                    key={cap.label}
                    className={"border-b border-sand/60 last:border-0 " + (i % 2 ? "bg-cream/30" : "")}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-display text-[13px] font-semibold text-forest">
                        {cap.label}
                      </div>
                      <div className="text-[11px] text-mist">{cap.sub}</div>
                    </td>
                    {cap.vals.map((v, j) => (
                      <td
                        key={j}
                        className={
                          "px-3 py-3.5 text-center " +
                          (PLATFORMS[j].featured ? "bg-mint/20" : "")
                        }
                      >
                        <Mark level={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-sand bg-cream/40 px-5 py-3 text-[11px] text-mist">
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-moss/15 text-[10px] font-bold text-moss">✓</span>
              Native
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-honey/15 text-[10px] font-bold text-honey">~</span>
              Partial / workaround
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-stone/15 text-[10px] font-bold text-stone">✕</span>
              Not available
            </span>
            <span className="ml-auto">GenomeAI's DNA can sit underneath any of these stacks.</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function CTA() {
  const { openAuth } = useStore();
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-forest to-forest-700 px-8 py-16 text-center shadow-2xl shadow-forest/30 sm:px-16">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-spring blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-leaf blur-3xl" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-spring/30 bg-spring/10 px-3 py-1 text-[12px] font-semibold text-spring">
                <HelixMark size={14} className="text-spring" />
                Start engineering behavior
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl text-balance">
                From prompt engineering to{" "}
                <span className="text-spring">genome engineering.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-mint">
                We're inviting builders who want to engineer AI behavior — not just
                write prompts. Join the beta and build your first genome.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => openAuth("request")}
                  className="bg-paper text-forest hover:bg-mint"
                >
                  Request early access
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => openAuth("signin")}
                  className="text-mint hover:text-spring hover:bg-spring/10"
                >
                  Sign in
                </Button>
              </div>
              <p className="mt-4 text-[12px] text-spring/70">
                Free Beta · No credit card required
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const { goPage, openAuth, route } = useStore();
  const onHome = !route.page || route.page === "home";
  const toSection = (id: string) => {
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (onHome) scroll();
    else {
      goPage("home");
      setTimeout(scroll, 90);
    }
  };

  const linkCls =
    "text-[13px] text-stone transition-colors hover:text-moss text-left";
  const extLinkCls =
    "inline-flex items-center gap-1 text-[13px] text-stone transition-colors hover:text-moss";
  const ExtIcon = () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-mist"
      aria-hidden
    >
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );

  return (
    <footer className="border-t border-sand bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <HelixMark size={24} className="text-moss" />
              <span className="font-display text-lg font-semibold text-forest">
                Genome<span className="text-moss">AI</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-stone">
              Engineer AI behavior through Digital DNA — structured, reusable, and
              measurable. Behavior is programmable.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href={SITE.social.twitter}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X (Twitter)"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-stone transition-colors hover:border-moss hover:text-forest"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={SITE.social.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-sand text-stone transition-colors hover:border-moss hover:text-forest"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-wider text-forest">
              Product
            </h4>
            <ul className="mt-3 space-y-2.5">
              <li><button className={linkCls} onClick={() => toSection("what")}>What is a Genome</button></li>
              <li><button className={linkCls} onClick={() => toSection("playground")}>Playground</button></li>
              <li><button className={linkCls} onClick={() => toSection("benchmark")}>Benchmark</button></li>
              <li><button className={linkCls} onClick={() => goPage("pricing")}>Pricing</button></li>
              <li><button className={linkCls} onClick={() => openAuth("request")}>Request access</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-wider text-forest">
              Resources
            </h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a className={extLinkCls} href={SITE.resources.docs} target="_blank" rel="noreferrer noopener">
                  Documentation
                  <ExtIcon />
                </a>
              </li>
              <li>
                <a className={extLinkCls} href={SITE.resources.standard} target="_blank" rel="noreferrer noopener">
                  Genome Standard
                  <ExtIcon />
                </a>
              </li>
              <li><button className={linkCls} onClick={() => goPage("catalog")}>Gene Catalog</button></li>
              <li>
                <a className={extLinkCls} href={SITE.resources.api} target="_blank" rel="noreferrer noopener">
                  API
                  <span className="rounded-full bg-cream px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-mist">
                    Soon
                  </span>
                </a>
              </li>
              <li>
                <a className={extLinkCls} href={SITE.resources.changelog} target="_blank" rel="noreferrer noopener">
                  Changelog
                  <ExtIcon />
                </a>
              </li>
              <li>
                <a className={extLinkCls} href={SITE.resources.roadmap} target="_blank" rel="noreferrer noopener">
                  Roadmap
                  <ExtIcon />
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-wider text-forest">
              Company
            </h4>
            <ul className="mt-3 space-y-2.5">
              <li><button className={linkCls} onClick={() => goPage("about")}>About</button></li>
              <li>
                <a className={extLinkCls} href={SITE.resources.blog} target="_blank" rel="noreferrer noopener">
                  Blog
                  <ExtIcon />
                </a>
              </li>
              <li><button className={linkCls} onClick={() => goPage("contact")}>Contact</button></li>
              <li><button className={linkCls} onClick={() => goPage("privacy")}>Privacy Policy</button></li>
              <li><button className={linkCls} onClick={() => goPage("terms")}>Terms of Service</button></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display text-[13px] font-bold uppercase tracking-wider text-forest">
              Community
            </h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  className={extLinkCls}
                  href={SITE.social.twitter}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-mist" aria-hidden>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {SITE.social.twitterHandle}
                </a>
              </li>
              <li>
                <a
                  className={extLinkCls}
                  href={SITE.social.github}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-mist" aria-hidden>
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                  </svg>
                  {SITE.social.githubHandle}
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <button
                onClick={() => openAuth("request")}
                className="inline-flex items-center gap-1.5 rounded-lg bg-moss px-3 py-2 text-[12px] font-semibold text-paper transition-colors hover:bg-forest-700"
              >
                Join the beta
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sand pt-6 text-[12px] text-mist sm:flex-row">
          <span>© 2026 Genome AI. All rights reserved.</span>
          <span className="flex items-center gap-2 font-mono tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-spring animate-pulse-soft" />
            Behavior is programmable.
          </span>
        </div>
      </div>
    </footer>
  );
}
