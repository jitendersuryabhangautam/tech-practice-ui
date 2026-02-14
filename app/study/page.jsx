"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import MCQSection from "@/components/MCQSection";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";
import { normalizeTopics } from "@/lib/topicUtils";
import { javascriptData, javascriptQuiz } from "@/data/javascript";
import { reactData, reactQuiz } from "@/data/react";
import { nextjsData, nextjsQuiz } from "@/data/nextjs";
import { systemDesignData, systemDesignQuiz } from "@/data/system-design";
import { golangData, golangQuiz } from "@/data/golang";
import { postgresqlData, postgresqlQuiz } from "@/data/postgresql";
import { dockerData, dockerQuiz } from "@/data/docker";
import { kubernetesData, kubernetesQuiz } from "@/data/kubernetes";

const TECH_CONFIG = {
  javascript: {
    label: "JavaScript",
    fallbackData: javascriptData,
    fallbackQuiz: javascriptQuiz,
  },
  react: { label: "React", fallbackData: reactData, fallbackQuiz: reactQuiz },
  nextjs: {
    label: "Next.js",
    fallbackData: nextjsData,
    fallbackQuiz: nextjsQuiz,
  },
  "system-design": {
    label: "System Design",
    fallbackData: systemDesignData,
    fallbackQuiz: systemDesignQuiz,
  },
  golang: { label: "Golang", fallbackData: golangData, fallbackQuiz: golangQuiz },
  postgresql: {
    label: "PostgreSQL",
    fallbackData: postgresqlData,
    fallbackQuiz: postgresqlQuiz,
  },
  docker: { label: "Docker", fallbackData: dockerData, fallbackQuiz: dockerQuiz },
  kubernetes: {
    label: "Kubernetes",
    fallbackData: kubernetesData,
    fallbackQuiz: kubernetesQuiz,
  },
};

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

export default function StudyPage() {
  const [technology, setTechnology] = useState("system-design");
  const [activeTopicId, setActiveTopicId] = useState("");
  const [showMCQ, setShowMCQ] = useState(false);
  const selectedTech = TECH_CONFIG[technology];

  const { data, quiz, metadata, loading } = useTopicDataFromContent(
    technology,
    selectedTech.fallbackData,
    selectedTech.fallbackQuiz
  );

  const topics = useMemo(() => normalizeTopics(data), [data]);

  useEffect(() => {
    if (!topics.length) return;
    if (!topics.find((topic) => topic.id === activeTopicId)) {
      setActiveTopicId(topics[0].id);
    }
  }, [topics, activeTopicId]);

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) || null;

  const questionCount = activeTopic?.interviewQuestions?.length || 0;
  const exerciseCount = activeTopic?.exercises?.length || 0;
  const programCount = activeTopic?.programExercises?.length || 0;

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Study Mode</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Unified Interview Study Flow
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base dark:text-slate-300">
              Review all interview questions, exercises, and code tasks for one
              topic at a time, then run a focused MCQ drill.
            </p>
          </section>

          <FreeModeBanner queueDepth={1} quotaUsed={34} />

          <section className="content-card mb-4 p-4 sm:p-6">
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              Choose technology
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TECH_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTechnology(key);
                    setShowMCQ(false);
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    technology === key
                      ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </section>

          {loading ? (
            <section className="content-card p-6 text-sm text-slate-600 dark:text-slate-300">
              Loading {selectedTech.label} study content...
            </section>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="content-card p-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Topics
                </h2>
                <div className="mt-3 space-y-2">
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setActiveTopicId(topic.id)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                        topic.id === activeTopicId
                          ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <p className="font-semibold">{topic.title}</p>
                      <p className="mt-1 text-xs opacity-80">{topic.category}</p>
                    </button>
                  ))}
                </div>
              </aside>

              <section className="content-card p-4 sm:p-6">
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {metadata.title || selectedTech.label}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {activeTopic?.title || "Select a topic"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {activeTopic?.description || "No topic selected."}
                  </p>
                </div>

                <div className="mb-4 grid gap-2 sm:grid-cols-3">
                  <StatCard label="Interview Qs" value={questionCount} />
                  <StatCard label="Exercises" value={exerciseCount} />
                  <StatCard label="Program Qs" value={programCount} />
                </div>

                <div className="space-y-4">
                  <article className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Interview Questions
                    </h3>
                    <div className="mt-3 space-y-3">
                      {activeTopic?.interviewQuestions?.map((item, index) => (
                        <details
                          key={`${item.question}-${index}`}
                          className="rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700"
                        >
                          <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {index + 1}. {item.question}
                          </summary>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {item.answer}
                          </p>
                        </details>
                      )) || (
                        <p className="text-sm text-slate-500">No interview questions.</p>
                      )}
                    </div>
                  </article>

                  <article className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Exercises
                    </h3>
                    <div className="mt-3 space-y-3">
                      {activeTopic?.exercises?.map((item, index) => (
                        <details
                          key={`${item.question}-${index}`}
                          className="rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700"
                        >
                          <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {index + 1}. {item.question}
                          </summary>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {item.type || "General"}
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {item.answer}
                          </p>
                        </details>
                      )) || <p className="text-sm text-slate-500">No exercises.</p>}
                    </div>
                  </article>

                  <article className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Program Exercises
                    </h3>
                    <div className="mt-3 space-y-3">
                      {activeTopic?.programExercises?.map((item, index) => (
                        <details
                          key={`${item.question}-${index}`}
                          className="rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700"
                        >
                          <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {index + 1}. {item.question}
                          </summary>
                          {item.code && (
                            <pre className="mt-2 overflow-x-auto rounded-md bg-slate-100 p-3 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                              {item.code}
                            </pre>
                          )}
                          {item.output && (
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              Expected: {item.output}
                            </p>
                          )}
                        </details>
                      )) || (
                        <p className="text-sm text-slate-500">No program exercises.</p>
                      )}
                    </div>
                  </article>
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowMCQ((value) => !value)}
                    className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400"
                  >
                    {showMCQ ? "Hide MCQ Drill" : "Start MCQ Drill"}
                  </button>
                </div>
              </section>
            </div>
          )}

          <MCQSection
            quiz={quiz}
            isVisible={showMCQ}
            onToggle={() => setShowMCQ((value) => !value)}
          />
        </div>
      </main>
    </>
  );
}
