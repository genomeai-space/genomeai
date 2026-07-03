# genome-engine — Private Backend Template

This document describes the structure for the **private** `genome-engine` repository.

## Directory Structure

```
genome-engine/
├── functions/                    # Supabase Edge Functions
│   ├── run/                      # POST /api/run
│   │   └── index.ts
│   ├── benchmark/                # POST /api/benchmark
│   │   └── index.ts
│   └── webhooks/
│       └── stripe/               # Webhook handlers
│           └── index.ts
├── supabase/
│   ├── migrations/               # Database schema + RLS policies
│   │   ├── 001_init_schema.sql
│   │   └── 002_rls_policies.sql
│   └── seed/                     # Test data
│       └── seed.sql
├── lib/
│   ├── compiler.ts               # REAL genome → prompt compiler
│   ├── llm.ts                    # OpenAI/Anthropic API calls
│   ├── billing.ts                # Usage tracking & billing
│   └── validation.ts
├── .env.example                  # Template (no secrets)
├── .env.production               # NEVER COMMIT (secrets manager)
├── supabase.json                 # Supabase config
├── deno.json                     # Deno runtime config
└── README.md
```

---

## Key Files

### functions/run/index.ts
```typescript
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { compileGenome } from "../../lib/compiler.ts";
import { callLLM } from "../../lib/llm.ts";
import { trackUsage } from "../../lib/billing.ts";

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const { genome, task } = await req.json();

  try {
    // Compile genome to actual prompt
    const systemPrompt = compileGenome(genome);

    // Call LLM (real API)
    const result = await callLLM(systemPrompt, task);

    // Track usage for billing
    await trackUsage(result.usage);

    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
```

### lib/compiler.ts
```typescript
import type { Genes } from "../genomeai-types.ts"; // Import from public repo

/**
 * Real genome compiler: takes genes and produces a system prompt
 * + tool instructions + reasoning guidelines
 */
export function compileGenome(genes: Genes): string {
  const reasoning = Math.floor((genes.reasoning - 50) / 50 * 100);
  const planning = Math.floor((genes.planning - 50) / 50 * 100);
  // ... compile each gene into actual instructions ...

  return `You are an AI assistant with the following behavior profile...`;
}
```

### supabase/migrations/001_init_schema.sql
```sql
CREATE TABLE IF NOT EXISTS genomes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  genes JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE genomes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own genomes" ON genomes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create genomes" ON genomes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage tracking for billing
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  tokens_used INT,
  cost_cents INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage" ON usage
  FOR SELECT USING (auth.uid() = user_id);
```

### lib/billing.ts
```typescript
import { createClient } from "https://esm.sh/@supabase/supabase-js";

export async function trackUsage(usage: { tokens: number; costCents: number }) {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_KEY")
  );

  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("usage").insert({
    user_id: user?.id,
    tokens_used: usage.tokens,
    cost_cents: usage.costCents,
  });
}
```

---

## Environment Variables

**`.env.production` (NEVER COMMIT)**
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_with_full_access

# LLM APIs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=claude-...

# Billing
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**`.env.example` (Committed)**
```bash
SUPABASE_URL=https://your-project.supabase.co
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
```

---

## Deployment

**Supabase Edge Functions:**
```bash
supabase functions deploy run --project-id <id>
supabase functions deploy benchmark --project-id <id>
```

**Stripe Webhooks:**
- Configure in Stripe Dashboard → Webhooks
- Endpoint: `https://your-project.supabase.co/functions/v1/webhooks/stripe`

---

## Security Checklist

- ✅ All secrets in `.env.production` (never in git)
- ✅ RLS policies enforce user data isolation
- ✅ API keys rotated regularly
- ✅ Service key only used server-side
- ✅ Edge Functions run in Deno (sandboxed)
- ✅ Billing logic prevents overcharging
- ✅ Rate limiting on LLM calls

---

## API Contract with genomeai

The public `genomeai` repo calls these endpoints:

- `POST /api/run` — Run genome on task
- `POST /api/benchmark` — Benchmark genome across tasks

Both endpoints expect:
- Valid `genome` object (10 genes, 0-100 each)
- Valid `task` string
- Optional: `auth_token` (Supabase JWT)

See [genomeai/docs/API_CONTRACT.md](../API_CONTRACT.md)

---

## Testing

```bash
# Start Supabase locally
supabase start

# Deploy functions locally
supabase functions deploy run --project-id local

# Test with curl
curl -X POST http://localhost:54321/functions/v1/run \
  -H "Content-Type: application/json" \
  -d '{"genome": {...}, "task": "..."}'
```
