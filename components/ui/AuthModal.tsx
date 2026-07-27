import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button, Modal } from "@/components/ui/primitives";
import { BrandLogo } from "@/components/ui/dna";
import { TIERS, TIER_MAP, type TierId } from "@/lib/pricing";
import { submitWaitlist } from "@/lib/waitlist";
import { SITE } from "@/lib/site";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-moss" />
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-moss">
        {children}
      </span>
    </div>
  );
}

/**
 * Early-access waitlist — submits to a real backend (see lib/waitlist.ts).
 * Product entry is still "Try demo" (startDemo).
 */
export function AuthModal() {
  const { route, closeAuth, startDemo } = useStore();
  const auth = route.auth ?? null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [building, setBuilding] = useState("");
  const [currentMethod, setCurrentMethod] = useState("");
  const [tier, setTier] = useState<TierId | "">("");
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  const resetForm = () => {
    setRequested(false);
    setLoading(false);
    setError(null);
    setProvider(null);
  };

  const close = () => {
    resetForm();
    closeAuth();
  };

  const submitRequest = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await submitWaitlist({
        name,
        email,
        org,
        building,
        currentMethod,
        tier: tier || undefined,
        source: "waitlist_modal",
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setProvider(result.provider);
      setRequested(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openDemo = () => {
    closeAuth();
    startDemo();
  };

  return (
    <Modal open={auth === "request"} onClose={close} className="max-w-lg">
      {requested ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mint">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2f6b43"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-moss">
            You're on the list
          </span>
          <h3 className="mt-1 font-display text-2xl font-bold text-forest">
            Request received
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-stone">
            We'll reach out at{" "}
            <span className="font-medium text-forest">{email || "your email"}</span> when your
            spot opens. Your submission was saved
            {provider ? ` via ${provider === "formsubmit" ? "email" : provider}` : ""}.
          </p>

          {(tier || building.trim()) && (
            <div className="mt-4 space-y-2 text-left">
              {tier && (
                <div className="flex items-center justify-between rounded-lg bg-mint/30 px-3 py-2">
                  <span className="text-[12px] text-stone">
                    Tier ·{" "}
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
                  .
                </p>
              )}
            </div>
          )}

          <Button className="mt-5 w-full" size="lg" onClick={openDemo}>
            Try the demo now →
          </Button>
          <button onClick={close} className="mt-2 text-[12px] text-mist hover:text-forest">
            Back to the site
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
              Join the waitlist
            </h3>
            <p className="mt-1.5 text-sm text-stone">
              Get product updates and early access. Or skip ahead and try the full demo —
              no account required.
            </p>
          </div>

          <div className="mt-5">
            <Button className="w-full" size="lg" onClick={openDemo}>
              Try demo — no signup
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-mist">
            <span className="h-px flex-1 bg-sand" />
            or join the waitlist
            <span className="h-px flex-1 bg-sand" />
          </div>

          <div className="space-y-3">
            <SectionLabel>About you</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-stone" htmlFor="wl-name">
                  Name
                </label>
                <input
                  id="wl-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada"
                  autoComplete="name"
                  className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-stone" htmlFor="wl-email">
                  Email
                </label>
                <input
                  id="wl-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="you@lab.dev"
                  className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-stone" htmlFor="wl-org">
                Organization <span className="font-normal text-mist">(optional)</span>
              </label>
              <input
                id="wl-org"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Lab / company"
                autoComplete="organization"
                className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
              />
            </div>

            <SectionLabel>What are you building?</SectionLabel>
            <textarea
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              rows={2}
              placeholder="Support agents, research copilots, coding assistants…"
              className="w-full resize-none rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
            />
            <div>
              <label className="mb-1 block text-[12px] font-semibold text-stone">
                How do you shape AI behavior today?
              </label>
              <input
                value={currentMethod}
                onChange={(e) => setCurrentMethod(e.target.value)}
                placeholder="Prompts, custom GPTs, agents…"
                className="w-full rounded-xl border border-sand bg-cream/50 px-3.5 py-2.5 text-sm outline-none focus:border-moss focus:bg-paper"
              />
            </div>

            <SectionLabel>Plan interest</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    tier === t.id
                      ? "border-moss bg-mint/40 ring-1 ring-moss/30"
                      : "border-sand bg-cream/40 hover:border-moss/40"
                  }`}
                >
                  <div className="font-display text-[13px] font-bold text-forest">{t.name}</div>
                  <div className="text-[11px] text-mist">{t.headline}</div>
                </button>
              ))}
            </div>

            {error && (
              <div className="rounded-xl border border-clay/30 bg-clay/10 px-3 py-2.5 text-[12.5px] text-clay">
                {error}
                <div className="mt-1 text-[11px] text-stone">
                  Or email us at{" "}
                  <a className="font-semibold text-moss underline" href={`mailto:${SITE.email}`}>
                    {SITE.email}
                  </a>
                </div>
              </div>
            )}

            <Button
              className="mt-2 w-full"
              size="lg"
              variant="secondary"
              onClick={submitRequest}
              disabled={loading || !email.trim() || !name.trim() || !tier}
            >
              {loading ? "Submitting…" : "Join the waitlist →"}
            </Button>
            <p className="text-center text-[11px] text-mist">
              We only use this to contact you about Genome AI. No spam.
            </p>
          </div>
        </>
      )}
    </Modal>
  );
}
