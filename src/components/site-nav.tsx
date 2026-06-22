"use client";

import Link from "next/link";
import { StreakBadge } from "@/components/streak-badge";
import { AuthButton } from "@/components/auth-button";
import { LANGS, useT } from "@/lib/i18n";

export function SiteNav() {
  const { t, lang, setLang } = useT();

  return (
    <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-sm sm:gap-x-4">
      <Link href="/mock" className="hover:text-brand">
        {t("nav.mock")}
      </Link>
      <Link href="/papers" className="hover:text-brand">
        {t("nav.papers")}
      </Link>
      <Link href="/resources" className="hover:text-brand">
        {t("nav.resources")}
      </Link>
      <Link href="/review" className="hover:text-brand">
        {t("nav.review")}
      </Link>
      <Link href="/progress" className="hover:text-brand">
        {t("nav.progress")}
      </Link>
      <Link href="/leaderboard" className="hover:text-brand">
        {t("nav.ranks")}
      </Link>
      <Link href="/admin" className="hover:text-brand">
        {t("nav.admin")}
      </Link>
      <StreakBadge />
      <AuthButton />
      <div className="flex overflow-hidden rounded-lg border border-border">
        {LANGS.map((l) => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={`px-2 py-0.5 text-xs ${
              lang === l.id ? "bg-brand text-white" : "hover:text-brand"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
