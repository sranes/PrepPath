"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function AuthButton() {
  const { enabled, user, signOut, loading } = useAuth();

  // Cloud sync off (no Supabase env) — keep the header clean, app is local-only.
  if (!enabled) return null;
  if (loading) return null;

  if (!user) {
    return (
      <Link href="/account" className="rounded-lg bg-brand px-3 py-1 text-white">
        Sign in
      </Link>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      title={user.email ?? "Signed in"}
      className="rounded-lg border border-border px-3 py-1 hover:border-brand"
    >
      Sign out
    </button>
  );
}
