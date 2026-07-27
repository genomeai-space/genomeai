import { useState } from "react";
import { useStore } from "@/lib/store";
import { FAQS } from "@/lib/faq";
import { PageHeader } from "./PageHeader";
import { Reveal } from "@/components/ui/primitives";
import { cn } from "@/utils/cn";

export function FAQ() {
  const { goPage, openAuth } = useStore();
  const [open, setOpen] = useState<number | null>(0);
  const groups = [...new Set(FAQS.map((f) => f.group))];

  return (
    <>
      <PageHeader
        page="faq"
        eyebrow="FAQ"
        title="Frequently asked questions"
        subtitle="Everything about Digital DNA, the engine, benchmarking, and access — in plain language."
      />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-5">
          {groups.map((g) => (
            <div key={g} className="mb-8">
              <h3 className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-moss">
                {g}
              </h3>
              <div className="space-y-2.5">
                {FAQS.filter((f) => f.group === g).map((f, i) => {
                  const idx = FAQS.indexOf(f);
                  const isOpen = open === idx;
                  return (
                    <Reveal key={idx} delay={Math.min(i * 40, 200)}>
                      <div
                        className={cn(
                          "overflow-hidden rounded-xl border bg-paper transition-colors",
                          isOpen ? "border-moss/50" : "border-sand"
                        )}
                      >
                        <button
                          onClick={() => setOpen(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="font-display text-[15px] font-semibold text-forest">
                            {f.q}
                          </span>
                          <span
                            className={cn(
                              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-stone transition-all",
                              isOpen && "rotate-45 bg-mint text-forest"
                            )}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          </span>
                        </button>
                        <div
                          className={cn(
                            "grid transition-all duration-300",
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          )}
                        >
                          <div className="overflow-hidden">
                            <p className="px-4 pb-4 text-[13.5px] leading-relaxed text-stone">
                              {f.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-xl border border-sand bg-cream/50 px-4 py-4 text-center sm:flex-row sm:text-left">
            <p className="text-[13px] text-stone">
              Still curious? See{" "}
              <a
                href="/pricing"
                onClick={(e) => {
                  e.preventDefault();
                  goPage("pricing");
                }}
                className="font-semibold text-moss hover:underline"
              >
                plans & features
              </a>{" "}
              or try the playground.
            </p>
            <div className="flex gap-2">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  goPage("home");
                }}
                className="rounded-lg border border-sand bg-paper px-3 py-2 text-[12px] font-medium text-forest hover:border-moss"
              >
                Back to home
              </a>
              <button
                onClick={() => openAuth("request")}
                className="rounded-lg bg-moss px-3 py-2 text-[12px] font-medium text-paper hover:bg-forest-700"
              >
                Request access
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
