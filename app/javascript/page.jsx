"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import javascriptContent from "@/public/data/javascript.json";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";

export default function JavaScriptPage() {
  const { data, quiz, title, description, loading } = useTopicDataFromContent(
    "javascript",
    javascriptContent.topics,
    javascriptContent.quiz
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading JavaScript content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InterviewTopicPage
      title={title || javascriptContent.title}
      description={description || javascriptContent.description}
      topics={data}
      quiz={quiz}
    />
  );
}
