"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { nextjsData, nextjsQuiz } from "@/data/nextjs";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";

const MIN_INTERVIEW_QUESTIONS = 10;
const MIN_EXERCISES = 10;
const MIN_PROGRAM_EXERCISES = 10;

const NEXTJS_ENRICHED_QUIZ = [
  {
    question: "Which file convention creates dynamic segment in App Router?",
    options: ["{id}", "(id)", "[id]", ":id"],
    correctAnswer: 2,
    explanation: "Use folder names like `[id]` for dynamic segments.",
  },
  {
    question: "Output behavior: `cache: 'no-store'` in fetch implies?",
    options: [
      "Build-time static cache",
      "Always fresh data, no cache reuse",
      "Only browser cache",
      "Compile-time error",
    ],
    correctAnswer: 1,
    explanation: "no-store disables caching for that request.",
  },
  {
    question: "Which is true for Server Components?",
    options: [
      "Can use useState directly",
      "Can access browser localStorage",
      "Run on server and reduce client JS",
      "Must include 'use client'",
    ],
    correctAnswer: 2,
    explanation:
      "Server Components execute on server and can reduce bundle size.",
  },
  {
    question: "When should `dynamic = 'force-dynamic'` be used?",
    options: [
      "For static docs only",
      "When route must render fresh on each request",
      "For image optimization",
      "For middleware only",
    ],
    correctAnswer: 1,
    explanation: "Force-dynamic opts route into per-request rendering.",
  },
  {
    question: "What does `revalidatePath('/posts')` do?",
    options: [
      "Delete route",
      "Invalidate cached data for that path",
      "Add new route",
      "Restart server",
    ],
    correctAnswer: 1,
    explanation: "It triggers on-demand revalidation for the route path.",
  },
  {
    question: "Best reason to use Route Handlers?",
    options: [
      "To write CSS",
      "To implement API endpoints under `app/api/...`",
      "To render React hooks",
      "To replace layouts",
    ],
    correctAnswer: 1,
    explanation: "Route Handlers are API endpoints in App Router.",
  },
  {
    question: "Output-oriented: `generateStaticParams` mainly helps with?",
    options: [
      "Runtime redirects",
      "Pre-rendering dynamic routes at build time",
      "Client-side state",
      "CSS loading",
    ],
    correctAnswer: 1,
    explanation: "It supplies params for static generation.",
  },
  {
    question: "What does `'use client'` mark?",
    options: [
      "Entire project as CSR",
      "Boundary where component must run on client",
      "Server action",
      "API route file",
    ],
    correctAnswer: 1,
    explanation: "It defines the client component boundary in App Router.",
  },
  {
    question:
      "Which strategy is best for frequently changing personalized data?",
    options: [
      "SSG",
      "ISR with long interval",
      "SSR/dynamic rendering",
      "Static export",
    ],
    correctAnswer: 2,
    explanation:
      "Personalized frequently changing data should be rendered dynamically.",
  },
  {
    question: "What is a strong middleware use case?",
    options: [
      "Heavy DB aggregation",
      "Auth checks and redirects before route handling",
      "Rendering large tables",
      "Running React hooks",
    ],
    correctAnswer: 1,
    explanation: "Middleware is good for lightweight request pre-processing.",
  },
];

function ensureMinimum(items, min, createItem) {
  const result = Array.isArray(items) ? [...items] : [];
  while (result.length < min) {
    result.push(createItem(result.length));
  }
  return result;
}

function fallbackInterviewQuestion(topic, index) {
  const n = index + 1;
  const description = topic.description || "Explain this Next.js concept.";
  const useCase = topic.useCase || "Describe production usage and trade-offs.";
  const templates = [
    {
      question: `Interview Q${n}: Explain ${topic.title} for a backend/fullstack interview.`,
      answer: `${description} ${useCase}`,
    },
    {
      question: `Interview Q${n}: What mistakes happen in ${topic.title} implementations?`,
      answer:
        "Common issues include wrong rendering strategy, stale cache assumptions, and missing invalidation/cancellation paths.",
    },
    {
      question: `Interview Q${n}: How do you test ${topic.title} behavior?`,
      answer:
        "Validate route behavior, status/headers, cache behavior, and integration boundaries with deterministic test inputs.",
    },
    {
      question: `Interview Q${n}: What performance considerations matter in ${topic.title}?`,
      answer:
        "Consider TTFB, cache hit ratio, hydration cost, and server/client boundary correctness.",
    },
  ];
  return templates[index % templates.length];
}

function fallbackExercise(topic, index) {
  const n = index + 1;
  const templates = [
    {
      type: "theory",
      question: `Exercise ${n}: Summarize ${topic.title} with pros, cons, and when-not-to-use.`,
    },
    {
      type: "implement",
      question: `Exercise ${n}: Build a minimal Next.js feature demonstrating ${topic.title}.`,
    },
    {
      type: "debug",
      question: `Exercise ${n}: Debug a broken ${topic.title} flow and identify root cause.`,
    },
    {
      type: "output",
      question: `Exercise ${n}: Predict result/status for a ${topic.title} scenario.`,
    },
    {
      type: "tricky",
      question: `Exercise ${n}: Describe one tricky edge case in ${topic.title}.`,
    },
  ];
  return templates[index % templates.length];
}

function fallbackProgram(topic, index) {
  const n = index + 1;
  return {
    question: `Program ${n}: Create a minimal Next.js snippet for ${topic.title}.`,
    answer:
      "Implement smallest reproducible version, keep route/component boundaries explicit.",
    code: `export default async function DemoPage() {
  return <div>${topic.title} demo ${n}</div>;
}`,
    output: `${topic.title} demo ${n}`,
  };
}

function enrichTopic(topic) {
  return {
    ...topic,
    interviewQuestions: ensureMinimum(
      topic.interviewQuestions,
      MIN_INTERVIEW_QUESTIONS,
      (index) => fallbackInterviewQuestion(topic, index)
    ),
    exercises: ensureMinimum(topic.exercises, MIN_EXERCISES, (index) =>
      fallbackExercise(topic, index)
    ),
    programExercises: ensureMinimum(
      topic.programExercises,
      MIN_PROGRAM_EXERCISES,
      (index) => fallbackProgram(topic, index)
    ),
  };
}

export default function NextJSPage() {
  const { data, quiz, title, description, loading } = useTopicDataFromContent(
    "nextjs",
    nextjsData,
    nextjsQuiz,
    { fetchMode: "index" }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading Next.js content...
          </p>
        </div>
      </div>
    );
  }

  const enrichedTopics = (data || []).map((section) => ({
    ...section,
    topics: (section.topics || []).map(enrichTopic),
  }));
  const mergedQuiz = [...(quiz || [])];
  const seen = new Set(mergedQuiz.map((q) => q.question));
  for (const q of NEXTJS_ENRICHED_QUIZ) {
    if (!seen.has(q.question)) {
      mergedQuiz.push(q);
      seen.add(q.question);
    }
  }

  return (
    <InterviewTopicPage
      technology="nextjs"
      title={title || "Next.js Interview Preparation"}
      description={
        description ||
        "Master App Router, rendering strategies, caching, APIs, and production patterns asked in modern interviews."
      }
      topics={enrichedTopics}
      quiz={mergedQuiz}
    />
  );
}
