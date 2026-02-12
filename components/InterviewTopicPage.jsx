"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Sidebar from "@/components/Sidebar";
import TopicDetail from "@/components/TopicDetail";
import MCQSection from "@/components/MCQSection";
import { normalizeTopics } from "@/lib/topicUtils";

export default function InterviewTopicPage({
  title,
  description,
  topics,
  quiz,
}) {
  const normalizedTopics = useMemo(() => normalizeTopics(topics), [topics]);
  const [activeTopicId, setActiveTopicId] = useState(normalizedTopics[0]?.id);
  const [showMCQ, setShowMCQ] = useState(false);

  const activeTopic =
    normalizedTopics.find((topic) => topic.id === activeTopicId) ?? null;

  const handleTopicClick = (topicId) => {
    setActiveTopicId(topicId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
          <BackButton />
          <section className="hero-panel mb-5 sm:mb-8">
            <p className="eyebrow">Interview Track</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-100">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-300">
              {description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              <span className="chip">{normalizedTopics.length} deep topics</span>
              <span className="chip">{quiz?.length ?? 0} interview MCQs</span>
              <span className="chip">Structured answers and examples</span>
            </div>
          </section>

          <div className="grid items-start gap-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6">
            <Sidebar
              topics={normalizedTopics}
              activeId={activeTopic?.id}
              onTopicClick={handleTopicClick}
            />
            <main className="content-card min-w-0 p-4 sm:p-6 lg:p-8">
              <TopicDetail topic={activeTopic} />
            </main>
          </div>

          <MCQSection
            quiz={quiz}
            isVisible={showMCQ}
            onToggle={() => setShowMCQ((value) => !value)}
          />
        </div>
      </div>
    </>
  );
}
