import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (publishable / anon key only — never secret).
 * Supports both classic anon JWT keys and new sb_publishable_* keys.
 */
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_PROJECT_URL ||
  "";

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "";

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    publishableKey: supabaseKey,
    configured: Boolean(supabaseUrl && supabaseKey),
    functionsWaitlistUrl: supabaseUrl
      ? `${supabaseUrl.replace(/\/$/, "")}/functions/v1/waitlist`
      : "",
  };
}
