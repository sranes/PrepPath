"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Chapter, ClassId, Difficulty, Question, SubjectId } from "@/lib/types";
import {
  CLASS_IDS,
  addCloudChapter,
  addCloudQuestion,
  checkIsAdmin,
  deleteCloudQuestion,
  getAdminChapters,
  getAdminQuestions,
  getAllChapters,
  getChaptersForClass,
  getQuestionsForChapter,
  getSubjects,
  saveAdminChapters,
  saveAdminQuestions,
  seedCloud,
  upsertAdminQuestion,
} from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useContentVersion } from "@/lib/use-content";

type Mode = "existing" | "new";

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminPage() {
  const version = useContentVersion();
  const { user, enabled } = useAuth();
  const subjects = getSubjects();

  // cloud === shared bank; only writable by an admin. Otherwise local-only.
  const [isAdmin, setIsAdmin] = useState(false);
  const cloud = isSupabaseConfigured && Boolean(user) && isAdmin;

  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  // when set, the form is editing this existing question id (upsert), not adding
  const [editingId, setEditingId] = useState<string | null>(null);

  // chapter selection (for new questions)
  const [mode, setMode] = useState<Mode>("existing");
  const [chapterId, setChapterId] = useState("");
  const [classId, setClassId] = useState<ClassId>("6");
  const [subjectId, setSubjectId] = useState<SubjectId>("physics");
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterBlurb, setChapterBlurb] = useState("");

  // question fields
  const [type, setType] = useState<"mcq" | "numeric">("mcq");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [solution, setSolution] = useState("");

  // browse / find filters
  const [fClass, setFClass] = useState<ClassId>("6");
  const [fSubject, setFSubject] = useState<SubjectId>("maths");
  const [fChapter, setFChapter] = useState("");

  useEffect(() => {
    if (isSupabaseConfigured && user) checkIsAdmin().then(setIsAdmin);
    else setIsAdmin(false);
  }, [user]);

  useEffect(() => {
    setAllChapters(getAllChapters());
  }, [version]);

  // chapters available for the browse filters
  const filterChapters = useMemo(
    () => getChaptersForClass(fClass).filter((c) => c.subjectId === fSubject),
    [fClass, fSubject, version]
  );
  // default-select the first chapter when the filter changes
  useEffect(() => {
    if (!filterChapters.some((c) => c.id === fChapter)) {
      setFChapter(filterChapters[0]?.id ?? "");
    }
  }, [filterChapters]); // eslint-disable-line react-hooks/exhaustive-deps

  const browseList = useMemo(
    () => (fChapter ? getQuestionsForChapter(fChapter) : []),
    [fChapter, version]
  );

  function resetForm() {
    setEditingId(null);
    setMode("existing");
    setType("mcq");
    setDifficulty("easy");
    setPrompt("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setSolution("");
  }

  function editQuestion(q: Question) {
    setEditingId(q.id);
    setMode("existing");
    setChapterId(q.chapterId);
    setType(q.type);
    setDifficulty(q.difficulty);
    setPrompt(q.prompt);
    setOptions(q.type === "mcq" ? [...(q.options ?? []), "", "", "", ""].slice(0, 4) : ["", "", "", ""]);
    setAnswer(q.answer);
    setSolution(q.solution);
    setMsg(`Editing ${q.id}`);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveQuestion() {
    setBusy(true);
    setMsg("");
    try {
      let chId = chapterId;
      let chapterObj: Chapter | undefined;

      if (!editingId && mode === "new") {
        if (!chapterTitle.trim()) return setMsg("Enter a chapter title.");
        chId = `${classId}-${subjectId}-${slug(chapterTitle)}`;
        chapterObj = {
          id: chId,
          classId,
          subjectId,
          title: chapterTitle.trim(),
          blurb: chapterBlurb.trim() || "Added via Admin.",
        };
      }

      if (!chId) return setMsg("Pick or create a chapter.");
      if (!prompt.trim()) return setMsg("Enter a question prompt.");
      if (!answer.trim()) return setMsg("Enter the answer.");
      if (type === "mcq" && !options.map((o) => o.trim()).includes(answer.trim()))
        return setMsg("For MCQs the answer must exactly match one of the options.");

      const target = chapterObj ?? getAllChapters().find((c) => c.id === chId);
      const q: Question = {
        // editing keeps the same id (upsert); adding generates a new one
        id: editingId ?? `${cloud ? "q" : "admin"}-${Date.now()}`,
        chapterId: chId,
        classId: target?.classId ?? classId,
        subjectId: target?.subjectId ?? subjectId,
        type,
        difficulty,
        prompt: prompt.trim(),
        options: type === "mcq" ? options.map((o) => o.trim()).filter(Boolean) : undefined,
        answer: answer.trim(),
        solution: solution.trim() || "—",
      };

      if (cloud) {
        if (chapterObj) {
          const r = await addCloudChapter(chapterObj);
          if (r.error) return setMsg(`❌ ${r.error}`);
        }
        const r = await addCloudQuestion(q); // upsert by id
        if (r.error) return setMsg(`❌ ${r.error}`);
      } else {
        if (chapterObj && !getAllChapters().some((c) => c.id === chId)) {
          saveAdminChapters([...getAdminChapters(), chapterObj]);
        }
        upsertAdminQuestion(q); // upsert by id (overrides seed locally)
      }

      const wasEditing = Boolean(editingId);
      resetForm();
      setMsg(
        wasEditing
          ? cloud
            ? "✅ Updated in the shared bank."
            : "✅ Updated (this device)."
          : cloud
            ? "✅ Added to the shared bank."
            : "✅ Added (this device)."
      );
    } finally {
      setBusy(false);
    }
  }

  async function seedFromApp() {
    if (!confirm("Push the built-in starter content (chapters, questions, papers) to the shared cloud bank?"))
      return;
    setBusy(true);
    setMsg("");
    try {
      const r = await seedCloud();
      if (r.error) setMsg(`❌ ${r.error}`);
      else
        setMsg(`✅ Seeded ${r.counts?.questions} questions, ${r.counts?.chapters} chapters, ${r.counts?.papers} papers.`);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this question? (A built-in seed question will revert to its original version.)")) return;
    if (cloud) {
      const r = await deleteCloudQuestion(id);
      if (r.error) return setMsg(`❌ ${r.error}`);
    } else {
      saveAdminQuestions(getAdminQuestions().filter((q) => q.id !== id));
    }
    if (editingId === id) resetForm();
    setMsg("Deleted.");
  }

  function exportJson() {
    const data = { chapters: getAdminChapters(), questions: getAdminQuestions() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "preppath-content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand";

  // Signed in but not an admin → can't edit the shared bank.
  if (enabled && user && !isAdmin) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-bold">Admin access needed</h1>
          <p className="mt-2 text-sm text-muted">
            You&apos;re signed in, but only admins can edit the shared question bank. The
            project owner can grant access by adding your user id to the <code>admins</code>{" "}
            table (see <code>supabase/content_schema.sql</code>).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Admin · Content</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Link href="/admin/chapters" className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">
            📖 Chapters &amp; lessons
          </Link>
          <Link href="/admin/import" className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">
            ⬆ Bulk import
          </Link>
          <Link href="/admin/papers" className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">
            📄 Build papers
          </Link>
          {!cloud && (
            <button onClick={exportJson} className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">
              ⬇ Export JSON
            </button>
          )}
          {cloud && (
            <button
              onClick={seedFromApp}
              disabled={busy}
              className="rounded-lg border border-border px-3 py-1.5 hover:border-brand disabled:opacity-50"
            >
              🌱 Seed cloud from app
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-muted">
          {cloud
            ? "Editing the shared cloud bank — changes appear for every student."
            : enabled && !user
              ? "Sign in as an admin to edit the shared bank. Until then, changes are saved on this device only."
              : "Saved on this device. Add Supabase credentials + admin access to publish to all students."}
        </p>
      </div>

      {/* Add / edit a question */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            {editingId ? "Edit question" : "Add a question"}{" "}
            {cloud && (
              <span className="ml-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                cloud
              </span>
            )}
          </h2>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-muted hover:text-brand">
              Cancel edit
            </button>
          )}
        </div>

        {editingId ? (
          <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted">
            Editing <span className="font-mono">{editingId}</span> — saved under the same id.
          </div>
        ) : (
          <>
            <div className="flex gap-2 text-sm">
              <Toggle on={mode === "existing"} onClick={() => setMode("existing")}>
                Existing chapter
              </Toggle>
              <Toggle on={mode === "new"} onClick={() => setMode("new")}>
                New chapter
              </Toggle>
            </div>

            {mode === "existing" ? (
              <select className={input} value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
                <option value="">— choose a chapter —</option>
                {allChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.classId} · {c.subjectId} · {c.title}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                <select className={input} value={classId} onChange={(e) => setClassId(e.target.value as ClassId)}>
                  {CLASS_IDS.map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
                <select className={input} value={subjectId} onChange={(e) => setSubjectId(e.target.value as SubjectId)}>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <input className={`${input} sm:col-span-2`} placeholder="Chapter title" value={chapterTitle} onChange={(e) => setChapterTitle(e.target.value)} />
                <input className={`${input} sm:col-span-2`} placeholder="Short description (optional)" value={chapterBlurb} onChange={(e) => setChapterBlurb(e.target.value)} />
              </div>
            )}
          </>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          <select className={input} value={type} onChange={(e) => setType(e.target.value as "mcq" | "numeric")}>
            <option value="mcq">MCQ</option>
            <option value="numeric">Numeric</option>
          </select>
          <select className={input} value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <textarea className={input} rows={2} placeholder="Question prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />

        {type === "mcq" && (
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o, i) => (
              <input
                key={i}
                className={input}
                placeholder={`Option ${i + 1}`}
                value={o}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
              />
            ))}
          </div>
        )}

        <input
          className={input}
          placeholder={type === "mcq" ? "Correct answer (must match an option exactly)" : "Correct answer"}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <textarea className={input} rows={3} placeholder="Worked solution / explanation" value={solution} onChange={(e) => setSolution(e.target.value)} />

        <div className="flex items-center gap-3">
          <button onClick={saveQuestion} disabled={busy} className="rounded-lg bg-brand px-5 py-2 font-semibold text-white disabled:opacity-50">
            {busy ? "Saving…" : editingId ? "Save changes" : "Add question"}
          </button>
          {msg && <span className="text-sm text-muted">{msg}</span>}
        </div>
      </div>

      {/* Find & edit existing questions */}
      <div className="space-y-3">
        <h2 className="font-semibold">Find &amp; edit questions</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <select className={input} value={fClass} onChange={(e) => setFClass(e.target.value as ClassId)}>
            {CLASS_IDS.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
          <select className={input} value={fSubject} onChange={(e) => setFSubject(e.target.value as SubjectId)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select className={`${input} col-span-2 sm:col-span-1`} value={fChapter} onChange={(e) => setFChapter(e.target.value)}>
            {filterChapters.length === 0 && <option value="">— no chapters —</option>}
            {filterChapters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          {browseList.map((q) => (
            <div
              key={q.id}
              className={`flex items-start justify-between gap-3 rounded-lg border bg-card p-3 text-sm ${
                editingId === q.id ? "border-brand" : "border-border"
              }`}
            >
              <div className="min-w-0">
                <div className="font-medium">{q.prompt}</div>
                <div className="text-xs text-muted">
                  <span className="font-mono">{q.id}</span> · {q.type} · {q.difficulty} · ans: {q.answer}
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <button onClick={() => editQuestion(q)} className="text-brand hover:underline">
                  edit
                </button>
                <button onClick={() => remove(q.id)} className="text-rose-500 hover:underline">
                  delete
                </button>
              </div>
            </div>
          ))}
          {fChapter && browseList.length === 0 && (
            <p className="text-sm text-muted">No questions in this chapter yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-1.5 ${on ? "bg-brand text-white" : "border border-border"}`}>
      {children}
    </button>
  );
}
