# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**PrepPath** — a free, ad-free Progressive Web App that helps Class 6–12 students build
toward the JEE and NEET competitive exams. It began as **Foundation (Class 6–10)** and now
also carries Class 11–12 JEE/NEET-level seed content. NCERT-aligned, focused on the practice
loop: pick a chapter → answer questions → see worked solutions → spaced-repetition revision
brings questions back before you forget.

Design constraints that shape every decision:
- **Free to run.** Stays on free tiers (Vercel Hobby; Supabase free tier). No paid services.
- **Local-first, cloud-optional.** Content and progress work with zero backend/credentials so
  the app runs immediately. Supabase auth + cloud progress sync switch on automatically when
  the two `NEXT_PUBLIC_SUPABASE_*` env vars are set, and degrade silently to local-only when
  not. Never add a hard dependency on Supabase being present.

## Commands

```bash
npm run dev      # dev server (Turbopack) on http://localhost:3000
npm run build    # production build — also the typecheck/lint gate; run before committing
npm run start    # serve the production build
npm run lint     # eslint
```

There is no test runner yet. `npm run build` is the verification gate (it runs TypeScript
and route generation). For browser preview, `.claude/launch.json` defines the `dev` server.

## Architecture

Next.js 16 (App Router, `src/` dir), React 19, Tailwind CSS v4 (config-less, via
`@import "tailwindcss"` + `@theme` in `src/app/globals.css`). TypeScript, import alias `@/*`.

The codebase is organized around **three lib modules that own all non-UI logic** — understand
these first; the pages are thin clients over them.

- **`src/lib/types.ts`** — the domain model: `ClassId (6–12)`, `Subject`, `Chapter`,
  `Question` (mcq | numeric), `Attempt`. All shapes are plain serialisable objects so the
  same types work for local seed data now and a database later.

- **`src/lib/seed.ts`** — the hand-written starter content (`SUBJECTS`, `CHAPTERS`,
  `QUESTIONS`, `PAPERS`). This is the seed set; real content is meant to grow through the
  Admin tool, not by editing this file. Bulky per-subject content lives in sibling modules
  spread into the seed arrays — **`src/lib/seed-class6-maths.ts`** (full Class 6 Maths,
  merged Ganita Prakash + classic NCERT) and **`src/lib/seed-class6-science.ts`** (Class 6
  Physics/Chemistry/Biology, 5 chapters each, mapped from NCERT Curiosity + classic). Each
  chapter carries a `lesson`.

- **Lessons** — a `Chapter.lesson` is an optional `LessonBlock[]` (heading / para / list /
  formula / example / tip) rendered by `components/lesson.tsx` on the `/learn/[chapterId]`
  page, which then links into `/practice/[chapterId]`. Subject-page cards link to `/learn`
  when a lesson exists, else straight to practice. The cloud `chapters.lesson` jsonb column
  persists lessons through `seedCloud()` / admin writes.

- **Gamified levels** — `src/lib/levels.ts` `getChapterSets()` splits a chapter's questions
  into ordered **sets of 5** (`SET_SIZE`), sorted easy→hard so the ramp is stable regardless
  of seed/cloud order. `/practice/[chapterId]` is a **level map**: each set is a level that
  unlocks the next when passed (≥3/5) and awards up to 3 stars. Per-set results live in
  `ProgressState.levels` (keyed `chapterId#setIndex`) via `recordSetResult` /
  `getChapterLevels` in `progress.ts` (merged + cloud-synced like the rest of progress).
  `QuestionRunner` takes an optional `onFinish(correct,total)` so a level reports its score
  in-page instead of navigating. Convention: author ~50 questions per chapter (10 sets).

- **`src/lib/content.ts`** — **the data-access layer and the key seam.** Every page asks
  *this* module for content. It merges three sources by id (later wins): (1) the in-code
  NCERT **seed** (always available, offline), (2) the **shared cloud bank** from Supabase
  (`chapters`/`questions` tables, public-read), held in a module-level cache and hydrated by
  `hydrateCloudContent()`, and (3) **local** Admin additions in `localStorage` (fallback when
  cloud isn't configured). Cloud writes (`addCloudChapter`, `addCloudQuestion`,
  `deleteCloudQuestion`) require admin (`checkIsAdmin`). Any content mutation fires a
  `CONTENT_CHANGED` window event. Pages must not import from `seed.ts` directly.
  - Because content loads asynchronously, content-reading client pages call
    `useContentVersion()` (`src/lib/use-content.ts`) so they re-render when the cache
    updates. `ContentSync` (`src/components/content-sync.tsx`, mounted in the layout)
    triggers the initial cloud hydration.

- **`src/lib/mock.ts`** — the **mock-test engine** (pure, framework-free): `buildMock`
  samples questions, `scoreMock` applies the real **+4 / −1** marking, and the in-progress
  test (question ids + start time) is persisted to `sessionStorage` so a refresh neither
  reshuffles nor loses answers. The `/mock` setup page and `/mock/run` runner (timer +
  palette + mark-for-review + scored review) consume it; submitting also calls
  `recordAttempt` so mock answers feed spaced repetition. `startPaper(paper)` lets a Paper
  reuse the same runner — **paper sets are just a fixed question list fed to the mock runner**.

- **Papers** — a `Paper` is a named, ordered question set (PYQ / sample paper). They live in
  `content.ts` exactly like questions: seed (`PAPERS` in `seed.ts`, works offline) + cloud
  (`papers` table) merged by `getAllPapers()`, with `addCloudPaper`/`deleteCloudPaper`
  writers. Public list at `/papers`; built in `/admin/papers`.

- **`src/lib/progress.ts`** — client-only progress + the learning-science core. Persists to
  `localStorage` (`cw:progress`): XP, daily streak, attempt log, and a per-question
  **SM-2-style spaced-repetition scheduler** (`recordAttempt` updates the schedule;
  `getDueQuestionIds` returns what's due). On save it dispatches a `cw:progress-changed`
  window event that the streak badge listens for. localStorage stays the source of truth;
  when a user is signed in it also mirrors to Supabase. `setSyncUser(userId)` (called by the
  auth layer) merges remote+local via `mergeProgress` (best streak/xp wins, attempts unioned,
  furthest-out SRS card kept) so no device loses work.

- **`src/lib/readiness.ts`** — pure `computeReadiness()` deriving a per-subject + overall
  exam-readiness score (0–100) from progress attempts × content: `0.6·accuracy +
  0.4·coverage`. Powers `/progress`. No storage of its own — recomputed from existing data.

- **`src/lib/leaderboard.ts`** — opt-in social layer (cloud-only). Mirrors **only** a
  self-chosen nickname + XP + streak to a public `leaderboard` table (never email/PII); a row
  exists only after the user joins and can be deleted via `leaveLeaderboard`. Powers
  `/leaderboard`. `seedCloud()` (in `content.ts`) pushes the in-app seed into the cloud bank.

- **`src/lib/i18n.tsx`** — lightweight UI i18n: `I18nProvider` (in the layout) + `useT()`
  returning `t(key)` over an en/hi `STRINGS` dictionary, language persisted in localStorage.
  Covers UI chrome (nav via `components/site-nav.tsx`, home); **authored content is data and
  is not translated**. Add a language by extending each key; add coverage by adding keys.

### Auth + cloud sync (optional, `src/lib/supabase.ts`, `src/lib/auth.tsx`)
- `supabase.ts` exports `supabase` (a client, or `null` if env vars absent) and
  `isSupabaseConfigured`. Every consumer must handle the `null` case.
- `auth.tsx` is the `AuthProvider`/`useAuth` context (email+password). It drives
  `setSyncUser` on auth-state changes. `enabled === false` means local-only mode.
- DB schema lives in `supabase/`: [`schema.sql`](supabase/schema.sql) (per-user `progress`
  jsonb row, RLS own-row-only; plus the opt-in `leaderboard` table, public-read/own-write)
  and [`content_schema.sql`](supabase/content_schema.sql)
  (`chapters`, `questions`, `papers` — public-read/admin-write — and an `admins` table
  gating writes via an `is_admin()` SQL function). Setup + how to grant admin are in the README "Cloud
  sync" section; env vars go in `.env.local` (template: `.env.local.example`).

### Pages (`src/app`)
Almost all pages are **client components** because content/progress live in `localStorage`.
Dynamic-route pages read params via `useParams()` (not async server params).
- `/` dashboard + class picker → `/c/[classId]` subjects → `/c/[classId]/[subjectId]`
  chapters → `/learn/[chapterId]` (concept lesson) → `/practice/[chapterId]` runs the session.
- `/review` runs the spaced-repetition due queue.
- `/mock` (setup) → `/mock/run` (timed runner + in-page scored results).
- `/papers` lists paper sets; starting one launches `/mock/run` via `startPaper`.
- `/progress` exam-readiness dashboard; `/leaderboard` opt-in XP ranking (cloud-only).
- `/resources` curated links to official free study material (external).
- `/account` sign in / sign up (only meaningful when cloud is configured).
- `/admin` add **and edit** questions (a class/subject/chapter filter lists every question
  with edit/delete; editing upserts by the same id, so it overrides seed/cloud) + JSON
  export; `/admin/chapters` edit a chapter's title/blurb and its **lesson** via a structured
  block editor (add/reorder/remove heading/para/list/formula/example/tip); `/admin/import`
  bulk JSON import (validation + preview); `/admin/papers` paper builder. All gated by
  `useAdmin()` (`src/lib/use-admin.ts`), which reports `cloud` (configured + signed in + in
  `admins`). Cloud writes target the shared bank; otherwise they fall back to this device
  (local edits override seed by id via `upsertAdminQuestion`/`upsertAdminChapter`).

### Shared components (`src/components`)
- `question-runner.tsx` — the reusable practice engine (MCQ + numeric, instant solution,
  progress bar, scoring). Used by both `/practice/[chapterId]` and `/review`.
- `streak-badge.tsx`, `pwa-register.tsx`.

### PWA
`public/manifest.webmanifest`, `public/icon.svg`, and `public/sw.js` (network-first service
worker registered client-side by `pwa-register.tsx`). The app is installable and works
offline — chosen deliberately to avoid app-store fees/approval for a free solo project.

## Conventions
- New content types or queries go through `content.ts`; keep its functions
  synchronous-shaped but ready to become async on the Supabase migration.
- For MCQs, `Question.answer` must exactly match one of `Question.options` (the Admin form
  enforces this; preserve it in any bulk import).
- Chapter ids are globally unique and human-readable: `"<class>-<subject>-<slug>"`.
