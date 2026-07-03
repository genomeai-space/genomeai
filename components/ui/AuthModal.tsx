import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Modal } from "@/components/ui/primitives";
import { BrandLogo } from "@/components/ui/dna";
import { TIERS, TIER_MAP, type TierId } from "@/lib/pricing";

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-moss" />
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-moss">
        {children}
      </span>
    </div>
  );
}

export function AuthModal() {
  const { route, openAuth, closeAuth, signIn, enterApp, goPage } = useStore();
  const auth = route.auth ?? null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [building, setBuilding] = useState("");
  const [currentMethod, setCurrentMethod] = useState("");
  const [tier, setTier] = useState<TierId | "">("");
  const [requested, setRequested] = useState(false);

  const close = () => {
    setRequested(false);
    closeAuth();
  };

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(name, email || "engineer@genome.ai");
      closeAuth();
      enterApp();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = () => setRequested(true);

  return (
    <>
      {/* ── Sign in ── */}
      <Modal open={auth === "signin"} onClose={close}>
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <BrandLogo />
          </div>
          <h3 className="font-display text-xl font-bold text-forest">Welcome back</h3>
          <p className="mt-1.5 text-sm text-stone">
            Existing approved users — sign in to access your DNA Library, Editor,
            Playground & Benchmarks.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-stone">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSignIn()}
              placeholder="Ada Lovelace"
              className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-stone">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitSignIn()}
              type="email"
              placeholder="you@lab.dev"
              className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
            />
          </div>
          {error && (
            <div className="rounded-lg bg-clay/10 px-3 py-2 text-[12.5px] text-clay">
              {error}
            </div>
          )}
          <Button className="mt-2 w-full" size="lg" onClick={submitSignIn} disabled={loading || !email}>
            {loading ? "Checking access…" : "Sign in →"}
          </Button>
          <button
            onClick={() => {
              signIn("Guest Engineer", "guest@genome.ai");
              closeAuth();
              enterApp();
            }}
            className="w-full py-1 text-[12px] text-mist hover:text-forest"
          >
            or continue as guest
          </button>
        </div>
        <div className="mt-4 border-t border-sand pt-3 text-center text-[12px] text-stone">
          Not approved yet?{" "}
          <button
            onClick={() => openAuth("request")}
            className="font-semibold text-moss hover:underline"
          >
            Request early access
          </button>
        </div>
      </Modal>

      {/* ── Request early access ── */}
      <Modal open={auth === "request"} onClose={close} className="max-w-lg">
        {requested ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2f6b43" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-moss">
              Request Received
            </span>
            <h3 className="mt-1 font-display text-2xl font-bold text-forest">
              You're on the early access list
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone">
              We'll review applications in batches and reach out at{" "}
              <span className="font-medium text-forest">{email || "your email"}</span>{" "}
              when your spot opens.
            </p>

            {(tier || building.trim()) && (
              <div className="mt-4 space-y-2 text-left">
                {tier && (
                  <div className="flex items-center justify-between rounded-lg bg-mint/30 px-3 py-2">
                    <span className="text-[12px] text-stone">
                      Tier interested in ·{" "}
                      <span className="font-display text-[13px] font-bold text-forest">
                        {TIER_MAP[tier].name}
                      </span>
                    </span>
                    <span className="text-[11px] text-mist">{TIER_MAP[tier].headline}</span>
                  </div>
                )}
                {building.trim() && (
                  <p className="rounded-lg bg-cream/60 px-3 py-2 text-[12.5px] text-forest">
                    <span className="font-semibold text-moss">Noted:</span> you're building{" "}
                    {building.trim().length > 90
                      ? building.trim().slice(0, 90) + "…"
                      : building.trim()}
                    . Genome engineering fits that perfectly.
                  </p>
                )}
              </div>
            )}

            <Button className="mt-5 w-full" size="lg" onClick={close}>
              Back to GenomeAI
            </Button>
            <button
              onClick={() => {
                closeAuth();
                signIn("Guest Engineer", "guest@genome.ai");
                enterApp();
              }}
              className="mt-2 text-[12px] text-mist hover:text-forest"
            >
              Explore the demo while you wait →
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <BrandLogo />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-forest-700">
                <span className="h-1.5 w-1.5 rounded-full bg-spring animate-pulse-soft" />
                Free Beta
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-forest">
                Request early access
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone">
                We're inviting builders who want to engineer AI behavior — not just
                write prompts.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              {/* Personal */}
              <div>
                <SectionLabel>Personal</SectionLabel>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-stone">
                      Full Name
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
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-stone">
                      Organization <span className="font-normal text-mist">(optional)</span>
                    </label>
                    <input
                      value={org}
                      onChange={(e) => setOrg(e.target.value)}
                      placeholder="Acme Labs"
                      className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                    />
                  </div>
                </div>
              </div>

              {/* About You */}
              <div>
                <SectionLabel>About You</SectionLabel>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-stone">
                      What are you building with AI?
                    </label>
                    <textarea
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      rows={3}
                      placeholder="e.g. A coding copilot for internal tooling, a research assistant, a support agent…"
                      className="w-full resize-none rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-stone">
                      How do you currently build AI agents?
                    </label>
                    <select
                      value={currentMethod}
                      onChange={(e) => setCurrentMethod(e.target.value)}
                      className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm text-forest outline-none focus:border-moss focus:bg-paper"
                    >
                      <option value="" disabled>
                        Select an approach…
                      </option>
                      <option value="prompt">Prompt engineering</option>
                      <option value="framework">Agent frameworks (CrewAI, LangGraph…)</option>
                      <option value="builder">GPT Builder / Claude Projects</option>
                      <option value="custom">Custom code + API</option>
                      <option value="exploring">Just exploring</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tier Interested In */}
              <div>
                <SectionLabel>
                  Tier Interested In
                  <span className="ml-1.5 font-normal normal-case tracking-normal text-mist">
                    (planned pricing)
                  </span>
                </SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  {TIERS.map((t) => {
                    const active = tier === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTier(t.id)}
                        className={
                          "relative rounded-xl border p-3 text-left transition-all " +
                          (active
                            ? "border-moss bg-mint/30 ring-1 ring-moss/40"
                            : "border-sand bg-cream/40 hover:border-moss/50 hover:bg-cream/70")
                        }
                      >
                        {t.highlight && (
                          <span className="absolute right-2 top-2 rounded-full bg-moss/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-moss">
                            Beta
                          </span>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="font-display text-[13.5px] font-bold text-forest">
                            {t.name}
                          </span>
                          {active && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-moss text-[9px] font-bold text-paper">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-baseline gap-1">
                          <span className="font-display text-base font-bold text-forest">
                            {t.price}
                          </span>
                          {t.cadence && (
                            <span className="text-[10px] text-mist">{t.cadence}</span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11.5px] font-semibold text-moss">
                          {t.headline}
                        </p>
                        {active && (
                          <ul className="mt-2 space-y-1 border-t border-moss/20 pt-2">
                            {t.features.map((f) => (
                              <li
                                key={f}
                                className="flex items-start gap-1.5 text-[11px] leading-snug text-forest"
                              >
                                <span className="mt-px text-moss">✓</span>
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => goPage("pricing")}
                  className="mt-2 text-[12px] font-medium text-moss hover:underline"
                >
                  Compare all plan features →
                </button>
              </div>

              <Button
                className="mt-1 w-full"
                size="lg"
                onClick={submitRequest}
                disabled={!email.trim() || !name.trim() || !tier}
              >
                Join the beta →
              </Button>
            </div>
            <div className="mt-4 border-t border-sand pt-3 text-center text-[12px] text-stone">
              Already approved?{" "}
              <button
                onClick={() => openAuth("signin")}
                className="font-semibold text-moss hover:underline"
              >
                Sign in
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
