// Waitlist submissions — tries real backends in order, never "fake success" silently.
//
// Providers (first configured wins):
// 1) VITE_WAITLIST_ENDPOINT — POST JSON to any webhook (Formspree, Make, custom API)
// 2) Supabase table `waitlist` (anon insert; see docs/WAITLIST.md)
// 3) FormSubmit ajax to SITE.email (works with zero extra infra)

import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";

export interface WaitlistPayload {
  name: string;
  email: string;
  org?: string;
  building?: string;
  currentMethod?: string;
  tier?: string;
  source?: string;
}

export type WaitlistResult =
  | { ok: true; provider: string }
  | { ok: false; error: string };

function clean(payload: WaitlistPayload): WaitlistPayload {
  return {
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    org: payload.org?.trim() || undefined,
    building: payload.building?.trim() || undefined,
    currentMethod: payload.currentMethod?.trim() || undefined,
    tier: payload.tier || undefined,
    source: payload.source || "web",
  };
}

function validate(p: WaitlistPayload): string | null {
  if (!p.name || p.name.length < 2) return "Please enter your name.";
  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
    return "Please enter a valid email.";
  }
  if (!p.tier) return "Please pick a plan interest.";
  return null;
}

async function postJson(url: string, body: Record<string, unknown>): Promise<void> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
}

/** Generic webhook / Formspree-style endpoint */
async function viaEndpoint(p: WaitlistPayload): Promise<WaitlistResult> {
  const url = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
  if (!url) return { ok: false, error: "no-endpoint" };

  await postJson(url, {
    ...p,
    _subject: `Genome AI waitlist: ${p.name}`,
    submittedAt: new Date().toISOString(),
    site: SITE.url,
  });
  return { ok: true, provider: "endpoint" };
}

/** Supabase `waitlist` table insert (RLS: anon insert only) */
async function viaSupabase(p: WaitlistPayload): Promise<WaitlistResult> {
  const { supabase } = await import("./supabase");
  if (!supabase) return { ok: false, error: "no-supabase" };

  const row = {
    name: p.name,
    email: p.email,
    org: p.org ?? null,
    building: p.building ?? null,
    current_method: p.currentMethod ?? null,
    tier: p.tier ?? null,
    source: p.source ?? "web",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : null,
  };

  const { error } = await supabase.from("waitlist").insert(row);
  if (error) {
    // Table missing / RLS — fall through to next provider
    throw new Error(error.message);
  }
  return { ok: true, provider: "supabase" };
}

/**
 * FormSubmit.co ajax — emails SITE.email without a custom backend.
 * Requires one-time inbox confirmation the first time the address is used.
 */
async function viaFormSubmit(p: WaitlistPayload): Promise<WaitlistResult> {
  const email = SITE.email;
  if (!email || email.includes("example")) {
    return { ok: false, error: "no-formsubmit" };
  }

  const url = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
  await postJson(url, {
    name: p.name,
    email: p.email,
    organization: p.org || "",
    building: p.building || "",
    current_method: p.currentMethod || "",
    tier: p.tier || "",
    source: p.source || "web",
    _subject: `[Genome AI] Waitlist — ${p.name}`,
    _template: "table",
    _captcha: "false",
  });
  return { ok: true, provider: "formsubmit" };
}

/**
 * Submit waitlist entry. Tries endpoint → Supabase → FormSubmit.
 * Returns ok:false only if every available provider fails.
 */
export async function submitWaitlist(raw: WaitlistPayload): Promise<WaitlistResult> {
  const payload = clean(raw);
  const invalid = validate(payload);
  if (invalid) return { ok: false, error: invalid };

  const attempts: Array<(p: WaitlistPayload) => Promise<WaitlistResult>> = [
    viaEndpoint,
    viaSupabase,
    viaFormSubmit,
  ];

  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      const result = await attempt(payload);
      if (result.ok) {
        track({
          name: "waitlist_join",
          props: { provider: result.provider, tier: payload.tier || "" },
        });
        try {
          localStorage.setItem(
            "genome-ai:waitlist",
            JSON.stringify({ email: payload.email, at: Date.now(), provider: result.provider })
          );
        } catch {
          /* ignore */
        }
        return result;
      }
      // soft skip (provider not configured)
      if (result.error.startsWith("no-")) continue;
      errors.push(result.error);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }

  track({
    name: "waitlist_join_failed",
    props: { error: errors[0] || "unknown" },
  });

  return {
    ok: false,
    error:
      errors[0] ||
      "Could not reach the waitlist service. Email us at " + SITE.email + " instead.",
  };
}

export function hasJoinedWaitlistLocally(): boolean {
  try {
    return Boolean(localStorage.getItem("genome-ai:waitlist"));
  } catch {
    return false;
  }
}
