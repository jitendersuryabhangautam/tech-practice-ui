"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Sidebar from "@/components/Sidebar";
import MCQSection from "@/components/MCQSection";
import { normalizeTopics } from "@/lib/topicUtils";

const systemDesignData = [
  {
    category: "Foundations",
    topics: [
      {
        id: "sd-process",
        title: "System Design Interview Framework",
        description:
          "A repeatable way to answer system design interviews from requirements to trade-offs.",
        explanation:
          "Use a fixed framework: clarify scope, estimate scale, define APIs, design high-level components, deep-dive one subsystem, discuss bottlenecks, and finish with reliability/observability/rollout plans. Interviewers evaluate clarity and trade-off quality more than perfect architecture.",
        designPatterns: [
          "Layered architecture",
          "Command query responsibility separation (CQRS-lite)",
          "Event-driven async workflows",
          "Bulkhead and circuit breaker",
        ],
        hld: [
          "Client -> API Gateway -> Domain Services -> Data Stores",
          "Async queue for long-running side effects",
          "Read path isolated from write path where useful",
        ],
        lld: [
          "Idempotency keys on write APIs",
          "State transition guards in business workflows",
          "Per-service SLO and timeout budgets",
        ],
        interviewQuestions: [
          {
            question: "What is the first thing to do in a design interview?",
            answer:
              "Clarify requirements and constraints before drawing architecture.",
          },
          {
            question: "Why estimate scale early?",
            answer:
              "Scale assumptions decide storage, caching, partitioning, and protocol choices.",
          },
          {
            question: "How do you choose what to deep-dive?",
            answer:
              "Pick the highest-risk or most central subsystem to prove design depth.",
          },
        ],
        exercises: [
          {
            type: "framework",
            question:
              "Design a 45-minute interview flow for any system and allocate time by section.",
          },
          {
            type: "scenario",
            question:
              "Given 10k QPS and 99.99% availability target, identify top 3 architecture constraints.",
          },
          {
            type: "tricky",
            question:
              "What if requirements conflict (strict consistency + ultra-low latency)?",
            answer: "State trade-off and propose bounded-scope strong consistency.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Draft API contract skeleton",
            code: `POST /v1/resource
Headers: Idempotency-Key, X-Request-Id
Body: { ... }`,
            output: "Explicit write contract with retry safety.",
          },
          {
            question: "Program 2: Latency budget breakdown",
            code: `Client->Gateway: 20ms
Gateway->Service: 30ms
Service->DB: 40ms
Total p95: 90ms`,
            output: "Component-wise SLO budget plan.",
          },
        ],
      },
      {
        id: "capacity-consistency",
        title: "Capacity Planning, Consistency, and Trade-offs",
        description:
          "Convert traffic assumptions to storage/throughput design and choose consistency model.",
        explanation:
          "Capacity planning means quantifying read/write QPS, peak multipliers, storage retention, and replication overhead. Then choose consistency by business semantics: strong for money movement/seat booking, eventual for feed counters.",
        designPatterns: [
          "Read replica scaling",
          "Sharding by tenant/time/hash",
          "Leader-follower with async replication",
        ],
        hld: [
          "Primary DB for writes + replicas for reads",
          "Cache for hot keys with TTL + jitter",
          "Queue for burst absorption",
        ],
        lld: [
          "Shard key selection and rebalancing plan",
          "Conflict resolution for eventually consistent views",
          "Hot partition detection metrics",
        ],
        interviewQuestions: [
          {
            question: "When do you choose eventual consistency?",
            answer:
              "For user-facing non-critical data where low latency/availability is more important than strict freshness.",
          },
          {
            question: "What is a bad shard key?",
            answer:
              "A key with skewed distribution causing hotspots and uneven partition load.",
          },
          {
            question: "How do you handle sudden 10x traffic spikes?",
            answer:
              "Autoscale stateless tiers, apply rate limits, use queue buffering, and degrade gracefully.",
          },
        ],
        exercises: [
          {
            type: "estimation",
            question:
              "Estimate storage for 200M events/day retained for 180 days with 1.5KB/event and 3x replication.",
          },
          {
            type: "design",
            question:
              "Pick strong vs eventual consistency for wallet, feed likes, and chat unread counts.",
          },
          {
            type: "debug",
            question:
              "A shard is 5x hotter than others. List three immediate mitigations.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Throughput sheet",
            code: `peak_qps = avg_qps * 5
write_qps = peak_qps * 0.3
read_qps = peak_qps * 0.7`,
            output: "Read/write planning baseline.",
          },
        ],
      },
    ],
  },
  {
    category: "Company LLD",
    topics: [
      {
        id: "netflix-lld",
        title: "Netflix LLD: Playback Session and Streaming",
        description:
          "Low-level design of playback authorization, adaptive bitrate, and segment delivery.",
        explanation:
          "Core path: user starts playback -> entitlement service validates rights -> playback session created -> manifest returned -> client fetches media segments via CDN. LLD focus is adaptive bitrate state machine, session token security, and QoE telemetry.",
        designPatterns: [
          "Token-based authorization",
          "State machine for playback session",
          "CQRS for control plane vs data plane",
        ],
        hld: [
          "Playback API -> Entitlement -> Session Store -> Manifest Builder -> CDN",
          "Telemetry stream -> Kafka -> QoE analytics",
        ],
        lld: [
          "Session states: INIT -> AUTHORIZED -> PLAYING -> ENDED",
          "ABR selection based on throughput and buffer",
          "Fallback rendition on packet loss spikes",
        ],
        interviewQuestions: [
          {
            question: "How do you reduce playback startup time?",
            answer:
              "Precomputed manifests, edge cache warmup, and minimizing control-plane round trips.",
          },
          {
            question: "How do you prevent token sharing abuse?",
            answer:
              "Short-lived signed tokens, device binding, and anomaly-based risk checks.",
          },
          {
            question: "What metrics define QoE?",
            answer:
              "Startup delay, rebuffer ratio, bitrate stability, and playback failure rate.",
          },
        ],
        exercises: [
          {
            type: "lld",
            question: "Design ABR switching logic with guardrails against quality oscillation.",
          },
          {
            type: "tricky",
            question:
              "CDN edge miss spike after release. What steps reduce origin overload?",
          },
          {
            type: "output",
            question:
              "Given buffer=2s and throughput drop 40%, which ABR action is expected?",
            answer: "Step down rendition immediately to protect playback continuity.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Playback state machine",
            code: `INIT -> AUTHORIZED -> PLAYING -> ENDED
on_auth_fail: INIT -> DENIED
on_token_expired: PLAYING -> REAUTH_REQUIRED`,
            output: "Deterministic session transitions.",
          },
        ],
      },
      {
        id: "facebook-feed-lld",
        title: "Facebook LLD: News Feed Generation",
        description:
          "Low-level design of candidate generation, ranking, fanout, and deduplication.",
        explanation:
          "Feed systems balance relevance and freshness at scale. Use hybrid fanout: push for normal users, pull for very high-follower creators. LLD includes feature pipeline, ranking timeout fallback, and duplicate suppression across sources.",
        designPatterns: [
          "Fanout hybrid (push + pull)",
          "Ranking pipeline with fallback tier",
          "Cache-aside for feed pages",
        ],
        hld: [
          "Write events -> Candidate Store",
          "Read request -> Candidate fetch -> Ranker -> Feed response cache",
        ],
        lld: [
          "Feature vector generation per user/post pair",
          "Timeout budget for ranker (fallback to heuristic sort)",
          "Cursor-based pagination with stable ordering keys",
        ],
        interviewQuestions: [
          {
            question: "Why not push all posts to all followers?",
            answer:
              "Celebrity fanout explodes write amplification and storage churn.",
          },
          {
            question: "How do you keep feed latency predictable?",
            answer:
              "Hard timeout budgets, partial results, cache layers, and degraded mode.",
          },
          {
            question: "How do you enforce privacy rules in feed?",
            answer:
              "Apply access filters before ranking and before final response assembly.",
          },
        ],
        exercises: [
          {
            type: "lld",
            question:
              "Design cursor schema that supports stable pagination even with new inserts.",
          },
          {
            type: "scenario",
            question:
              "Ranker is down for 2 minutes. Define degraded behavior and user impact policy.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Feed cursor format",
            code: `cursor = base64(last_score + ":" + last_post_id + ":" + timestamp)`,
            output: "Stable cursor-based pagination token.",
          },
        ],
      },
      {
        id: "youtube-lld",
        title: "YouTube LLD: Upload, Transcode, and Publish Pipeline",
        description:
          "Low-level design for chunk uploads, transcoding queues, and publish readiness.",
        explanation:
          "Users upload large files in chunks. System assembles object, triggers transcode workflows, and publishes only after required renditions and moderation checks pass. LLD requires idempotent chunk handling and workflow state durability.",
        designPatterns: [
          "Resumable upload protocol",
          "Workflow orchestration with retries",
          "Saga-style stage transitions",
        ],
        hld: [
          "Upload API -> Object Storage -> Job Queue -> Transcoder Workers -> Metadata Service",
        ],
        lld: [
          "Chunk table with checksum and range index",
          "Job idempotency keys to avoid duplicate transcode runs",
          "Stage states: UPLOADING, PROCESSING, READY, FAILED",
        ],
        interviewQuestions: [
          {
            question: "How do you resume interrupted upload safely?",
            answer:
              "Track uploaded byte ranges with checksums and request only missing segments.",
          },
          {
            question: "How do you avoid duplicate processing?",
            answer:
              "Use idempotency keys and unique constraints on pipeline job identifiers.",
          },
        ],
        exercises: [
          {
            type: "design",
            question:
              "Design chunk upload API with checksum validation and conflict handling.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Upload stage transitions",
            code: `UPLOADING -> PROCESSING -> READY
on_transcode_error: PROCESSING -> FAILED`,
            output: "Publish gated by READY state.",
          },
        ],
      },
      {
        id: "zomato-lld",
        title: "Zomato LLD: Order Lifecycle and Dispatch",
        description:
          "Low-level design for food order state machine, dispatch, and ETA updates.",
        explanation:
          "Order systems need strict state transitions and near real-time tracking. Key challenge is balancing fast assignment with quality constraints (distance, prep time, rider load).",
        designPatterns: [
          "Finite state machine",
          "Event-driven updates",
          "Saga for refund/compensation flows",
        ],
        hld: [
          "Order service -> Dispatch service -> Rider app -> Tracking service",
        ],
        lld: [
          "States: CREATED -> ACCEPTED -> PREPARING -> PICKED -> DELIVERED/CANCELLED",
          "Assignment score includes ETA, rider load, acceptance probability",
          "Idempotent cancellation and refund commands",
        ],
        interviewQuestions: [
          {
            question: "How do you prevent double rider assignment?",
            answer:
              "Atomic reservation with short lease and compare-and-set assignment.",
          },
          {
            question: "How do you handle late restaurant reject?",
            answer:
              "Compensating actions: re-dispatch if possible, else auto-refund + notification.",
          },
        ],
        exercises: [
          {
            type: "lld",
            question:
              "Define state transition guards for cancellation at each stage.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Dispatch score",
            code: `score = eta_weight*eta + load_weight*rider_load + risk_weight*cancellation_risk`,
            output: "Lower score means better dispatch candidate.",
          },
        ],
      },
      {
        id: "bookmyshow-lld",
        title: "BookMyShow LLD: Seat Locking and Booking",
        description:
          "Low-level design for seat lock service, payment callback handling, and oversell prevention.",
        explanation:
          "Ticketing systems require strict consistency around inventory. Seat lock with TTL is common: reserve temporarily, confirm after payment, release on timeout/failure. Must be idempotent for payment retries.",
        designPatterns: [
          "Optimistic concurrency control",
          "Lock with lease (TTL)",
          "Outbox pattern for payment event publishing",
        ],
        hld: [
          "Inventory service + lock store + booking service + payment gateway",
        ],
        lld: [
          "Seat states: AVAILABLE -> LOCKED -> BOOKED",
          "Unique constraint on show_id + seat_no + BOOKED",
          "Payment callback dedupe by payment_reference",
        ],
        interviewQuestions: [
          {
            question: "How do you guarantee no double booking?",
            answer:
              "Atomic state transition with uniqueness constraints and lock validation at confirm time.",
          },
          {
            question: "What if payment succeeds but confirm call times out?",
            answer:
              "Use idempotent reconciliation job on payment reference to finalize booking safely.",
          },
        ],
        exercises: [
          {
            type: "scenario",
            question:
              "Design retry-safe booking confirmation endpoint with idempotency key.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Seat lock state transitions",
            code: `AVAILABLE -> LOCKED(5 min TTL)
LOCKED -> BOOKED (on successful payment)
LOCKED -> AVAILABLE (on expiry)`,
            output: "Consistent inventory lifecycle.",
          },
        ],
      },
      {
        id: "delhivery-lld",
        title: "Delhivery LLD: Shipment Tracking and Logistics Events",
        description:
          "Low-level design for high-volume shipment events, ordering, dedupe, and SLA tracking.",
        explanation:
          "Logistics tracking consumes scan events from hubs and riders. Event ordering can break due to network delays. LLD should use append-only timeline, dedupe keys, and event versioning per shipment.",
        designPatterns: [
          "Event sourcing style timeline",
          "Out-of-order event handling",
          "Exactly-once illusion via dedupe + idempotency",
        ],
        hld: [
          "Scan ingest -> Event stream -> Tracking projection -> Customer API",
        ],
        lld: [
          "Per-shipment monotonic event version",
          "Dedupe key: shipment_id + source + event_id",
          "SLA breach detector on delayed milestone transitions",
        ],
        interviewQuestions: [
          {
            question: "How do you handle out-of-order scan events?",
            answer:
              "Store raw events, reorder by logical version/time, and correct projections asynchronously.",
          },
          {
            question: "How do you avoid duplicate timeline entries?",
            answer: "Enforce dedupe key uniqueness at ingest boundary.",
          },
        ],
        exercises: [
          {
            type: "design",
            question:
              "Model shipment state machine with hub arrival/departure and failed delivery loops.",
          },
        ],
        programExercises: [
          {
            question: "Program 1: Dedupe key formula",
            code: `dedupe_key = sha256(shipment_id + ":" + source + ":" + external_event_id)`,
            output: "Retry-safe ingest key.",
          },
        ],
      },
    ],
  },
];

const systemDesignQuiz = [
  {
    question: "For seat booking systems, which consistency is usually required?",
    options: [
      "Eventual consistency only",
      "Strong consistency on inventory state transitions",
      "No consistency needed",
      "Client-side consistency",
    ],
    correctAnswer: 1,
    explanation:
      "Inventory allocation must be strongly consistent to avoid double booking.",
  },
  {
    question: "Best pagination strategy for very large sorted feeds?",
    options: ["OFFSET pagination", "Keyset/cursor pagination", "Random pagination", "Full table scan"],
    correctAnswer: 1,
    explanation:
      "Cursor-based pagination scales better and avoids deep OFFSET scan cost.",
  },
  {
    question: "Which pattern helps retry-safe write APIs?",
    options: ["Global mutex", "Idempotency key", "Bigger server", "More replicas only"],
    correctAnswer: 1,
    explanation: "Idempotency keys let repeated requests return same logical outcome.",
  },
  {
    question:
      "Output-based: If ABR observes throughput drop and low buffer, expected action?",
    options: [
      "Increase bitrate",
      "Lower bitrate to avoid rebuffering",
      "Pause all playback",
      "Delete session",
    ],
    correctAnswer: 1,
    explanation:
      "Adapt down quickly to preserve continuous playback.",
  },
  {
    question:
      "In fanout architecture, a common reason to avoid push for celebrity accounts is:",
    options: [
      "Low relevance",
      "Massive write amplification",
      "No caching support",
      "No ranking possible",
    ],
    correctAnswer: 1,
    explanation:
      "Huge follower counts make push fanout expensive and operationally risky.",
  },
  {
    question:
      "What primarily prevents duplicate logistics events in tracking systems?",
    options: [
      "Bigger queue",
      "Dedupe key + idempotent ingest",
      "Shorter event payload",
      "Random delay",
    ],
    correctAnswer: 1,
    explanation:
      "Deterministic dedupe keys ensure repeated events do not duplicate timeline records.",
  },
];

function TopicDiagram({ topicId }) {
  if (topicId === "bookmyshow-lld") {
    return (
      <svg viewBox="0 0 760 180" className="h-auto w-full">
        {[
          { x: 20, l: "Client" },
          { x: 160, l: "Seat Lock API" },
          { x: 320, l: "Lock Store" },
          { x: 480, l: "Payment" },
          { x: 620, l: "Booking DB" },
        ].map((n) => (
          <g key={n.l}>
            <rect x={n.x} y="60" width="120" height="44" rx="8" fill="#f8fafc" stroke="#94a3b8" />
            <text x={n.x + 60} y="86" textAnchor="middle" fontSize="12" fill="#0f172a">{n.l}</text>
          </g>
        ))}
        <g stroke="#475569" strokeWidth="2" fill="none">
          <path d="M140 82 L160 82" />
          <path d="M280 82 L320 82" />
          <path d="M440 82 L480 82" />
          <path d="M600 82 L620 82" />
        </g>
      </svg>
    );
  }

  if (topicId === "delhivery-lld") {
    return (
      <svg viewBox="0 0 760 200" className="h-auto w-full">
        <rect x="30" y="30" width="160" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" />
        <rect x="230" y="30" width="180" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" />
        <rect x="450" y="30" width="140" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" />
        <rect x="620" y="30" width="120" height="48" rx="8" fill="#f8fafc" stroke="#94a3b8" />
        <text x="110" y="58" textAnchor="middle" fontSize="12" fill="#0f172a">Scan Ingest</text>
        <text x="320" y="58" textAnchor="middle" fontSize="12" fill="#0f172a">Event Stream</text>
        <text x="520" y="58" textAnchor="middle" fontSize="12" fill="#0f172a">Projection</text>
        <text x="680" y="58" textAnchor="middle" fontSize="12" fill="#0f172a">Tracking API</text>
        <g stroke="#475569" strokeWidth="2" fill="none">
          <path d="M190 54 L230 54" />
          <path d="M410 54 L450 54" />
          <path d="M590 54 L620 54" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 760 180" className="h-auto w-full">
      <rect x="30" y="70" width="140" height="44" rx="8" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="220" y="70" width="180" height="44" rx="8" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="450" y="70" width="130" height="44" rx="8" fill="#f8fafc" stroke="#94a3b8" />
      <rect x="620" y="70" width="110" height="44" rx="8" fill="#f8fafc" stroke="#94a3b8" />
      <text x="100" y="96" textAnchor="middle" fontSize="12" fill="#0f172a">Client</text>
      <text x="310" y="96" textAnchor="middle" fontSize="12" fill="#0f172a">API/Gateway</text>
      <text x="515" y="96" textAnchor="middle" fontSize="12" fill="#0f172a">Service</text>
      <text x="675" y="96" textAnchor="middle" fontSize="12" fill="#0f172a">Storage</text>
      <g stroke="#475569" strokeWidth="2" fill="none">
        <path d="M170 92 L220 92" />
        <path d="M400 92 L450 92" />
        <path d="M580 92 L620 92" />
      </g>
    </svg>
  );
}

function TopicSection({ title, items }) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <section className="mb-6">
      <h3 className="section-title mb-2">{title}</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function SystemDesignTopicDetail({ topic }) {
  if (!topic) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Select a system design topic to start.
      </div>
    );
  }

  return (
    <article className="w-full min-w-0 max-w-4xl">
      <header className="mb-6">
        <p className="eyebrow">{topic.category}</p>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          {topic.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base dark:text-slate-300">
          {topic.description}
        </p>
      </header>

      <section className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <h3 className="section-title mb-2">Detailed Explanation</h3>
        <p className="whitespace-pre-line break-words text-slate-800 dark:text-slate-200">
          {topic.explanation}
        </p>
      </section>

      <section className="mb-6 content-card p-3 sm:p-4">
        <h3 className="section-title mb-3">Architecture Flow Diagram</h3>
        <TopicDiagram topicId={topic.id} />
      </section>

      <TopicSection title="High-Level Design (HLD)" items={topic.hld} />
      <TopicSection title="Low-Level Design (LLD)" items={topic.lld} />
      <TopicSection title="Design Patterns Used" items={topic.designPatterns} />

      {topic.interviewQuestions?.length > 0 && (
        <section className="mb-6">
          <h3 className="section-title mb-3">Interview Questions and Answers</h3>
          <div className="space-y-3">
            {topic.interviewQuestions.map((qa, index) => (
              <div key={`${topic.id}-qa-${index}`} className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Q{index + 1}. {qa.question}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {topic.exercises?.length > 0 && (
        <section className="mb-6">
          <h3 className="section-title mb-3">Exercises</h3>
          <div className="space-y-3">
            {topic.exercises.map((ex, index) => (
              <details key={`${topic.id}-ex-${index}`} className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <summary className="cursor-pointer break-words font-semibold text-slate-900 dark:text-slate-100">
                  Exercise {index + 1}{" "}
                  <span className="ml-2 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {ex.type || "practice"}
                  </span>
                </summary>
                <p className="mt-3 break-words text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {ex.question}
                </p>
                {ex.answer && (
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Answer:
                    </span>{" "}
                    {ex.answer}
                  </p>
                )}
              </details>
            ))}
          </div>
        </section>
      )}

      {topic.programExercises?.length > 0 && (
        <section>
          <h3 className="section-title mb-3">Program Exercises</h3>
          <div className="space-y-3">
            {topic.programExercises.map((p, index) => (
              <details key={`${topic.id}-prog-${index}`} className="rounded-xl border border-slate-200 p-3 sm:p-4 dark:border-slate-700">
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100">
                  Program {index + 1}
                </summary>
                <p className="mt-3 break-words text-sm text-slate-700 dark:text-slate-300">
                  {p.question}
                </p>
                {p.code && (
                  <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-cyan-200">
                    <code>{p.code}</code>
                  </pre>
                )}
                {p.output && (
                  <pre className="mt-3 max-w-full overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-200">
                    <code>{p.output}</code>
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

export default function SystemDesignPage() {
  const topics = useMemo(() => normalizeTopics(systemDesignData), []);
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id);
  const [showMCQ, setShowMCQ] = useState(false);

  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? null;

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
          <BackButton />

          <section className="hero-panel mb-5 sm:mb-8">
            <p className="eyebrow">System Design Track</p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-100">
              Company-scale HLD + LLD with diagrams, patterns, and interview practice
            </h1>
            <p className="mt-2 text-sm text-slate-700 sm:text-base dark:text-slate-300">
              Topics include foundations plus low-level designs of Netflix, Facebook, YouTube, Zomato,
              BookMyShow, and Delhivery with flow diagrams, interview Q&A, exercises, and programs.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip">{topics.length} design topics</span>
              <span className="chip">HLD + LLD deep dives</span>
              <span className="chip">Patterns + scenarios + output questions</span>
            </div>
          </section>

          <div className="grid items-start gap-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6">
            <Sidebar
              topics={topics}
              activeId={activeTopic?.id}
              onTopicClick={(topicId) => {
                setActiveTopicId(topicId);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <main className="content-card min-w-0 p-4 sm:p-6 lg:p-8">
              <SystemDesignTopicDetail topic={activeTopic} />
            </main>
          </div>

          <MCQSection
            quiz={systemDesignQuiz}
            isVisible={showMCQ}
            onToggle={() => setShowMCQ((v) => !v)}
          />
        </div>
      </div>
    </>
  );
}
