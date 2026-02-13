"use client";

import { useEffect, useMemo, useState } from "react";

function CategoryIcon({ category }) {
  const key = (category || "").toLowerCase();
  if (key.includes("complete")) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5v14" strokeLinecap="round" />
      </svg>
    );
  }
  if (key.includes("performance")) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 18h16M7 18v-5m5 5V8m5 10v-8" strokeLinecap="round" />
      </svg>
    );
  }
  if (key.includes("core")) {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M8 10h8M8 14h6" strokeLinecap="round" />
    </svg>
  );
}

export default function Sidebar({ topics, activeId, onTopicClick }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [collapsedByCategory, setCollapsedByCategory] = useState({});

  const groupedTopicEntries = useMemo(() => {
    const filtered = topics.filter((topic) =>
      `${topic.title} ${topic.description}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    const grouped = filtered.reduce((acc, topic) => {
      const key = topic.category || "Core Concepts";
      acc[key] = acc[key] || [];
      acc[key].push(topic);
      return acc;
    }, {});

    return Object.entries(grouped);
  }, [topics, query]);

  useEffect(() => {
    if (!groupedTopicEntries.length) return;

    setCollapsedByCategory((prev) => {
      const next = { ...prev };
      groupedTopicEntries.forEach(([category]) => {
        if (typeof next[category] !== "boolean") {
          next[category] = false;
        }
      });
      return next;
    });
  }, [groupedTopicEntries]);

  const activeIndex = Math.max(
    topics.findIndex((topic) => topic.id === activeId),
    0
  );
  const activeTopic = topics[activeIndex];

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const toggleCategory = (category) => {
    setCollapsedByCategory((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="content-card mb-3 flex w-full items-center justify-between gap-2 px-4 py-3 text-left lg:hidden"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {activeTopic?.title || "Topic Navigator"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeIndex + 1} / {topics.length} topics
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          Open
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
          {activeTopic && (
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              Current: <span className="font-semibold">{activeTopic.title}</span>
            </p>
          )}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search topics"
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-2 focus:ring-2 focus:ring-amber-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="h-[calc(100%-156px)] overflow-y-auto p-3">
          {!groupedTopicEntries.length && (
            <p className="rounded-lg border border-dashed border-slate-300 p-3 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
              No topics found for this search.
            </p>
          )}

          {groupedTopicEntries.map(([category, items]) => {
            const isCollapsed = !!collapsedByCategory[category];

            return (
              <section key={category} className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="mb-2 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <span className="flex items-center gap-1.5">
                    <CategoryIcon category={category} />
                    {category}
                  </span>
                  <span>{isCollapsed ? "+" : "-"}</span>
                </button>

                {!isCollapsed && (
                  <div className="space-y-1">
                    {items.map((topic) => (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => {
                          onTopicClick(topic.id);
                          closeOnMobile();
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          activeId === topic.id
                            ? "border-amber-300 bg-amber-100 font-semibold text-amber-900 dark:border-amber-500/50 dark:bg-amber-500/20 dark:text-amber-200"
                            : "border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-100 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                        }`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </aside>
    </>
  );
}
