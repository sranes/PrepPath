"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Question } from "@/lib/types";
import { getQuestion } from "@/lib/content";
import { useContentVersion } from "@/lib/use-content";
import { recordAttempt } from "@/lib/progress";
import {
  clearMockState,
  isAnswerCorrect,
  loadMockState,
  MARK_CORRECT,
  MARK_WRONG,
  scoreMock,
  type MockResult,
} from "@/lib/mock";

type Phase = "loading" | "active" | "done";

export default function MockRunPage() {
  const version = useContentVersion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [durationSec, setDurationSec] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [remaining, setRemaining] = useState(0);
  const [result, setResult] = useState<MockResult | null>(null);
  const recordedRef = useRef(false);

  // resolve the test from session storage (re-runs once content hydrates)
  useEffect(() => {
    const state = loadMockState();
    if (!state) {
      setPhase((p) => (p === "done" ? p : "loading"));
      return;
    }
    const qs = state.questionIds
      .map((id) => getQuestion(id))
      .filter((q): q is Question => Boolean(q));
    if (qs.length === 0) return; // wait for hydration
    setQuestions(qs);
    setDurationSec(state.config.durationSec);
    setStartedAt(state.startedAt);
    setPhase((p) => (p === "done" ? p : "active"));
  }, [version]);

  const submit = useCallback(() => {
    if (recordedRef.current) return;
    recordedRef.current = true;
    const res = scoreMock(questions, answers);
    // feed spaced repetition: every attempted question counts as a test
    for (const q of questions) {
      const given = answers[q.id];
      if (given != null && given !== "") recordAttempt(q.id, isAnswerCorrect(q, given));
    }
    setResult(res);
    setPhase("done");
    clearMockState();
  }, [questions, answers]);

  // countdown
  useEffect(() => {
    if (phase !== "active" || !durationSec) return;
    const tick = () => {
      const left = Math.max(0, durationSec - Math.floor((Date.now() - startedAt) / 1000));
      setRemaining(left);
      if (left <= 0) submit();
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [phase, durationSec, startedAt, submit]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter((a) => a != null && a !== "").length,
    [answers]
  );

  if (phase === "loading") {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">No active test</h1>
        <p className="text-sm text-muted">Start a new mock test to begin.</p>
        <Link href="/mock" className="inline-block rounded-lg bg-brand px-4 py-2 text-white">
          Set up a test
        </Link>
      </div>
    );
  }

  if (phase === "done" && result) {
    return <Results questions={questions} answers={answers} result={result} />;
  }

  const q = questions[idx];
  const given = answers[q.id] ?? "";
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const low = remaining <= 30;

  const setAnswer = (val: string) => setAnswers((a) => ({ ...a, [q.id]: val }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          Q{idx + 1} / {questions.length} · {answeredCount} answered
        </span>
        <span
          className={`rounded-lg px-3 py-1 font-mono font-semibold ${
            low ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : "bg-background"
          }`}
        >
          ⏱ {mm}:{ss}
        </span>
      </div>

      {/* palette */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((qq, i) => {
          const ans = answers[qq.id] != null && answers[qq.id] !== "";
          const mk = marked[qq.id];
          return (
            <button
              key={qq.id}
              onClick={() => setIdx(i)}
              className={[
                "h-8 w-8 rounded text-xs font-semibold",
                i === idx ? "ring-2 ring-brand" : "",
                mk
                  ? "bg-amber-500 text-white"
                  : ans
                    ? "bg-emerald-500 text-white"
                    : "border border-border",
              ].join(" ")}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span className="rounded bg-background px-2 py-0.5 uppercase">{q.difficulty}</span>
          <span className="rounded bg-background px-2 py-0.5 uppercase">{q.subjectId}</span>
        </div>
        <p className="text-lg font-medium">{q.prompt}</p>

        {q.type === "mcq" && q.options && (
          <div className="mt-4 space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAnswer(opt)}
                className={`block w-full rounded-lg border px-4 py-2 text-left transition ${
                  given === opt ? "border-brand bg-background" : "border-border hover:border-brand"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "numeric" && (
          <input
            type="text"
            inputMode="decimal"
            value={given}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer"
            className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-brand"
          />
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button
            onClick={() => setMarked((m) => ({ ...m, [q.id]: !m[q.id] }))}
            className="rounded-lg border border-border px-3 py-1.5"
          >
            {marked[q.id] ? "Unmark" : "Mark for review"}
          </button>
          <button
            onClick={() => setAnswers((a) => ({ ...a, [q.id]: "" }))}
            className="rounded-lg border border-border px-3 py-1.5"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="rounded-lg border border-border px-4 py-2 disabled:opacity-40"
        >
          ← Prev
        </button>
        {idx < questions.length - 1 ? (
          <button
            onClick={() => setIdx((i) => i + 1)}
            className="rounded-lg bg-brand px-4 py-2 font-semibold text-white"
          >
            Save &amp; Next →
          </button>
        ) : (
          <button
            onClick={submit}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white"
          >
            Submit test
          </button>
        )}
      </div>

      <button onClick={submit} className="w-full text-center text-sm text-muted hover:text-brand">
        Submit early
      </button>
    </div>
  );
}

function Results({
  questions,
  answers,
  result,
}: {
  questions: Question[];
  answers: Record<string, string | null>;
  result: MockResult;
}) {
  const pct = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Test submitted 🎉</h1>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-extrabold">{result.score}</span>
          <span className="text-indigo-100">/ {result.maxScore} marks</span>
        </div>
        <p className="mt-1 text-sm text-indigo-100">
          {pct}% · scored with +{MARK_CORRECT} / {MARK_WRONG} marking
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <Stat label="Correct" value={result.correct} tone="text-emerald-600 dark:text-emerald-400" />
        <Stat label="Wrong" value={result.wrong} tone="text-rose-600 dark:text-rose-400" />
        <Stat label="Skipped" value={result.unattempted} tone="text-muted" />
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">Review</h2>
        {questions.map((q, i) => {
          const given = answers[q.id];
          const attempted = given != null && given !== "";
          const correct = attempted && isAnswerCorrect(q, given);
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-2">
                <span className="text-sm font-semibold text-muted">{i + 1}.</span>
                <div className="flex-1">
                  <p className="font-medium">{q.prompt}</p>
                  <div className="mt-2 text-sm">
                    <span
                      className={
                        !attempted
                          ? "text-muted"
                          : correct
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                      }
                    >
                      {!attempted
                        ? "Skipped"
                        : correct
                          ? `✅ Correct (${given})`
                          : `❌ Your answer: ${given}`}
                    </span>
                    {!correct && (
                      <span className="ml-2 text-muted">· Correct: {q.answer}</span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-foreground/80">{q.solution}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Link href="/mock" className="rounded-lg bg-brand px-5 py-2 font-semibold text-white">
          New test
        </Link>
        <Link href="/" className="rounded-lg border border-border px-5 py-2">
          Home
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className={`text-2xl font-bold ${tone}`}>{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
