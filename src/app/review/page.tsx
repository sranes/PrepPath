"use client";

import { useEffect, useState } from "react";
import type { Question } from "@/lib/types";
import { getQuestion } from "@/lib/content";
import { getDueQuestionIds } from "@/lib/progress";
import { QuestionRunner } from "@/components/question-runner";
import { useContentVersion } from "@/lib/use-content";

export default function ReviewPage() {
  const version = useContentVersion();
  const [questions, setQuestions] = useState<Question[] | null>(null);

  useEffect(() => {
    const due = getDueQuestionIds();
    const qs = due.map((id) => getQuestion(id)).filter((q): q is Question => Boolean(q));
    setQuestions(qs);
  }, [version]);

  if (questions === null) {
    return <p className="text-sm text-muted">Loading your review queue…</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🔁 Spaced Revision</h1>
      <p className="text-sm text-muted">
        Questions resurface right before you&apos;re likely to forget them — the most
        effective way to lock concepts into long-term memory.
      </p>
      <QuestionRunner
        questions={questions}
        backHref="/"
        backLabel="Home"
        title="All caught up!"
      />
    </div>
  );
}
