import { type ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Reveal } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";

export function LegalLayout({
  page,
  eyebrow,
  title,
  intro,
  children,
  updated,
}: {
  page: "privacy" | "terms";
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
  updated?: string;
}) {
  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <>
      <PageHeader page={page} eyebrow={eyebrow} title={title} subtitle={intro} />
      <section className="py-14">
        <div className="mx-auto max-w-3xl px-5">
          <div className="mb-8 flex items-center justify-between text-[12px] text-mist">
            <span>Effective: {updated || today}</span>
            <span>· {SITE.name}</span>
          </div>
          <Reveal>
            <div className="legal-prose space-y-6">{children}</div>
          </Reveal>

          <div className="mt-10 rounded-xl border border-sand bg-cream/50 p-4 text-[13px] text-stone">
            Questions about this {eyebrow.toLowerCase()}? Email{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="font-semibold text-moss hover:underline"
            >
              {SITE.email}
            </a>
            .
          </div>
        </div>
      </section>
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-bold text-forest">{title}</h2>
      <div className="mt-2 space-y-3 text-[14px] leading-relaxed text-stone [&_strong]:font-semibold [&_strong]:text-forest [&_li]:ml-4 [&_li]:list-disc">
        {children}
      </div>
    </div>
  );
}
