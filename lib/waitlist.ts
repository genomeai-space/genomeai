// Waitlist submissions — real backends only (no fake success).
//
// Providers (first success wins):
// 1) Supabase Edge Function `waitlist` (publishable key) — preferred
// 2) VITE_WAITLIST_ENDPOINT — Formspree / custom webhook
// 3) Direct Supabase table insert (anon RLS)
// 4) FormSubmit → SITE.email

import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { getSupabaseConfig, supabase } from "@/lib/supabase";

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
  | { ok: true; provider: string; alreadyJoined?: boolean }
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

async function postJson(
  url: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

/** Preferred: Edge Function secured with publishable key */
async function viaEdgeFunction(p: WaitlistPayload): Promise<WaitlistResult> {
  const { functionsWaitlistUrl, publishableKey, configured } = getSupabaseConfig();
  if (!configured || !functionsWaitlistUrl || !publishableKey) {
    return { ok: false, error: "no-edge" };
  }

  const res = await postJson(
    functionsWaitlistUrl,
    {
      name: p.name,
      email: p.email,
      org: p.org,
      building: p.building,
      currentMethod: p.currentMethod,
      tier: p.tier,
      source: p.source,
    },
    {
      apikey: publishableKey,
      Authorization: `Bearer ${publishableKey}`,
    }
  );

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    error?: string;
    alreadyJoined?: boolean;
    provider?: string;
  };

  if (!res.ok || data.ok === false) {
    // Function not deployed yet → fall through
    if (res.status === 404 || res.status === 503) {
      return { ok: false, error: "no-edge" };
    }
    throw new Error(data.error || `Waitlist function failed (${res.status})`);
  }

  return {
    ok: true,
    provider: data.provider || "edge_waitlist",
    alreadyJoined: data.alreadyJoined,
  };
}

async function viaEndpoint(p: WaitlistPayload): Promise<WaitlistResult> {
  const url = import.meta.env.VITE_WAITLIST_ENDPOINT as string | undefined;
  if (!url) return { ok: false, error: "no-endpoint" };

  const res = await postJson(url, {
    ...p,
    _subject: `Genome AI waitlist: ${p.name}`,
    submittedAt: new Date().toISOString(),
    site: SITE.url,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return { ok: true, provider: "endpoint" };
}

async function viaSupabaseTable(p: WaitlistPayload): Promise<WaitlistResult> {
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
    if (error.code === "23505" || /duplicate|unique/i.test(error.message)) {
      return { ok: true, provider: "supabase", alreadyJoined: true };
    }
    throw new Error(error.message);
  }
  return { ok: true, provider: "supabase" };
}

async function viaFormSubmit(p: WaitlistPayload): Promise<WaitlistResult> {
  const email = SITE.email;
  if (!email || email.includes("example")) {
    return { ok: false, error: "no-formsubmit" };
  }

  const url = `https://formsubmit.co/ajax/${encodeURIComponent(email)}`;
  const res = await postJson(url, {
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
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `FormSubmit failed (${res.status})`);
  }
  return { ok: true, provider: "formsubmit" };
}

export async function submitWaitlist(raw: WaitlistPayload): Promise<WaitlistResult> {
  const payload = clean(raw);
  const invalid = validate(payload);
  if (invalid) return { ok: false, error: invalid };

  const attempts: Array<(p: WaitlistPayload) => Promise<WaitlistResult>> = [
    viaEdgeFunction,
    viaEndpoint,
    viaSupabaseTable,
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
            JSON.stringify({
              email: payload.email,
              at: Date.now(),
              provider: result.provider,
            })
          );
        } catch {
          /* ignore */
        }
        return result;
      }
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
