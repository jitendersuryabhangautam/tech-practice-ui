"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FreeModeBanner from "@/components/FreeModeBanner";
import MCQSection from "@/components/MCQSection";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";
import { javascriptData, javascriptQuiz } from "@/data/javascript";
import { reactData, reactQuiz } from "@/data/react";
import { nextjsData, nextjsQuiz } from "@/data/nextjs";
import { systemDesignData, systemDesignQuiz } from "@/data/system-design";
import { golangData, golangQuiz } from "@/data/golang";
import { postgresqlData, postgresqlQuiz } from "@/data/postgresql";
import { dockerData, dockerQuiz } from "@/data/docker";
import { kubernetesData, kubernetesQuiz } from "@/data/kubernetes";

const QUIZ_CONFIG = {
  javascript: { label: "JavaScript", data: javascriptData, quiz: javascriptQuiz },
  react: { label: "React", data: reactData, quiz: reactQuiz },
  nextjs: { label: "Next.js", data: nextjsData, quiz: nextjsQuiz },
  "system-design": {
    label: "System Design",
    data: systemDesignData,
    quiz: systemDesignQuiz,
  },
  golang: { label: "Golang", data: golangData, quiz: golangQuiz },
  postgresql: {
    label: "PostgreSQL",
    data: postgresqlData,
    quiz: postgresqlQuiz,
  },
  docker: { label: "Docker", data: dockerData, quiz: dockerQuiz },
  kubernetes: {
    label: "Kubernetes",
    data: kubernetesData,
    quiz: kubernetesQuiz,
  },
};

export default function QuizPage() {
  const [technology, setTechnology] = useState("system-design");
  const [isOpen, setIsOpen] = useState(true);
  const selected = QUIZ_CONFIG[technology];
  const { quiz, loading, error } = useTopicDataFromContent(
    technology,
    selected.data,
    selected.quiz
  );
  const currentQuiz = quiz || [];

  return (
    <>
      <Navbar />
      <main className="page-shell min-h-screen">
        <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
          <section className="hero-panel mb-5">
            <p className="eyebrow">Quiz Mode</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
              Standalone Interview Quiz
            </h1>
          </section>

          <FreeModeBanner queueDepth={0} quotaUsed={27} />

          <section className="content-card p-4 sm:p-6">
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Select technology
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(QUIZ_CONFIG).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTechnology(key);
                    setIsOpen(true);
                  }}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                    technology === key
                      ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"
                      : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {loading && (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Loading quiz from backend...
              </p>
            )}
            {error && (
              <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">
                {error}
              </p>
            )}
          </section>

          <MCQSection
            quiz={currentQuiz}
            isVisible={isOpen}
            onToggle={() => setIsOpen((value) => !value)}
          />
        </div>
      </main>
    </>
  );
}
