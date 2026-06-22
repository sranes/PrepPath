import type {
  Chapter,
  ClassId,
  ExamKind,
  LessonBlock,
  Paper,
  Question,
  Subject,
  SubjectId,
} from "./types";
import { CHAPTERS, PAPERS, QUESTIONS, SUBJECTS } from "./seed";
import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// CONTENT DATA LAYER
// The single place the UI asks for content. It merges three sources, later
// ones overriding earlier by id:
//   1. the in-code NCERT seed (always available, works offline)
//   2. the shared cloud bank (Supabase, public-read) — hydrated on app start
//   3. local Admin additions (only used when cloud isn't configured)
// Cloud content is the global, shared question bank; local content is a
// fallback for running with no backend.
// ---------------------------------------------------------------------------

const ADMIN_QUESTIONS_KEY = "cw:admin-questions";
const ADMIN_CHAPTERS_KEY = "cw:admin-chapters";
export const CONTENT_CHANGED = "cw:content-changed";

export const CLASS_IDS: ClassId[] = ["6", "7", "8", "9", "10", "11", "12"];

// in-memory cloud cache, filled by hydrateCloudContent()
let cloudChapters: Chapter[] = [];
let cloudQuestions: Question[] = [];
let cloudPapers: Paper[] = [];

function readLocal<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

/** Merge arrays by id; later sources win. */
function mergeById<T extends { id: string }>(...sources: T[][]): T[] {
  const map = new Map<string, T>();
  for (const src of sources) for (const item of src) map.set(item.id, item);
  return [...map.values()];
}

function emitChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CONTENT_CHANGED));
}

export function getSubjects(): Subject[] {
  return SUBJECTS;
}

export function getSubject(id: SubjectId): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getAllChapters(): Chapter[] {
  return mergeById(CHAPTERS, cloudChapters, readLocal<Chapter>(ADMIN_CHAPTERS_KEY));
}

export function getAllQuestions(): Question[] {
  return mergeById(QUESTIONS, cloudQuestions, readLocal<Question>(ADMIN_QUESTIONS_KEY));
}

export function getChaptersForClass(classId: ClassId): Chapter[] {
  return getAllChapters().filter((c) => c.classId === classId);
}

export function getSubjectsForClass(classId: ClassId): Subject[] {
  const present = new Set(getChaptersForClass(classId).map((c) => c.subjectId));
  return SUBJECTS.filter((s) => present.has(s.id));
}

export function getChapters(classId: ClassId, subjectId: SubjectId): Chapter[] {
  return getAllChapters().filter((c) => c.classId === classId && c.subjectId === subjectId);
}

export function getChapter(chapterId: string): Chapter | undefined {
  return getAllChapters().find((c) => c.id === chapterId);
}

export function getQuestionsForChapter(chapterId: string): Question[] {
  return getAllQuestions().filter((q) => q.chapterId === chapterId);
}

export function getQuestion(id: string): Question | undefined {
  return getAllQuestions().find((q) => q.id === id);
}

/** Questions for a whole class (optionally a single subject) — used by mock tests. */
export function getQuestionsForClass(classId: ClassId, subjectId?: SubjectId): Question[] {
  return getAllQuestions().filter(
    (q) => q.classId === classId && (!subjectId || q.subjectId === subjectId)
  );
}

// --- Papers ----------------------------------------------------------------

export function getAllPapers(): Paper[] {
  return mergeById(PAPERS, cloudPapers);
}

export function getPaper(id: string): Paper | undefined {
  return getAllPapers().find((p) => p.id === id);
}

// --- Cloud (Supabase) ------------------------------------------------------

type ChapterRow = {
  id: string;
  class_id: string;
  subject_id: string;
  title: string;
  blurb: string;
  ncert_ref: string | null;
  lesson: LessonBlock[] | null;
};

type QuestionRow = {
  id: string;
  chapter_id: string;
  class_id: string;
  subject_id: string;
  type: "mcq" | "numeric";
  difficulty: Question["difficulty"];
  prompt: string;
  options: string[] | null;
  answer: string;
  solution: string;
  tags: string[] | null;
};

const chapterToRow = (c: Chapter): ChapterRow => ({
  id: c.id,
  class_id: c.classId,
  subject_id: c.subjectId,
  title: c.title,
  blurb: c.blurb,
  ncert_ref: c.ncertRef ?? null,
  lesson: c.lesson ?? null,
});

const rowToChapter = (r: ChapterRow): Chapter => ({
  id: r.id,
  classId: r.class_id as ClassId,
  subjectId: r.subject_id as SubjectId,
  title: r.title,
  blurb: r.blurb,
  ncertRef: r.ncert_ref ?? undefined,
  lesson: r.lesson ?? undefined,
});

const questionToRow = (q: Question): QuestionRow => ({
  id: q.id,
  chapter_id: q.chapterId,
  class_id: q.classId,
  subject_id: q.subjectId,
  type: q.type,
  difficulty: q.difficulty,
  prompt: q.prompt,
  options: q.options ?? null,
  answer: q.answer,
  solution: q.solution,
  tags: q.tags ?? null,
});

const rowToQuestion = (r: QuestionRow): Question => ({
  id: r.id,
  chapterId: r.chapter_id,
  classId: r.class_id as ClassId,
  subjectId: r.subject_id as SubjectId,
  type: r.type,
  difficulty: r.difficulty,
  prompt: r.prompt,
  options: r.options ?? undefined,
  answer: r.answer,
  solution: r.solution,
  tags: r.tags ?? undefined,
});

type PaperRow = {
  id: string;
  name: string;
  exam: ExamKind;
  year: number | null;
  class_id: string | null;
  subject_id: string | null;
  duration_sec: number;
  question_ids: string[];
};

const paperToRow = (p: Paper): PaperRow => ({
  id: p.id,
  name: p.name,
  exam: p.exam,
  year: p.year ?? null,
  class_id: p.classId ?? null,
  subject_id: p.subjectId ?? null,
  duration_sec: p.durationSec,
  question_ids: p.questionIds,
});

const rowToPaper = (r: PaperRow): Paper => ({
  id: r.id,
  name: r.name,
  exam: r.exam,
  year: r.year ?? undefined,
  classId: (r.class_id as ClassId) ?? undefined,
  subjectId: (r.subject_id as SubjectId) ?? undefined,
  durationSec: r.duration_sec,
  questionIds: r.question_ids ?? [],
});

/** Fetch the shared bank into the in-memory cache and notify the UI. */
export async function hydrateCloudContent(): Promise<void> {
  if (!supabase) return;
  try {
    const [{ data: chs }, { data: qs }, { data: ps }] = await Promise.all([
      supabase.from("chapters").select("*"),
      supabase.from("questions").select("*"),
      supabase.from("papers").select("*"),
    ]);
    if (chs) cloudChapters = (chs as ChapterRow[]).map(rowToChapter);
    if (qs) cloudQuestions = (qs as QuestionRow[]).map(rowToQuestion);
    if (ps) cloudPapers = (ps as PaperRow[]).map(rowToPaper);
    emitChange();
  } catch {
    /* offline — seed + local cache still serve content */
  }
}

/** Is the signed-in user allowed to edit the shared bank? */
export async function checkIsAdmin(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getUser();
  const uid = data.user?.id;
  if (!uid) return false;
  const { data: row } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", uid)
    .maybeSingle();
  return Boolean(row);
}

export async function addCloudChapter(c: Chapter): Promise<{ error?: string }> {
  if (!supabase) return { error: "Cloud not configured." };
  const { error } = await supabase.from("chapters").upsert(chapterToRow(c));
  if (error) return { error: error.message };
  await hydrateCloudContent();
  return {};
}

export async function addCloudQuestion(q: Question): Promise<{ error?: string }> {
  if (!supabase) return { error: "Cloud not configured." };
  const { error } = await supabase.from("questions").upsert(questionToRow(q));
  if (error) return { error: error.message };
  await hydrateCloudContent();
  return {};
}

export async function deleteCloudQuestion(id: string): Promise<{ error?: string }> {
  if (!supabase) return { error: "Cloud not configured." };
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) return { error: error.message };
  await hydrateCloudContent();
  return {};
}

export async function addCloudPaper(p: Paper): Promise<{ error?: string }> {
  if (!supabase) return { error: "Cloud not configured." };
  const { error } = await supabase.from("papers").upsert(paperToRow(p));
  if (error) return { error: error.message };
  await hydrateCloudContent();
  return {};
}

export async function deleteCloudPaper(id: string): Promise<{ error?: string }> {
  if (!supabase) return { error: "Cloud not configured." };
  const { error } = await supabase.from("papers").delete().eq("id", id);
  if (error) return { error: error.message };
  await hydrateCloudContent();
  return {};
}

/** Bulk upsert chapters + questions (used by the Admin import tool). */
export async function bulkUpsertCloud(
  chapters: Chapter[],
  questions: Question[]
): Promise<{ error?: string }> {
  if (!supabase) return { error: "Cloud not configured." };
  if (chapters.length) {
    const { error } = await supabase.from("chapters").upsert(chapters.map(chapterToRow));
    if (error) return { error: error.message };
  }
  if (questions.length) {
    const { error } = await supabase.from("questions").upsert(questions.map(questionToRow));
    if (error) return { error: error.message };
  }
  await hydrateCloudContent();
  return {};
}

/** Push the in-app seed content (chapters, questions, papers) into the cloud
 *  bank so a fresh project isn't empty. Idempotent — upserts by id. */
export async function seedCloud(): Promise<{ error?: string; counts?: { chapters: number; questions: number; papers: number } }> {
  if (!supabase) return { error: "Cloud not configured." };
  const r = await bulkUpsertCloud(CHAPTERS, QUESTIONS);
  if (r.error) return r;
  for (const p of PAPERS) {
    const pr = await addCloudPaper(p);
    if (pr.error) return { error: pr.error };
  }
  await hydrateCloudContent();
  return {
    counts: { chapters: CHAPTERS.length, questions: QUESTIONS.length, papers: PAPERS.length },
  };
}

/** Cloud questions only (for the Admin "manage" list when signed in as admin). */
export function getCloudQuestions(): Question[] {
  return cloudQuestions;
}

export function getCloudPapers(): Paper[] {
  return cloudPapers;
}

// --- Local admin writes (used when cloud is NOT configured) ----------------

export function saveAdminQuestions(qs: Question[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_QUESTIONS_KEY, JSON.stringify(qs));
  emitChange();
}

export function getAdminQuestions(): Question[] {
  return readLocal<Question>(ADMIN_QUESTIONS_KEY);
}

export function saveAdminChapters(cs: Chapter[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_CHAPTERS_KEY, JSON.stringify(cs));
  emitChange();
}

export function getAdminChapters(): Chapter[] {
  return readLocal<Chapter>(ADMIN_CHAPTERS_KEY);
}
