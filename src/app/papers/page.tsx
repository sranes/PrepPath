"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ExamKind, Paper } from "@/lib/types";
import { getAllPapers } from "@/lib/content";
import { startPaper } from "@/lib/mock";
import { useContentVersion } from "@/lib/use-content";

const EXAM_LABEL: Record<ExamKind, string> = {
  jee: "JEE",
  neet: "NEET",
  foundation: "Foundation",
  other: "Other",
};

export default function PapersPage() {
  useContentVersion();
  const router = useRouter();
  const papers = getAllPapers();

  // group by exam for a tidy list
  const groups = papers.reduce<Record<string, Paper[]>>((acc, p) => {
    (acc[p.exam] ??= []).push(p);
    return acc;
  }, {});

  function start(p: Paper) {
    startPaper(p);
    router.push("/mock/run");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">📄 Paper Sets</h1>
        <p className="text-sm text-muted">
          Previous-year and sample papers, taken as full timed tests (+4 / −1 marking).
        </p>
      </div>

      {papers.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
          No papers yet. An admin can create them in{" "}
          <Link href="/admin/papers" className="text-brand underline">
            Admin → Papers
          </Link>
          .
        </p>
      )}

      {Object.entries(groups).map(([exam, list]) => (
        <section key={exam} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {EXAM_LABEL[exam as ExamKind] ?? exam}
          </h2>
          {list.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {p.questionIds.length} question{p.questionIds.length === 1 ? "" : "s"} ·{" "}
                  {Math.round(p.durationSec / 60)} min
                  {p.year ? ` · ${p.year}` : ""}
                  {p.classId ? ` · Class ${p.classId}` : ""}
                </div>
              </div>
              <button
                onClick={() => start(p)}
                disabled={p.questionIds.length === 0}
                className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                Start
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
