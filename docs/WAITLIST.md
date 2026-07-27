# Waitlist + Supabase setup

## Architecture

| Layer | Role |
|-------|------|
| **Browser** (`lib/waitlist.ts`) | Calls Edge Function → webhook → table insert → FormSubmit |
| **Edge Function** `waitlist` | `@supabase/server` with `auth: 'publishable'` |
| **Table** `public.waitlist` | Stores leads; anon can insert, not select |

## 1. Create the table

In Supabase SQL editor (or `supabase db push`):

```bash
# from repo root, after supabase link
supabase db push
```

Or paste `supabase/migrations/20260727120000_waitlist.sql`.

## 2. Browser env

`.env.local` (gitignored):

```bash
VITE_SUPABASE_URL=https://anwwrkajurbwkczivzmu.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SUPABASE_ANON_KEY=sb_publishable_...   # same value is fine
```

GitHub Actions secrets for Pages:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (use publishable key)
- optional `VITE_WAITLIST_ENDPOINT`

**Never** put `SUPABASE_SECRET_KEY` in `VITE_*` or the frontend.

## 3. Deploy Edge Function

```bash
# once
npx supabase login
npx supabase link --project-ref anwwrkajurbwkczivzmu

# deploy
npx supabase functions deploy waitlist --project-ref anwwrkajurbwkczivzmu
```

Hosted functions get `SUPABASE_URL`, keys, and JWKS automatically.

Local serve:

```bash
npx supabase functions serve waitlist --env-file .env.local
```

## 4. `@supabase/server`

Used **only** in Edge Functions:

```ts
import { withSupabase } from "npm:@supabase/server@1";
```

The repo also lists `@supabase/server` in `package.json` for local tooling/docs.  
Optional AI skill: `npx skills add supabase/server`.

## 5. Test

```bash
npm run dev
# Join waitlist → submit → check Table Editor → waitlist
```

Or:

```bash
curl -X POST "$VITE_SUPABASE_URL/functions/v1/waitlist" \
  -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -H "Authorization: Bearer $VITE_SUPABASE_PUBLISHABLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","tier":"explorer"}'
```
