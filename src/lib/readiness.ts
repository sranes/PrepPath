import type { SubjectId } from "./types";
import { getAllQuestions, getSubjects } from "./content";
import { loadProgress } from "./progress";

// ---------------------------------------------------------------------------
// READINESS SCORE
// A simple, explainable "exam-readiness" estimate per subject, blending:
//   • accuracy — how often answers are correct
//   • coverage — how much of the available bank has been attempted
// readiness = 60% accuracy + 40% coverage, as a 0–100 score. Both factors
// matter: high accuracy on 3 questions isn't readiness, nor is wide but wrong.
// ---------------------------------------------------------------------------

const ACCURACY_WEIGHT = 0.6;
const COVERAGE_WEIGHT = 0.4;

export interface SubjectReadiness {
  subjectId: SubjectId;
  name: string;
  icon: string;
  total: number; // questions available in this subject
  attemptedUnique: number; // distinct questions tried
  attempts: number; // total attempts
  correct: number;
  accuracy: number; // 0..1
  coverage: number; // 0..1
  readiness: number; // 0..100
}

export interface ReadinessSummary {
  subjects: SubjectReadiness[];
  overall: number; // 0..100 across subjects with content
}

export function computeReadiness(): ReadinessSummary {
  const questions = getAllQuestions();
  const subjectOf = new Map(questions.map((q) => [q.id, q.subjectId]));
  const { attempts } = loadProgress();

  const totals = new Map<SubjectId, number>();
  for (const q of questions) totals.set(q.subjectId, (totals.get(q.subjectId) ?? 0) + 1);

  const correctBy = new Map<SubjectId, number>();
  const attemptsBy = new Map<SubjectId, number>();
  const triedBy = new Map<SubjectId, Set<string>>();
  for (const a of attempts) {
    const s = subjectOf.get(a.questionId);
    if (!s) continue;
    attemptsBy.set(s, (attemptsBy.get(s) ?? 0) + 1);
    if (a.correct) correctBy.set(s, (correctBy.get(s) ?? 0) + 1);
    (triedBy.get(s) ?? triedBy.set(s, new Set()).get(s)!).add(a.questionId);
  }

  const subjects: SubjectReadiness[] = getSubjects()
    .filter((s) => (totals.get(s.id) ?? 0) > 0)
    .map((s) => {
      const total = totals.get(s.id) ?? 0;
      const attemptsN = attemptsBy.get(s.id) ?? 0;
      const correct = correctBy.get(s.id) ?? 0;
      const attemptedUnique = triedBy.get(s.id)?.size ?? 0;
      const accuracy = attemptsN > 0 ? correct / attemptsN : 0;
      const coverage = total > 0 ? attemptedUnique / total : 0;
      const readiness = Math.round(100 * (ACCURACY_WEIGHT * accuracy + COVERAGE_WEIGHT * coverage));
      return {
        subjectId: s.id,
        name: s.name,
        icon: s.icon,
        total,
        attemptedUnique,
        attempts: attemptsN,
        correct,
        accuracy,
        coverage,
        readiness,
      };
    });

  const scored = subjects.filter((s) => s.attempts > 0);
  const overall =
    scored.length > 0
      ? Math.round(scored.reduce((sum, s) => sum + s.readiness, 0) / scored.length)
      : 0;

  return { subjects, overall };
}

export function readinessLabel(score: number): string {
  if (score >= 80) return "Exam-ready";
  if (score >= 60) return "Strong";
  if (score >= 35) return "Building up";
  if (score > 0) return "Getting started";
  return "Not started";
}
