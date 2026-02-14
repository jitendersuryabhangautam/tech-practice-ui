"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/userTracking";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload?.error || "Signup failed");
        setIsLoading(false);
        return;
      }
      trackEvent("signup_success", { email: email.trim() });
      router.push("/dashboard");
    } catch {
      setError("Unable to signup right now");
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-3 sm:px-4">
      <section className="content-card w-full max-w-md p-5 sm:p-8">
        <p className="eyebrow">Interview Practice</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Create your account to start practice.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Your name"
            />
          </div>

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
              minLength={6}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Repeat password"
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
            {isLoading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-amber-600 hover:underline">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
