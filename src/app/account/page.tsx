"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function AccountPage() {
  const { enabled, user, signIn, signUp, signOut } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const input =
    "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-brand";

  if (!enabled) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-bold">Cloud sync isn&apos;t configured yet</h1>
          <p className="mt-2 text-sm text-muted">
            Your progress is saved on this device. To sync across devices, add Supabase
            credentials (see the README &ldquo;Cloud sync&rdquo; section) and restart.
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="space-y-3">
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-xl font-bold">Signed in</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
          <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
            ✅ Your streak, XP and revision schedule sync to the cloud.
          </p>
          <button
            onClick={() => signOut()}
            className="mt-4 rounded-lg border border-border px-4 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  async function submit() {
    setBusy(true);
    setMsg("");
    const fn = mode === "in" ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) {
      setMsg(error);
    } else if (mode === "up") {
      setMsg("Account created. If email confirmation is on, check your inbox; otherwise sign in.");
    } else {
      router.push("/");
    }
  }

  return (
    <div className="space-y-4">
      <Link href="/" className="text-sm text-muted hover:text-brand">
        ← Home
      </Link>
      <div className="mx-auto max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold">
          {mode === "in" ? "Sign in" : "Create account"}
        </h1>
        <p className="text-sm text-muted">
          Sync your progress across phone, tablet and computer. Free, always.
        </p>
        <input
          className={input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={input}
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <button
          onClick={submit}
          disabled={busy || !email || password.length < 6}
          className="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {busy ? "…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
        {msg && <p className="text-sm text-muted">{msg}</p>}
        <button
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setMsg("");
          }}
          className="text-sm text-brand hover:underline"
        >
          {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
