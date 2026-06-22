"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Chapter, ClassId, Question, SubjectId } from "@/lib/types";
import {
  bulkUpsertCloud,
  getAdminChapters,
  getAdminQuestions,
  getAllChapters,
  saveAdminChapters,
  saveAdminQuestions,
} from "@/lib/content";
import { useAdmin } from "@/lib/use-admin";

const TEMPLATE = `{
  "chapters": [
    {
      "id": "7-physics-motion",
      "classId": "7",
      "subjectId": "physics",
      "title": "Motion",
      "blurb": "Speed and types of motion."
    }
  ],
  "questions": [
    {
      "id": "q-7-mot-1",
      "chapterId": "7-physics-motion",
      "classId": "7",
      "subjectId": "physics",
      "type": "mcq",
      "difficulty": "easy",
      "prompt": "The SI unit of speed is?",
      "options": ["m/s", "km", "s", "kg"],
      "answer": "m/s",
      "solution": "Speed = distance / time = metre / second = m/s."
    }
  ]
}`;

interface Parsed {
  chapters: Chapter[];
  questions: Question[];
  errors: string[];
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseImport(raw: string, existingChapterIds: Set<string>): Parsed {
  const errors: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { chapters: [], questions: [], errors: ["Invalid JSON — check for a stray comma or quote."] };
  }

  // accept {chapters, questions} or a bare questions array
  const obj = Array.isArray(data) ? { questions: data } : (data as Record<string, unknown>);
  const chapters = Array.isArray(obj.chapters) ? (obj.chapters as Chapter[]) : [];
  const rawQuestions = Array.isArray(obj.questions) ? (obj.questions as Question[]) : [];

  const knownChapters = new Set([...existingChapterIds, ...chapters.map((c) => c.id)]);
  const autoChapters: Chapter[] = [];
  const questions: Question[] = [];

  rawQuestions.forEach((q, i) => {
    const where = `Question #${i + 1}${q.id ? ` (${q.id})` : ""}`;
    if (!q.id) return errors.push(`${where}: missing "id".`);
    if (!q.prompt) return errors.push(`${where}: missing "prompt".`);
    if (!q.answer) return errors.push(`${where}: missing "answer".`);
    if (!q.chapterId) return errors.push(`${where}: missing "chapterId".`);
    if (q.type === "mcq") {
      if (!Array.isArray(q.options) || q.options.length < 2)
        return errors.push(`${where}: MCQ needs at least 2 options.`);
      if (!q.options.includes(q.answer))
        return errors.push(`${where}: answer must exactly match one option.`);
    }
    // auto-create a placeholder chapter if referenced but unknown
    if (!knownChapters.has(q.chapterId)) {
      knownChapters.add(q.chapterId);
      autoChapters.push({
        id: q.chapterId,
        classId: (q.classId as ClassId) ?? "6",
        subjectId: (q.subjectId as SubjectId) ?? "physics",
        title: q.chapterId.split("-").slice(2).join(" ") || q.chapterId,
        blurb: "Imported.",
      });
    }
    questions.push({ ...q, solution: q.solution ?? "—" });
  });

  return { chapters: [...chapters, ...autoChapters], questions, errors };
}

export default function ImportPage() {
  const { cloud, enabled, signedIn, isAdmin } = useAdmin();
  const [raw, setRaw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const existingIds = useMemo(() => new Set(getAllChapters().map((c) => c.id)), []);
  const parsed = useMemo(
    () => (raw.trim() ? parseImport(raw, existingIds) : null),
    [raw, existingIds]
  );

  function loadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRaw(String(reader.result));
    reader.readAsText(file);
  }

  async function doImport() {
    if (!parsed || parsed.questions.length === 0) return;
    setBusy(true);
    setMsg("");
    try {
      if (cloud) {
        const r = await bulkUpsertCloud(parsed.chapters, parsed.questions);
        if (r.error) return setMsg(`❌ ${r.error}`);
        setMsg(`✅ Imported ${parsed.questions.length} question(s) to the shared bank.`);
      } else {
        const chMap = new Map(getAdminChapters().map((c) => [c.id, c]));
        parsed.chapters.forEach((c) => chMap.set(c.id, c));
        saveAdminChapters([...chMap.values()]);
        const qMap = new Map(getAdminQuestions().map((q) => [q.id, q]));
        parsed.questions.forEach((q) => qMap.set(q.id, q));
        saveAdminQuestions([...qMap.values()]);
        setMsg(`✅ Imported ${parsed.questions.length} question(s) to this device.`);
      }
      setRaw("");
    } finally {
      setBusy(false);
    }
  }

  if (enabled && signedIn && !isAdmin) {
    return <NotAdmin />;
  }

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-brand">
          ← Admin
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Bulk import</h1>
        <p className="text-sm text-muted">
          Paste or upload a JSON file of chapters + questions. {cloud
            ? "Imports go to the shared cloud bank."
            : "Imports are saved on this device (sign in as admin to publish to all students)."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm">
          ⬆ Choose .json file
          <input type="file" accept="application/json" onChange={loadFile} className="hidden" />
        </label>
        <button
          onClick={() => setRaw(TEMPLATE)}
          className="rounded-lg border border-border px-4 py-2 text-sm"
        >
          Load example
        </button>
      </div>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={12}
        placeholder='Paste JSON: { "chapters": [...], "questions": [...] }'
        className="w-full rounded-lg border border-border bg-background p-3 font-mono text-xs outline-none focus:border-brand"
      />

      {parsed && (
        <div className="rounded-xl border border-border bg-card p-4 text-sm">
          <div className="font-medium">
            Preview: {parsed.questions.length} question(s), {parsed.chapters.length} chapter(s)
          </div>
          {parsed.errors.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-rose-500">
              {parsed.errors.slice(0, 8).map((e, i) => (
                <li key={i}>{e}</li>
              ))}
              {parsed.errors.length > 8 && <li>…and {parsed.errors.length - 8} more</li>}
            </ul>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={doImport}
          disabled={busy || !parsed || parsed.questions.length === 0}
          className="rounded-lg bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Importing…" : `Import${parsed ? ` ${parsed.questions.length}` : ""}`}
        </button>
        {msg && <span className="text-sm text-muted">{msg}</span>}
      </div>
    </div>
  );
}

function NotAdmin() {
  return (
    <div className="space-y-3">
      <Link href="/" className="text-sm text-muted hover:text-brand">
        ← Home
      </Link>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold">Admin access needed</h1>
        <p className="mt-2 text-sm text-muted">
          Only admins can import into the shared bank. Ask the project owner to add your user
          id to the <code>admins</code> table.
        </p>
      </div>
    </div>
  );
}
