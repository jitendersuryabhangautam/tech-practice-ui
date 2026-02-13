"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { useTopicData } from "@/hooks/useTopicData";
import { dockerData, dockerQuiz } from "@/data/docker";

export default function DockerPage() {
  // Try to load from JSON, fallback to JS imports
  const { data, quiz, loading } = useTopicData(
    "docker",
    dockerData,
    dockerQuiz
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading Docker content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InterviewTopicPage
      title="Docker Interview Preparation"
      description="Learn how to answer Docker interview questions on images, containers, networking, security, and debugging with real commands."
      topics={data}
      quiz={quiz}
    />
  );
}
