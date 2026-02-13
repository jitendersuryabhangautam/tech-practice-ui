"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";
import { kubernetesData, kubernetesQuiz } from "@/data/kubernetes";

export default function KubernetesPage() {
  const { data, quiz, metadata, loading } = useTopicDataFromContent(
    "kubernetes",
    kubernetesData,
    kubernetesQuiz
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading Kubernetes content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <InterviewTopicPage
      title={metadata.title || "Kubernetes Interview Preparation"}
      description={
        metadata.description ||
        "Master Kubernetes interview questions on Pods, Services, Deployments, ConfigMaps, Secrets, and kubectl commands with practical examples."
      }
      topics={data}
      quiz={quiz}
    />
  );
}
