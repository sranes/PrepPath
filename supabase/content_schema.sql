-- PrepPath — shared question bank (cloud content)
-- Run this in the Supabase SQL editor AFTER schema.sql.
-- Content is public-readable (every student sees it) but only admins can write.
-- The in-app NCERT seed set always works offline; these tables ADD to it.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.chapters (
  id         text primary key,             -- "<class>-<subject>-<slug>"
  class_id   text not null,
  subject_id text not null,
  title      text not null,
  blurb      text not null default '',
  ncert_ref  text,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id          text primary key,
  chapter_id  text not null references public.chapters (id) on delete cascade,
  class_id    text not null,
  subject_id  text not null,
  type        text not null check (type in ('mcq', 'numeric')),
  difficulty  text not null check (difficulty in ('easy', 'medium', 'hard')),
  prompt      text not null,
  options     jsonb,                        -- string[] for mcq, null for numeric
  answer      text not null,
  solution    text not null default '',
  tags        jsonb,
  created_at  timestamptz not null default now()
);

-- Named question sets: previous-year papers, sample papers, chapter tests.
create table if not exists public.papers (
  id           text primary key,
  name         text not null,
  exam         text not null default 'foundation',  -- jee | neet | foundation | other
  year         int,
  class_id     text,
  subject_id   text,
  duration_sec int not null default 1800,
  question_ids jsonb not null default '[]'::jsonb,   -- ordered list of question ids
  created_at   timestamptz not null default now()
);

-- Who is allowed to edit content. Add yourself once (see note at bottom).
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.chapters  enable row level security;
alter table public.questions enable row level security;
alter table public.papers    enable row level security;
alter table public.admins    enable row level security;

-- helper: is the current user an admin?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- Content is readable by everyone (including anonymous visitors).
drop policy if exists "chapters_read_all" on public.chapters;
create policy "chapters_read_all" on public.chapters for select using (true);

drop policy if exists "questions_read_all" on public.questions;
create policy "questions_read_all" on public.questions for select using (true);

-- Only admins may insert/update/delete content.
drop policy if exists "chapters_admin_write" on public.chapters;
create policy "chapters_admin_write" on public.chapters for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "questions_admin_write" on public.questions;
create policy "questions_admin_write" on public.questions for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "papers_read_all" on public.papers;
create policy "papers_read_all" on public.papers for select using (true);

drop policy if exists "papers_admin_write" on public.papers;
create policy "papers_admin_write" on public.papers for all
  using (public.is_admin()) with check (public.is_admin());

-- A user can check whether they themselves are an admin.
drop policy if exists "admins_read_self" on public.admins;
create policy "admins_read_self" on public.admins for select using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Make yourself an admin (one time)
-- ---------------------------------------------------------------------------
-- 1. Sign up in the app (or Dashboard → Authentication → Users).
-- 2. Copy your user UID from Authentication → Users.
-- 3. Run (replace the UUID):
--      insert into public.admins (user_id) values ('00000000-0000-0000-0000-000000000000');
-- This SQL editor uses the service role, so it bypasses RLS for this insert.
