/**
 * Waitlist Edge Function — public lead capture.
 *
 * Auth: publishable key (browser sends apikey header).
 * DB: insert into public.waitlist under anon RLS.
 *
 * Deploy:
 *   supabase functions deploy waitlist --project-ref anwwrkajurbwkczivzmu
 *
 * Env (injected on hosted Edge Functions):
 *   SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, SUPABASE_JWKS_URL
 */
import { withSupabase } from "npm:@supabase/server@1";

type Body = {
  name?: string;
  email?: string;
  org?: string;
  building?: string;
  currentMethod?: string;
  current_method?: string;
  tier?: string;
  source?: string;
};

function bad(message: string, status = 400) {
  return Response.json({ ok: false, error: message }, { status });
}

export default {
  fetch: withSupabase(
    {
      // Browser clients authenticate with the publishable (anon) key
      auth: "publishable",
      cors: true,
    },
    async (req, ctx) => {
      if (req.method === "OPTIONS") {
        return new Response(null, { status: 204 });
      }
      if (req.method !== "POST") {
        return bad("Method not allowed", 405);
      }

      let body: Body;
      try {
        body = (await req.json()) as Body;
      } catch {
        return bad("Invalid JSON body");
      }

      const name = String(body.name ?? "").trim();
      const email = String(body.email ?? "").trim().toLowerCase();
      const org = String(body.org ?? "").trim() || null;
      const building = String(body.building ?? "").trim() || null;
      const currentMethod =
        String(body.currentMethod ?? body.current_method ?? "").trim() || null;
      const tier = String(body.tier ?? "").trim() || null;
      const source = String(body.source ?? "edge_waitlist").trim() || "edge_waitlist";

      if (name.length < 2) return bad("Please enter your name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return bad("Please enter a valid email.");
      }
      if (!tier) return bad("Please pick a plan interest.");

      const userAgent = req.headers.get("user-agent")?.slice(0, 240) ?? null;

      const row = {
        name,
        email,
        org,
        building,
        current_method: currentMethod,
        tier,
        source,
        user_agent: userAgent,
      };

      // Prefer RLS-scoped client (anon). Fall back to admin if policy not applied yet.
      let error = (await ctx.supabase.from("waitlist").insert(row)).error;

      if (error && ctx.supabaseAdmin) {
        const admin = await ctx.supabaseAdmin.from("waitlist").insert(row);
        error = admin.error;
      }

      if (error) {
        // Unique email — treat as success so the UI can show "you're on the list"
        if (
          error.code === "23505" ||
          /duplicate|unique/i.test(error.message)
        ) {
          return Response.json({
            ok: true,
            provider: "edge_waitlist",
            alreadyJoined: true,
          });
        }
        return Response.json(
          { ok: false, error: error.message },
          { status: 500 }
        );
      }

      return Response.json({ ok: true, provider: "edge_waitlist" });
    }
  ),
};
