"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Sidebar from "@/components/Sidebar";
import TopicDetail from "@/components/TopicDetail";
import MCQSection from "@/components/MCQSection";
import { normalizeTopics } from "@/lib/topicUtils";

function IconTrack() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-amber-700 dark:text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16M4 12h10M4 18h7" strokeLinecap="round" />
      <circle cx="18" cy="12" r="3" />
    </svg>
  );
}

function IconTopic() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  );
}

function IconQuiz() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 16v.01M10.2 9.6A2 2 0 1 1 13.8 11c-.9.5-1.3.9-1.3 2" strokeLinecap="round" />
    </svg>
  );
}

function IconNotes() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4h10l3 3v13H7z" />
      <path d="M17 4v4h4M10 11h7M10 15h7" strokeLinecap="round" />
    </svg>
  );
}

export default function InterviewTopicPage({
  title,
  description,
  topics,
  quiz,
}) {
  const normalizedTopics = useMemo(() => normalizeTopics(topics), [topics]);
  const [activeTopicId, setActiveTopicId] = useState(normalizedTopics[0]?.id);
  const [showMCQ, setShowMCQ] = useState(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

  const activeTopic =
    normalizedTopics.find((topic) => topic.id === activeTopicId) ?? null;

  useEffect(() => {
    const onScroll = () => {
      // Keep the header collapsed throughout content scrolling to avoid layout
      // jumps; only expand again when the page is back at the top.
      setIsHeaderCollapsed(window.scrollY > 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleTopicClick = (topicId) => {
    setActiveTopicId(topicId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-6 sm:py-8 lg:px-8">
          {!isHeaderCollapsed && <BackButton />}
          <section
            className={`hero-panel motion-card transition-all duration-300 ${
              isHeaderCollapsed
                ? "mb-0 max-h-0 overflow-hidden border-0 p-0 opacity-0"
                : "mb-5 max-h-[420px] opacity-100 sm:mb-8"
            }`}
            aria-hidden={isHeaderCollapsed}
          >
            <p className="eyebrow">Interview Track</p>
            <div className="mb-2 flex items-center gap-2">
              <IconTrack />
              <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Guided Practice
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-100">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-300">
              {description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              <span className="chip flex items-center gap-1.5">
                <IconTopic />
                {normalizedTopics.length} deep topics
              </span>
              <span className="chip flex items-center gap-1.5">
                <IconQuiz />
                {quiz?.length ?? 0} interview MCQs
              </span>
              <span className="chip flex items-center gap-1.5">
                <IconNotes />
                Structured answers and examples
              </span>
            </div>
          </section>

          <div className="motion-stagger grid items-start gap-3 sm:gap-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6">
            <Sidebar
              topics={normalizedTopics}
              activeId={activeTopic?.id}
              onTopicClick={handleTopicClick}
            />
            <main className="content-card motion-card min-w-0 p-4 sm:p-6 lg:p-8">
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
