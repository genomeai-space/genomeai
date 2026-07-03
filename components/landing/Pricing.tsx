import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { Reveal, Button } from "@/components/ui/primitives";
import { TIERS } from "@/lib/pricing";
import { useStore } from "@/lib/store";
import { cn } from "@/utils/cn";

export function Pricing() {
  const { goPage } = useStore();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const planButton = (t: (typeof TIERS)[number]) => (
    <Button
      className="w-full"
      variant={t.highlight ? "primary" : "secondary"}
      onClick={() => goPage("home")}
    >
      {t.cta}
    </Button>
  );

  return (
    <>
      <PageHeader
        page="pricing"
        eyebrow="Pricing"
        title={
          <>
            Engineer behavior,{" "}
            <span className="text-moss">at any scale</span>
          </>
        }
        subtitle="Start free during the beta, then scale from solo building to full teams and on-prem deployment. Pick the plan that matches where you're going."
      />

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-5">
          {/* billing toggle (cosmetic — current beta is free) */}
          <div className="mb-10 flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-xl border border-sand bg-cream p-1">
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[13px] font-medium capitalize transition-all",
                    billing === b
                      ? "bg-paper text-forest shadow-sm border border-sand"
                      : "text-stone hover:text-forest"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
            <span className="rounded-full bg-mint/50 px-2.5 py-1 text-[11px] font-semibold text-forest-700">
              Save 20% yearly
            </span>
          </div>

          {/* tier cards */}
          <div className="grid gap-5 lg:grid-cols-4">
            {TIERS.map((t, i) => {
              const featured = t.highlight;
              const yearly = t.price.startsWith("$");
              const num = Number(t.price.replace(/[^0-9.]/g, ""));
              const priceLabel =
                yearly && billing === "yearly" && !isNaN(num)
                  ? `$${Math.round(num * 0.8)}`
                  : t.price;
              return (
                <Reveal key={t.id} delay={i * 80}>
                  <div
                    className={cn(
                      "relative flex h-full flex-col rounded-2xl border p-5 transition-all",
                      featured
                        ? "border-moss bg-gradient-to-b from-mint/30 to-paper shadow-xl shadow-forest/10 lg:-mt-3 lg:mb-3"
                        : "border-sand bg-paper hover:border-moss/40"
                    )}
                  >
                    {featured && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-moss px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-paper shadow-md">
                        Free Beta
                      </span>
                    )}
                    <h3 className="font-display text-lg font-bold text-forest">
                      {t.name}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-stone">{t.blurb}</p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-forest">
                        {priceLabel}
                      </span>
                      {t.cadence && (
                        <span className="text-[12px] text-mist">{t.cadence}</span>
                      )}
                    </div>

                    <div className="mt-2 rounded-lg bg-cream/60 px-3 py-2 text-center">
                      <span className="text-[12px] font-semibold text-moss">
                        {t.headline}
                      </span>
                    </div>

                    <div className="my-4 border-t border-sand" />

                    <ul className="flex-1 space-y-2.5">
                      {t.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-[13px] text-ink"
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                              featured
                                ? "bg-moss/15 text-moss"
                                : "bg-fog text-leaf"
                            )}
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-5">{planButton(t)}</div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* feature comparison note */}
          <Reveal delay={200}>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: "🧬",
                  title: "Every plan is DNA-native",
                  body: "All tiers engineer behavior through genes — the difference is scale, teams, and deployment.",
                },
                {
                  icon: "📈",
                  title: "Upgrade as you measure",
                  body: "Move up when you need benchmarks, API/SDK access, or shared team workspaces.",
                },
                {
                  icon: "🔒",
                  title: "Enterprise-ready",
                  body: "SSO, RBAC, audit logs, custom models, and on-premise deployment for regulated environments.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-2xl border border-sand bg-cream/40 p-5"
                >
                  <div className="text-2xl">{c.icon}</div>
                  <h4 className="mt-2 font-display text-[15px] font-bold text-forest">
                    {c.title}
                  </h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-stone">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* FAQ teaser */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-sand bg-paper p-6 sm:flex-row">
            <div>
              <h3 className="font-display text-lg font-bold text-forest">
                Not sure which plan?
              </h3>
              <p className="mt-1 text-[13px] text-stone">
                Start with Explorer — it's free during the beta, no card required.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => goPage("faq")}>
                Read FAQ
              </Button>
              <Button onClick={() => goPage("home")}>Get started</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
