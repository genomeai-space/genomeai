# Waitlist backend setup

The app submits waitlist forms via `lib/waitlist.ts` using the **first available** provider:

1. **`VITE_WAITLIST_ENDPOINT`** — any HTTPS webhook that accepts JSON POST  
2. **Supabase** table `waitlist` (if `VITE_SUPABASE_*` are set)  
3. **FormSubmit.co** → emails `contact@genomeai.space` (zero extra infra)

---

## Option A — Supabase (recommended)

In the Supabase SQL editor:

```sql
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  org text,
  building text,
  current_method text,
  tier text,
  source text default 'web',
  user_agent text
);

create unique index if not exists waitlist_email_uidx on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Allow anonymous inserts from the public site (anon key)
create policy "anon can insert waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- No public reads
create policy "no public select"
  on public.waitlist
  for select
  to anon
  using (false);
```

Env (already used for auth):

```bash
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

CI: set the same secrets on GitHub Actions so Pages builds include them.

---

## Option B — Formspree / custom webhook

```bash
VITE_WAITLIST_ENDPOINT=https://formspree.io/f/your_id
```

Body is JSON: `name`, `email`, `org`, `building`, `currentMethod`, `tier`, `source`, `submittedAt`.

---

## Option C — FormSubmit (default fallback)

If neither A nor B is configured, the client posts to FormSubmit for `SITE.email`.  
**First submission** requires confirming the inbox link from FormSubmit.

---

## Local test

```bash
cp .env.example .env.local
# fill Supabase or WAITLIST_ENDPOINT
npm run dev
# open Join waitlist → submit → check Supabase table or inbox
```
