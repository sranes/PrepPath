"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ClassId, ExamKind, Paper, SubjectId } from "@/lib/types";
import {
  CLASS_IDS,
  addCloudPaper,
  deleteCloudPaper,
  getCloudPapers,
  getQuestionsForClass,
  getSubjects,
} from "@/lib/content";
import { useAdmin } from "@/lib/use-admin";
import { useContentVersion } from "@/lib/use-content";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function PaperBuilderPage() {
  useContentVersion();
  const { cloud, enabled, signedIn } = useAdmin();
  const subjects = getSubjects();

  const [name, setName] = useState("");
  const [exam, setExam] = useState<ExamKind>("foundation");
  const [year, setYear] = useState("");
  const [classId, setClassId] = useState<ClassId>("9");
  const [subjectId, setSubjectId] = useState<SubjectId | "all">("all");
  const [minutes, setMinutes] = useState(30);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [papers, setPapers] = useState<Paper[]>([]);

  useEffect(() => setPapers(getCloudPapers()), [cloud]);

  const pool = useMemo(
    () => getQuestionsForClass(classId, subjectId === "all" ? undefined : subjectId),
    [classId, subjectId]
  );
  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand";

  if (!enabled || !signedIn || !cloud) {
    return (
      <div className="space-y-3">
        <Link href="/admin" className="text-sm text-muted hover:text-brand">
          ← Admin
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-bold">Papers need cloud + admin</h1>
          <p className="mt-2 text-sm text-muted">
            Paper sets are shared with all students, so they live in the cloud. Configure
            Supabase, sign in, and have an admin grant you access to build papers.
          </p>
        </div>
      </div>
    );
  }

  async function save() {
    if (!name.trim()) return setMsg("Name the paper.");
    if (selectedIds.length === 0) return setMsg("Select at least one question.");
    setBusy(true);
    setMsg("");
    try {
      const paper: Paper = {
        id: `paper-${slug(name)}-${Date.now().toString(36)}`,
        name: name.trim(),
        exam,
        year: year ? Number(year) : undefined,
        classId,
        subjectId: subjectId === "all" ? undefined : subjectId,
        durationSec: minutes * 60,
        questionIds: selectedIds,
      };
      const r = await addCloudPaper(paper);
      if (r.error) return setMsg(`❌ ${r.error}`);
      setMsg(`✅ Created "${paper.name}".`);
      setName("");
      setYear("");
      setSelected({});
      setPapers(getCloudPapers());
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const r = await deleteCloudPaper(id);
    if (r.error) return setMsg(`❌ ${r.error}`);
    setPapers(getCloudPapers());
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-brand">
          ← Admin
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Build a paper</h1>
        <p className="text-sm text-muted">
          Bundle questions into a named, timed paper that every student can take.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <input
          className={input}
          placeholder="Paper name (e.g. NEET 2024 Biology, Class 9 Sample Paper)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select className={input} value={exam} onChange={(e) => setExam(e.target.value as ExamKind)}>
            <option value="foundation">Foundation</option>
            <option value="jee">JEE</option>
            <option value="neet">NEET</option>
            <option value="other">Other</option>
          </select>
          <input
            className={input}
            placeholder="Year"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            className={input}
            type="number"
            min={1}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            title="Duration (minutes)"
          />
          <span className="flex items-center text-sm text-muted">min · {selectedIds.length} picked</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select className={input} value={classId} onChange={(e) => setClassId(e.target.value as ClassId)}>
            {CLASS_IDS.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
          <select
            className={input}
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
        </div>

        <div className="max-h-72 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
          {pool.length === 0 && (
            <p className="p-2 text-sm text-muted">No questions for this filter yet.</p>
          )}
          {pool.map((q) => (
            <label
              key={q.id}
              className="flex cursor-pointer items-start gap-2 rounded p-2 text-sm hover:bg-background"
            >
              <input
                type="checkbox"
                checked={Boolean(selected[q.id])}
                onChange={(e) => setSelected((s) => ({ ...s, [q.id]: e.target.checked }))}
                className="mt-1"
              />
              <span>
                <span className="font-medium">{q.prompt}</span>
                <span className="ml-1 text-xs text-muted">({q.subjectId} · {q.difficulty})</span>
              </span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={busy}
            className="rounded-lg bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Saving…" : "Create paper"}
          </button>
          {msg && <span className="text-sm text-muted">{msg}</span>}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-semibold">
          Cloud papers <span className="text-muted">({papers.length})</span>
        </h2>
        <div className="space-y-2">
          {papers.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 text-sm"
            >
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.exam} · {p.questionIds.length} Q · {Math.round(p.durationSec / 60)} min
                </div>
              </div>
              <button onClick={() => remove(p.id)} className="shrink-0 text-rose-500 hover:underline">
                delete
              </button>
            </div>
          ))}
          {papers.length === 0 && <p className="text-sm text-muted">No cloud papers yet.</p>}
        </div>
      </div>
    </div>
  );
}
