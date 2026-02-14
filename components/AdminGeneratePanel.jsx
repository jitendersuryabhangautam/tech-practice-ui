"use client";

import { useState, useCallback } from "react";
import { trackEvent } from "@/lib/userTracking";

// ── Mock data ───────────────────────────────────────────────────────────────
const TECHNOLOGIES = [
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "system-design", label: "System Design" },
  { value: "golang", label: "Golang" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
];

const CATEGORIES = {
  javascript: [
    "Core Concepts",
    "Async Patterns",
    "DOM & Browser",
    "Design Patterns",
    "ES6+ Features",
  ],
  react: [
    "Hooks",
    "State Management",
    "Component Patterns",
    "Performance",
    "Testing",
  ],
  nextjs: ["Routing", "Rendering", "Data Fetching", "API Routes", "Deployment"],
  "system-design": ["Foundation", "Company LLD", "Company HLD"],
  golang: ["Syntax", "Concurrency", "Data Structures", "Networking", "Testing"],
  postgresql: ["Queries", "Indexes", "Transactions", "Optimization", "Admin"],
  docker: ["Basics", "Dockerfile", "Compose", "Networking", "Security"],
  kubernetes: [
    "Workloads",
    "Services",
    "Storage",
    "Configuration",
    "Troubleshooting",
  ],
};

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const MOCK_GENERATED_PREVIEW = {
  id: "closures-and-scope",
  title: "Closures and Lexical Scope",
  category: "Core Concepts",
  description:
    "Understanding how JavaScript closures capture variables from their lexical scope, enabling powerful patterns like data privacy, factories, and memoization.",
  interviewQuestions: [
    {
      question: "What is a closure in JavaScript?",
      answer:
        "A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned...",
    },
    {
      question: "How does lexical scope differ from dynamic scope?",
      answer:
        "Lexical scope is determined at write-time based on where functions are declared...",
    },
    {
      question: "What are practical use cases for closures?",
      answer:
        "Data privacy (module pattern), function factories, memoization, event handlers...",
    },
  ],
  exercises: [
    {
      type: "conceptual",
      question: "Explain why closures can cause memory leaks...",
      answer: "Closures maintain references to outer scope variables...",
    },
    {
      type: "practical",
      question: "Create a counter using closures...",
      answer:
        "function createCounter() { let count = 0; return { increment: () => ++count }; }",
    },
  ],
  programExercises: [
    {
      question: "Implement a memoize function",
      code: "function memoize(fn) { const cache = new Map(); ... }",
      output: "fibonacci(10) // 55 (cached)",
    },
  ],
};

// ── Status Steps ────────────────────────────────────────────────────────────
function StatusStep({ label, status, detail }) {
  const icons = {
    pending: (
      <span className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
    ),
    active: (
      <span className="relative flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-5 w-5 rounded-full bg-amber-500" />
      </span>
    ),
    done: (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    ),
    error: (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    ),
  };

  return (
    <div className="flex items-center gap-3">
      {icons[status]}
      <div>
        <p
          className={`text-sm font-medium ${status === "active" ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}`}
        >
          {label}
        </p>
        {detail && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{detail}</p>
        )}
      </div>
    </div>
  );
}

// ── Content Preview ─────────────────────────────────────────────────────────
function ContentPreview({ content, onApprove, onReject, onRegenerate }) {
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {content.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {content.category}
            </span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
              {content.id}
            </span>
          </div>
        </div>
        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
          Pending Review
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {content.description}
      </p>

      {/* Expandable sections */}
      {[
        {
          key: "interviewQuestions",
          label: "Interview Questions",
          count: content.interviewQuestions?.length || 0,
        },
        {
          key: "exercises",
          label: "Exercises",
          count: content.exercises?.length || 0,
        },
        {
          key: "programExercises",
          label: "Program Exercises",
          count: content.programExercises?.length || 0,
        },
      ].map((section) => (
        <div
          key={section.key}
          className="rounded-lg border border-slate-200 dark:border-slate-700"
        >
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === section.key ? null : section.key
              )
            }
            className="flex w-full items-center justify-between px-4 py-2.5 text-left"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {section.label}
              <span className="ml-2 text-xs text-slate-400">
                ({section.count})
              </span>
            </span>
            <svg
              className={`h-4 w-4 text-slate-400 transition ${expandedSection === section.key ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSection === section.key && content[section.key] && (
            <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              {content[section.key].slice(0, 3).map((item, i) => (
                <div key={i} className="mb-2 last:mb-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {item.question}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {(item.answer || item.code || "").slice(0, 120)}...
                  </p>
                </div>
              ))}
              {(content[section.key]?.length || 0) > 3 && (
                <p className="mt-2 text-xs text-slate-400">
                  + {content[section.key].length - 3} more...
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onApprove}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Approve & Publish
        </button>
        <button
          onClick={onReject}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Reject
        </button>
        <button
          onClick={onRegenerate}
          className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-500/10"
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function AdminGeneratePanel() {
  const [technology, setTechnology] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [genType, setGenType] = useState("topic"); // "topic" | "quiz"
  const [quizCount, setQuizCount] = useState(10);

  const [jobStatus, setJobStatus] = useState("idle"); // idle | generating | preview | approved | error
  const [steps, setSteps] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const categories = CATEGORIES[technology] || [];

  const canSubmit = technology && (genType === "quiz" || topicTitle.trim());

  const simulateGeneration = useCallback(async () => {
    trackEvent("admin_generate", {
      genType,
      technology,
      category,
      difficulty,
      topicTitle,
      quizCount,
    });
    setJobStatus("generating");
    setError(null);
    setPreview(null);

    const jobSteps = [
      { label: "Queuing job...", delay: 400 },
      { label: "Calling AI model (Gemini 2.0 Flash)", delay: 1500 },
      { label: "Parsing response...", delay: 600 },
      { label: "Validating schema (Zod)", delay: 500 },
      { label: "Storing in database", delay: 400 },
    ];

    const currentSteps = jobSteps.map((s, i) => ({
      label: s.label,
      status: i === 0 ? "active" : "pending",
    }));
    setSteps([...currentSteps]);

    for (let i = 0; i < jobSteps.length; i++) {
      currentSteps[i].status = "active";
      if (i > 0) currentSteps[i - 1].status = "done";
      setSteps([...currentSteps]);
      await new Promise((r) => setTimeout(r, jobSteps[i].delay));
    }

    // Simulate occasional failures (~20% chance) to exercise error UI
    if (Math.random() < 0.2) {
      currentSteps[currentSteps.length - 1].status = "error";
      setSteps([...currentSteps]);
      setError(
        "AI model returned an invalid response. Schema validation failed on field 'interviewQuestions'. Please try again."
      );
      trackEvent("admin_generate_failed", { genType, technology, topicTitle });
      setJobStatus("error");
      return;
    }

    currentSteps[currentSteps.length - 1].status = "done";
    setSteps([...currentSteps]);

    // Show preview with mock data
    setPreview({
      ...MOCK_GENERATED_PREVIEW,
      title: topicTitle || "Generated Quiz Questions",
      category: category || "General",
    });
    trackEvent("admin_generate_preview", { genType, technology, topicTitle });
    setJobStatus("preview");
  }, [topicTitle, category, genType, technology, difficulty, quizCount]);

  const handleApprove = () => {
    trackEvent("admin_approve_generated", {
      title: preview?.title || topicTitle,
      genType,
      technology,
    });
    setJobStatus("approved");
    setTimeout(() => {
      setJobStatus("idle");
      setSteps([]);
      setPreview(null);
      setTopicTitle("");
    }, 2000);
  };

  const handleReject = () => {
    trackEvent("admin_reject_generated", {
      title: preview?.title || topicTitle,
      genType,
      technology,
    });
    setJobStatus("idle");
    setSteps([]);
    setPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Generate Content
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Use AI to generate topic content or quiz questions. Content goes
          through review before publishing.
        </p>
      </div>

      {/* Type tabs */}
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {[
          { value: "topic", label: "Topic Content" },
          { value: "quiz", label: "Quiz Questions" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setGenType(tab.value)}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition ${
              genType === tab.value
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Technology */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Technology
          </label>
          <select
            value={technology}
            onChange={(e) => {
              setTechnology(e.target.value);
              setCategory("");
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
          >
            <option value="">Select technology...</option>
            {TECHNOLOGIES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={!technology}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
          >
            <option value="">Select category...</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Topic title (only for topic generation) */}
        {genType === "topic" && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Topic Title
            </label>
            <input
              type="text"
              value={topicTitle}
              onChange={(e) => setTopicTitle(e.target.value)}
              placeholder="e.g., Closures and Lexical Scope"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
            />
          </div>
        )}

        {/* Quiz count (only for quiz generation) */}
        {genType === "quiz" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Number of Questions
            </label>
            <input
              type="number"
              min={5}
              max={50}
              value={quizCount}
              onChange={(e) => setQuizCount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
            />
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={simulateGeneration}
        disabled={!canSubmit || jobStatus === "generating"}
        className="w-full rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-40 sm:w-auto dark:bg-amber-600 dark:hover:bg-amber-500"
      >
        {jobStatus === "generating" ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating...
          </span>
        ) : (
          `Generate ${genType === "topic" ? "Topic" : "Quiz"}`
        )}
      </button>

      {/* Progress steps */}
      {steps.length > 0 && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Generation Progress
          </h4>
          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <StatusStep key={i} label={step.label} status={step.status} />
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {jobStatus === "preview" && preview && (
        <ContentPreview
          content={preview}
          onApprove={handleApprove}
          onReject={handleReject}
          onRegenerate={simulateGeneration}
        />
      )}

      {/* Approved confirmation */}
      {jobStatus === "approved" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Content approved!
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              It will be published in the next build cycle.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {jobStatus === "error" && error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 dark:border-rose-800 dark:bg-rose-900/20">
          <svg
            viewBox="0 0 24 24"
            className="mt-0.5 h-6 w-6 shrink-0 text-rose-600 dark:text-rose-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">
              Generation failed
            </p>
            <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={() => { setError(null); simulateGeneration(); }}
              className="mt-2 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-600 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              Retry Generation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
