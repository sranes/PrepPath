"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  getLeaderboard,
  getMyEntry,
  getMyUserId,
  joinLeaderboard,
  leaveLeaderboard,
  refreshMyScore,
  type LeaderEntry,
} from "@/lib/leaderboard";

export default function LeaderboardPage() {
  const { enabled, user, loading } = useAuth();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [mine, setMine] = useState<LeaderEntry | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    await refreshMyScore(); // keep my own score current on view
    const [list, me, id] = await Promise.all([getLeaderboard(), getMyEntry(), getMyUserId()]);
    setEntries(list);
    setMine(me);
    setMyId(id);
    setReady(true);
  }, []);

  useEffect(() => {
    if (enabled && user) load();
    else setReady(true);
  }, [enabled, user, load]);

  async function join() {
    setBusy(true);
    setMsg("");
    const { error } = await joinLeaderboard(nickname);
    setBusy(false);
    if (error) setMsg(error);
    else {
      setNickname("");
      load();
    }
  }

  async function leave() {
    if (!confirm("Remove yourself from the leaderboard?")) return;
    await leaveLeaderboard();
    load();
  }

  const header = (
    <div>
      <Link href="/" className="text-sm text-muted hover:text-brand">
        ← Home
      </Link>
      <h1 className="mt-1 text-2xl font-bold">🏆 Leaderboard</h1>
      <p className="text-sm text-muted">
        Friendly competition by XP. Opt-in and shown only by a nickname you choose — never your
        email.
      </p>
    </div>
  );

  if (!enabled) {
    return (
      <div className="space-y-4">
        {header}
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted">
          The leaderboard needs cloud sync. It&apos;s off in local-only mode.
        </p>
      </div>
    );
  }

  if (loading || !ready) return <p className="text-sm text-muted">Loading leaderboard…</p>;

  if (!user) {
    return (
      <div className="space-y-4">
        {header}
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted">Sign in to join the leaderboard.</p>
          <Link
            href="/account"
            className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {header}

      {!mine ? (
        <div className="space-y-3 rounded-xl border border-border bg-card p-5">
          <h2 className="font-semibold">Join the leaderboard</h2>
          <p className="text-sm text-muted">Choose a nickname (max 24 characters).</p>
          <div className="flex gap-2">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={24}
              placeholder="e.g. RocketLearner"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand"
              onKeyDown={(e) => e.key === "Enter" && nickname.trim() && join()}
            />
            <button
              onClick={join}
              disabled={busy || !nickname.trim()}
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              Join
            </button>
          </div>
          {msg && <p className="text-sm text-rose-500">{msg}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-sm">
          <span>
            You&apos;re in as <strong>{mine.nickname}</strong> · {mine.xp} XP
          </span>
          <button onClick={leave} className="text-rose-500 hover:underline">
            Leave
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border">
        {entries.map((e, i) => {
          const me = e.user_id === myId;
          return (
            <div
              key={e.user_id}
              className={`flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-0 ${
                me ? "bg-brand/10" : "bg-card"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-muted">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </span>
                <span className="font-medium">
                  {e.nickname}
                  {me && <span className="ml-1 text-xs text-brand">(you)</span>}
                </span>
              </div>
              <div className="flex items-center gap-4 text-muted">
                <span title="streak">🔥 {e.streak}</span>
                <span className="font-semibold text-foreground">{e.xp} XP</span>
              </div>
            </div>
          );
        })}
        {entries.length === 0 && (
          <p className="bg-card p-4 text-sm text-muted">
            No one&apos;s on the board yet — be the first to join!
          </p>
        )}
      </div>
    </div>
  );
}
