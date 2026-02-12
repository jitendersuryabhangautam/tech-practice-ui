"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { dockerData, dockerQuiz } from "@/data/docker";

export default function DockerPage() {
  return (
    <InterviewTopicPage
      title="Docker Interview Preparation"
      description="Learn how to answer Docker interview questions on images, containers, networking, security, and debugging with real commands."
      topics={dockerData}
      quiz={dockerQuiz}
    />
  );
}
