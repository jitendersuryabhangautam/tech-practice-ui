"use client";

import { useState } from "react";

export default function Card({ card }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg transition-all hover:shadow-xl sm:p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex justify-between items-start mb-3">
        <h3 className="min-w-0 break-words pr-2 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
          {card.title}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="mb-4 break-words text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {card.description}
      </p>

      {isExpanded && (
        <div className="space-y-4 mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
          {card.code && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                Code:
              </h4>
              <pre className="overflow-x-auto rounded border border-gray-300 bg-gray-100 p-3 text-sm dark:border-gray-600 dark:bg-gray-900 sm:p-4">
                <code className="text-green-700 dark:text-green-400">
                  {card.code}
                </code>
              </pre>
            </div>
          )}

          {card.command && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                Command:
              </h4>
              <pre className="overflow-x-auto rounded border border-gray-300 bg-gray-100 p-3 text-sm dark:border-gray-600 dark:bg-gray-900 sm:p-4">
                <code className="text-blue-700 dark:text-blue-400">
                  {card.command}
                </code>
              </pre>
            </div>
          )}

          {card.example && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                Example:
              </h4>
              <pre className="overflow-x-auto rounded border border-gray-300 bg-gray-100 p-3 text-sm dark:border-gray-600 dark:bg-gray-900 sm:p-4">
                <code className="text-yellow-700 dark:text-yellow-400">
                  {card.example}
                </code>
              </pre>
            </div>
          )}

          {card.useCase && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-2">
                Use Case:
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {card.useCase}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
