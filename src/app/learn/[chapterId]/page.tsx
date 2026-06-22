"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getChapter, getQuestionsForChapter, getSubject } from "@/lib/content";
import { Lesson } from "@/components/lesson";
import { useContentVersion } from "@/lib/use-content";

export default function LearnPage() {
  useContentVersion();
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = getChapter(chapterId);

  if (!chapter) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <p className="text-muted">Chapter not found.</p>
      </div>
    );
  }

  const subject = getSubject(chapter.subjectId);
  const qCount = getQuestionsForChapter(chapter.id).length;
  const backHref = `/c/${chapter.classId}/${chapter.subjectId}`;

  return (
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="text-sm text-muted hover:text-brand">
          ← {subject?.name ?? "Back"}
        </Link>
        <div className="mt-1 text-sm text-muted">
          Class {chapter.classId} · {subject?.name}
        </div>
        <h1 className="text-2xl font-bold">{chapter.title}</h1>
        <p className="mt-1 text-muted">{chapter.blurb}</p>
        {chapter.ncertRef && (
          <p className="mt-1 text-xs text-muted">📘 {chapter.ncertRef}</p>
        )}
      </div>

      {chapter.lesson && chapter.lesson.length > 0 ? (
        <Lesson blocks={chapter.lesson} />
      ) : (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
          A lesson for this chapter is coming soon — you can still practise the questions.
        </p>
      )}

      <div className="sticky bottom-4 flex gap-3 pt-2">
        {qCount > 0 ? (
          <Link
            href={`/practice/${chapter.id}`}
            className="flex-1 rounded-lg bg-brand px-5 py-3 text-center font-semibold text-white shadow-lg"
          >
            Practise this chapter →{" "}
            <span className="opacity-80">
              ({qCount} question{qCount === 1 ? "" : "s"})
            </span>
          </Link>
        ) : (
          <span className="flex-1 rounded-lg border border-border px-5 py-3 text-center text-sm text-muted">
            No questions yet for this chapter.
          </span>
        )}
      </div>
    </div>
  );
}
