"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Chapter, ClassId, LessonBlock, SubjectId } from "@/lib/types";
import {
  CLASS_IDS,
  addCloudChapter,
  getChapter,
  getChaptersForClass,
  getSubjects,
  upsertAdminChapter,
} from "@/lib/content";
import { useAdmin } from "@/lib/use-admin";
import { useContentVersion } from "@/lib/use-content";

type Kind = LessonBlock["kind"];

// editor-friendly shape: list items + example fields held as plain strings
interface EditBlock {
  kind: Kind;
  text: string; // heading / para / formula / tip
  itemsText: string; // list (one per line)
  problem: string; // example
  solution: string; // example
}

const BLANK: EditBlock = { kind: "para", text: "", itemsText: "", problem: "", solution: "" };

function toEdit(b: LessonBlock): EditBlock {
  switch (b.kind) {
    case "list":
      return { ...BLANK, kind: "list", itemsText: b.items.join("\n") };
    case "example":
      return { ...BLANK, kind: "example", problem: b.problem, solution: b.solution };
    default:
      return { ...BLANK, kind: b.kind, text: b.text };
  }
}

function fromEdit(b: EditBlock): LessonBlock | null {
  if (b.kind === "list") {
    const items = b.itemsText.split("\n").map((s) => s.trim()).filter(Boolean);
    return items.length ? { kind: "list", items } : null;
  }
  if (b.kind === "example") {
    if (!b.problem.trim() && !b.solution.trim()) return null;
    return { kind: "example", problem: b.problem.trim(), solution: b.solution.trim() };
  }
  return b.text.trim() ? { kind: b.kind, text: b.text.trim() } : null;
}

const KINDS: Kind[] = ["heading", "para", "list", "formula", "example", "tip"];

export default function ChapterEditorPage() {
  const version = useContentVersion();
  const { cloud, enabled, signedIn, isAdmin } = useAdmin();
  const subjects = getSubjects();

  const [fClass, setFClass] = useState<ClassId>("6");
  const [fSubject, setFSubject] = useState<SubjectId>("maths");
  const [chapterId, setChapterId] = useState("");

  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [blocks, setBlocks] = useState<EditBlock[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const chapters = useMemo(
    () => getChaptersForClass(fClass).filter((c) => c.subjectId === fSubject),
    [fClass, fSubject, version]
  );

  useEffect(() => {
    if (!chapters.some((c) => c.id === chapterId)) setChapterId(chapters[0]?.id ?? "");
  }, [chapters]); // eslint-disable-line react-hooks/exhaustive-deps

  // load the selected chapter into the editor
  useEffect(() => {
    const ch = chapterId ? getChapter(chapterId) : undefined;
    setTitle(ch?.title ?? "");
    setBlurb(ch?.blurb ?? "");
    setBlocks((ch?.lesson ?? []).map(toEdit));
    setMsg("");
  }, [chapterId, version]);

  const input = "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand";

  function update(i: number, patch: Partial<EditBlock>) {
    setBlocks((bs) => bs.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  }
  function move(i: number, dir: -1 | 1) {
    setBlocks((bs) => {
      const next = [...bs];
      const j = i + dir;
      if (j < 0 || j >= next.length) return bs;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  function removeBlock(i: number) {
    setBlocks((bs) => bs.filter((_, j) => j !== i));
  }
  function addBlock(kind: Kind) {
    setBlocks((bs) => [...bs, { ...BLANK, kind }]);
  }

  async function save() {
    if (!chapterId) return;
    const ch = getChapter(chapterId);
    if (!ch) return setMsg("Chapter not found.");
    if (!title.trim()) return setMsg("Title can't be empty.");
    setBusy(true);
    setMsg("");
    try {
      const lesson = blocks.map(fromEdit).filter((b): b is LessonBlock => b !== null);
      const updated: Chapter = {
        ...ch,
        title: title.trim(),
        blurb: blurb.trim(),
        lesson: lesson.length ? lesson : undefined,
      };
      if (cloud) {
        const r = await addCloudChapter(updated); // upsert by id
        if (r.error) return setMsg(`❌ ${r.error}`);
        setMsg("✅ Saved to the shared bank.");
      } else {
        upsertAdminChapter(updated);
        setMsg("✅ Saved (this device).");
      }
    } finally {
      setBusy(false);
    }
  }

  if (enabled && signedIn && !isAdmin) {
    return (
      <div className="space-y-3">
        <Link href="/admin" className="text-sm text-muted hover:text-brand">
          ← Admin
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-bold">Admin access needed</h1>
          <p className="mt-2 text-sm text-muted">
            Only admins can edit the shared chapters. Ask the owner to add your user id to the{" "}
            <code>admins</code> table.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-muted hover:text-brand">
          ← Admin
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Chapters &amp; lessons</h1>
        <p className="text-sm text-muted">
          Edit a chapter&apos;s title, description and concept lesson.{" "}
          {cloud ? "Changes publish to all students." : "Saved on this device."}
        </p>
      </div>

      {/* chapter picker */}
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
        <select className={`${input} col-span-2 sm:col-span-1`} value={chapterId} onChange={(e) => setChapterId(e.target.value)}>
          {chapters.length === 0 && <option value="">— no chapters —</option>}
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {chapterId && (
        <>
          <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
            <label className="block text-sm font-medium">
              Title
              <input className={`${input} mt-1`} value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="block text-sm font-medium">
              Description (blurb)
              <input className={`${input} mt-1`} value={blurb} onChange={(e) => setBlurb(e.target.value)} />
            </label>
          </div>

          {/* lesson blocks */}
          <div className="space-y-3">
            <h2 className="font-semibold">
              Lesson <span className="text-muted">({blocks.length} block{blocks.length === 1 ? "" : "s"})</span>
            </h2>

            {blocks.map((b, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-border bg-card p-3">
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-lg border border-border bg-background px-2 py-1 text-sm"
                    value={b.kind}
                    onChange={(e) => update(i, { kind: e.target.value as Kind })}
                  >
                    {KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <div className="ml-auto flex gap-2 text-sm text-muted">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                      ↑
                    </button>
                    <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="disabled:opacity-30">
                      ↓
                    </button>
                    <button onClick={() => removeBlock(i)} className="text-rose-500 hover:underline">
                      remove
                    </button>
                  </div>
                </div>

                {b.kind === "list" ? (
                  <textarea
                    className={input}
                    rows={3}
                    placeholder="One bullet per line"
                    value={b.itemsText}
                    onChange={(e) => update(i, { itemsText: e.target.value })}
                  />
                ) : b.kind === "example" ? (
                  <div className="space-y-2">
                    <input className={input} placeholder="Example problem" value={b.problem} onChange={(e) => update(i, { problem: e.target.value })} />
                    <input className={input} placeholder="Solution" value={b.solution} onChange={(e) => update(i, { solution: e.target.value })} />
                  </div>
                ) : (
                  <textarea
                    className={input}
                    rows={b.kind === "para" ? 3 : 2}
                    placeholder={b.kind === "heading" ? "Heading text" : b.kind === "formula" ? "Formula text" : b.kind === "tip" ? "Tip text" : "Text"}
                    value={b.text}
                    onChange={(e) => update(i, { text: e.target.value })}
                  />
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-2 text-sm">
              {KINDS.map((k) => (
                <button key={k} onClick={() => addBlock(k)} className="rounded-lg border border-border px-3 py-1.5 hover:border-brand">
                  + {k}
                </button>
              ))}
            </div>
          </div>

          <div className="sticky bottom-4 flex items-center gap-3">
            <button onClick={save} disabled={busy} className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white shadow-lg disabled:opacity-50">
              {busy ? "Saving…" : "Save chapter"}
            </button>
            <Link href={`/learn/${chapterId}`} className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm">
              Preview lesson →
            </Link>
            {msg && <span className="text-sm text-muted">{msg}</span>}
          </div>
        </>
      )}
    </div>
  );
}
