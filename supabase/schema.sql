-- PrepPath — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- It stores each signed-in student's progress as a single JSON row, secured
-- so a user can only ever read/write their own row (Row Level Security).

create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- A user may only see their own progress.
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own"
  on public.progress for select
  using (auth.uid() = user_id);

-- A user may only insert a row for themselves.
drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own"
  on public.progress for insert
  with check (auth.uid() = user_id);

-- A user may only update their own row.
drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Leaderboard (opt-in). Stores ONLY a self-chosen nickname + XP + streak —
-- never email or any personal info. A row exists only if the student opts in.
-- Public-read so everyone sees the rankings; each user writes only their row.
-- ---------------------------------------------------------------------------

create table if not exists public.leaderboard (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  nickname   text not null check (char_length(nickname) between 1 and 24),
  xp         int not null default 0,
  streak     int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.leaderboard enable row level security;

drop policy if exists "leaderboard_read_all" on public.leaderboard;
create policy "leaderboard_read_all" on public.leaderboard for select using (true);

drop policy if exists "leaderboard_write_own" on public.leaderboard;
create policy "leaderboard_write_own" on public.leaderboard for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
