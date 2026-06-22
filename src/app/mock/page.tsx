"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClassId, SubjectId } from "@/lib/types";
import { CLASS_IDS, getQuestionsForClass, getSubjects } from "@/lib/content";
import { buildMock, saveMockState } from "@/lib/mock";
import { useContentVersion } from "@/lib/use-content";

export default function MockSetupPage() {
  useContentVersion();
  const router = useRouter();
  const subjects = getSubjects();

  const [classId, setClassId] = useState<ClassId>("9");
  const [subjectId, setSubjectId] = useState<SubjectId | "all">("all");
  const [count, setCount] = useState(10);
  const [minutes, setMinutes] = useState(15);
  const [err, setErr] = useState("");

  const available = getQuestionsForClass(
    classId,
    subjectId === "all" ? undefined : subjectId
  ).length;

  function start() {
    const realCount = Math.min(count, available);
    if (realCount < 1) {
      setErr("No questions available for that selection yet. Add some in Admin, or change the class/subject.");
      return;
    }
    const config = { classId, subjectId, count: realCount, durationSec: minutes * 60 };
    const questionIds = buildMock(config);
    saveMockState({ config, questionIds, startedAt: Date.now() });
    router.push("/mock/run");
  }

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">📝 Mock Test</h1>
        <p className="text-sm text-muted">
          A timed test with real exam marking: <strong>+4</strong> correct, <strong>−1</strong>{" "}
          wrong, <strong>0</strong> unattempted. Solutions are shown only after you submit.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <label className="block text-sm font-medium">
          Class
          <select
            className={`${input} mt-1`}
            value={classId}
            onChange={(e) => setClassId(e.target.value as ClassId)}
          >
            {CLASS_IDS.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium">
          Subject
          <select
            className={`${input} mt-1`}
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value as SubjectId | "all")}
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Questions
            <select
              className={`${input} mt-1`}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {[5, 10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Minutes
            <select
              className={`${input} mt-1`}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
            >
              {[5, 10, 15, 30, 45, 60].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="text-xs text-muted">
          {available} question{available === 1 ? "" : "s"} available for this selection.
        </p>
        {err && <p className="text-sm text-rose-500">{err}</p>}

        <button
          onClick={start}
          className="w-full rounded-lg bg-brand px-5 py-2.5 font-semibold text-white"
        >
          Start test
        </button>
      </div>
    </div>
  );
}
