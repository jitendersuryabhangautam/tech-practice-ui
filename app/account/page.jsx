"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "Interview Learner",
    targetRole: "Senior Frontend Engineer",
    focus: "System Design",
  });
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Account</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Profile and Preferences
            </h1>
          </section>

          <FreeModeBanner queueDepth={0} quotaUsed={19} />

          <section className="content-card p-4 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Name
                </span>
                <input
                  value={profile.name}
                  onChange={(event) => update("name", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                  Target Role
                </span>
                <input
                  value={profile.targetRole}
                  onChange={(event) => update("targetRole", event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
                />
              </label>
            </div>
            <label className="mt-3 block text-sm">
              <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                Primary Focus
              </span>
              <select
                value={profile.focus}
                onChange={(event) => update("focus", event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <option>System Design</option>
                <option>React</option>
                <option>Golang</option>
                <option>PostgreSQL</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setSaved(true)}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Save Profile
            </button>
            {saved && (
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">
                Profile updated in local UI state.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
