"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ClassId } from "@/lib/types";
import { getChapters, getSubjectsForClass } from "@/lib/content";
import { useContentVersion } from "@/lib/use-content";

export default function ClassPage() {
  useContentVersion();
  const { classId } = useParams<{ classId: ClassId }>();
  const subjects = getSubjectsForClass(classId);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Class {classId}</h1>
        <p className="text-sm text-muted">Choose a subject to start practising.</p>
      </div>

      {subjects.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
          No chapters yet for this class. Add some from the{" "}
          <Link href="/admin" className="text-brand underline">
            Admin tool
          </Link>
          .
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {subjects.map((s) => {
          const count = getChapters(classId, s.id).length;
          return (
            <Link
              key={s.id}
              href={`/c/${classId}/${s.id}`}
              className={`rounded-xl bg-gradient-to-br ${s.accent} p-4 text-white shadow-sm transition hover:shadow-md`}
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="mt-1 text-lg font-semibold">{s.name}</div>
              <div className="text-xs text-white/80">{count} chapters</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
