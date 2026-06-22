"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ClassId, SubjectId } from "@/lib/types";
import {
  getAllQuestions,
  getChapters,
  getQuestionsForChapter,
  getSubject,
} from "@/lib/content";
import { statsByChapter } from "@/lib/progress";
import { useContentVersion } from "@/lib/use-content";

export default function SubjectPage() {
  useContentVersion();
  const { classId, subjectId } = useParams<{ classId: ClassId; subjectId: SubjectId }>();
  const subject = getSubject(subjectId);
  const chapters = getChapters(classId, subjectId);
  const [stats, setStats] = useState<Record<string, { attempted: number; correct: number }>>({});

  useEffect(() => {
    const all = getAllQuestions();
    const map = new Map(all.map((q) => [q.id, q.chapterId]));
    setStats(statsByChapter((qid) => map.get(qid)));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/c/${classId}`} className="text-sm text-muted hover:text-brand">
          ← Class {classId}
        </Link>
        <h1 className="mt-1 text-2xl font-bold">
          {subject?.icon} {subject?.name}
        </h1>
      </div>

      <div className="space-y-3">
        {chapters.map((ch) => {
          const total = getQuestionsForChapter(ch.id).length;
          const s = stats[ch.id];
          const pct = s && s.attempted ? Math.round((s.correct / s.attempted) * 100) : null;
          return (
            <Link
              key={ch.id}
              href={`/practice/${ch.id}`}
              className="block rounded-xl border border-border bg-card p-4 transition hover:border-brand hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">{ch.title}</div>
                <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs text-muted">
                  {total} Q
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">{ch.blurb}</p>
              {pct !== null && (
                <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {pct}% correct · {s.attempted} attempted
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
