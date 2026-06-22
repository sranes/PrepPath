"use client";

import type { Attempt } from "./types";
import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// PROGRESS + SPACED REPETITION (client-side, localStorage)
// Implements the two highest-utility study methods from learning science:
// practice testing (every question is a test) and distributed practice
// (a lightweight SM-2-style scheduler resurfaces questions before you forget).
// Swap localStorage for a Supabase table later; the API stays the same.
// ---------------------------------------------------------------------------

const STATE_KEY = "cw:progress";

export interface SrsCard {
  questionId: string;
  /** ease factor, SM-2 style */
  ease: number;
  /** current interval in days */
  interval: number;
  /** epoch ms when the card is next due */
  due: number;
  reps: number;
}

export interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDay: string | null; // YYYY-MM-DD
  attempts: Attempt[];
  srs: Record<string, SrsCard>;
}

const EMPTY: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
  attempts: [],
  srs: {},
};

const DAY = 24 * 60 * 60 * 1000;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as ProgressState) };
  } catch {
    return { ...EMPTY };
  }
}

function save(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("cw:progress-changed"));
  // fire-and-forget cloud push when signed in
  if (syncUserId) void pushRemote(state);
}

function bumpStreak(state: ProgressState) {
  const t = today();
  if (state.lastActiveDay === t) return;
  const yesterday = new Date(Date.now() - DAY).toISOString().slice(0, 10);
  state.streak = state.lastActiveDay === yesterday ? state.streak + 1 : 1;
  state.lastActiveDay = t;
}

/** SM-2 inspired update: correct pushes the review further out; wrong resets. */
function schedule(card: SrsCard, correct: boolean): SrsCard {
  const c = { ...card };
  if (correct) {
    c.reps += 1;
    if (c.reps === 1) c.interval = 1;
    else if (c.reps === 2) c.interval = 3;
    else c.interval = Math.round(c.interval * c.ease);
    c.ease = Math.min(2.8, c.ease + 0.1);
  } else {
    c.reps = 0;
    c.interval = 0; // due again this session / today
    c.ease = Math.max(1.3, c.ease - 0.2);
  }
  c.due = Date.now() + c.interval * DAY;
  return c;
}

/** Record an answer: updates XP, streak, attempt log and the SRS schedule. */
export function recordAttempt(questionId: string, correct: boolean): ProgressState {
  const state = loadProgress();
  bumpStreak(state);
  state.xp += correct ? 10 : 2; // reward effort, reward correctness more
  state.attempts.push({ questionId, correct, ts: Date.now() });

  const existing =
    state.srs[questionId] ??
    ({ questionId, ease: 2.3, interval: 0, due: Date.now(), reps: 0 } as SrsCard);
  state.srs[questionId] = schedule(existing, correct);

  save(state);
  return state;
}

/** Question ids currently due for review (forgetting-curve based). */
export function getDueQuestionIds(): string[] {
  const state = loadProgress();
  const now = Date.now();
  return Object.values(state.srs)
    .filter((c) => c.due <= now)
    .sort((a, b) => a.due - b.due)
    .map((c) => c.questionId);
}

export interface ChapterStats {
  attempted: number;
  correct: number;
}

export function statsByChapter(
  questionIdToChapter: (qid: string) => string | undefined
): Record<string, ChapterStats> {
  const state = loadProgress();
  const out: Record<string, ChapterStats> = {};
  for (const a of state.attempts) {
    const ch = questionIdToChapter(a.questionId);
    if (!ch) continue;
    out[ch] ??= { attempted: 0, correct: 0 };
    out[ch].attempted += 1;
    if (a.correct) out[ch].correct += 1;
  }
  return out;
}

// --- Cloud sync (Supabase, optional) --------------------------------------
// Local storage stays the source of truth and cache. When a user is signed in
// we mirror their progress to a single jsonb row so it follows them across
// devices. Merge is conflict-tolerant: best streak/xp wins, attempts are
// unioned by timestamp, and each SRS card keeps its furthest-out schedule.

let syncUserId: string | null = null;

/** Two progress states merged so neither device loses work. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const attemptsKey = (x: Attempt) => `${x.questionId}@${x.ts}`;
  const attempts = Array.from(
    new Map([...a.attempts, ...b.attempts].map((x) => [attemptsKey(x), x])).values()
  ).sort((x, y) => x.ts - y.ts);

  const srs: Record<string, SrsCard> = { ...a.srs };
  for (const [qid, card] of Object.entries(b.srs)) {
    const cur = srs[qid];
    // keep the card with the most reps (most progressed), tie-break on due date
    if (!cur || card.reps > cur.reps || (card.reps === cur.reps && card.due > cur.due)) {
      srs[qid] = card;
    }
  }

  const lastActiveDay =
    (a.lastActiveDay ?? "") >= (b.lastActiveDay ?? "") ? a.lastActiveDay : b.lastActiveDay;

  return {
    xp: Math.max(a.xp, b.xp),
    streak: Math.max(a.streak, b.streak),
    lastActiveDay,
    attempts,
    srs,
  };
}

async function pushRemote(state: ProgressState) {
  if (!supabase || !syncUserId) return;
  try {
    await supabase
      .from("progress")
      .upsert({ user_id: syncUserId, data: state, updated_at: new Date().toISOString() });
  } catch {
    /* offline / transient — local copy is safe, next save retries */
  }
}

async function pullRemote(): Promise<ProgressState | null> {
  if (!supabase || !syncUserId) return null;
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("data")
      .eq("user_id", syncUserId)
      .maybeSingle();
    if (error || !data) return null;
    return { ...EMPTY, ...(data.data as ProgressState) };
  } catch {
    return null;
  }
}

/**
 * Called by the auth layer on sign-in/out. On sign-in it merges remote with
 * local, persists the result, and pushes it back so both ends converge.
 */
export async function setSyncUser(userId: string | null) {
  syncUserId = userId;
  if (!userId) return;
  const remote = await pullRemote();
  const local = loadProgress();
  const merged = remote ? mergeProgress(local, remote) : local;
  save(merged); // persists locally, fires change event, and pushes to remote
}
