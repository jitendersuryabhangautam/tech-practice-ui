"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";
import { systemDesignData, systemDesignQuiz } from "@/data/system-design";

export default function SystemDesignPage() {
  const { data, quiz, metadata, loading } = useTopicDataFromContent(
    "system-design",
    systemDesignData,
    systemDesignQuiz,
    { fetchMode: "index" }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading System Design content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InterviewTopicPage
      technology="system-design"
      title={metadata.title || "System Design Interview Preparation"}
      description={
        metadata.description ||
        "Master system design interviews with real-world architecture patterns, scalability concepts, and company-specific case studies."
      }
      topics={data}
      quiz={quiz}
    />
  );
}
