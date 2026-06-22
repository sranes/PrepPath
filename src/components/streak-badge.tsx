"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";

export function StreakBadge() {
  const [streak, setStreak] = useState<number | null>(null);
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const sync = () => {
      const p = loadProgress();
      setStreak(p.streak);
      setXp(p.xp);
    };
    sync();
    // refresh when other tabs / the practice page update progress
    window.addEventListener("storage", sync);
    window.addEventListener("cw:progress-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cw:progress-changed", sync);
    };
  }, []);

  if (streak === null) return null;

  return (
    <span
      className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
      title={`${xp} XP`}
    >
      🔥 {streak}
    </span>
  );
}
