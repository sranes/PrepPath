"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getChapter } from "@/lib/content";
import { getChapterSets } from "@/lib/levels";
import { getChapterLevels, recordSetResult, type LevelInfo } from "@/lib/progress";
import { QuestionRunner } from "@/components/question-runner";
import { useContentVersion } from "@/lib/use-content";

export default function PracticePage() {
  const version = useContentVersion();
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = getChapter(chapterId);
  const sets = useMemo(() => getChapterSets(chapterId), [chapterId, version]);

  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [result, setResult] = useState<{ set: number; correct: number; total: number; stars: number } | null>(null);

  useEffect(() => {
    setLevels(getChapterLevels(chapterId, sets.length));
  }, [chapterId, sets.length]);

  if (!chapter) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-muted hover:text-brand">← Home</Link>
        <p className="text-muted">Chapter not found.</p>
      </div>
    );
  }

  const backHref = `/c/${chapter.classId}/${chapter.subjectId}`;

  // --- running a level ---
  if (active !== null && sets[active]) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-muted">
          {chapter.title} · Set {active + 1} of {sets.length}
        </div>
        <QuestionRunner
          key={active}
          questions={sets[active]}
          backHref={`/practice/${chapterId}`}
          backLabel="Levels"
          title={chapter.title}
          onFinish={(correct, total) => {
            const { stars } = recordSetResult(chapterId, active, correct, total);
            setResult({ set: active, correct, total, stars });
            setLevels(getChapterLevels(chapterId, sets.length));
            setActive(null);
          }}
        />
      </div>
    );
  }

  const passedCount = levels.filter((l) => l.passed).length;
  const totalStars = levels.reduce((s, l) => s + l.stars, 0);
  const maxStars = sets.length * 3;
  const allDone = sets.length > 0 && passedCount === sets.length;

  return (
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="text-sm text-muted hover:text-brand">
          ← {chapter.title}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Practice Levels</h1>
        <p className="text-sm text-muted">
          {sets.length} set{sets.length === 1 ? "" : "s"} · 5 questions each, easy → hard.
          Score 3/5 to unlock the next level.
        </p>
      </div>

      {/* progress summary */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div>
          <div className="text-sm font-semibold">
            {passedCount} / {sets.length} levels cleared
          </div>
          <div className="text-xs text-muted">⭐ {totalStars} / {maxStars} stars</div>
        </div>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${sets.length ? (passedCount / sets.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* result banner after finishing a level */}
      {result && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="font-semibold text-emerald-800 dark:text-emerald-200">
            Set {result.set + 1}: {result.correct}/{result.total} correct{" "}
            {result.stars > 0 ? "— ".concat("⭐".repeat(result.stars)) : ""}
          </div>
          <div className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
            {result.stars === 3
              ? "Perfect! 🎉"
              : result.stars >= 1
                ? "Level cleared — next one unlocked!"
                : "Almost! Score 3/5 to unlock the next set. Try again 💪"}
          </div>
        </div>
      )}

      {allDone && (
        <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white">
          <div className="text-lg font-bold">🏆 Chapter complete!</div>
          <div className="text-sm text-amber-50">
            You cleared every level with ⭐ {totalStars}/{maxStars} stars. Brilliant work!
          </div>
        </div>
      )}

      {/* level map */}
      {sets.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
          No questions here yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sets.map((set, i) => {
            const info = levels[i] ?? { stars: 0, best: 0, unlocked: i === 0, passed: false };
            const locked = !info.unlocked;
            return (
              <button
                key={i}
                disabled={locked}
                onClick={() => {
                  setResult(null);
                  setActive(i);
                }}
                className={[
                  "flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition",
                  locked
                    ? "cursor-not-allowed border-border bg-background opacity-60"
                    : "border-border bg-card hover:border-brand hover:shadow-md",
                ].join(" ")}
              >
                <span className="text-xs text-muted">Level {i + 1}</span>
                <span className="text-2xl">
                  {locked ? "🔒" : info.passed ? "✅" : "▶️"}
                </span>
                <span className="text-sm text-amber-500">
                  {info.stars > 0 ? "⭐".repeat(info.stars) : locked ? "" : "—"}
                </span>
                <span className="text-[11px] text-muted">{set.length} Q</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
