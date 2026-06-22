# PrepPath 🎯

A **free, ad-free** practice app for **Class 6–12** students building toward the
**JEE** and **NEET** competitive exams. Installable PWA, NCERT-aligned, and runnable with
zero backend.

## Why

Foundation years (Class 6–10) are where strong fundamentals are built — but most quality
prep is locked behind paid coaching apps. PrepPath focuses on the two study methods that
learning science rates highest: **practice testing** and **spaced (distributed) practice**.
It also leans on India's large body of *free, official* content — NCERT, NTA Abhyas, DIKSHA,
SWAYAM, and public previous-year papers — rather than rebuilding what already exists for free.

## What's built (MVP)

- **Lessons + gamified levels** — pick class → subject → chapter → **read the concept lesson**
  (`/learn`) → play through **levels**: questions are grouped into sets of 5 (easy → hard),
  each set a level that unlocks the next when you score ≥3/5 and earns up to ⭐⭐⭐. Worked
  solutions show instantly. Class 6 Maths & Science have full concept lessons; "Knowing Our
  Numbers" is built out to the target 50 questions (10 levels) as the content standard.
- **Spaced-repetition revision** (`/review`) — an SM-2-style scheduler resurfaces questions
  before you forget them.
- **Gamification** — daily streak + XP to build a habit.
- **Timed mock tests** (`/mock`) — choose class/subject/length, real **+4 / −1** marking,
  countdown timer, question palette with mark-for-review, then a scored review with
  solutions. Attempts also feed spaced repetition.
- **Paper sets** (`/papers`) — previous-year / sample papers grouped by exam, launched as
  full timed tests through the mock runner.
- **Exam readiness** (`/progress`) — a per-subject readiness score blending accuracy and
  coverage, with an overall estimate.
- **Leaderboard** (`/leaderboard`) — opt-in, friendly XP ranking shown only by a self-chosen
  nickname (never email). Cloud-only; hidden in local mode.
- **Free resources** (`/resources`) — curated links to official free study material (NCERT
  e-Pathshala, DIKSHA, NTA Abhyas, SWAYAM, NPTEL, PYQ portals).
- **Multi-language UI** — English + Hindi toggle in the header (UI chrome; coverage grows by
  adding keys). Authored questions stay in their written language.
- **Shared cloud question bank** — when Supabase is configured, admins edit a question bank
  that every student sees; the built-in NCERT seed still works offline.
- **Admin tools** — `/admin` (single add + **🌱 Seed cloud from app** to push the built-in
  starter content into Supabase), `/admin/import` (**bulk import** of `{chapters, questions}`
  JSON with validation + preview), `/admin/papers` (**paper builder** — bundle questions into
  a named timed paper). Writes go to the cloud bank as an admin, or to this device otherwise.
- **Installable PWA** — works offline, no app store needed.

Everything is **local-first**: content and progress live in the browser, so it runs with no
credentials. Architecture detail is in [CLAUDE.md](CLAUDE.md).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + typecheck gate
```

## Cloud sync (optional)

The app runs fully **local-first** with no backend. To let a student's streak, XP and
revision schedule follow them across devices, switch on Supabase (free tier):

1. Create a project at [supabase.com](https://supabase.com).
2. In the dashboard: **SQL → New query**, run both
   [`supabase/schema.sql`](supabase/schema.sql) (progress sync) and
   [`supabase/content_schema.sql`](supabase/content_schema.sql) (shared question bank).
   Each user can only touch their own progress; content is public-read, admin-write.
3. Copy `.env.local.example` → `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Dashboard → Project Settings → API).
4. Restart `npm run dev`. A **Sign in** button appears; sign-in merges local progress with
   the cloud so nothing is lost.
5. **Become an admin** (to edit the shared bank): sign up in the app, find your user id in
   **Authentication → Users**, then in the SQL editor run
   `insert into public.admins (user_id) values ('<your-uuid>');`. Now `/admin` writes to the
   cloud bank for everyone.

> For the smoothest first run, disable email confirmation in
> **Authentication → Providers → Email** while testing, or confirm via the emailed link.

Without these vars the app behaves exactly as before — local-only, no sign-in.

## Deploy (Vercel, free Hobby tier)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project** and import the repo. Next.js is
   auto-detected — no config needed.
3. Add the two environment variables in **Project → Settings → Environment Variables**
   (Production + Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. In Supabase, **Authentication → URL Configuration**, set **Site URL** to your Vercel
   production URL and add the Vercel preview URLs under **Redirect URLs** (so email links
   resolve correctly).
5. **Deploy.** The PWA installs over HTTPS automatically.

> Local-only still works with no env vars — the deploy just won't have cloud sync until they
> are set. Optional: `npm i -g vercel` then `vercel` to deploy from the CLI.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript · PWA. Deploys free on
**Vercel**, with **Supabase** (auth + Postgres) as the optional cloud backend — `src/lib/
content.ts` is the single data-access seam.

## Roadmap

- [x] **Phase 1 — Practice loop** (MVP, done): chapters, questions, solutions, progress.
- [x] **Phase 2 — Make it stick** (done): spaced repetition, streak, XP, per-chapter stats.
- [x] **Phase 3 — Accounts & sync** (done): Supabase email/password auth, cloud progress
      sync, and a **shared cloud question bank** (admin-write, public-read).
- [x] **Phase 4 — Exam realism** (done): timed mock tests (+4/−1) with palette and scored
      review, plus **paper sets** (previous-year / sample papers). Still to come: a readiness
      score.
- [x] **Phase 5 — Scale content & reach** (done): bulk import, seed-the-cloud, readiness
      score, opt-in leaderboard, curated free-resources page, English/Hindi UI, and Class
      11–12 seed content.
- [ ] **Phase 6 — Next**: deeper content per chapter, more regional languages, optional
      budget-capped AI hints, parent/teacher view.

## Content note

The hard part of an exam app is **quality questions**, not code. The seed set in
`src/lib/seed.ts` is a small starter; grow the bank via `/admin` (and, later, bulk import).
Use original questions or properly licensed/public material (e.g. public NTA previous-year
papers); avoid copying solutions from commercial coaching sites.
