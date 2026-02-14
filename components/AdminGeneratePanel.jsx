"use client";

import { useCallback, useMemo, useState } from "react";
import { trackEvent } from "@/lib/userTracking";

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
  javascript: ["Core Concepts", "Async Patterns", "DOM and Browser", "Design Patterns", "ES6+ Features"],
  react: ["Hooks", "State Management", "Component Patterns", "Performance", "Testing"],
  nextjs: ["Routing", "Rendering", "Data Fetching", "API Routes", "Deployment"],
  "system-design": ["Foundation", "Company LLD", "Company HLD"],
  golang: ["Syntax", "Concurrency", "Data Structures", "Networking", "Testing"],
  postgresql: ["Queries", "Indexes", "Transactions", "Optimization", "Admin"],
  docker: ["Basics", "Dockerfile", "Compose", "Networking", "Security"],
  kubernetes: ["Workloads", "Services", "Storage", "Configuration", "Troubleshooting"],
};

const DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const WAIT_STEPS = [
  { label: "Queuing job", delay: 250 },
  { label: "Calling AI model (Gemini 2.0 Flash)", delay: 500 },
  { label: "Parsing response", delay: 250 },
  { label: "Validating schema (Zod)", delay: 250 },
  { label: "Storing in database", delay: 250 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function clampQuizCount(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 10;
  return Math.min(50, Math.max(5, Math.floor(n)));
}

function buildTopicPreview({ title, category, technologyLabel, difficultyLabel }) {
  const topicTitle = title.trim();
  const topicId = slugify(topicTitle || "generated-topic");

  return {
    contentType: "topic",
    id: topicId,
    title: topicTitle,
    category,
    description: `${topicTitle} in ${technologyLabel} (${difficultyLabel}) with interview-first explanations and practical scenarios.`,
    sections: [
      {
        key: "interviewQuestions",
        label: "Interview Questions",
        items: [
          { question: `What problem does ${topicTitle} solve?`, answer: "Explain the core goal and trade-offs." },
          { question: `When should you avoid ${topicTitle}?`, answer: "Discuss limits, complexity, and failure modes." },
          { question: `How do you validate ${topicTitle} in production?`, answer: "Use metrics, tests, and rollback strategy." },
        ],
      },
      {
        key: "exercises",
        label: "Exercises",
        items: [
          { question: `Write one practical exercise for ${topicTitle}.`, answer: "Build a small implementation with constraints." },
          { question: `Debug a broken ${topicTitle} flow.`, answer: "Identify root cause and provide a fix." },
        ],
      },
      {
        key: "programExercises",
        label: "Program Exercises",
        items: [
          { question: `Implement a minimal ${topicTitle} example.`, code: "// code sample", answer: "Explain key decisions." },
        ],
      },
    ],
  };
}

function buildQuizPreview({ technologyLabel, category, difficultyLabel, quizCount }) {
  const safeCount = clampQuizCount(quizCount);
  const title = `${technologyLabel} ${difficultyLabel} Quiz`;

  return {
    contentType: "quiz",
    id: slugify(`${technologyLabel}-${category}-${difficultyLabel}-quiz-${safeCount}`),
    title,
    category,
    description: `${safeCount} generated quiz questions for ${technologyLabel} in ${category} at ${difficultyLabel} difficulty.`,
    sections: [
      {
        key: "questions",
        label: "Quiz Questions",
        items: Array.from({ length: Math.min(safeCount, 5) }).map((_, idx) => ({
          question: `Question ${idx + 1}: Sample ${category} question for ${technologyLabel}`,
          answer: `Correct option rationale for question ${idx + 1}.`,
        })),
        totalCount: safeCount,
      },
    ],
  };
}

function StatusStep({ label, status }) {
  const icon =
    status === "done" ? (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">OK</span>
    ) : status === "active" ? (
      <span className="relative flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-5 w-5 rounded-full bg-amber-500" />
      </span>
    ) : status === "error" ? (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">X</span>
    ) : (
      <span className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
    );

  return (
    <div className="flex items-center gap-3">
      {icon}
      <p className={`text-sm font-medium ${status === "active" ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"}`}>{label}</p>
    </div>
  );
}

function ContentPreview({ content, onApprove, onReject, onRegenerate }) {
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{content.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{content.category}</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">{content.id}</span>
            <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">{content.contentType}</span>
          </div>
        </div>
        <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">Pending Review</span>
      </div>

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{content.description}</p>

      {content.sections.map((section) => {
        const count = section.totalCount || section.items.length;
        return (
          <div key={section.key} className="rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {section.label}
                <span className="ml-2 text-xs text-slate-400">({count})</span>
              </span>
              <span className={`text-slate-400 transition ${expandedSection === section.key ? "rotate-180" : ""}`}>v</span>
            </button>

            {expandedSection === section.key && (
              <div className="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
                {section.items.map((item, i) => (
                  <div key={`${section.key}-${i}`} className="mb-2 last:mb-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.question}</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{(item.answer || item.code || "").slice(0, 140)}...</p>
                  </div>
                ))}
                {count > section.items.length && (
                  <p className="mt-2 text-xs text-slate-400">+ {count - section.items.length} more...</p>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="button" onClick={onApprove} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">Approve and Publish</button>
        <button type="button" onClick={onReject} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">Reject</button>
        <button type="button" onClick={onRegenerate} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-500/10">Regenerate</button>
      </div>
    </div>
  );
}

export default function AdminGeneratePanel() {
  const [technology, setTechnology] = useState("javascript");
  const [topicTitle, setTopicTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES.javascript[0]);
  const [difficulty, setDifficulty] = useState("intermediate");
  const [genType, setGenType] = useState("topic");
  const [quizCount, setQuizCount] = useState(10);

  const [jobStatus, setJobStatus] = useState("idle");
  const [steps, setSteps] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const categories = CATEGORIES[technology] || [];
  const technologyLabel = TECHNOLOGIES.find((item) => item.value === technology)?.label || technology;
  const difficultyLabel = DIFFICULTIES.find((item) => item.value === difficulty)?.label || difficulty;

  const sanitizedQuizCount = clampQuizCount(quizCount);

  const validationError = useMemo(() => {
    if (!technology) return "Select a technology.";
    if (!category) return "Select a category.";
    if (genType === "topic") {
      const title = topicTitle.trim();
      if (title.length < 3) return "Topic title must be at least 3 characters.";
    }
    if (genType === "quiz" && (sanitizedQuizCount < 5 || sanitizedQuizCount > 50)) {
      return "Quiz count must be between 5 and 50.";
    }
    return "";
  }, [technology, category, genType, topicTitle, sanitizedQuizCount]);

  const canSubmit = !validationError && jobStatus !== "generating";

  const simulateGeneration = useCallback(async () => {
    if (validationError) {
      setError(validationError);
      return;
    }

    const safeQuizCount = clampQuizCount(quizCount);

    trackEvent("admin_generate", {
      genType,
      technology,
      category,
      difficulty,
      topicTitle: topicTitle.trim(),
      quizCount: safeQuizCount,
    });

    setJobStatus("generating");
    setError("");
    setPreview(null);

    const currentSteps = WAIT_STEPS.map((step, idx) => ({
      label: step.label,
      status: idx === 0 ? "active" : "pending",
    }));
    setSteps([...currentSteps]);

    for (let i = 0; i < WAIT_STEPS.length; i++) {
      currentSteps[i].status = "active";
      if (i > 0) currentSteps[i - 1].status = "done";
      setSteps([...currentSteps]);
      await sleep(WAIT_STEPS[i].delay);
    }

    currentSteps[currentSteps.length - 1].status = "done";
    setSteps([...currentSteps]);

    const nextPreview =
      genType === "topic"
        ? buildTopicPreview({
            title: topicTitle,
            category,
            technologyLabel,
            difficultyLabel,
          })
        : buildQuizPreview({
            technologyLabel,
            category,
            difficultyLabel,
            quizCount: safeQuizCount,
          });

    setPreview(nextPreview);
    setJobStatus("preview");

    trackEvent("admin_generate_preview", {
      genType,
      technology,
      category,
      previewId: nextPreview.id,
    });
  }, [validationError, quizCount, genType, technology, category, difficulty, topicTitle, technologyLabel, difficultyLabel]);

  const resetFlow = () => {
    setJobStatus("idle");
    setSteps([]);
    setPreview(null);
    setError("");
  };

  const handleApprove = () => {
    trackEvent("admin_approve_generated", {
      title: preview?.title || topicTitle.trim(),
      genType,
      technology,
      previewId: preview?.id,
    });

    setJobStatus("approved");
    setTimeout(() => {
      resetFlow();
      if (genType === "topic") {
        setTopicTitle("");
      }
    }, 1200);
  };

  const handleReject = () => {
    trackEvent("admin_reject_generated", {
      title: preview?.title || topicTitle.trim(),
      genType,
      technology,
      previewId: preview?.id,
    });
    resetFlow();
  };

  const handleTypeChange = (nextType) => {
    setGenType(nextType);
    resetFlow();
    setError("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Generate Content</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Generate topic content or quiz questions. Output is validated before publish.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {[{ value: "topic", label: "Topic Content" }, { value: "quiz", label: "Quiz Questions" }].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTypeChange(tab.value)}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Technology</label>
          <select
            value={technology}
            onChange={(e) => {
              const nextTech = e.target.value;
              setTechnology(nextTech);
              const nextCategories = CATEGORIES[nextTech] || [];
              setCategory(nextCategories[0] || "");
              resetFlow();
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
          >
            {TECHNOLOGIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              resetFlow();
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {genType === "topic" && (
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Topic Title</label>
            <input
              type="text"
              value={topicTitle}
              onChange={(e) => {
                setTopicTitle(e.target.value);
                resetFlow();
              }}
              placeholder="Example: Closures and Lexical Scope"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
            />
          </div>
        )}

        {genType === "quiz" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Number of Questions</label>
            <input
              type="number"
              min={5}
              max={50}
              value={sanitizedQuizCount}
              onChange={(e) => {
                setQuizCount(clampQuizCount(e.target.value));
                resetFlow();
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              resetFlow();
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-amber-500 dark:focus:ring-amber-500/20"
          >
            {DIFFICULTIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
      </div>

      {validationError && (
        <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{validationError}</p>
      )}

      <button
        type="button"
        onClick={simulateGeneration}
        disabled={!canSubmit}
        className="w-full rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-40 sm:w-auto dark:bg-amber-600 dark:hover:bg-amber-500"
      >
        {jobStatus === "generating" ? "Generating..." : `Generate ${genType === "topic" ? "Topic" : "Quiz"}`}
      </button>

      {steps.length > 0 && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Generation Progress</h4>
          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <StatusStep key={`${step.label}-${i}`} label={step.label} status={step.status} />
            ))}
          </div>
        </div>
      )}

      {jobStatus === "preview" && preview && (
        <ContentPreview content={preview} onApprove={handleApprove} onReject={handleReject} onRegenerate={simulateGeneration} />
      )}

      {jobStatus === "approved" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-900/20">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">OK</span>
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Content approved</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">It will be published in the next build cycle.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 dark:border-rose-800 dark:bg-rose-900/20">
          <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">X</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-800 dark:text-rose-300">Generation failed</p>
            <p className="mt-0.5 text-xs text-rose-600 dark:text-rose-400">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError("");
                simulateGeneration();
              }}
              className="mt-2 rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-600 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
