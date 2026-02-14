"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import {
  evaluateCodingSubmission,
  listCodingChallenges,
} from "@/lib/frontendData";

export default function CodingLabPage() {
  const challenges = useMemo(() => listCodingChallenges(), []);
  const [activeId, setActiveId] = useState(challenges[0]?.id || "");
  const activeChallenge =
    challenges.find((challenge) => challenge.id === activeId) || null;
  const [code, setCode] = useState(activeChallenge?.starterCode || "");
  const [result, setResult] = useState(null);

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Coding Lab</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              In-browser Practice Workspace
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-300">
              Pick a challenge, write code, and run a quick test evaluation flow.
            </p>
          </section>

          <FreeModeBanner queueDepth={0} quotaUsed={22} />

          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="content-card p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Challenges
              </h2>
              <div className="mt-3 space-y-2">
                {challenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    type="button"
                    onClick={() => {
                      setActiveId(challenge.id);
                      setCode(challenge.starterCode);
                      setResult(null);
                    }}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      challenge.id === activeId
                        ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                        : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <p className="font-semibold">{challenge.title}</p>
                    <p className="mt-1 text-xs opacity-80">
                      {challenge.technology} | {challenge.difficulty}
                    </p>
                  </button>
                ))}
              </div>
            </aside>

            <section className="content-card p-4 sm:p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {activeChallenge?.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {activeChallenge?.prompt}
              </p>

              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                rows={16}
                className="mt-4 w-full rounded-lg border border-slate-300 bg-slate-950 p-3 font-mono text-xs text-slate-100 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setResult(evaluateCodingSubmission(activeChallenge.id, code))
                  }
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                >
                  Run Tests
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCode(activeChallenge.starterCode);
                    setResult(null);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
                >
                  Reset
                </button>
              </div>

              {result && (
                <div className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Passed {result.passed} / {result.total}
                  </p>
                  <div className="mt-2 space-y-2">
                    {result.checks.map((item) => (
                      <div
                        key={item.check}
                        className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800"
                      >
                        <span>{item.check}</span>
                        <span
                          className={`font-semibold ${
                            item.passed
                              ? "text-emerald-600 dark:text-emerald-300"
                              : "text-rose-600 dark:text-rose-300"
                          }`}
                        >
                          {item.passed ? "Pass" : "Fail"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
