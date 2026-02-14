"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";
import { dockerData, dockerQuiz } from "@/data/docker";

export default function DockerPage() {
  // Load from granular content structure
  const { data, quiz, metadata, loading } = useTopicDataFromContent(
    "docker",
    dockerData,
    dockerQuiz,
    { fetchMode: "index" }
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
      technology="docker"
      title={metadata.title || "Docker Interview Preparation"}
      description={
        metadata.description ||
        "Learn how to answer Docker interview questions on images, containers, networking, security, and debugging with real commands."
      }
      topics={data}
      quiz={quiz}
    />
  );
}
