-- VA Command Center Supabase setup
--
-- Paste this into Supabase SQL Editor and run it once.
-- This creates one simple backup table for the full dashboard state.
--
-- Important:
-- These policies allow the browser app to read and write using the anon public key.
-- That is practical for this local/internal dashboard, but it is not production security.
-- Before storing sensitive data on a public site, replace this with Supabase Auth
-- and user-specific Row Level Security policies.

create table if not exists public.va_command_center_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.va_command_center_state enable row level security;

drop policy if exists "VA dashboard anon read" on public.va_command_center_state;
create policy "VA dashboard anon read"
on public.va_command_center_state
for select
to anon
using (true);

drop policy if exists "VA dashboard anon insert" on public.va_command_center_state;
create policy "VA dashboard anon insert"
on public.va_command_center_state
for insert
to anon
with check (true);

drop policy if exists "VA dashboard anon update" on public.va_command_center_state;
create policy "VA dashboard anon update"
on public.va_command_center_state
for update
to anon
using (true)
with check (true);
