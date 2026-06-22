// Core domain model for the foundation (Class 6-10) practice app.
// Kept deliberately simple and serialisable so the same shapes can be
// stored in local seed files today and in Supabase/Postgres later.

export type ClassId = "6" | "7" | "8" | "9" | "10" | "11" | "12";

export type SubjectId = "physics" | "chemistry" | "biology" | "maths";

export type Difficulty = "easy" | "medium" | "hard";

export interface Subject {
  id: SubjectId;
  name: string;
  /** emoji used as a lightweight, zero-asset icon */
  icon: string;
  /** tailwind gradient classes for the subject card */
  accent: string;
}

/** A single block of a chapter's lesson (the teaching content shown before
 *  practice). A small, serialisable union so lessons work in seed + cloud and
 *  render with no markdown/LaTeX dependency. */
export type LessonBlock =
  | { kind: "heading"; text: string }
  | { kind: "para"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "formula"; text: string }
  | { kind: "example"; problem: string; solution: string }
  | { kind: "tip"; text: string };

export interface Chapter {
  id: string; // globally unique, e.g. "8-physics-force-pressure"
  classId: ClassId;
  subjectId: SubjectId;
  title: string;
  /** short, kid-friendly description of what the chapter covers */
  blurb: string;
  /** maps the chapter to its NCERT origin so school + exam prep align */
  ncertRef?: string;
  /** the lesson: concepts explained before any question (optional) */
  lesson?: LessonBlock[];
}

export interface Question {
  id: string; // globally unique
  chapterId: string;
  classId: ClassId;
  subjectId: SubjectId;
  type: "mcq" | "numeric";
  difficulty: Difficulty;
  prompt: string;
  /** MCQ options; omitted for numeric questions */
  options?: string[];
  /** index into options for mcq, or the numeric answer as a string */
  answer: string;
  /** worked solution shown after answering — the highest-value content */
  solution: string;
  /** optional tags for analytics / future filtering */
  tags?: string[];
}

/** A user's attempt at a single question (kept client-side for now). */
export interface Attempt {
  questionId: string;
  correct: boolean;
  ts: number;
}

export type ExamKind = "jee" | "neet" | "foundation" | "other";

/** A named, ordered set of questions: a previous-year paper, sample paper,
 *  or chapter test. Taken through the timed mock runner. */
export interface Paper {
  id: string;
  name: string;
  exam: ExamKind;
  year?: number;
  classId?: ClassId;
  subjectId?: SubjectId;
  durationSec: number;
  questionIds: string[];
}
