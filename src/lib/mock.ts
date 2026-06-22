import type { ClassId, Paper, Question, SubjectId } from "./types";
import { getQuestionsForClass } from "./content";

// ---------------------------------------------------------------------------
// MOCK TEST ENGINE
// Builds a timed test and scores it with the real JEE/NEET marking scheme
// (+4 correct, -1 wrong, 0 unattempted). State for an in-progress test lives
// in sessionStorage so a refresh doesn't reshuffle or lose answers.
// ---------------------------------------------------------------------------

export const MARK_CORRECT = 4;
export const MARK_WRONG = -1;

const MOCK_KEY = "cw:mock";

export interface MockConfig {
  classId: ClassId;
  subjectId: SubjectId | "all";
  count: number;
  durationSec: number;
}

export interface MockState {
  config: MockConfig;
  questionIds: string[];
  startedAt: number; // epoch ms
}

export interface MockResult {
  total: number;
  correct: number;
  wrong: number;
  unattempted: number;
  score: number;
  maxScore: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick up to `count` random questions matching the config. */
export function buildMock(config: MockConfig): string[] {
  const subject = config.subjectId === "all" ? undefined : config.subjectId;
  const pool = getQuestionsForClass(config.classId, subject);
  return shuffle(pool)
    .slice(0, config.count)
    .map((q) => q.id);
}

export function isAnswerCorrect(q: Question, given: string | null | undefined): boolean {
  if (given == null || given === "") return false;
  return given.trim() === q.answer.trim();
}

export function scoreMock(
  questions: Question[],
  answers: Record<string, string | null>
): MockResult {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  for (const q of questions) {
    const given = answers[q.id];
    if (given == null || given === "") unattempted += 1;
    else if (isAnswerCorrect(q, given)) correct += 1;
    else wrong += 1;
  }
  return {
    total: questions.length,
    correct,
    wrong,
    unattempted,
    score: correct * MARK_CORRECT + wrong * MARK_WRONG,
    maxScore: questions.length * MARK_CORRECT,
  };
}

// --- session persistence ---------------------------------------------------

export function saveMockState(state: MockState) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(MOCK_KEY, JSON.stringify(state));
}

export function loadMockState(): MockState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as MockState) : null;
  } catch {
    return null;
  }
}

export function clearMockState() {
  if (typeof window !== "undefined") window.sessionStorage.removeItem(MOCK_KEY);
}

/** Begin a paper as a timed test (reuses the mock runner). */
export function startPaper(paper: Paper) {
  saveMockState({
    config: {
      classId: paper.classId ?? "6",
      subjectId: paper.subjectId ?? "all",
      count: paper.questionIds.length,
      durationSec: paper.durationSec,
    },
    questionIds: paper.questionIds,
    startedAt: Date.now(),
  });
}
