"use client";

import { useEffect, useState } from "react";

let mermaidLoaderPromise = null;

function loadMermaid() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  if (window.mermaid) {
    return Promise.resolve(window.mermaid);
  }

  if (mermaidLoaderPromise) {
    return mermaidLoaderPromise;
  }

  mermaidLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-mermaid-cdn='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.mermaid), {
        once: true,
      });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Mermaid script")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
    script.async = true;
    script.dataset.mermaidCdn = "true";
    script.onload = () => resolve(window.mermaid);
    script.onerror = () => reject(new Error("Failed to load Mermaid from CDN"));
    document.head.appendChild(script);
  });

  return mermaidLoaderPromise;
}

function isMermaidSyntax(content = "") {
  return /^\s*(erDiagram|graph|flowchart|sequenceDiagram|classDiagram)\b/m.test(
    content
  );
}

function IconBulb() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-700 dark:text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18h6M10 21h4M8 10a4 4 0 1 1 8 0c0 1.6-.7 2.5-1.6 3.4-.8.8-1.4 1.4-1.4 2.6h-2c0-1.2-.6-1.8-1.4-2.6C8.7 12.5 8 11.6 8 10z" strokeLinecap="round" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 9 5 12l3 3M16 9l3 3-3 3M13 7l-2 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconExercise() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h10l4 4v12H6z" />
      <path d="M16 4v4h4M9 13h8M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

function IconQuestion() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 16v.01M10.2 9.6A2 2 0 1 1 13.8 11c-.9.5-1.3.9-1.3 2" strokeLinecap="round" />
    </svg>
  );
}

function normalizeExerciseQuestion(question = "") {
  return String(question).replace(/^Exercise\s+\d+:\s*/i, "").trim();
}

function normalizeProgramQuestion(question = "") {
  return String(question).replace(/^Program\s+\d+:\s*/i, "").trim();
}

function CodeBlock({ title, code, className = "" }) {
  if (!code) {
    return null;
  }

  return (
    <section className={`mb-8 min-w-0 ${className}`}>
      <h3 className="section-title mb-3 flex items-center gap-2">
        <IconCode />
        {title}
      </h3>
      <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-cyan-200 sm:p-4 sm:text-sm">
        <code>{code}</code>
      </pre>
    </section>
  );
}

function MermaidDiagram({ title, definition }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        setError("");
        const mermaid = await loadMermaid();

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "default",
        });

        const renderId = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const result = await mermaid.render(renderId, definition);

        if (active) {
          setSvg(result.svg);
        }
      } catch (err) {
        if (active) {
          setSvg("");
          setError(err?.message || "Unable to render Mermaid diagram");
        }
      }
    }

    renderDiagram();
    return () => {
      active = false;
    };
  }, [definition]);

  return (
    <section className="mb-8 min-w-0">
      <h3 className="section-title mb-3 flex items-center gap-2">
        <IconCode />
        {title}
      </h3>
      {svg ? (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
          <div
            className="min-w-[720px]"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      ) : (
        <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-cyan-200 sm:p-4 sm:text-sm">
          <code>
            {error
              ? `${error}\n\nMermaid source:\n${definition}`
              : "Rendering diagram..."}
          </code>
        </pre>
      )}
    </section>
  );
}

export default function TopicDetail({ topic }) {
  if (!topic) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Select a topic to open a deep-dive interview guide.
      </div>
    );
  }

  return (
    <article className="motion-stagger w-full min-w-0 max-w-4xl">
      <header className="mb-6 sm:mb-8">
        <p className="eyebrow">{topic.category || "Core Concepts"}</p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          {topic.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700 sm:mt-3 sm:text-base sm:leading-7 dark:text-slate-300">
          {topic.description}
        </p>
      </header>

      {topic.explanation && (
        <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
          <h3 className="section-title mb-2 flex items-center gap-2">
            <IconBulb />
            Detailed Explanation
          </h3>
          <p className="whitespace-pre-line break-words text-slate-800 dark:text-slate-200">
            {topic.explanation}
          </p>
        </section>
      )}

      <CodeBlock title="Implementation" code={topic.implementation} />
      {isMermaidSyntax(topic.example) ? (
        <MermaidDiagram
          title="Relationship Diagram"
          definition={topic.example}
        />
      ) : (
        <CodeBlock title="Practical Example" code={topic.example} />
      )}

      {topic.useCase && (
        <section className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="section-title mb-2">When To Use This</h3>
          <p className="break-words text-slate-700 dark:text-slate-300">
            {topic.useCase}
          </p>
        </section>
      )}

      {topic.interviewQuestions?.length > 0 && (
        <section className="mb-4">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <IconQuestion />
            Interview Questions and Answers
          </h3>
          <div className="space-y-3">
            {topic.interviewQuestions.map((item, index) => (
              <div
                key={`${topic.id}-qa-${index}`}
                className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700"
              >
                <p className="break-words font-semibold text-slate-900 dark:text-slate-100">
                  Q{index + 1}. {item.question}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {topic.exercises?.length > 0 && (
        <section className="mt-8">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <IconExercise />
            Exercises
          </h3>
          <div className="space-y-6">
            {(() => {
              // Group exercises by topic
              const groupedExercises = topic.exercises.reduce(
                (acc, item, index) => {
                  const topicKey = item.topic || "General";
                  if (!acc[topicKey]) {
                    acc[topicKey] = [];
                  }
                  acc[topicKey].push({ ...item, originalIndex: index });
                  return acc;
                },
                {}
              );

              return Object.entries(groupedExercises).map(
                ([topicName, exercises], groupIndex) => (
                  <div key={`topic-group-${groupIndex}`} className="space-y-3">
                    {topicName !== "General" && (
                      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 pb-2 border-b-2 border-amber-400">
                        {topicName}
                      </h4>
                    )}
                    {exercises.map((item) => (
                      <details
                        key={`${topic.id}-exercise-${item.originalIndex}`}
                        className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700"
                      >
                        <summary className="cursor-pointer break-words pr-1 font-semibold text-slate-900 dark:text-slate-100">
                          Exercise {item.originalIndex + 1}:{" "}
                          {normalizeExerciseQuestion(item.question)}{" "}
                          <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {item.type || "practice"}
                          </span>
                        </summary>
                        <p className="mt-3 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                          {item.question}
                        </p>
                        {item.hint && (
                          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                            Hint: {item.hint}
                          </p>
                        )}
                        {item.answer && (
                          <p className="mt-3 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              Answer:
                            </span>{" "}
                            {item.answer}
                          </p>
                        )}
                        {item.code && (
                          <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-cyan-200">
                            <code>{item.code}</code>
                          </pre>
                        )}
                        {item.output && (
                          <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-200">
                            <code>{item.output}</code>
                          </pre>
                        )}
                      </details>
                    ))}
                  </div>
                )
              );
            })()}
          </div>
        </section>
      )}

      {topic.programExercises?.length > 0 && (
        <section className="mt-8">
          <h3 className="section-title mb-3">Program Exercises</h3>
          <div className="space-y-6">
            {(() => {
              const groupedPrograms = topic.programExercises.reduce(
                (acc, item, index) => {
                  const levelKey = item.level || "General";
                  if (!acc[levelKey]) {
                    acc[levelKey] = [];
                  }
                  acc[levelKey].push({ ...item, originalIndex: index });
                  return acc;
                },
                {}
              );

              const orderedLevels = ["Medium", "Hard", "Very Hard", "General"];
              const sortedEntries = Object.entries(groupedPrograms).sort(
                ([a], [b]) => {
                  const ia = orderedLevels.indexOf(a);
                  const ib = orderedLevels.indexOf(b);
                  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
                }
              );

              return sortedEntries.map(([level, items], groupIndex) => (
                <div key={`program-group-${groupIndex}`} className="space-y-3">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3 pb-2 border-b-2 border-sky-400">
                    {level}
                  </h4>
                  {items.map((item) => (
                    <details
                      key={`${topic.id}-program-${item.originalIndex}`}
                      className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700"
                    >
                      <summary className="cursor-pointer break-words pr-1 font-semibold text-slate-900 dark:text-slate-100">
                        Program {item.originalIndex + 1}:{" "}
                        {normalizeProgramQuestion(item.question)}
                        <span className="ml-2 rounded bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800 dark:bg-sky-900/40 dark:text-sky-300">
                          {item.level || "General"}
                        </span>
                      </summary>
                      {item.answer && (
                        <p className="mt-3 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            Approach:
                          </span>{" "}
                          {item.answer}
                        </p>
                      )}
                      {item.code && (
                        <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-cyan-200">
                          <code>{item.code}</code>
                        </pre>
                      )}
                      {item.output && (
                        <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-200">
                          <code>{item.output}</code>
                        </pre>
                      )}
                    </details>
                  ))}
                </div>
              ));
            })()}
          </div>
        </section>
      )}
    </article>
  );
}
