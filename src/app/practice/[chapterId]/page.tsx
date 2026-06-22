"use client";

import { useParams } from "next/navigation";
import { getChapter, getQuestionsForChapter } from "@/lib/content";
import { QuestionRunner } from "@/components/question-runner";
import { useContentVersion } from "@/lib/use-content";

export default function PracticePage() {
  useContentVersion();
  const { chapterId } = useParams<{ chapterId: string }>();
  const chapter = getChapter(chapterId);
  const questions = getQuestionsForChapter(chapterId);

  const backHref = chapter ? `/c/${chapter.classId}/${chapter.subjectId}` : "/";

  return (
    <QuestionRunner
      questions={questions}
      backHref={backHref}
      backLabel={chapter ? chapter.title : "Back"}
      title={chapter?.title ?? "Practice"}
    />
  );
}
