"use client";

import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import { trackEvent } from "@/lib/userTracking";

const SKILL_BARS = [
  { name: "System Design", score: 74 },
  { name: "React", score: 66 },
  { name: "PostgreSQL", score: 59 },
  { name: "Golang", score: 63 },
  { name: "Docker", score: 52 },
];

const RECOMMENDED = [
  "Revisit consistent hashing and token distribution.",
  "Practice 15 PostgreSQL indexing questions.",
  "Take one hard React hooks mock interview.",
];

export default function ProgressPage() {
  return (
    <>
      <Navbar />
      <div className="page-shell min-h-screen">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Learner Dashboard</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Progress and Coaching
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-300">
              Track weak topics, monitor readiness, and get your next best study
              actions.
            </p>
          </section>

          <FreeModeBanner queueDepth={1} quotaUsed={31} />

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <section className="content-card p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Skill Readiness
              </h2>
              <div className="space-y-3">
                {SKILL_BARS.map((item) => (
                  <div key={item.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {item.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {item.score}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-amber-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="content-card p-4 sm:p-6">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Weekly Stats
              </h2>
              <div className="grid grid-cols-2 gap-2 text-center text-sm">
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    19
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Quizzes done
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    73%
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">Accuracy</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    6
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">Study days</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    2h 45m
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    Avg session
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="content-card mt-4 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
              Next Recommended Actions
            </h2>
            <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {RECOMMENDED.map((action, index) => (
                <li
                  key={action}
                  className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                >
                  <span className="mr-2 font-semibold text-amber-700 dark:text-amber-300">
                    {index + 1}.
                  </span>
                  {action}
                  <button
                    type="button"
                    onClick={() =>
                      trackEvent("progress_recommendation_click", {
                        index,
                        action,
                      })
                    }
                    className="ml-3 rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  >
                    Mark
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </>
  );
}
