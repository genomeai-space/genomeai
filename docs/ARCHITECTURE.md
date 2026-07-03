# Architecture: Public Frontend & Private Backend

## 📦 Two Repositories

### 1. **genomeai-space/genomeai** (PUBLIC)
Your open-source marketing engine and developer experience.

**What's here:**
- React frontend + landing page
- UI components (Editor, Playground, Compare, Benchmark)
- **Mock engine** (`lib/engine.ts`) — deterministic simulator that shows how genes drive behavior
- Community issues, feature requests, documentation
- No sensitive credentials

**Why public:**
- Shows the "Genome Standard" to the world
- Developers can run locally without API keys
- Community can contribute, star, and build integrations
- Transparent about how the core concept works

---

### 2. **genomeai-space/genome-engine** (PRIVATE)
Your proprietary backend and business logic.

**What goes here:**
- Supabase SQL migrations (schema, RLS policies)
- Edge Functions (actual LLM calls, billing, orchestration)
- Stripe webhook handlers + billing logic
- **Real engine** — production LLM compiler that:
  - Takes a Genome + task
  - Constructs the actual prompt/system message
  - Calls OpenAI/Anthropic APIs
  - Returns real results + usage metrics
  - Charges per token/API call
- Database backups, security configs
- API keys, secrets, and deployment configs

**Why private:**
- Protects your proprietary prompt engineering
- Keeps database schemas confidential
- Prevents competitors from cloning your infrastructure
- Secures billing and customer data

---

## 🔗 How They Interact

```
┌─────────────────────────────────────────────────────────────┐
│                    genomeai (PUBLIC)                        │
│  Frontend • UI • Mock Engine (for demo/community)           │
│                                                              │
│  When user clicks "Run" in Playground:                      │
│  → POST /api/run { genome, task }                           │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS API Call
                     ↓
┌─────────────────────────────────────────────────────────────┐
│               genome-engine (PRIVATE)                       │
│  Real LLM Compiler • Billing • Database • RLS Policies      │
│                                                              │
│  Edge Function receives { genome, task }                    │
│  → Compile Genome to actual prompt                          │
│  → Call OpenAI/Anthropic                                    │
│  → Track usage + charge user                                │
│  → Return { result, metrics, cost }                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Current State

### genomeai/lib/engine.ts
- ✅ Mock engine (perfect for public repo)
- Uses seeded PRNG for deterministic output
- No real LLM calls, no API costs
- Demonstrates the concept

### genomeai/.env.local
- ❌ **Should NOT be in git** (add to `.gitignore`)
- Contains Supabase credentials
- Only for local development

### To Create in genome-engine
- [ ] `supabase/migrations/` — SQL schemas, RLS policies
- [ ] `functions/` — Edge Functions for real LLM calls
- [ ] `.env.production` — Production secrets
- [ ] `lib/real-engine.ts` — Production LLM compiler
- [ ] `stripe/` — Webhook handlers for billing

---

## 🚀 Getting Started

**For genomeai (PUBLIC):**
```bash
npm install
npm run dev
# Mock engine runs, no credentials needed
# Users can try Playground, Compare, Benchmark locally
```

**For genome-engine (PRIVATE):**
```bash
# Requires:
# - Supabase project + credentials
# - Stripe keys
# - OpenAI/Anthropic API keys
# - Deploy via Supabase Edge Functions
```

---

## 🔐 Secrets Management

**Never commit:**
- `.env.local` or any `.env` files with real keys
- Supabase migration files with sensitive RLS (if not yet public)
- API keys, tokens, or credentials
- Database backups or personally identifiable data

**Use instead:**
- `.gitignore` (committed) — lists files to ignore
- `.env.example` (committed) — template showing required vars
- Secrets in CI/CD (GitHub Actions, Supabase Dashboard, etc.)
- Vault/Secret Manager for production

