"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/userTracking";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error || "Login failed");
        setIsLoading(false);
        return;
      }
      trackEvent("login_success", { email: email.trim() });
      router.push("/dashboard");
    } catch {
      setError("Unable to login right now");
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-3 sm:px-4">
      <section className="content-card w-full max-w-md p-5 sm:p-8">
        <p className="eyebrow">Interview Practice</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Start Your Session
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in to continue your preparation.
        </p>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Demo: `admin@platform.dev/admin123` or `user@platform.dev/user123`
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-amber-600 hover:underline">
            Create account
          </Link>
        </p>
      </section>
    </main>
  );
}
