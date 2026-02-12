"use client";

import InterviewTopicPage from "@/components/InterviewTopicPage";
import { postgresqlData, postgresqlQuiz } from "@/data/postgresql";

const MIN_INTERVIEW_QUESTIONS = 10;
const MIN_EXERCISES = 10;
const MIN_PROGRAM_EXERCISES = 10;

const POSTGRES_ADVANCED_TOPICS = [
  {
    category: "Advanced SQL (E-commerce Scenario)",
    topics: [
      {
        id: "ecommerce-query-patterns",
        title: "All Query Types in One Scenario",
        description:
          "Learn SELECT, filtering, grouping, HAVING, subqueries, CTEs, window functions, and set operations using an e-commerce schema.",
        explanation:
          "Assume this schema: customers(id, city), orders(id, customer_id, status, created_at), order_items(order_id, product_id, qty, unit_price), products(id, category, price). Interviewers usually test if you can move from simple filters to business-ready reporting queries. The key is choosing the right pattern: WHERE for row filtering, HAVING for group filtering, CTE for readability, window functions for ranking/running totals, and EXISTS for existence checks.",
        code: `-- Core examples on one schema
-- 1) Daily revenue
SELECT DATE(o.created_at) AS order_day,
       SUM(oi.qty * oi.unit_price) AS revenue
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY DATE(o.created_at)
ORDER BY order_day DESC;

-- 2) Customers with at least 3 completed orders
SELECT o.customer_id, COUNT(*) AS completed_orders
FROM orders o
WHERE o.status = 'completed'
GROUP BY o.customer_id
HAVING COUNT(*) >= 3;

-- 3) Top product per category using window function
WITH product_sales AS (
  SELECT p.category, p.id AS product_id, SUM(oi.qty) AS units
  FROM products p
  JOIN order_items oi ON oi.product_id = p.id
  GROUP BY p.category, p.id
)
SELECT category, product_id, units
FROM (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY category ORDER BY units DESC) AS rn
  FROM product_sales
) t
WHERE rn = 1;`,
        example: `-- EXISTS vs IN pattern
SELECT c.id
FROM customers c
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.customer_id = c.id
    AND o.status = 'completed'
);

-- Set operation: categories sold this month but not previous month
SELECT DISTINCT p.category
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.created_at >= date_trunc('month', now())
EXCEPT
SELECT DISTINCT p.category
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE o.created_at >= date_trunc('month', now()) - INTERVAL '1 month'
  AND o.created_at < date_trunc('month', now());`,
        useCase:
          "Revenue dashboards, cohort analysis, top-N ranking, category insights, operational reporting.",
        interviewQuestions: [
          {
            question: "When should HAVING be used instead of WHERE?",
            answer:
              "WHERE filters rows before aggregation. HAVING filters groups after GROUP BY/aggregation.",
          },
          {
            question: "Why are CTEs useful in interviews and production?",
            answer:
              "They make complex logic readable and maintainable; they can also support recursive patterns.",
          },
          {
            question: "When is EXISTS preferred over IN?",
            answer:
              "EXISTS is often better for correlated existence checks and can stop early after first match.",
          },
          {
            question: "What is a window function and how is it different from GROUP BY?",
            answer:
              "Window functions compute over partitions without collapsing rows; GROUP BY collapses rows into aggregates.",
          },
          {
            question: "How do you return top-N per category?",
            answer:
              "Use ROW_NUMBER or RANK with PARTITION BY category and filter rank <= N.",
          },
          {
            question: "What is a common anti-pattern in reporting queries?",
            answer:
              "Using SELECT * with wide joins and no predicate selectivity, causing unnecessary IO.",
          },
          {
            question: "How do set operators differ: UNION vs UNION ALL?",
            answer:
              "UNION removes duplicates (extra sort/hash work). UNION ALL keeps all rows and is faster.",
          },
          {
            question: "How do you avoid double counting in joined aggregates?",
            answer:
              "Understand join cardinality, aggregate at correct grain, and pre-aggregate in CTE/subquery when needed.",
          },
          {
            question: "How would you debug a slow analytics query?",
            answer:
              "Use EXPLAIN (ANALYZE, BUFFERS), inspect row estimates, join order, filter selectivity, and index usage.",
          },
          {
            question: "What query pattern is best for pagination at scale?",
            answer:
              "Prefer keyset pagination (`WHERE id < last_seen`) over deep OFFSET scans for large datasets.",
          },
        ],
        exercises: [
          { type: "implement", question: "Write query for monthly revenue by city from completed orders." },
          { type: "implement", question: "Find customers whose latest order is cancelled." },
          { type: "output", question: "What changes when UNION is replaced by UNION ALL?", answer: "Duplicates are kept; usually faster." },
          { type: "debug", question: "Fix query that overcounts revenue because of duplicate joins." },
          { type: "theory", question: "Explain difference between window aggregate and grouped aggregate." },
          { type: "tricky", question: "Why can `NOT IN (subquery)` fail with NULL values?", answer: "NULL semantics can make predicate unknown; use NOT EXISTS safely." },
          { type: "scenario", question: "Design query for top 3 products per category for the last 30 days." },
          { type: "implement", question: "Use CTE to separate filtering stage from ranking stage." },
          { type: "output", question: "Predict output ordering when ORDER BY is omitted.", answer: "No guaranteed order." },
          { type: "scenario", question: "Rewrite heavy correlated subquery into JOIN + aggregation." },
        ],
        programExercises: [
          {
            question: "Program 1: Revenue by day",
            code: "SELECT DATE(created_at), SUM(total_amount) FROM orders GROUP BY DATE(created_at);",
            output: "One row per date with daily revenue.",
          },
          {
            question: "Program 2: Customers with >= 3 completed orders",
            code: "SELECT customer_id FROM orders WHERE status='completed' GROUP BY customer_id HAVING COUNT(*) >= 3;",
            output: "Customer IDs meeting threshold.",
          },
          {
            question: "Program 3: Top product per category with ROW_NUMBER",
            code: "Use CTE + ROW_NUMBER() OVER (PARTITION BY category ORDER BY units DESC) and filter rn=1.",
            output: "One top product per category.",
          },
          {
            question: "Program 4: Category list this month EXCEPT last month",
            code: "Two DISTINCT category queries with EXCEPT.",
            output: "Categories appearing only in current month window.",
          },
          {
            question: "Program 5: Running total by customer",
            code: "SELECT customer_id, created_at, SUM(total_amount) OVER (PARTITION BY customer_id ORDER BY created_at) FROM orders;",
            output: "Running cumulative spend per customer.",
          },
          {
            question: "Program 6: Keyset pagination",
            code: "SELECT id, created_at FROM orders WHERE id < 9000 ORDER BY id DESC LIMIT 20;",
            output: "Next page without deep OFFSET scan.",
          },
          {
            question: "Program 7: EXISTS-based active customer list",
            code: "SELECT c.id FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id=c.id);",
            output: "Customers with at least one order.",
          },
          {
            question: "Program 8: Average order value by city",
            code: "SELECT c.city, AVG(o.total_amount) FROM customers c JOIN orders o ON o.customer_id=c.id GROUP BY c.city;",
            output: "Average order value per city.",
          },
          {
            question: "Program 9: CTE pre-aggregation",
            code: "WITH s AS (SELECT product_id, SUM(qty) q FROM order_items GROUP BY product_id) SELECT * FROM s;",
            output: "Total units per product.",
          },
          {
            question: "Program 10: Explain analyze sample",
            code: "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20;",
            output: "Execution plan with actual timing and buffer usage.",
          },
        ],
      },
      {
        id: "join-index-partition-deep-dive",
        title: "Joins + Indexes + Partitioning Deep Dive",
        description:
          "Master join strategy, index design, and partitioning for high-volume PostgreSQL workloads.",
        explanation:
          "In production, performance is mostly about data shape + access pattern. Join choice controls row volume and semantics. Index choice controls lookup and sort cost. Partitioning controls pruning and maintenance windows on very large tables. Use `orders` partitioned by month for a realistic scenario.",
        code: `-- Join semantics quick matrix
-- INNER: matched rows only
-- LEFT: all left + matched right
-- FULL: all rows both sides
-- CROSS: cartesian product

-- Index strategy examples
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at DESC);
CREATE INDEX idx_orders_completed_recent
ON orders(created_at DESC)
WHERE status = 'completed';

-- Partitioning example
CREATE TABLE orders (
  id BIGINT,
  customer_id BIGINT,
  status TEXT,
  created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2026_01 PARTITION OF orders
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE orders_2026_02 PARTITION OF orders
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');`,
        example: `-- Partition pruning in action
EXPLAIN ANALYZE
SELECT COUNT(*)
FROM orders
WHERE created_at >= '2026-02-01'
  AND created_at <  '2026-03-01';

-- Join with selective predicate + supporting index
EXPLAIN ANALYZE
SELECT o.id, c.city
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'completed'
  AND o.created_at >= NOW() - INTERVAL '7 days';`,
        useCase:
          "Large e-commerce order tables, monthly retention analytics, low-latency operational dashboards.",
        interviewQuestions: [
          {
            question: "How do you choose between INNER and LEFT JOIN?",
            answer:
              "Use INNER when only matching rows are needed; use LEFT when preserving all left-side rows is required.",
          },
          {
            question: "Why does composite index column order matter?",
            answer:
              "Planner can use leftmost prefix efficiently. `(a,b)` supports `a` and `a+b`, not `b` alone optimally.",
          },
          {
            question: "When is a partial index better than full index?",
            answer:
              "When frequent queries hit a predictable subset, e.g., `status='completed'` recent records.",
          },
          {
            question: "What is partition pruning?",
            answer:
              "Planner skips irrelevant partitions based on partition key predicates, reducing scanned data.",
          },
          {
            question: "Range vs list vs hash partitioning?",
            answer:
              "Range for time/number intervals, list for categorical sets, hash for even distribution.",
          },
          {
            question: "Can too many indexes hurt performance?",
            answer:
              "Yes. Writes become slower due to index maintenance and storage overhead increases.",
          },
          {
            question: "How do you verify index usefulness?",
            answer:
              "Use EXPLAIN ANALYZE and `pg_stat_user_indexes` to compare scans and effectiveness.",
          },
          {
            question: "What join issue causes multiplicative row explosion?",
            answer:
              "Joining one-to-many relations without controlling granularity before aggregation.",
          },
          {
            question: "Why avoid function-wrapped predicates on indexed columns?",
            answer:
              "They can prevent index usage unless expression index exists.",
          },
          {
            question: "What is one partitioning maintenance task?",
            answer:
              "Pre-create upcoming partitions and archive/drop old ones by retention policy.",
          },
        ],
        exercises: [
          { type: "implement", question: "Create composite index for `customer_id + created_at` access pattern." },
          { type: "implement", question: "Design monthly range partitions for orders table." },
          { type: "scenario", question: "Your join report doubled revenue unexpectedly. Find likely root cause." },
          { type: "tricky", question: "Why can LEFT JOIN + WHERE right_table.col = value behave like INNER JOIN?" },
          { type: "output", question: "What plan change do you expect after adding selective index?", answer: "Seq scan may become index scan/bitmap scan." },
          { type: "debug", question: "Partitioned table query scans all partitions; what predicate fix is needed?" },
          { type: "theory", question: "Explain index-only scan requirements in PostgreSQL." },
          { type: "scenario", question: "Choose BRIN vs B-tree for very large append-only time-series table." },
          { type: "implement", question: "Add partial index for frequently queried active users." },
          { type: "debug", question: "Write path slowed after adding many indexes. What to audit first?" },
        ],
        programExercises: [
          {
            question: "Program 1: LEFT JOIN customers with order counts",
            code: "SELECT c.id, COUNT(o.id) FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id;",
            output: "All customers including zero-order customers.",
          },
          {
            question: "Program 2: FULL JOIN mismatch detector",
            code: "SELECT * FROM table_a a FULL JOIN table_b b ON a.id=b.id WHERE a.id IS NULL OR b.id IS NULL;",
            output: "Unmatched rows from both sides.",
          },
          {
            question: "Program 3: Composite index DDL",
            code: "CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at DESC);",
            output: "Index created for common filtered sort path.",
          },
          {
            question: "Program 4: Partial index DDL",
            code: "CREATE INDEX idx_orders_completed ON orders(created_at) WHERE status='completed';",
            output: "Smaller targeted index.",
          },
          {
            question: "Program 5: Partitioned orders base table",
            code: "CREATE TABLE orders (...) PARTITION BY RANGE (created_at);",
            output: "Parent table ready for child partitions.",
          },
          {
            question: "Program 6: Monthly partition creation",
            code: "CREATE TABLE orders_2026_03 PARTITION OF orders FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');",
            output: "March partition ready.",
          },
          {
            question: "Program 7: Partition-aware query",
            code: "SELECT COUNT(*) FROM orders WHERE created_at >= '2026-03-01' AND created_at < '2026-04-01';",
            output: "Planner can prune unrelated partitions.",
          },
          {
            question: "Program 8: Explain buffers for hot query",
            code: "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE customer_id=10 ORDER BY created_at DESC LIMIT 10;",
            output: "Execution plan with IO/buffer details.",
          },
          {
            question: "Program 9: Anti-join missing relations",
            code: "SELECT c.id FROM customers c LEFT JOIN orders o ON o.customer_id=c.id WHERE o.id IS NULL;",
            output: "Customers with no orders.",
          },
          {
            question: "Program 10: Safe retention delete by partition",
            code: "DROP TABLE IF EXISTS orders_2024_01;",
            output: "Old partition removed quickly.",
          },
        ],
      },
    ],
  },
];

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
    explanation: "FULL OUTER JOIN includes matched and unmatched rows from both sides.",
  },
  {
    question:
      "Why can `NOT IN (subquery)` be dangerous with NULLs?",
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
    question:
      "Best index type for JSONB containment (`@>`) queries?",
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
    options: ["Any selected column", "Partition key", "Primary key only", "Indexed column only"],
    correctAnswer: 1,
    explanation: "Planner prunes partitions when conditions constrain partition key.",
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
    question:
      "Tricky: `LEFT JOIN b ... WHERE b.id IS NOT NULL` behaves like?",
    options: ["FULL JOIN", "CROSS JOIN", "INNER JOIN", "SELF JOIN"],
    correctAnswer: 2,
    explanation:
      "Filtering out NULL right rows effectively removes unmatched left rows, similar to INNER JOIN.",
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
  const description =
    topic.description || "Explain this PostgreSQL concept with practical context.";
  const useCase =
    topic.useCase || "Discuss real production impact, trade-offs, and risk.";
  const templates = [
    {
      question: `Interview Q${n}: Explain ${topic.title} in production terms.`,
      answer: `${description} ${useCase}`,
    },
    {
      question: `Interview Q${n}: What is a common failure mode with ${topic.title}?`,
      answer:
        "Common failures include wrong cardinality assumptions, missing indexes, and incorrect isolation expectations.",
    },
    {
      question: `Interview Q${n}: How do you benchmark and verify ${topic.title}?`,
      answer:
        "Use realistic dataset, EXPLAIN ANALYZE with buffers, compare before/after query plans and latency percentiles.",
    },
    {
      question: `Interview Q${n}: What trade-offs are involved in ${topic.title}?`,
      answer:
        "Balance read speed, write overhead, storage footprint, operational complexity, and correctness guarantees.",
    },
  ];
  return templates[index % templates.length];
}

function fallbackExercise(topic, index) {
  const n = index + 1;
  const templates = [
    { type: "theory", question: `Exercise ${n}: Write detailed notes on ${topic.title} with two production pitfalls.` },
    { type: "implement", question: `Exercise ${n}: Implement a SQL solution for ${topic.title} on e-commerce schema.` },
    { type: "debug", question: `Exercise ${n}: Debug a slow ${topic.title} query and propose concrete fixes.` },
    { type: "output", question: `Exercise ${n}: Predict output for a ${topic.title} query with duplicates/NULLs.` },
    { type: "tricky", question: `Exercise ${n}: Explain one tricky interview edge case in ${topic.title}.` },
  ];
  return templates[index % templates.length];
}

function fallbackProgram(topic, index) {
  const n = index + 1;
  return {
    question: `Program ${n}: SQL snippet for ${topic.title}.`,
    answer:
      "Keep query deterministic, add explicit filtering/sorting, and explain expected result shape.",
    code: `-- ${topic.title} program ${n}
SELECT 'postgresql' AS topic, ${n} AS sample_id;`,
    output: `topic=postgresql, sample_id=${n}`,
  };
}

function enrichTopic(topic) {
  return {
    ...topic,
    explanation: topic.explanation || topic.description || "",
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

export default function PostgreSQLPage() {
  const enrichedTopics = [...postgresqlData, ...POSTGRES_ADVANCED_TOPICS].map(
    (section) => ({
      ...section,
      topics: (section.topics || []).map(enrichTopic),
    })
  );

  const mergedQuiz = [...postgresqlQuiz];
  const seen = new Set(mergedQuiz.map((q) => q.question));
  for (const q of POSTGRES_ENRICHED_QUIZ) {
    if (!seen.has(q.question)) {
      mergedQuiz.push(q);
      seen.add(q.question);
    }
  }

  return (
    <InterviewTopicPage
      title="PostgreSQL Interview Preparation"
      description="Build confidence in SQL, indexing, optimization, transactions, and schema design with interview-ready explanations."
      topics={enrichedTopics}
      quiz={mergedQuiz}
    />
  );
}
