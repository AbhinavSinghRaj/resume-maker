-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  email text not null unique,
  created_at timestamptz not null default now()
);

-- RLS on with no policies = nobody can read/write via the public API.
-- Only the server (service role key in /api/signup) can insert.
alter table public.signups enable row level security;
