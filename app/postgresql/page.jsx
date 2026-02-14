"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { postgresqlData, postgresqlQuiz } from "@/data/postgresql";
import { useTopicDataFromContent } from "@/hooks/useTopicDataFromContent";

const POSTGRES_ENRICHED_QUIZ = [
  {
    question: "Which clause filters groups after aggregation?",
    options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
    correctAnswer: 1,
    explanation: "HAVING applies after GROUP BY aggregation.",
  },
  {
    question:
      "Output: `SELECT COUNT(*) FROM (SELECT 1 UNION SELECT 1) t;` returns?",
    options: ["1", "2", "0", "error"],
    correctAnswer: 0,
    explanation: "UNION removes duplicates, so only one row remains.",
  },
  {
    question:
      "Output: `SELECT COUNT(*) FROM (SELECT 1 UNION ALL SELECT 1) t;` returns?",
    options: ["1", "2", "0", "error"],
    correctAnswer: 1,
    explanation: "UNION ALL keeps duplicates.",
  },
  {
    question: "Which join returns unmatched rows from both tables?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    correctAnswer: 3,
    explanation:
      "FULL OUTER JOIN includes matched and unmatched rows from both sides.",
  },
  {
    question: "Why can `NOT IN (subquery)` be dangerous with NULLs?",
    options: [
      "It is always fast",
      "It can produce unknown/empty result unexpectedly",
      "It ignores indexes",
      "It is deprecated",
    ],
    correctAnswer: 1,
    explanation:
      "If subquery returns NULL, comparisons can evaluate to unknown; NOT EXISTS is usually safer.",
  },
  {
    question: "Best index type for JSONB containment (`@>`) queries?",
    options: ["B-tree", "Hash", "GIN", "BRIN"],
    correctAnswer: 2,
    explanation: "GIN is typically preferred for JSONB containment lookups.",
  },
  {
    question:
      "If query filters `WHERE customer_id=? ORDER BY created_at DESC`, best index is usually?",
    options: [
      "(created_at, customer_id)",
      "(customer_id, created_at DESC)",
      "(status)",
      "No index needed",
    ],
    correctAnswer: 1,
    explanation:
      "Match filter first then sort key to reduce sort work and improve index usage.",
  },
  {
    question:
      "Partition pruning mainly depends on predicate over which column?",
    options: [
      "Any selected column",
      "Partition key",
      "Primary key only",
      "Indexed column only",
    ],
    correctAnswer: 1,
    explanation:
      "Planner prunes partitions when conditions constrain partition key.",
  },
  {
    question: "What does `EXPLAIN ANALYZE` add over plain EXPLAIN?",
    options: [
      "Nothing",
      "Actual execution timing and row counts",
      "Automatic index creation",
      "Query rewrite only",
    ],
    correctAnswer: 1,
    explanation: "It executes the query and shows real runtime stats.",
  },
  {
    question: "Tricky: `LEFT JOIN b ... WHERE b.id IS NOT NULL` behaves like?",
    options: ["FULL JOIN", "CROSS JOIN", "INNER JOIN", "SELF JOIN"],
    correctAnswer: 2,
    explanation:
      "Filtering out NULL right rows effectively removes unmatched left rows, similar to INNER JOIN.",
  },
];

export default function PostgreSQLPage() {
  const { data, quiz, title, description, loading } = useTopicDataFromContent(
    "postgresql",
    postgresqlData,
    postgresqlQuiz,
    { fetchMode: "index" }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4">Loading PostgreSQL content...</p>
        </div>
      </div>
    );
  }

  const mergedQuiz = [...(quiz || [])];
  const seen = new Set(mergedQuiz.map((q) => q.question));
  for (const q of POSTGRES_ENRICHED_QUIZ) {
    if (!seen.has(q.question)) {
      mergedQuiz.push(q);
      seen.add(q.question);
    }
  }

  return (
    <InterviewTopicPage
      technology="postgresql"
      title={title || "PostgreSQL Interview Preparation"}
      description={
        description ||
        "Build confidence in SQL, indexing, optimization, transactions, and schema design with interview-ready explanations."
      }
      topics={data || []}
      quiz={mergedQuiz}
    />
  );
}
