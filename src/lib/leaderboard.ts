"use client";

import { supabase } from "./supabase";
import { loadProgress } from "./progress";

// ---------------------------------------------------------------------------
// LEADERBOARD (opt-in, cloud-only)
// Mirrors only a self-chosen nickname + XP + streak to a public table. No
// email or personal data leaves the device. A student has a row only after
// they explicitly join, and can leave (delete it) at any time.
// ---------------------------------------------------------------------------

export interface LeaderEntry {
  user_id: string;
  nickname: string;
  xp: number;
  streak: number;
}

const COLS = "user_id,nickname,xp,streak";

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getLeaderboard(limit = 100): Promise<LeaderEntry[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("leaderboard")
    .select(COLS)
    .order("xp", { ascending: false })
    .order("streak", { ascending: false })
    .limit(limit);
  return (data as LeaderEntry[]) ?? [];
}

export async function getMyEntry(): Promise<LeaderEntry | null> {
  const uid = await currentUserId();
  if (!uid || !supabase) return null;
  const { data } = await supabase.from("leaderboard").select(COLS).eq("user_id", uid).maybeSingle();
  return (data as LeaderEntry) ?? null;
}

export async function joinLeaderboard(nickname: string): Promise<{ error?: string }> {
  const uid = await currentUserId();
  if (!uid || !supabase) return { error: "Sign in to join." };
  const name = nickname.trim().slice(0, 24);
  if (!name) return { error: "Pick a nickname." };
  const p = loadProgress();
  const { error } = await supabase.from("leaderboard").upsert({
    user_id: uid,
    nickname: name,
    xp: p.xp,
    streak: p.streak,
    updated_at: new Date().toISOString(),
  });
  return error ? { error: error.message } : {};
}

/** Push the latest XP/streak if the user has already opted in. */
export async function refreshMyScore(): Promise<void> {
  const mine = await getMyEntry();
  const uid = await currentUserId();
  if (!mine || !uid || !supabase) return;
  const p = loadProgress();
  if (p.xp === mine.xp && p.streak === mine.streak) return;
  await supabase
    .from("leaderboard")
    .update({ xp: p.xp, streak: p.streak, updated_at: new Date().toISOString() })
    .eq("user_id", uid);
}

export async function leaveLeaderboard(): Promise<void> {
  const uid = await currentUserId();
  if (!uid || !supabase) return;
  await supabase.from("leaderboard").delete().eq("user_id", uid);
}

export { currentUserId as getMyUserId };
