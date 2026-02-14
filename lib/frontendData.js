const REVIEW_ITEMS = [
  {
    id: "cnt_async_patterns_01",
    technology: "javascript",
    category: "Async Patterns",
    topicId: "async-await",
    title: "Async Patterns",
    status: "pending_review",
    generatedAt: "2026-02-13T10:30:00.000Z",
    summary:
      "Interview-first coverage of callback queues, promises, async/await pitfalls, and cancellation strategies.",
    interviewQuestions: 10,
    exercises: 10,
    programExercises: 10,
  },
  {
    id: "cnt_sd_consistent_hashing_01",
    technology: "system-design",
    category: "Scalability",
    topicId: "consistent-hashing",
    title: "Consistent Hashing",
    status: "approved",
    generatedAt: "2026-02-12T17:15:00.000Z",
    summary:
      "Ring architecture, virtual nodes, rebalancing behavior, and production trade-offs for distributed systems.",
    interviewQuestions: 12,
    exercises: 8,
    programExercises: 4,
  },
  {
    id: "cnt_go_channels_02",
    technology: "golang",
    category: "Concurrency",
    topicId: "channels",
    title: "Go Channels",
    status: "rejected",
    generatedAt: "2026-02-11T08:45:00.000Z",
    summary:
      "Covers buffered/unbuffered channels, select patterns, and deadlock scenarios with practical debugging notes.",
    interviewQuestions: 8,
    exercises: 5,
    programExercises: 3,
  },
];

const PUBLISH_HISTORY = [
  {
    id: "pub_2026_02_13_01",
    type: "topic",
    title: "Docker Multi-stage Builds",
    status: "published",
    timestamp: "2026-02-13T18:20:00.000Z",
    rollbackRef: "rkb_8122",
  },
  {
    id: "pub_2026_02_12_03",
    type: "quiz",
    title: "React Hooks Deep Revision Quiz",
    status: "rolled_back",
    timestamp: "2026-02-12T13:05:00.000Z",
    rollbackRef: "rkb_8117",
  },
];

const STUDY_PLAN = {
  generatedAt: "2026-02-14T07:30:00.000Z",
  completionRatio: 38,
  streakDays: 6,
  weakTopics: [
    { name: "PostgreSQL Indexing", score: 54 },
    { name: "System Design Trade-offs", score: 58 },
    { name: "React Rendering", score: 61 },
  ],
  queue: [
    {
      id: "rev_1",
      title: "Consistent Hashing",
      dueAt: "2026-02-14T18:00:00.000Z",
      interval: "1 day",
      priority: "high",
    },
    {
      id: "rev_2",
      title: "Go Channels",
      dueAt: "2026-02-15T10:00:00.000Z",
      interval: "2 days",
      priority: "medium",
    },
    {
      id: "rev_3",
      title: "React useEffect Cleanup",
      dueAt: "2026-02-15T19:30:00.000Z",
      interval: "3 days",
      priority: "medium",
    },
  ],
  recommendations: [
    "Spend 20 minutes on indexing strategy patterns with EXPLAIN ANALYZE examples.",
    "Do one architecture whiteboard run for URL shortener with scaling constraints.",
    "Complete 1 hard React hooks quiz and review missed questions.",
  ],
};

const CODING_CHALLENGES = [
  {
    id: "challenge_1",
    technology: "javascript",
    title: "Debounce Function",
    difficulty: "Intermediate",
    prompt:
      "Implement a debounce(fn, wait) utility that delays execution until no call happens for wait ms.",
    starterCode:
      "export function debounce(fn, wait) {\n  // TODO: implement\n}\n",
    checks: [
      "returns a function",
      "uses setTimeout",
      "clears previous timer",
      "invokes fn after delay",
    ],
  },
  {
    id: "challenge_2",
    technology: "golang",
    title: "Worker Pool",
    difficulty: "Advanced",
    prompt:
      "Create a worker pool that processes jobs concurrently and returns ordered results.",
    starterCode:
      "package main\n\nfunc workerPool(jobs []int, workers int) []int {\n  // TODO: implement\n  return nil\n}\n",
    checks: [
      "uses goroutines",
      "uses channels",
      "waits for completion",
      "returns deterministic output",
    ],
  },
];

const JOB_FEED = [
  {
    id: "job_8801",
    type: "GENERATE_TOPIC",
    status: "running",
    provider: "gemini",
    progress: 62,
    createdAt: "2026-02-14T09:03:00.000Z",
  },
  {
    id: "job_8799",
    type: "GENERATE_QUIZ",
    status: "completed",
    provider: "gemini",
    progress: 100,
    createdAt: "2026-02-14T08:41:00.000Z",
  },
  {
    id: "job_8793",
    type: "PUBLISH_CONTENT",
    status: "failed",
    provider: "system",
    progress: 100,
    createdAt: "2026-02-14T07:15:00.000Z",
  },
];

const AUDIT_FEED = [
  {
    id: "audit_1",
    actor: "admin@platform.dev",
    action: "CONTENT_APPROVED",
    entity: "cnt_sd_consistent_hashing_01",
    createdAt: "2026-02-14T08:32:00.000Z",
  },
  {
    id: "audit_2",
    actor: "admin@platform.dev",
    action: "PUBLISH_TRIGGERED",
    entity: "pub_2026_02_13_01",
    createdAt: "2026-02-13T18:19:00.000Z",
  },
];

const USERS_OVERVIEW = [
  {
    id: "usr_1001",
    name: "Jitender",
    quizzes: 42,
    chatMessages: 186,
    generatedRequests: 9,
    lastActiveAt: "2026-02-14T09:20:00.000Z",
  },
  {
    id: "usr_1002",
    name: "Ananya",
    quizzes: 18,
    chatMessages: 74,
    generatedRequests: 2,
    lastActiveAt: "2026-02-14T08:48:00.000Z",
  },
];

export function listReviewItems(status = "all") {
  if (status === "all") return REVIEW_ITEMS;
  return REVIEW_ITEMS.filter((item) => item.status === status);
}

export function getReviewItemById(id) {
  return REVIEW_ITEMS.find((item) => item.id === id) || null;
}

export function listPublishQueue() {
  return REVIEW_ITEMS.filter((item) => item.status === "approved");
}

export function listPublishHistory() {
  return PUBLISH_HISTORY;
}

export function getStudyPlanSnapshot() {
  return STUDY_PLAN;
}

export function listCodingChallenges() {
  return CODING_CHALLENGES;
}

export function evaluateCodingSubmission(challengeId, submission) {
  const challenge = CODING_CHALLENGES.find((item) => item.id === challengeId);
  if (!challenge) {
    return { passed: 0, total: 0, checks: [] };
  }

  const normalized = submission.toLowerCase();
  const checks = challenge.checks.map((check) => {
    const map = {
      "returns a function": ["return", "function"],
      "uses setTimeout": ["settimeout"],
      "clears previous timer": ["cleartimeout"],
      "invokes fn after delay": ["fn(", "apply", "call("],
      "uses goroutines": ["go ", "goroutine"],
      "uses channels": ["chan", "<-"],
      "waits for completion": ["waitgroup", "done"],
      "returns deterministic output": ["sort", "index", "ordered"],
    };
    const keywords = map[check] || [];
    const passed = keywords.some((kw) => normalized.includes(kw));
    return { check, passed };
  });

  return {
    passed: checks.filter((item) => item.passed).length,
    total: checks.length,
    checks,
  };
}

export function listJobs() {
  return JOB_FEED;
}

export function listAuditFeed() {
  return AUDIT_FEED;
}

export function listUsersOverview() {
  return USERS_OVERVIEW;
}
