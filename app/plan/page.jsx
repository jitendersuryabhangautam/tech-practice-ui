"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import { getStudyPlanSnapshot } from "@/lib/frontendData";

function formatDate(value) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PlanPage() {
  const snapshot = useMemo(() => getStudyPlanSnapshot(), []);
  const [completed, setCompleted] = useState([]);

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Personalization</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Revision Plan and Spaced Repetition
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-300">
              Focus weak topics first, clear today&apos;s review queue, and keep
              your interview readiness improving daily.
            </p>
          </section>

          <FreeModeBanner queueDepth={1} quotaUsed={28} />

          <section className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="content-card p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Plan Completion
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {snapshot.completionRatio}%
              </p>
            </div>
            <div className="content-card p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Streak
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {snapshot.streakDays} days
              </p>
            </div>
            <div className="content-card p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Weak Topics
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {snapshot.weakTopics.length}
              </p>
            </div>
          </section>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <section className="content-card p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Spaced Repetition Queue
              </h2>
              <div className="mt-3 space-y-2">
                {snapshot.queue.map((item) => {
                  const done = completed.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Due {formatDate(item.dueAt)} | Interval {item.interval}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            item.priority === "high"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={done}
                        onClick={() => setCompleted((prev) => [...prev, item.id])}
                        className="mt-2 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
                      >
                        {done ? "Completed" : "Mark Complete"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <article className="content-card p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Weak Topics
                </h2>
                <div className="mt-3 space-y-3">
                  {snapshot.weakTopics.map((topic) => (
                    <div key={topic.name}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {topic.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          {topic.score}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-amber-500"
                          style={{ width: `${topic.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="content-card p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Next Actions
                </h2>
                <ol className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {snapshot.recommendations.map((item, index) => (
                    <li
                      key={item}
                      className="rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <span className="mr-2 font-semibold text-amber-700 dark:text-amber-300">
                        {index + 1}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </article>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
