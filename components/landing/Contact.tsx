import { useState } from "react";
import { PageHeader } from "./PageHeader";
import { Reveal, Button } from "@/components/ui/primitives";
import { SITE } from "@/lib/site";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!email.trim() || !message.trim()) return;
    setSent(true);
  };

  return (
    <>
      <PageHeader
        page="contact"
        eyebrow="Contact"
        title={
          <>
            Let's <span className="text-moss">talk</span>
          </>
        }
        subtitle="Questions about Genome AI, the beta, partnerships, or the Genome Standard? Reach out — we read everything."
      />

      <section className="py-14">
        <div className="mx-auto max-w-5xl px-5">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* form */}
            <Reveal>
              <div className="rounded-2xl border border-sand bg-paper p-6">
                {sent ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f6b43" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-bold text-forest">
                      Message sent
                    </h3>
                    <p className="mt-2 max-w-sm text-[14px] text-stone">
                      Thanks{name ? `, ${name.split(" ")[0]}` : ""}! We'll get back to
                      you at <span className="font-medium text-forest">{email}</span>{" "}
                      shortly.
                    </p>
                    <Button
                      className="mt-5"
                      variant="secondary"
                      onClick={() => {
                        setSent(false);
                        setName("");
                        setEmail("");
                        setMessage("");
                      }}
                    >
                      Send another
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-stone">
                          Name
                        </label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ada Lovelace"
                          className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold text-stone">
                          Email
                        </label>
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          placeholder="you@lab.dev"
                          className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-stone">
                        Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        placeholder="How can we help?"
                        className="w-full resize-none rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                      />
                    </div>
                    <Button
                      size="lg"
                      onClick={submit}
                      disabled={!email.trim() || !message.trim()}
                    >
                      Send message →
                    </Button>
                  </div>
                )}
              </div>
            </Reveal>

            {/* contact info */}
            <Reveal delay={100}>
              <div className="space-y-4">
                <div className="rounded-2xl border border-sand bg-paper p-5">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-moss">
                    Email
                  </h3>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-2 block text-[14px] font-medium text-forest hover:underline"
                  >
                    {SITE.email}
                  </a>
                  <p className="mt-1 text-[12px] text-stone">
                    General questions & partnerships.
                  </p>

                  <div className="my-4 border-t border-sand" />

                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-moss">
                    Beta access
                  </h3>
                  <a
                    href={`mailto:${SITE.betaEmail}`}
                    className="mt-2 block text-[14px] font-medium text-forest hover:underline"
                  >
                    {SITE.betaEmail}
                  </a>
                  <p className="mt-1 text-[12px] text-stone">
                    Beta applications & onboarding.
                  </p>
                </div>

                <div className="rounded-2xl border border-sand bg-paper p-5">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-moss">
                    Community
                  </h3>
                  <div className="mt-2 space-y-2">
                    <a
                      href={SITE.social.twitter}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 text-[14px] font-medium text-forest hover:text-moss"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-mist" aria-hidden>
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      {SITE.social.twitterHandle}
                    </a>
                    <a
                      href={SITE.social.github}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 text-[14px] font-medium text-forest hover:text-moss"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-mist" aria-hidden>
                        <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
                      </svg>
                      genomeai
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-moss/30 bg-gradient-to-br from-fog to-mint/20 p-5">
                  <p className="text-[13px] leading-relaxed text-forest">
                    Looking for a faster reply?{" "}
                    <span className="font-semibold">Request early access</span> and you'll
                    hear from us as part of the beta rollout.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
