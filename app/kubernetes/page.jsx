"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { kubernetesData, kubernetesQuiz } from "@/data/kubernetes";

export default function KubernetesPage() {
  return (
    <InterviewTopicPage
      title="Kubernetes Interview Preparation"
      description="Cover Kubernetes architecture, workloads, networking, and operational troubleshooting in an interview-first format."
      topics={kubernetesData}
      quiz={kubernetesQuiz}
    />
  );
}
