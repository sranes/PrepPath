"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CLASS_IDS, getChaptersForClass } from "@/lib/content";
import { getDueQuestionIds, loadProgress } from "@/lib/progress";
import { useContentVersion } from "@/lib/use-content";
import { useT } from "@/lib/i18n";

export default function Home() {
  useContentVersion();
  const { t } = useT();
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [due, setDue] = useState(0);
  const [attempted, setAttempted] = useState(0);

  useEffect(() => {
    const p = loadProgress();
    setXp(p.xp);
    setStreak(p.streak);
    setAttempted(p.attempts.length);
    setDue(getDueQuestionIds().length);
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
        <h1 className="text-2xl font-bold">{t("home.hero.title")}</h1>
        <p className="mt-1 text-sm text-indigo-100">{t("home.hero.subtitle")}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/mock"
            className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700"
          >
            {t("home.cta.mock")}
          </Link>
          {due > 0 && (
            <Link
              href="/review"
              className="inline-block rounded-lg bg-indigo-500/40 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/40"
            >
              🔁 {due} due for review
            </Link>
          )}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Stat label={t("home.stat.streak")} value={`🔥 ${streak}`} />
        <Stat label={t("home.stat.xp")} value={`${xp}`} />
        <Stat label={t("home.stat.questions")} value={`${attempted}`} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">{t("home.pickClass")}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CLASS_IDS.map((id) => {
            const count = getChaptersForClass(id).length;
            return (
              <Link
                key={id}
                href={`/c/${id}`}
                className="group rounded-xl border border-border bg-card p-4 transition hover:border-brand hover:shadow-md"
              >
                <div className="text-sm text-muted">Class</div>
                <div className="text-3xl font-bold group-hover:text-brand">{id}</div>
                <div className="mt-1 text-xs text-muted">{count} chapters</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}
