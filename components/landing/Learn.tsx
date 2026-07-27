import { useStore } from "@/lib/store";
import { ARTICLES, articlePath, getArticle } from "@/lib/content";
import { SITE } from "@/lib/site";
import { PageHeader } from "./PageHeader";
import { Reveal } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

function goLearn(go: ReturnType<typeof useStore>["go"], slug?: string) {
  go({ area: "landing", tab: "library", page: "learn", section: slug });
}

export function Learn() {
  const { route, go, goPage } = useStore();
  const slug = route.section;
  const article = getArticle(slug);

  if (article) {
    return <ArticleView articleSlug={article.slug} />;
  }

  return (
    <>
      <PageHeader
        page="learn"
        eyebrow="Learn"
        title={
          <>
            Guides for{" "}
            <span className="text-moss">behavior engineering</span>
          </>
        }
        subtitle="Practical articles on Digital DNA, genomes vs prompts, compilation, and benchmarking — written for builders shipping AI products."
      />
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-8 flex flex-wrap gap-2 text-[12px] text-stone">
            <a
              href="/catalog/"
              onClick={(e) => {
                e.preventDefault();
                goPage("catalog");
              }}
              className="rounded-full border border-sand bg-paper px-3 py-1 font-medium hover:border-moss hover:text-forest"
            >
              Gene Catalog
            </a>
            <a
              href="/faq/"
              onClick={(e) => {
                e.preventDefault();
                goPage("faq");
              }}
              className="rounded-full border border-sand bg-paper px-3 py-1 font-medium hover:border-moss hover:text-forest"
            >
              FAQ
            </a>
            <a
              href="/pricing/"
              onClick={(e) => {
                e.preventDefault();
                goPage("pricing");
              }}
              className="rounded-full border border-sand bg-paper px-3 py-1 font-medium hover:border-moss hover:text-forest"
            >
              Pricing
            </a>
          </div>

          <div className="grid gap-4">
            {ARTICLES.map((a, i) => (
              <Reveal key={a.slug} delay={Math.min(i * 60, 240)}>
                <a
                  href={articlePath(a.slug)}
                  onClick={(e) => {
                    e.preventDefault();
                    goLearn(go, a.slug);
                  }}
                  className="block rounded-2xl border border-sand bg-paper p-5 transition hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-lg hover:shadow-forest/10"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-mist">
                    <time dateTime={a.date}>{a.date}</time>
                    <span>·</span>
                    <span>{a.readMinutes} min read</span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-bold text-forest">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-stone">{a.teaser}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-fog px-2 py-0.5 text-[11px] font-medium text-moss"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-moss/30 bg-gradient-to-br from-fog to-mint/20 p-6 text-center">
            <p className="font-display text-lg font-semibold text-forest">
              Ready to engineer behavior?
            </p>
            <p className="mx-auto mt-1 max-w-md text-[13px] text-stone">
              Open the free beta, tune a genome, and run the playground — same ideas as these guides, in product form.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <a
                href="/playground/"
                onClick={(e) => {
                  e.preventDefault();
                  goPage("playground");
                }}
                className="rounded-lg bg-moss px-4 py-2 text-[13px] font-semibold text-paper hover:bg-forest-700"
              >
                Try the playground
              </a>
              <a
                href="/about/"
                onClick={(e) => {
                  e.preventDefault();
                  goPage("about");
                }}
                className="rounded-lg border border-sand bg-paper px-4 py-2 text-[13px] font-semibold text-forest hover:border-moss"
              >
                About Genome AI
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ArticleView({ articleSlug }: { articleSlug: string }) {
  const { go, goPage } = useStore();
  const article = getArticle(articleSlug)!;
  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        page="learn"
        eyebrow="Learn"
        title={article.title}
        subtitle={article.description}
      />
      <article className="py-12">
        <div className="mx-auto max-w-3xl px-5">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-[12px] text-mist">
            <a
              href="/learn/"
              onClick={(e) => {
                e.preventDefault();
                goLearn(go);
              }}
              className="font-medium text-moss hover:underline"
            >
              ← All guides
            </a>
            <span aria-hidden>·</span>
            <time dateTime={article.date}>{article.date}</time>
            <span aria-hidden>·</span>
            <span>{article.readMinutes} min read</span>
          </div>

          <div className="space-y-4 text-[15px] leading-relaxed text-stone">
            {article.body.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>

          {article.sections?.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="font-display text-2xl font-bold text-forest">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-stone">
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <aside className="mt-10 rounded-2xl border border-sand bg-cream/50 p-5">
            <h3 className="font-display text-base font-bold text-forest">Keep exploring</h3>
            <ul className="mt-3 space-y-2 text-[13.5px]">
              <li>
                <a
                  href="/catalog/"
                  className="font-medium text-moss hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    goPage("catalog");
                  }}
                >
                  Gene Catalog — the 10 tunable genes
                </a>
              </li>
              <li>
                <a
                  href="/faq/"
                  className="font-medium text-moss hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    goPage("faq");
                  }}
                >
                  FAQ — short answers on access and data
                </a>
              </li>
              <li>
                <a
                  href="/pricing/"
                  className="font-medium text-moss hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    goPage("pricing");
                  }}
                >
                  Pricing — free beta during MVP
                </a>
              </li>
              <li>
                <a
                  href={SITE.repo}
                  className="font-medium text-moss hover:underline"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  GitHub — open source frontend
                </a>
              </li>
            </ul>
          </aside>

          <div className="mt-12">
            <h3 className="font-display text-lg font-bold text-forest">Related guides</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {related.map((a) => (
                <a
                  key={a.slug}
                  href={articlePath(a.slug)}
                  onClick={(e) => {
                    e.preventDefault();
                    goLearn(go, a.slug);
                  }}
                  className={cn(
                    "rounded-xl border border-sand bg-paper p-3 transition hover:border-moss/40"
                  )}
                >
                  <div className="font-display text-[14px] font-semibold text-forest">{a.title}</div>
                  <p className="mt-1 text-[12px] leading-snug text-stone line-clamp-3">{a.teaser}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
