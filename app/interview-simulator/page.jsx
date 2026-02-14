"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import { trackEvent } from "@/lib/userTracking";

const QUESTIONS = [
  "Design a scalable search autocomplete system.",
  "How would you optimize a slow PostgreSQL query under high load?",
  "Explain how React rendering and memoization reduce unnecessary updates.",
];

function scoreAnswer(text) {
  const normalized = text.toLowerCase();
  const structure = Math.min(10, Math.floor(text.length / 55));
  const tradeoffs =
    normalized.includes("trade-off") || normalized.includes("tradeoff")
      ? 8
      : 5;
  const depth = normalized.includes("cache") || normalized.includes("index")
    ? 8
    : 5;
  const clarity = normalized.includes("first") || normalized.includes("then")
    ? 8
    : 6;

  return { structure, tradeoffs, depth, clarity };
}

export default function InterviewSimulatorPage() {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!started || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitted, timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const rubric = useMemo(() => {
    return answers.map((answer) => scoreAnswer(answer));
  }, [answers]);

  const totals = useMemo(() => {
    const merged = rubric.reduce(
      (acc, item) => ({
        structure: acc.structure + item.structure,
        tradeoffs: acc.tradeoffs + item.tradeoffs,
        depth: acc.depth + item.depth,
        clarity: acc.clarity + item.clarity,
      }),
      { structure: 0, tradeoffs: 0, depth: 0, clarity: 0 }
    );

    return {
      ...merged,
      overall: merged.structure + merged.tradeoffs + merged.depth + merged.clarity,
      max: QUESTIONS.length * 40,
    };
  }, [rubric]);

  return (
    <>
      <Navbar />
      <div className="page-shell min-h-screen">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Interview Mode</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Mock Interview Simulator
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-300">
              Practice timed answers and get rubric-based feedback on structure,
              depth, trade-offs, and clarity.
            </p>
          </section>

          <FreeModeBanner queueDepth={0} quotaUsed={24} />

          {!started ? (
            <section className="content-card p-4 sm:p-6">
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Session Setup
              </h2>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
                Duration: 12 minutes | Questions: {QUESTIONS.length} | Style:
                System + frontend + database
              </p>
              <button
                type="button"
                onClick={() => {
                  setStarted(true);
                  trackEvent("simulator_start", {
                    totalQuestions: QUESTIONS.length,
                  });
                }}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
              >
                Start Interview Session
              </button>
            </section>
          ) : (
            <section className="content-card p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Question {questionIndex + 1} of {QUESTIONS.length}
                </p>
                <p className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                  {minutes}:{seconds}
                </p>
              </div>

              <p className="mb-3 text-base font-semibold text-slate-900 sm:text-lg dark:text-slate-100">
                {QUESTIONS[questionIndex]}
              </p>

              <textarea
                value={answers[questionIndex]}
                onChange={(event) =>
                  setAnswers((prev) => {
                    const next = [...prev];
                    next[questionIndex] = event.target.value;
                    return next;
                  })
                }
                rows={8}
                placeholder="Write your answer with assumptions, architecture, trade-offs, and bottlenecks."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={questionIndex === 0}
                  onClick={() =>
                    setQuestionIndex((value) => Math.max(0, value - 1))
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={questionIndex === QUESTIONS.length - 1}
                  onClick={() =>
                    setQuestionIndex((value) =>
                      Math.min(QUESTIONS.length - 1, value + 1)
                    )
                  }
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(true);
                    trackEvent("simulator_submit", {
                      answered: answers.filter((item) => item.trim().length > 0)
                        .length,
                    });
                  }}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
                >
                  Submit Session
                </button>
              </div>
            </section>
          )}

          {submitted && (
            <section className="content-card mt-4 p-4 sm:p-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Rubric Feedback
              </h2>
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                Overall Score:{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {totals.overall} / {totals.max}
                </span>
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  Structure: {totals.structure}
                </div>
                <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  Trade-offs: {totals.tradeoffs}
                </div>
                <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  Depth: {totals.depth}
                </div>
                <div className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">
                  Clarity: {totals.clarity}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStarted(false);
                  setSubmitted(false);
                  setTimeLeft(12 * 60);
                  setQuestionIndex(0);
                  setAnswers(["", "", ""]);
                  trackEvent("simulator_reset");
                }}
                className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                Start New Session
              </button>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
