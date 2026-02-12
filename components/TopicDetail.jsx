"use client";

function CodeBlock({ title, code, className = "" }) {
  if (!code) {
    return null;
  }

  return (
    <section className={`mb-8 min-w-0 ${className}`}>
      <h3 className="section-title mb-3">{title}</h3>
      <pre className="max-w-full overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-cyan-200 sm:p-4 sm:text-sm">
        <code>{code}</code>
      </pre>
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
    <article className="w-full min-w-0 max-w-4xl">
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
          <h3 className="section-title mb-2">Detailed Explanation</h3>
          <p className="whitespace-pre-line break-words text-slate-800 dark:text-slate-200">
            {topic.explanation}
          </p>
        </section>
      )}

      <CodeBlock title="Implementation" code={topic.implementation} />
      <CodeBlock title="Practical Example" code={topic.example} />

      {topic.useCase && (
        <section className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="section-title mb-2">When To Use This</h3>
          <p className="break-words text-slate-700 dark:text-slate-300">{topic.useCase}</p>
        </section>
      )}

      {topic.interviewQuestions?.length > 0 && (
        <section className="mb-4">
          <h3 className="section-title mb-3">Interview Questions and Answers</h3>
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
          <h3 className="section-title mb-3">Exercises</h3>
          <div className="space-y-3">
            {topic.exercises.map((item, index) => (
              <details
                key={`${topic.id}-exercise-${index}`}
                className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700"
              >
                <summary className="cursor-pointer break-words pr-1 font-semibold text-slate-900 dark:text-slate-100">
                  Exercise {index + 1}{" "}
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
        </section>
      )}

      {topic.programExercises?.length > 0 && (
        <section className="mt-8">
          <h3 className="section-title mb-3">Program Exercises</h3>
          <div className="space-y-3">
            {topic.programExercises.map((item, index) => (
              <details
                key={`${topic.id}-program-${index}`}
                className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700"
              >
                <summary className="cursor-pointer break-words pr-1 font-semibold text-slate-900 dark:text-slate-100">
                  Program {index + 1}
                </summary>
                <p className="mt-3 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {item.question}
                </p>
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
        </section>
      )}
    </article>
  );
}
