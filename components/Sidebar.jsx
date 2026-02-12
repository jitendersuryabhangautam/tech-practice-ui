"use client";

import { useMemo, useState } from "react";

export default function Sidebar({ topics, activeId, onTopicClick }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const groupedTopics = useMemo(() => {
    const filtered = topics.filter((topic) =>
      `${topic.title} ${topic.description}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    return filtered.reduce((acc, topic) => {
      const key = topic.category || "Core Concepts";
      acc[key] = acc[key] || [];
      acc[key].push(topic);
      return acc;
    }, {});
  }, [topics, query]);

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="content-card mb-3 flex w-full items-center justify-between px-4 py-3 text-left lg:hidden"
      >
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Topic Navigator
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {topics.length} topics
        </span>
      </button>

      {isOpen && (
        <button
          type="button"
          aria-label="Close topic navigator"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/45 lg:hidden"
        />
      )}

      <aside
        className={`content-card overflow-hidden lg:sticky lg:top-24 lg:h-[calc(100vh-210px)] ${
          isOpen
            ? "fixed inset-x-2 top-20 bottom-2 z-30 lg:static"
            : "hidden lg:block"
        }`}
      >
        <div className="border-b border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
                Topic Navigator
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Pick one concept and master it deeply
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Close
            </button>
          </div>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics"
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="h-[calc(100%-126px)] overflow-y-auto p-3">
          {Object.entries(groupedTopics).map(([category, items]) => (
            <section key={category} className="mb-4">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {category}
              </p>
              <div className="space-y-1">
                {items.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      onTopicClick(topic.id);
                      closeOnMobile();
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      activeId === topic.id
                        ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {topic.title}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  );
}
