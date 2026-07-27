-- Waitlist leads from the public site (anon / publishable insert only).
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

create unique index if not exists waitlist_email_uidx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- Drop re-runnable policies
drop policy if exists "anon can insert waitlist" on public.waitlist;
drop policy if exists "no public select" on public.waitlist;
drop policy if exists "authenticated can insert waitlist" on public.waitlist;

-- Public site may insert only (publishable / anon role)
create policy "anon can insert waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);

-- No public reads of other people's emails
create policy "no public select"
  on public.waitlist
  for select
  to anon
  using (false);
