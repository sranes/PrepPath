import type { Question } from "./types";
import { getQuestionsForChapter } from "./content";

// ---------------------------------------------------------------------------
// LEVELS / SETS
// A chapter's questions are split into ordered "sets" of 5, ramping easy→hard.
// Each set is a gamified level: pass it (≥3/5) to unlock the next, earn up to
// 3 stars. Sorting by difficulty makes the ramp robust to question source
// order (seed vs cloud), so set 1 is always the easiest five.
// ---------------------------------------------------------------------------

export const SET_SIZE = 5;

const RANK: Record<Question["difficulty"], number> = { easy: 0, medium: 1, hard: 2 };

export function getChapterSets(chapterId: string): Question[][] {
  const qs = [...getQuestionsForChapter(chapterId)].sort((a, b) => {
    const d = RANK[a.difficulty] - RANK[b.difficulty];
    return d !== 0 ? d : a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
  const sets: Question[][] = [];
  for (let i = 0; i < qs.length; i += SET_SIZE) sets.push(qs.slice(i, i + SET_SIZE));
  return sets;
}
