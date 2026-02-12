"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import javascriptContent from "@/public/data/javascript.json";

export default function JavaScriptPage() {
  return (
    <InterviewTopicPage
      title={javascriptContent.title}
      description={javascriptContent.description}
      topics={javascriptContent.topics}
      quiz={javascriptContent.quiz}
    />
  );
}
