"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { computeReadiness, readinessLabel, type ReadinessSummary } from "@/lib/readiness";
import { useContentVersion } from "@/lib/use-content";

function barColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-lime-500";
  if (score >= 35) return "bg-amber-500";
  if (score > 0) return "bg-orange-500";
  return "bg-border";
}

export default function ProgressPage() {
  const version = useContentVersion();
  const [data, setData] = useState<ReadinessSummary | null>(null);

  useEffect(() => {
    setData(computeReadiness());
    const refresh = () => setData(computeReadiness());
    window.addEventListener("cw:progress-changed", refresh);
    return () => window.removeEventListener("cw:progress-changed", refresh);
  }, [version]);

  if (!data) return <p className="text-sm text-muted">Calculating your readiness…</p>;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">📊 Exam Readiness</h1>
        <p className="text-sm text-muted">
          Blends your <strong>accuracy</strong> with how much of each subject you&apos;ve{" "}
          <strong>covered</strong>. Practise more and get answers right to push these up.
        </p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
        <div className="text-sm text-indigo-100">Overall readiness</div>
        <div className="mt-1 flex items-end gap-3">
          <span className="text-4xl font-extrabold">{data.overall}%</span>
          <span className="pb-1 text-indigo-100">{readinessLabel(data.overall)}</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.subjects.map((s) => (
          <div key={s.subjectId} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {s.icon} {s.name}
              </span>
              <span className="text-sm font-semibold">{s.readiness}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className={`h-full rounded-full transition-all ${barColor(s.readiness)}`}
                style={{ width: `${Math.max(s.readiness, 2)}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <span>{readinessLabel(s.readiness)}</span>
              <span>
                Accuracy {Math.round(s.accuracy * 100)}% ({s.correct}/{s.attempts})
              </span>
              <span>
                Coverage {s.attemptedUnique}/{s.total}
              </span>
            </div>
          </div>
        ))}
        {data.subjects.length === 0 && (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
            No content yet — start practising to see your readiness.
          </p>
        )}
      </div>

      <Link
        href="/"
        className="inline-block rounded-lg bg-brand px-5 py-2 font-semibold text-white"
      >
        Practise more
      </Link>
    </div>
  );
}
