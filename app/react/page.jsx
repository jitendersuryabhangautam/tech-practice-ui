"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import reactContent from "@/public/data/react.json";

const MIN_INTERVIEW_QUESTIONS = 10;
const MIN_EXERCISES = 10;
const MIN_PROGRAM_EXERCISES = 10;

const REACT_ENRICHED_QUIZ = [
  {
    question:
      "Output: `setCount(count + 1); setCount(count + 1);` in one click (without functional update) typically results in?",
    options: ["+2", "+1", "no change", "error"],
    correctAnswer: 1,
    explanation:
      "Both updates may read same stale value in batched update. Functional update avoids this.",
  },
  {
    question: "Which is safest when next state depends on previous state?",
    options: [
      "setCount(count + 1)",
      "setCount(prev => prev + 1)",
      "count++",
      "setCount(++count)",
    ],
    correctAnswer: 1,
    explanation:
      "Functional update always uses latest queued state and avoids stale closures.",
  },
  {
    question:
      "Output: useEffect without dependency array runs when?",
    options: [
      "Only on mount",
      "Only on unmount",
      "After every render",
      "Only on prop change",
    ],
    correctAnswer: 2,
    explanation: "No dependency array means effect runs after each render.",
  },
  {
    question: "What is a common source of infinite render loops in useEffect?",
    options: [
      "Using JSX fragments",
      "Updating state inside effect with unstable dependencies",
      "Using React.memo",
      "Using useRef",
    ],
    correctAnswer: 1,
    explanation:
      "Effects rerun when dependencies change; unstable deps + state updates can loop.",
  },
  {
    question: "Which statement about `key` in list rendering is correct?",
    options: [
      "Index key is always best",
      "Stable unique key helps correct reconciliation",
      "Key is optional in all lists",
      "Key improves CSS performance only",
    ],
    correctAnswer: 1,
    explanation:
      "Stable unique keys help React map old/new elements correctly.",
  },
  {
    question:
      "Output: changing `useRef().current` causes re-render?",
    options: ["Always", "Never", "Only in StrictMode", "Only in production"],
    correctAnswer: 1,
    explanation: "Updating ref current does not trigger component re-render.",
  },
  {
    question: "What is best for expensive derived value computation?",
    options: ["useEffect", "useMemo", "useRef", "useLayoutEffect"],
    correctAnswer: 1,
    explanation:
      "useMemo memoizes expensive computed values based on dependencies.",
  },
  {
    question: "Which is true for controlled inputs?",
    options: [
      "DOM is source of truth",
      "React state is source of truth",
      "Cannot validate input",
      "Cannot reset form",
    ],
    correctAnswer: 1,
    explanation:
      "Controlled components bind value to state and update via onChange.",
  },
  {
    question: "When should `useCallback` be considered?",
    options: [
      "For every function",
      "When memoized children depend on stable callback identity",
      "Only for API calls",
      "Never",
    ],
    correctAnswer: 1,
    explanation:
      "useCallback helps avoid unnecessary renders when function identity matters.",
  },
  {
    question: "What does React StrictMode do in development?",
    options: [
      "Disables effects",
      "Adds extra checks and may double-invoke certain lifecycles",
      "Optimizes production build",
      "Removes warnings",
    ],
    correctAnswer: 1,
    explanation:
      "StrictMode intentionally surfaces side effects and unsafe patterns in dev.",
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
  const description = topic.description || "Explain this React concept clearly.";
  const useCase = topic.useCase || "Discuss a production use case.";
  const templates = [
    {
      question: `Interview Q${n}: Explain ${topic.title} in 60 seconds.`,
      answer: `${description} ${useCase}`,
    },
    {
      question: `Interview Q${n}: What mistakes do candidates make in ${topic.title}?`,
      answer:
        "Most candidates describe API surface but miss rendering behavior, dependency rules, and performance trade-offs.",
    },
    {
      question: `Interview Q${n}: How would you test ${topic.title} behavior?`,
      answer:
        "Use user-centric tests, assert visible output and behavior under edge cases.",
    },
    {
      question: `Interview Q${n}: What optimization concerns exist for ${topic.title}?`,
      answer:
        "Identify unnecessary renders, stale closures, heavy computations, and dependency drift.",
    },
  ];
  return templates[index % templates.length];
}

function fallbackExercise(topic, index) {
  const n = index + 1;
  const templates = [
    { type: "theory", question: `Exercise ${n}: Write theory notes for ${topic.title} with two pitfalls.` },
    { type: "implement", question: `Exercise ${n}: Build a small component demonstrating ${topic.title}.` },
    { type: "debug", question: `Exercise ${n}: Debug a buggy ${topic.title} snippet and explain root cause.` },
    { type: "output", question: `Exercise ${n}: Predict rendered output for a ${topic.title} code sample.` },
    { type: "tricky", question: `Exercise ${n}: Describe one tricky edge case in ${topic.title}.` },
  ];
  return templates[index % templates.length];
}

function fallbackProgram(topic, index) {
  const n = index + 1;
  return {
    question: `Program ${n}: Build a minimal React example for ${topic.title}.`,
    answer:
      "Keep component small, use one state/effect concern, and verify deterministic UI output.",
    code: `import { useState } from "react";

export default function Demo() {
  const [value, setValue] = useState(0);
  return (
    <button onClick={() => setValue((v) => v + 1)}>
      ${topic.title}: {value}
    </button>
  );
}`,
    output: `${topic.title}: increments on click`,
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

export default function ReactPage() {
  const enrichedTopics = (reactContent.topics || []).map(enrichTopic);
  const mergedQuiz = [...(reactContent.quiz || [])];
  const seen = new Set(mergedQuiz.map((q) => q.question));
  for (const q of REACT_ENRICHED_QUIZ) {
    if (!seen.has(q.question)) {
      mergedQuiz.push(q);
      seen.add(q.question);
    }
  }

  return (
    <InterviewTopicPage
      title={reactContent.title}
      description={reactContent.description}
      topics={enrichedTopics}
      quiz={mergedQuiz}
    />
  );
}
