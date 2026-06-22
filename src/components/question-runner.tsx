"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import { recordAttempt } from "@/lib/progress";

interface Props {
  questions: Question[];
  /** where the "back" / "done" links point */
  backHref: string;
  backLabel: string;
  title: string;
}

export function QuestionRunner({ questions, backHref, backLabel, title }: Props) {
  const ordered = useMemo(() => questions, [questions]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [numeric, setNumeric] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  if (ordered.length === 0) {
    return (
      <Empty backHref={backHref} backLabel={backLabel} title={title} />
    );
  }

  const q = ordered[idx];
  const isLast = idx === ordered.length - 1;

  const isCorrect = (() => {
    if (q.type === "mcq") return selected === q.answer;
    return numeric.trim() === q.answer.trim();
  })();

  function check() {
    if (checked) return;
    if (q.type === "mcq" && selected === null) return;
    if (q.type === "numeric" && numeric.trim() === "") return;
    recordAttempt(q.id, isCorrect);
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setChecked(true);
  }

  function next() {
    setIdx((i) => i + 1);
    setSelected(null);
    setNumeric("");
    setChecked(false);
  }

  if (idx >= ordered.length) {
    return null;
  }

  // finished screen
  if (checked && isLast && score.total === ordered.length) {
    // fall through to normal render; "Finish" button handles navigation
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Link href={backHref} className="text-sm text-muted hover:text-brand">
          ← {backLabel}
        </Link>
        <span className="text-sm text-muted">
          {idx + 1} / {ordered.length}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-border">
        <div
          className="h-1.5 rounded-full bg-brand transition-all"
          style={{ width: `${(idx / ordered.length) * 100}%` }}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          <span className="rounded bg-background px-2 py-0.5 uppercase">{q.difficulty}</span>
          <span className="rounded bg-background px-2 py-0.5 uppercase">{q.type}</span>
        </div>
        <p className="text-lg font-medium">{q.prompt}</p>

        {q.type === "mcq" && q.options && (
          <div className="mt-4 space-y-2">
            {q.options.map((opt) => {
              const chosen = selected === opt;
              const right = checked && opt === q.answer;
              const wrong = checked && chosen && opt !== q.answer;
              return (
                <button
                  key={opt}
                  disabled={checked}
                  onClick={() => setSelected(opt)}
                  className={[
                    "block w-full rounded-lg border px-4 py-2 text-left transition",
                    right
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
                      : wrong
                        ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30"
                        : chosen
                          ? "border-brand bg-background"
                          : "border-border hover:border-brand",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "numeric" && (
          <input
            type="text"
            inputMode="decimal"
            value={numeric}
            disabled={checked}
            onChange={(e) => setNumeric(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Type your answer"
            className="mt-4 w-full rounded-lg border border-border bg-background px-4 py-2 outline-none focus:border-brand"
          />
        )}

        {checked && (
          <div
            className={`mt-4 rounded-lg p-3 text-sm ${
              isCorrect
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                : "bg-rose-50 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200"
            }`}
          >
            <div className="font-semibold">
              {isCorrect ? "✅ Correct!" : `❌ Not quite — answer: ${q.answer}`}
            </div>
            <div className="mt-1 text-foreground/80">{q.solution}</div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {!checked ? (
          <button
            onClick={check}
            className="rounded-lg bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50"
          >
            Check
          </button>
        ) : isLast ? (
          <Link
            href={backHref}
            className="rounded-lg bg-emerald-600 px-5 py-2 font-semibold text-white"
          >
            Finish ({score.correct}/{score.total})
          </Link>
        ) : (
          <button
            onClick={next}
            className="rounded-lg bg-brand px-5 py-2 font-semibold text-white"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

function Empty({ backHref, backLabel, title }: Omit<Props, "questions">) {
  return (
    <div className="space-y-4">
      <Link href={backHref} className="text-sm text-muted hover:text-brand">
        ← {backLabel}
      </Link>
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted">No questions here yet.</p>
        <Link href="/admin" className="mt-3 inline-block text-sm text-brand underline">
          Add questions in the Admin tool →
        </Link>
      </div>
    </div>
  );
}
