# AI/ML Integration Guide v2 - Tech Revision Platform

## Deploy-Safe, Async-First Architecture for AI-Powered Interview Preparation

> **Document Version**: 2.0
> **Created**: February 14, 2026
> **Scope**: Auto-generation of topic content, quizzes, RAG chatbot, adaptive learning, and interview simulation
> **Current Stack**: Next.js 15 (App Router) + JavaScript (.jsx) + Tailwind CSS + Static JSON content
> **Target Stack**: Same + PostgreSQL + OpenAI/Gemini + Vector DB + Async Jobs

---

## Design Decisions (Resolved Up-Front)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Content source-of-truth? | **Database**, published to CDN/S3 via build step | Serverless deployments have immutable filesystems |
| Single-tenant or multi-tenant? | **Single-tenant personal tool first**, multi-tenant later | Ship fast, add org support in Phase 5 |
| JavaScript or TypeScript? | **JavaScript first** (matches existing .jsx codebase) | No migration friction; add TS incrementally via jsconfig strict |
| Monthly AI budget cap? | **$50/month hard cap** with model fallback ladder | GPT-4o-mini default, kill-switch at 90% budget |
| Target user scale? | **1-50 users** initially (personal + small team) | Architecture supports 1000+ with minimal changes |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Architecture Analysis](#2-current-architecture-analysis)
3. [Target Architecture (Deploy-Safe)](#3-target-architecture-deploy-safe)
4. [LLM Provider Selection](#4-llm-provider-selection)
5. [Async Job System](#5-async-job-system)
6. [Backend API Layer](#6-backend-api-layer)
7. [Database Schema](#7-database-schema)
8. [Deploy-Safe Content Pipeline](#8-deploy-safe-content-pipeline)
9. [Feature: Auto-Generate Topic Content](#9-feature-auto-generate-topic-content)
10. [Feature: Auto-Generate Quizzes](#10-feature-auto-generate-quizzes)
11. [Feature: RAG Chatbot](#11-feature-rag-chatbot)
12. [Feature: Adaptive Learning Engine](#12-feature-adaptive-learning-engine)
13. [Feature: Interview Simulator](#13-feature-interview-simulator)
14. [Feature: Coding Lab](#14-feature-coding-lab)
15. [Feature: Company Tracks](#15-feature-company-tracks)
16. [Feature: Mentor/Peer Layer](#16-feature-mentorpeer-layer)
17. [Feature: Analytics and Coaching](#17-feature-analytics-and-coaching)
18. [Feature: Content Ops (CMS-Grade)](#18-feature-content-ops-cms-grade)
19. [Feature: AI Reliability Layer](#19-feature-ai-reliability-layer)
20. [Feature: Evaluation Platform](#20-feature-evaluation-platform)
21. [Authentication and User Management](#21-authentication-and-user-management)
22. [Vector Database and Embeddings](#22-vector-database-and-embeddings)
23. [Prompt Engineering Cookbook](#23-prompt-engineering-cookbook)
24. [Streaming and Real-Time UX](#24-streaming-and-real-time-ux)
25. [Rate Limiting and Cost Control (Operationalized)](#25-rate-limiting-and-cost-control-operationalized)
26. [Security and Compliance Checklist](#26-security-and-compliance-checklist)
27. [RAG Quality and Eval Framework](#27-rag-quality-and-eval-framework)
28. [Data Governance and Privacy](#28-data-governance-and-privacy)
29. [Testing Strategy](#29-testing-strategy)
30. [Deployment and Infrastructure](#30-deployment-and-infrastructure)
31. [Cost Analysis](#31-cost-analysis)
32. [Package Dependencies](#32-package-dependencies)
33. [Environment Variables](#33-environment-variables)
34. [Phased Roadmap with Effort and Risk](#34-phased-roadmap-with-effort-and-risk)
35. [File Structure After Integration](#35-file-structure-after-integration)
36. [Code Examples (JavaScript)](#36-code-examples-javascript)
37. [Troubleshooting and Common Pitfalls](#37-troubleshooting-and-common-pitfalls)
38. [Enterprise Readiness (Future)](#38-enterprise-readiness-future)

---

## 1. Executive Summary

### Goal

Transform the Tech Revision Platform from a **static content delivery system** into an **AI-powered adaptive learning platform** that can:

1. **Auto-generate** interview questions, exercises, and program exercises for any topic
2. **Auto-generate** MCQ quizzes with difficulty levels, explanations, and deduplication
3. **Provide a chatbot** that answers questions grounded in platform content (RAG)
4. **Adapt to each user** with weak-topic detection, spaced repetition, and personalized plans
5. **Simulate interviews** with timed rounds, rubric scoring, and actionable feedback
6. **Run code exercises** in-browser with test cases, complexity hints, and similarity checks

### v1 to v2 Changes

| Area | v1 Problem | v2 Fix |
|------|-----------|--------|
| Content writes | Runtime writes to `public/` (breaks on Vercel/serverless) | DB is source-of-truth; publish via build step or CDN |
| Stack reference | Document said TypeScript; project is JavaScript | All code examples are JS (.jsx), TS mentioned as optional migration |
| Job design | Synchronous API routes for generation (timeout risk) | Async job queue with status polling and idempotency keys |
| Security | Role check only; no CSRF, audit, or abuse detection | Full endpoint security checklist with audit trail |
| RAG quality | No eval framework | Automated evals: faithfulness, citation precision, hallucination rate |
| Cost control | Pricing tables only | Hard budget caps, model fallback ladder, per-user limits, kill switch |
| Data governance | Chat stored but no retention/deletion policy | Retention windows, user export/delete, PII handling policy |
| Encoding | Mojibake characters from wrong encoding | File saved as clean UTF-8 |

---

## 2. Current Architecture Analysis

### How Content Works Today

```
public/content/{technology}/
  meta.json              -- Page title and description
  quiz.json              -- Array of MCQ questions
  topics/
    index.json           -- Topic listing with file paths and categories
    topic-1.json         -- Full topic content (10/10/10 standard)
    topic-2.json
    ...
```

### Current Content Schema (Topic JSON)

```json
{
  "id": "string (kebab-case)",
  "title": "string",
  "category": "string",
  "description": "string",
  "explanation": "string (markdown)",
  "code": "string (code block)",
  "example": "string",
  "useCase": "string",
  "interviewQuestions": [
    { "question": "string", "answer": "string" }
  ],
  "exercises": [
    { "type": "string", "question": "string", "answer": "string" }
  ],
  "programExercises": [
    { "question": "string", "code": "string", "output": "string" }
  ]
}
```

**Standard**: Each topic has exactly **10 interview questions**, **10 exercises**, **10 program exercises**.

### Current Quiz Schema

```json
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": 0,
    "explanation": "string"
  }
]
```

### Current Data Flow

```
Browser --> fetch('/content/{tech}/topics/index.json')
        --> fetch('/content/{tech}/topics/{id}.json')
        --> fetch('/content/{tech}/quiz.json')
        --> useTopicDataFromContent hook
        --> InterviewTopicPage component
        --> TopicDetail / MCQSection / Sidebar
```

### Key Components

| Component | Role |
|-----------|------|
| `hooks/useTopicDataFromContent.js` | Loads content from JSON files with JS fallback |
| `components/InterviewTopicPage.jsx` | Shared page shell (Navbar, Sidebar, TopicDetail, MCQ) |
| `components/TopicDetail.jsx` | Renders topic content with Mermaid diagram support |
| `components/MCQSection.jsx` | Renders quiz with score tracking |
| `components/Sidebar.jsx` | Category-grouped topic navigation |
| `data/{tech}.js` | Fallback data modules |

### What We Keep

- All existing static JSON content (seed data and fallback)
- All existing React components
- The `useTopicDataFromContent` hook pattern
- Tailwind CSS styling
- Next.js App Router structure

---

## 3. Target Architecture (Deploy-Safe)

### Critical Design Principle

> **The filesystem is read-only in production.** All generated content lives in the database. Content is published to static JSON either via a build-step CI pipeline or served directly from DB via API routes. Never write to `public/` at runtime.

### High-Level System Diagram

```
+------------------------------------------------------------------+
|                      FRONTEND (Next.js 15)                       |
|                                                                  |
|  +-----------+  +-----------+  +------------+  +---------+       |
|  | Topic     |  | Quiz      |  | Chatbot    |  | Admin   |       |
|  | Pages     |  | Section   |  | Widget     |  | Panel   |       |
|  +-----------+  +-----------+  +------------+  +---------+       |
|       |              |              |              |              |
+-------+--------------+--------------+--------------+--------------+
        |              |              |              |
        v              v              v              v
  +----------------------------------------------------------+
  |           Next.js API Routes (app/api/)                  |
  |                                                          |
  |  /api/content/[tech]/topics   GET   Serve from DB/cache  |
  |  /api/generate/topic          POST  Enqueue generation   |
  |  /api/generate/quiz           POST  Enqueue quiz gen     |
  |  /api/chat                    POST  RAG chat (streaming) |
  |  /api/jobs/[id]               GET   Poll job status      |
  |  /api/content/approve         POST  Approve + publish    |
  |  /api/content/publish         POST  Trigger CDN deploy   |
  |  /api/auth/[...nextauth]      ALL   Authentication       |
  +----+-------------+-------------+-------------+-----------+
       |             |             |             |
       v             v             v             v
  +-----------+ +-----------+ +-----------+ +-----------+
  | Job Queue | | PostgreSQL| | Vector DB | |   Redis   |
  | (BullMQ/  | |           | |           | |           |
  |  Inngest/ | | - Users   | | - pgvector| | - Rate    |
  |  QStash)  | | - Content | | - Pinecone| |   limits  |
  |           | | - Jobs    | |           | | - Cache   |
  | Workers:  | | - Chat    | |           | | - Sessions|
  | - Generate| | - Quizzes | |           | | - Pub/Sub |
  | - Embed   | | - Scores  | |           | |           |
  | - Publish | | - Audit   | |           | |           |
  +-----------+ +-----------+ +-----------+ +-----------+
                      |
                      v (build step / CI trigger)
               +-----------+
               | CDN / S3  |
               | (optional)|
               | Static    |
               | JSON      |
               +-----------+
```

### Content Lifecycle (Deploy-Safe)

```
1. GENERATE  -->  Admin triggers topic generation via UI
                  API enqueues async job (returns jobId immediately)
                  Worker calls LLM, validates output, stores in DB
                  Status: "pending_review"

2. REVIEW    -->  Admin previews generated content in admin panel
                  Can edit, regenerate, or approve
                  Status: "approved"

3. PUBLISH   -->  Two deployment strategies:
                  
                  Strategy A (Static Export - recommended for Vercel):
                    CI pipeline reads approved content from DB
                    Writes JSON files to public/content/
                    Deploys via next build
                    
                  Strategy B (API-Served - for Docker/VPS):
                    /api/content/[tech]/topics serves from DB directly
                    Redis cache layer (5-min TTL)
                    No filesystem writes needed

4. SERVE     -->  Frontend fetches content (same hook, different source)
                  useTopicDataFromContent falls through:
                    1. Try /api/content/... (if API-served)
                    2. Try /content/... static JSON (if static export)
                    3. Fall back to data/{tech}.js module
```

### Request Flow: Generate Topic Content (Async)

```
Admin clicks "Generate Topic"
    |
    v
POST /api/generate/topic
    |  Body: { technology, topicTitle, category, difficulty }
    |
    v
API Route (synchronous, <500ms):
    |-- Auth check (admin role)
    |-- Rate limit check
    |-- Deduplication check (DB query)
    |-- Generate idempotency key: hash(tech + title + category)
    |-- Enqueue job to job queue
    |-- Return { jobId, status: "queued" }
    |
    v
Worker picks up job (async, up to 60s):
    |-- Call LLM API with structured prompt
    |-- Parse JSON response
    |-- Validate with Zod schema
    |-- If invalid: retry with error feedback (max 2 retries)
    |-- Store validated content in DB (status: "pending_review")
    |-- Record token usage + cost
    |-- Update job status to "completed"
    |
    v
Frontend polls GET /api/jobs/{jobId} every 2s
    |-- Returns { status, result, error }
    |-- When "completed": show preview
    |
    v
Admin reviews and clicks "Approve"
    |
    v
POST /api/content/approve
    |-- Update DB status to "approved"
    |-- Write audit log entry
    |-- Trigger publish (Strategy A: webhook to CI, Strategy B: cache invalidation)
```

---

## 4. LLM Provider Selection

### Detailed Comparison

#### OpenAI

| Aspect | Details |
|--------|---------|
| **Models** | GPT-4o (best quality), GPT-4o-mini (budget), o3-mini (reasoning) |
| **Pricing** | GPT-4o: $2.50/1M input, $10/1M output; GPT-4o-mini: $0.15/1M input, $0.60/1M output |
| **Latency** | GPT-4o: 500ms-2s first token; GPT-4o-mini: 200ms-800ms |
| **Context Window** | 128K tokens (all models) |
| **Streaming** | Yes (SSE) |
| **JSON Mode** | Yes (`response_format: { type: "json_object" }`) - critical for our use case |
| **Structured Output** | Yes (function calling + JSON schema enforcement) |
| **Rate Limits** | Tier 1: 500 RPM, 30K TPM; Tier 2: 5000 RPM, 450K TPM |
| **SDK** | `openai` npm package - excellent, well-documented |
| **Best For** | Highest quality content generation, JSON mode guarantees valid JSON |

#### Google Gemini

| Aspect | Details |
|--------|---------|
| **Models** | Gemini 2.0 Flash (fast), Gemini 1.5 Pro (quality) |
| **Pricing** | Flash: FREE up to 15 RPM / 1M TPD; Pro: $1.25-$5/1M tokens |
| **Latency** | Flash: 300ms-1s; Pro: 600ms-2s |
| **Context Window** | 1M tokens (Flash), 2M tokens (Pro) |
| **Streaming** | Yes |
| **JSON Mode** | Yes (via `responseMimeType: "application/json"`) |
| **Rate Limits** | Free tier: 15 RPM, 1M TPD, 1500 RPD |
| **SDK** | `@google/generative-ai` npm package |
| **Best For** | Prototyping (free tier), processing very large context |

#### Anthropic Claude

| Aspect | Details |
|--------|---------|
| **Models** | Claude 3.5 Sonnet (balanced), Claude 3 Opus (best), Claude 3 Haiku (fast) |
| **Pricing** | Sonnet: $3/1M input, $15/1M output; Haiku: $0.25/1M input, $1.25/1M output |
| **Context Window** | 200K tokens |
| **JSON Mode** | Not native - must instruct via prompt |
| **Best For** | Nuanced explanations, safety, longer-form content |

#### Self-Hosted (Ollama + Open Source Models)

| Aspect | Details |
|--------|---------|
| **Models** | Llama 3.1 70B, Mistral Large, CodeLlama, DeepSeek Coder |
| **Pricing** | Free (GPU costs only) |
| **Requirements** | GPU with 24GB+ VRAM for 70B models; 8GB for 7B models |
| **SDK** | `ollama` npm package, OpenAI-compatible API |
| **Best For** | Full privacy, no API costs, offline development |

**How to set up Ollama locally:**

```bash
# Install Ollama (Windows)
winget install Ollama.Ollama

# Pull a model
ollama pull llama3.1:8b     # Good quality (requires 8GB VRAM)
ollama pull mistral          # Fast, 7B model

# Ollama exposes OpenAI-compatible API at http://localhost:11434
```

### Model Fallback Ladder (Cost Control)

When budget is tight, the system automatically falls back to cheaper models:

```
Budget > 50%:  GPT-4o-mini       (best quality, $0.60/1M output)
Budget > 80%:  Gemini 2.0 Flash  (free tier)
Budget > 90%:  Generation disabled, chatbot only with Gemini free
Budget = 100%: All AI features disabled (kill switch)
```

### Recommendation Matrix

| Scenario | Recommended Provider | Cost |
|----------|---------------------|------|
| **$0 prototype** | Gemini 2.0 Flash | Free |
| **$0 with speed** | Groq Llama 3.3 70B | Free |
| **$0 multi-model** | OpenRouter (free models) | Free |
| **$0 offline** | Ollama + Llama 3.1 8B | Free (local GPU) |
| **$0 GitHub user** | GitHub Models (GPT-4o-mini) | Free |
| **$0 production** | Gemini Flash + Groq fallback | Free |
| **Low-cost production** | OpenAI GPT-4o-mini | ~$3/mo |
| **Best quality** | OpenAI GPT-4o | ~$45/mo |

---

## 5. Async Job System

### Why Async is Required

| Problem with Synchronous | Impact |
|--------------------------|--------|
| LLM calls take 5-30 seconds | Vercel serverless timeout (10s free, 60s pro) |
| No retry on partial failure | User loses the entire generation if validation fails |
| No progress visibility | User stares at a spinner with no feedback |
| No idempotency | Duplicate requests waste tokens and money |
| No audit trail | Cannot track what was generated, when, by whom |

### Job Queue Options

#### Option A: Inngest (Recommended for Vercel)

Inngest is a serverless job queue designed for Next.js:

```bash
npm install inngest
```

```javascript
// lib/jobs/client.js
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "tech-revision-platform",
});
```

```javascript
// lib/jobs/generate-topic.js
import { inngest } from "./client";
import { generateTopicContent } from "../ai/generate-topic";
import { validateTopicSchema } from "../validators/topic-schema";
import { db } from "../db";

export const generateTopicJob = inngest.createFunction(
  {
    id: "generate-topic",
    retries: 2,
    idempotency: "event.data.idempotencyKey",
    rateLimit: { limit: 5, period: "1m" },
  },
  { event: "content/generate.topic" },
  async ({ event, step }) => {
    const { technology, topicTitle, category, difficulty, userId } = event.data;

    // Step 1: Generate content (retryable independently)
    const rawContent = await step.run("call-llm", async () => {
      return await generateTopicContent({ technology, topicTitle, category, difficulty });
    });

    // Step 2: Validate schema
    const validated = await step.run("validate", async () => {
      const result = validateTopicSchema(rawContent);
      if (!result.success) {
        throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
      }
      return result.data;
    });

    // Step 3: Store in database
    const saved = await step.run("persist", async () => {
      return await db.generatedContent.create({
        data: {
          technology,
          topicId: validated.id,
          title: validated.title,
          category,
          content: validated,
          status: "PENDING",
          generatedBy: userId,
          model: process.env.AI_MODEL || "gpt-4o-mini",
        },
      });
    });

    // Step 4: Write audit log
    await step.run("audit", async () => {
      await db.auditLog.create({
        data: {
          action: "CONTENT_GENERATED",
          entityType: "TOPIC",
          entityId: saved.id,
          userId,
          metadata: { technology, topicTitle, model: saved.model },
        },
      });
    });

    return { contentId: saved.id, status: "pending_review" };
  }
);
```

```javascript
// app/api/inngest/route.js
import { serve } from "inngest/next";
import { inngest } from "@/lib/jobs/client";
import { generateTopicJob } from "@/lib/jobs/generate-topic";
import { generateQuizJob } from "@/lib/jobs/generate-quiz";
import { embedContentJob } from "@/lib/jobs/embed-content";
import { publishContentJob } from "@/lib/jobs/publish-content";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateTopicJob, generateQuizJob, embedContentJob, publishContentJob],
});
```

#### Option B: BullMQ (For Docker/VPS)

```bash
npm install bullmq ioredis
```

```javascript
// lib/jobs/queue.js
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL);

export const generateQueue = new Queue("generate", { connection });

// Worker (runs in separate process or same server)
const worker = new Worker("generate", async (job) => {
  const { type, payload } = job.data;
  
  switch (type) {
    case "topic":
      return await handleTopicGeneration(payload);
    case "quiz":
      return await handleQuizGeneration(payload);
    case "embed":
      return await handleEmbedding(payload);
  }
}, {
  connection,
  concurrency: 3,
  limiter: { max: 10, duration: 60000 }, // 10 jobs per minute
});
```

#### Option C: QStash (Upstash - Serverless)

```bash
npm install @upstash/qstash
```

```javascript
// lib/jobs/qstash.js
import { Client } from "@upstash/qstash";

const qstash = new Client({ token: process.env.QSTASH_TOKEN });

export async function enqueueGeneration(payload) {
  const result = await qstash.publishJSON({
    url: `${process.env.NEXTAUTH_URL}/api/workers/generate`,
    body: payload,
    retries: 2,
    deduplicationId: payload.idempotencyKey,
  });
  return result.messageId;
}
```

### Job Status Polling

```javascript
// app/api/jobs/[id]/route.js
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = await params;

  const job = await db.job.findUnique({ where: { id } });
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  return Response.json({
    id: job.id,
    status: job.status,        // "queued" | "running" | "completed" | "failed"
    progress: job.progress,    // 0-100
    result: job.result,        // null until completed
    error: job.error,          // null unless failed
    createdAt: job.createdAt,
    completedAt: job.completedAt,
  });
}
```

Frontend polls this endpoint:

```javascript
// hooks/useJobStatus.js
import { useState, useEffect, useCallback } from "react";

export function useJobStatus(jobId) {
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "completed") {
          setResult(data.result);
          clearInterval(interval);
        } else if (data.status === "failed") {
          setError(data.error);
          clearInterval(interval);
        }
      } catch (err) {
        setError(err.message);
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [jobId]);

  return { status, result, error };
}
```

---

## 6. Backend API Layer

### API Routes Structure

```
app/api/
  auth/
    [...nextauth]/route.js       -- NextAuth.js handler
  generate/
    topic/route.js               -- POST: Enqueue topic generation job
    quiz/route.js                -- POST: Enqueue quiz generation job
  chat/
    route.js                     -- POST: RAG chat (streaming)
  content/
    [tech]/
      topics/route.js            -- GET: Serve topics from DB (Strategy B)
      quiz/route.js              -- GET: Serve quiz from DB
    approve/route.js             -- POST: Approve generated content
    publish/route.js             -- POST: Trigger CDN deploy
    list/route.js                -- GET: List all content with statuses
  jobs/
    [id]/route.js                -- GET: Poll job status
  embeddings/
    sync/route.js                -- POST: Trigger embedding ingestion
  admin/
    budget/route.js              -- GET: Current spend and budget status
    audit/route.js               -- GET: Audit log viewer
  inngest/route.js               -- Inngest webhook handler
  health/route.js                -- GET: Health check
```

### Standard API Route Pattern

Every API route follows this security-first pattern:

```javascript
// Example: app/api/generate/topic/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { checkBudget } from "@/lib/cost-tracker";
import { auditLog } from "@/lib/audit";
import { inngest } from "@/lib/jobs/client";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request) {
  // 1. Authentication
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. CSRF: NextAuth session cookie + SameSite=Strict handles this
  // Additional: check Origin header matches allowed origins
  const origin = request.headers.get("origin");
  if (origin && !process.env.ALLOWED_ORIGINS?.split(",").includes(origin)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  // 3. Rate limiting (per-user)
  const rl = await rateLimit(session.user.id, "generate");
  if (!rl.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // 4. Budget check
  const budget = await checkBudget();
  if (budget.isOverBudget) {
    return NextResponse.json(
      { error: "Monthly AI budget exceeded", spent: budget.spent, budget: budget.budget },
      { status: 402 }
    );
  }

  // 5. Parse and validate input
  const body = await request.json();
  const { technology, topicTitle, category, difficulty } = body;
  if (!technology || !topicTitle) {
    return NextResponse.json({ error: "technology and topicTitle are required" }, { status: 400 });
  }

  // 6. Idempotency key (prevents duplicate generation)
  const idempotencyKey = crypto
    .createHash("sha256")
    .update(`${technology}:${topicTitle}:${category || ""}`)
    .digest("hex");

  // 7. Deduplication check
  const existing = await db.generatedContent.findFirst({
    where: { technology, title: topicTitle, status: { in: ["APPROVED", "PENDING", "PUBLISHED"] } },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Content already exists", existingId: existing.id, status: existing.status },
      { status: 409 }
    );
  }

  // 8. Enqueue async job
  const { ids } = await inngest.send({
    name: "content/generate.topic",
    data: {
      technology,
      topicTitle,
      category: category || "General",
      difficulty: difficulty || "intermediate",
      userId: session.user.id,
      idempotencyKey,
    },
  });

  // 9. Audit log
  await auditLog({
    action: "GENERATION_REQUESTED",
    userId: session.user.id,
    metadata: { technology, topicTitle, jobId: ids[0] },
  });

  // 10. Return immediately with job ID for polling
  return NextResponse.json({
    jobId: ids[0],
    status: "queued",
    message: "Generation job queued. Poll /api/jobs/{jobId} for status.",
    idempotencyKey,
  });
}
```

---

## 7. Database Schema

### Prisma Schema (Complete)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// Authentication
// ============================================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts          Account[]
  sessions          Session[]
  generatedContent  GeneratedContent[]
  conversations     ChatConversation[]
  quizAttempts      QuizAttempt[]
  auditActions      AuditLog[]         @relation("actor")
  topicProgress     TopicProgress[]
  studyPlans        StudyPlan[]

  // Data governance
  dataExportedAt    DateTime?
  dataDeletedAt     DateTime?
  consentGivenAt    DateTime?
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

// ============================================================
// Async Jobs
// ============================================================

model Job {
  id            String    @id @default(cuid())
  type          String    // "generate_topic" | "generate_quiz" | "embed" | "publish"
  status        JobStatus @default(QUEUED)
  progress      Int       @default(0)
  input         Json      // Job input parameters
  result        Json?     // Job output (null until completed)
  error         String?   // Error message if failed
  idempotencyKey String?  @unique
  attempts      Int       @default(0)
  maxAttempts   Int       @default(3)
  
  createdAt     DateTime  @default(now())
  startedAt     DateTime?
  completedAt   DateTime?
  
  createdBy     String
  
  @@index([status])
  @@index([type, status])
  @@index([createdBy])
}

enum JobStatus {
  QUEUED
  RUNNING
  COMPLETED
  FAILED
  CANCELLED
}

// ============================================================
// Generated Content (Source of Truth)
// ============================================================

model GeneratedContent {
  id            String        @id @default(cuid())
  technology    String
  topicId       String        // Slug: "consistent-hashing"
  title         String
  category      String
  content       Json          // Full topic JSON object
  status        ContentStatus @default(PENDING)
  version       Int           @default(1)

  // Generation metadata
  model         String        // "gpt-4o-mini", "gemini-2.0-flash"
  promptTokens  Int?
  completionTokens Int?
  totalCost     Float?

  // Workflow
  generatedBy   String
  user          User          @relation(fields: [generatedBy], references: [id])
  reviewedBy    String?
  reviewNote    String?
  approvedAt    DateTime?
  publishedAt   DateTime?

  // Content versioning
  previousVersionId String?
  changeDescription String?

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@unique([technology, topicId, version])
  @@index([technology, status])
  @@index([status])
}

enum ContentStatus {
  PENDING       // Generated, awaiting review
  APPROVED      // Reviewed and approved
  PUBLISHED     // Live (deployed to CDN or served via API)
  REJECTED      // Reviewed and rejected
  ARCHIVED      // Replaced by newer version
}

// ============================================================
// Generated Quizzes
// ============================================================

model GeneratedQuiz {
  id            String        @id @default(cuid())
  technology    String
  topicId       String?       // null = general quiz
  difficulty    Difficulty    @default(MEDIUM)
  questions     Json          // Array of quiz question objects
  questionCount Int
  status        ContentStatus @default(PENDING)
  model         String

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([technology, status])
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  MIXED
}

// ============================================================
// Chat / Chatbot
// ============================================================

model ChatConversation {
  id           String   @id @default(cuid())
  userId       String
  technology   String?
  title        String?

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages     ChatMessage[]

  // Data governance
  expiresAt    DateTime   // Auto-set to createdAt + retention window
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
  @@index([expiresAt])   // For retention cleanup job
}

model ChatMessage {
  id             String      @id @default(cuid())
  conversationId String
  role           MessageRole
  content        String      @db.Text

  // RAG metadata
  sources        Json?       // Array of source topic IDs used for context
  tokenUsage     Int?
  faithfulnessScore Float?   // Auto-eval: 0-1

  conversation   ChatConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())

  @@index([conversationId])
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

// ============================================================
// Quiz Attempts and Scoring
// ============================================================

model QuizAttempt {
  id             String   @id @default(cuid())
  userId         String
  technology     String
  quizType       String   // "static" | "generated"
  quizId         String?
  difficulty     Difficulty?

  totalQuestions  Int
  correctAnswers Int
  score          Float    // Percentage 0-100
  timeTaken      Int?     // Seconds
  answers        Json     // { questionIndex: selectedOption }

  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())

  @@index([userId, technology])
  @@index([userId, createdAt])
}

// ============================================================
// Adaptive Learning
// ============================================================

model TopicProgress {
  id            String   @id @default(cuid())
  userId        String
  technology    String
  topicId       String
  
  // Spaced repetition
  easeFactor    Float    @default(2.5)   // SM-2 algorithm
  interval      Int      @default(1)      // Days until next review
  repetitions   Int      @default(0)
  nextReviewAt  DateTime @default(now())
  
  // Performance tracking
  totalAttempts Int      @default(0)
  correctCount  Int      @default(0)
  lastScore     Float?
  weakAreas     Json?    // Array of specific weak sub-topics

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([userId, technology, topicId])
  @@index([userId, nextReviewAt])
}

model StudyPlan {
  id            String   @id @default(cuid())
  userId        String
  title         String   // "Google SDE-2 Prep", "Daily Plan Feb 14"
  targetDate    DateTime?
  technologies  Json     // ["system-design", "javascript", "react"]
  dailyMinutes  Int      @default(60)
  schedule      Json     // Array of { date, topics: [], completed: bool }
  
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([userId])
}

// ============================================================
// Audit Trail
// ============================================================

model AuditLog {
  id          String   @id @default(cuid())
  action      String   // "CONTENT_GENERATED", "CONTENT_APPROVED", "CONTENT_PUBLISHED", etc.
  entityType  String?  // "TOPIC", "QUIZ", "USER"
  entityId    String?
  userId      String
  user        User     @relation("actor", fields: [userId], references: [id])
  metadata    Json?    // Additional context
  ipAddress   String?
  userAgent   String?

  createdAt   DateTime @default(now())

  @@index([action])
  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt])
}

// ============================================================
// Cost Tracking
// ============================================================

model AIUsageLog {
  id              String   @id @default(cuid())
  userId          String
  operation       String   // "generate_topic", "generate_quiz", "chat", "embed"
  model           String
  promptTokens    Int
  completionTokens Int
  totalTokens     Int
  estimatedCost   Float    // USD
  
  createdAt       DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
  @@index([operation])
}

// ============================================================
// Vector Embeddings (if using pgvector)
// ============================================================

// Requires: CREATE EXTENSION IF NOT EXISTS vector;

model ContentEmbedding {
  id          String   @id @default(cuid())
  technology  String
  topicId     String
  chunkIndex  Int
  chunkText   String   @db.Text
  chunkType   String   // "overview", "code", "qa", "exercise"
  // embedding  vector(1536)  -- Handled via raw SQL, not Prisma native
  metadata    Json?

  createdAt   DateTime @default(now())

  @@unique([technology, topicId, chunkIndex])
  @@index([technology])
}
```

### Database Setup

```bash
npm install prisma @prisma/client
npx prisma init
# Edit prisma/schema.prisma (above)
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio   # GUI viewer at localhost:5555
```

---

## 8. Deploy-Safe Content Pipeline

### Strategy A: Static Export via CI (Recommended for Vercel)

```
DB (source of truth)  -->  CI Job (GitHub Action)  -->  public/content/  -->  next build  -->  Vercel deploy
```

```yaml
# .github/workflows/publish-content.yml
name: Publish Content
on:
  workflow_dispatch:     # Manual trigger from admin panel
  repository_dispatch:   # Webhook trigger from /api/content/publish
    types: [content-approved]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - run: npm ci
      
      - name: Export content from DB to JSON
        run: node scripts/export-content-from-db.js
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Commit and push
        run: |
          git config user.name "Content Bot"
          git config user.email "bot@techrevision.dev"
          git add public/content/
          git diff --staged --quiet || git commit -m "chore: publish approved content"
          git push
      
      # Vercel auto-deploys on push to main
```

```javascript
// scripts/export-content-from-db.js
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const db = new PrismaClient();

async function exportContent() {
  // Get all published content grouped by technology
  const content = await db.generatedContent.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ technology: "asc" }, { category: "asc" }, { title: "asc" }],
  });

  const grouped = {};
  for (const item of content) {
    if (!grouped[item.technology]) grouped[item.technology] = [];
    grouped[item.technology].push(item);
  }

  for (const [tech, items] of Object.entries(grouped)) {
    const topicsDir = path.join("public", "content", tech, "topics");
    fs.mkdirSync(topicsDir, { recursive: true });

    // Write individual topic files
    for (const item of items) {
      const filePath = path.join(topicsDir, `${item.topicId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(item.content, null, 2));
    }

    // Write index.json
    const index = items.map((item) => ({
      id: item.topicId,
      file: `topics/${item.topicId}.json`,
      title: item.title,
      category: item.category,
    }));
    fs.writeFileSync(path.join(topicsDir, "index.json"), JSON.stringify(index, null, 2));
  }

  console.log(`Exported ${content.length} topics across ${Object.keys(grouped).length} technologies`);
}

exportContent()
  .catch(console.error)
  .finally(() => db.$disconnect());
```

### Strategy B: API-Served Content (For Docker/VPS)

```javascript
// app/api/content/[tech]/topics/route.js
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Cache in Redis for 5 minutes
const CACHE_TTL = 300;

export async function GET(request, { params }) {
  const { tech } = await params;
  const url = new URL(request.url);
  const topicId = url.searchParams.get("id");

  if (topicId) {
    // Serve single topic
    const topic = await db.generatedContent.findFirst({
      where: { technology: tech, topicId, status: "PUBLISHED" },
      orderBy: { version: "desc" },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic.content, {
      headers: { "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` },
    });
  }

  // Serve index
  const topics = await db.generatedContent.findMany({
    where: { technology: tech, status: "PUBLISHED" },
    orderBy: [{ category: "asc" }, { title: "asc" }],
    select: { topicId: true, title: true, category: true },
  });

  const index = topics.map((t) => ({
    id: t.topicId,
    file: `topics/${t.topicId}.json`,
    title: t.title,
    category: t.category,
  }));

  return NextResponse.json(index, {
    headers: { "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=60` },
  });
}
```

### Updated Content Hook (Supports Both Strategies)

```javascript
// hooks/useTopicDataFromContent.js (updated)
// Priority: API-served DB content > static JSON > JS fallback

export function useTopicDataFromContent(technology, fallbackData, fallbackQuiz) {
  // ... existing logic ...

  async function loadTopics() {
    // Strategy B: Try API first
    try {
      const res = await fetch(`/api/content/${technology}/topics`);
      if (res.ok) return await res.json();
    } catch (e) { /* fall through */ }

    // Strategy A: Try static JSON
    try {
      const res = await fetch(`/content/${technology}/topics/index.json`);
      if (res.ok) return await res.json();
    } catch (e) { /* fall through */ }

    // Fallback to JS data
    return fallbackData;
  }

  // ... rest of hook ...
}
```

---

## 9. Feature: Auto-Generate Topic Content

### Generation Logic

```javascript
// lib/ai/generate-topic.js
import { getAIClient } from "./client";

export async function generateTopicContent({ technology, topicTitle, category, difficulty, errorFeedback }) {
  const client = getAIClient();

  const systemPrompt = `You are an expert technical content creator for an interview preparation platform.
You generate comprehensive, accurate, and practical content for software engineering topics.

RULES:
1. All code must be syntactically correct and runnable
2. Answers must be detailed (3-5 sentences minimum)
3. Interview questions should range from basic to advanced
4. Program exercises must include complete, working code with accurate output
5. Exercise types must vary (conceptual, practical, debugging, code-review, design, comparison, scenario, optimization)
6. Content must be factually accurate and up-to-date
7. Use markdown formatting in explanation field
8. Return ONLY valid JSON, no markdown code fences

OUTPUT SCHEMA:
{
  "id": "kebab-case-slug",
  "title": "Topic Title",
  "category": "${category}",
  "description": "2-3 sentence overview (50-500 chars)",
  "explanation": "Detailed markdown explanation with ## headers, bullet points, and examples",
  "code": "Primary code example demonstrating the concept",
  "example": "Practical real-world example or scenario",
  "useCase": "When and why to use this in production",
  "interviewQuestions": [
    { "question": "...", "answer": "..." }
  ],
  "exercises": [
    { "type": "conceptual|practical|debugging|code-review|design|comparison|scenario|optimization", "question": "...", "answer": "..." }
  ],
  "programExercises": [
    { "question": "...", "code": "...", "output": "..." }
  ]
}

REQUIREMENTS:
- Exactly 10 interviewQuestions
- Exactly 10 exercises (with varied types)
- Exactly 10 programExercises (with working code and expected output)`;

  let userPrompt = `Generate a complete topic JSON for **${topicTitle}** in the **${technology}** technology area.
Category: ${category}
Difficulty level: ${difficulty}
Target audience: Software engineers preparing for technical interviews.`;

  if (errorFeedback) {
    userPrompt += `\n\nPREVIOUS ATTEMPT FAILED VALIDATION. Fix these errors:\n${JSON.stringify(errorFeedback, null, 2)}`;
  }

  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 8000,
  });

  const content = JSON.parse(response.choices[0].message.content);

  content._tokenUsage = {
    prompt: response.usage.prompt_tokens,
    completion: response.usage.completion_tokens,
    total: response.usage.total_tokens,
  };

  return content;
}
```

### AI Client Factory

```javascript
// lib/ai/client.js
import OpenAI from "openai";

let clientInstance = null;

export function getAIClient() {
  if (clientInstance) return clientInstance;

  const provider = process.env.AI_PROVIDER || "openai";

  switch (provider) {
    case "openai":
      clientInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      break;

    case "gemini":
      clientInstance = new OpenAI({
        apiKey: process.env.GOOGLE_AI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });
      break;

    case "ollama":
      clientInstance = new OpenAI({
        apiKey: "ollama",
        baseURL: "http://localhost:11434/v1",
      });
      break;

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }

  return clientInstance;
}
```

### Validation Layer

```javascript
// lib/validators/topic-schema.js
import { z } from "zod";

const interviewQuestionSchema = z.object({
  question: z.string().min(20, "Question must be at least 20 characters"),
  answer: z.string().min(50, "Answer must be at least 50 characters"),
});

const exerciseSchema = z.object({
  type: z.enum([
    "conceptual", "practical", "debugging", "code-review",
    "design", "comparison", "scenario", "optimization",
    "true-false", "fill-in-the-blank",
  ]),
  question: z.string().min(20),
  answer: z.string().min(30),
});

const programExerciseSchema = z.object({
  question: z.string().min(20),
  code: z.string().min(20),
  output: z.string().min(1),
});

export const topicSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID must be lowercase alphanumeric with hyphens"),
  title: z.string().min(5).max(100),
  category: z.string().min(2),
  description: z.string().min(50).max(500),
  explanation: z.string().min(200),
  code: z.string().min(20),
  example: z.string().min(50),
  useCase: z.string().min(50),
  interviewQuestions: z.array(interviewQuestionSchema).length(10),
  exercises: z.array(exerciseSchema).length(10),
  programExercises: z.array(programExerciseSchema).length(10),
});

export function validateTopicSchema(data) {
  const result = topicSchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors: result.error.issues.map((i) => ({
      path: i.path.join("."),
      message: i.message,
    })),
  };
}
```

---

## 10. Feature: Auto-Generate Quizzes

```javascript
// lib/ai/generate-quiz.js
import { getAIClient } from "./client";

export async function generateQuizQuestions({
  technology,
  topicId = null,
  difficulty = "mixed",
  count = 10,
  existingQuestions = [],
}) {
  const client = getAIClient();

  const existingSummary = existingQuestions.length > 0
    ? `\n\nAVOID DUPLICATING THESE:\n${existingQuestions.map((q) => `- ${q.question}`).join("\n")}`
    : "";

  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You create ${count} ${difficulty} MCQ questions for ${technology}${topicId ? ` (topic: ${topicId})` : ""}.
Each question has exactly 4 options, a 0-based correctAnswer index, and an explanation.
Return JSON: { "questions": [...] }`,
      },
      { role: "user", content: `Generate ${count} ${difficulty} questions.${existingSummary}` },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: count * 400,
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return Array.isArray(parsed) ? parsed : parsed.questions;
}
```

---

## 11. Feature: RAG Chatbot

### RAG Pipeline

```
User question
    |
    v
Embed question (text-embedding-3-small)
    |
    v
Vector search (top-5 similar chunks from platform content)
    |
    v
Construct prompt: system + context chunks + chat history + user question
    |
    v
Stream LLM response with source citations
    |
    v
Auto-evaluate: faithfulness score (0-1) stored per message
```

### Chat API with Streaming

```javascript
// app/api/chat/route.js
import { getAIClient } from "@/lib/ai/client";
import { searchSimilarContent } from "@/lib/vector-db/search";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const rl = await rateLimit(session.user.id, "chat");
  if (!rl.success) return Response.json({ error: "Rate limit" }, { status: 429 });

  const { message, conversationId, technology } = await request.json();
  const client = getAIClient();

  // 1. Search for relevant content
  const relevantChunks = await searchSimilarContent(message, {
    technology,
    topK: 5,
    minScore: 0.5,
  });

  const context = relevantChunks
    .map((c) => `--- Source: ${c.metadata.topicTitle} (${c.metadata.category}) ---\n${c.text}`)
    .join("\n\n");

  // 2. Get conversation history
  let history = [];
  if (conversationId) {
    const messages = await db.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 20,
    });
    history = messages.map((m) => ({ role: m.role.toLowerCase(), content: m.content }));
  }

  // 3. Construct messages
  const systemMessage = `You are an expert interview preparation assistant for the Tech Revision Platform.

RULES:
1. Answer using ONLY the provided context from the platform's content
2. If context is insufficient, say so honestly and suggest nearest topics
3. Provide code examples when relevant
4. Reference specific topics by name so users can find them
5. Use markdown formatting

CONTEXT FROM PLATFORM:
${context}`;

  const llmMessages = [
    { role: "system", content: systemMessage },
    ...history,
    { role: "user", content: message },
  ];

  // 4. Stream response
  const stream = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: llmMessages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1500,
  });

  // 5. Create SSE stream
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
      }

      const sources = relevantChunks.map((c) => ({
        topicId: c.metadata.topicId,
        topicTitle: c.metadata.topicTitle,
        technology: c.metadata.technology,
        score: c.score,
      }));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources, done: true })}\n\n`));

      // Persist to DB
      if (conversationId) {
        await db.chatMessage.createMany({
          data: [
            { conversationId, role: "USER", content: message },
            { conversationId, role: "ASSISTANT", content: fullResponse, sources },
          ],
        });
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

### Chatbot UI Component

```jsx
// components/Chatbot.jsx
"use client";
import { useState, useRef, useEffect } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything about the topics on this platform." },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isStreaming) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "", sources: [] }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          conversationId,
          technology: window.location.pathname.split("/")[1] || null,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = JSON.parse(line.slice(6));
          if (data.done) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].sources = data.sources;
              return updated;
            });
          } else if (data.content) {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].content += data.content;
              return updated;
            });
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Sorry, something went wrong. Please try again.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50 flex items-center justify-center text-xl">
        AI
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-700 flex flex-col z-50">
      <div className="p-4 border-b dark:border-gray-700 bg-blue-600 text-white rounded-t-xl flex justify-between">
        <div>
          <h3 className="font-bold">Interview Prep Assistant</h3>
          <p className="text-xs text-blue-200">Ask about any topic</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200">X</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
              msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
            }`}>
              {msg.content}
              {msg.sources?.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs">
                  <p className="font-medium">Sources:</p>
                  {msg.sources.map((s, j) => (
                    <a key={j} href={`/${s.technology}?topic=${s.topicId}`}
                      className="text-blue-400 hover:underline block">{s.topicTitle}</a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t dark:border-gray-700 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
          disabled={isStreaming} />
        <button onClick={handleSend} disabled={isStreaming || !input.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm">
          Send
        </button>
      </div>
    </div>
  );
}
```

---

## 12. Feature: Adaptive Learning Engine

### Overview

Detect user weaknesses automatically and schedule reviews using spaced repetition (SM-2 algorithm).

### Core Algorithm

```javascript
// lib/adaptive/sm2.js
// SuperMemo SM-2 spaced repetition algorithm

export function calculateNextReview({ quality, easeFactor, interval, repetitions }) {
  // quality: 0-5 (0=complete blackout, 5=perfect response)
  let newEF = easeFactor;
  let newInterval = interval;
  let newReps = repetitions;

  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval * easeFactor);
    newReps = repetitions + 1;
  } else {
    // Incorrect - reset
    newInterval = 1;
    newReps = 0;
  }

  // Update ease factor
  newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF); // Minimum ease factor

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  return {
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReviewAt,
  };
}
```

### Weak-Topic Detection

```javascript
// lib/adaptive/weakness-detector.js

export async function detectWeakTopics(userId, technology) {
  const progress = await db.topicProgress.findMany({
    where: { userId, technology },
    orderBy: { lastScore: "asc" },
  });

  const quizAttempts = await db.quizAttempt.findMany({
    where: { userId, technology },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Topics with score < 60% or overdue for review
  const weakTopics = progress.filter((p) =>
    (p.lastScore !== null && p.lastScore < 60) ||
    (p.nextReviewAt < new Date())
  );

  // Topics with declining quiz scores
  const declining = findDecliningTopics(quizAttempts);

  return {
    weakTopics: weakTopics.map((t) => t.topicId),
    decliningTopics: declining,
    overdueReviews: progress.filter((p) => p.nextReviewAt < new Date()).length,
    overallReadiness: calculateReadiness(progress),
  };
}

function calculateReadiness(progress) {
  if (progress.length === 0) return 0;
  const avgScore = progress.reduce((sum, p) => sum + (p.lastScore || 0), 0) / progress.length;
  const overdueRatio = progress.filter((p) => p.nextReviewAt < new Date()).length / progress.length;
  return Math.round(Math.max(0, avgScore * (1 - overdueRatio * 0.5)));
}
```

### Personalized Daily Plan

```javascript
// lib/adaptive/study-plan.js

export async function generateDailyPlan(userId, dailyMinutes = 60) {
  const allProgress = await db.topicProgress.findMany({ where: { userId } });
  const overdueTopics = allProgress
    .filter((p) => p.nextReviewAt <= new Date())
    .sort((a, b) => a.nextReviewAt - b.nextReviewAt);

  const plan = [];
  let remainingMinutes = dailyMinutes;

  // Priority 1: Overdue reviews (5 min each)
  for (const topic of overdueTopics.slice(0, 5)) {
    if (remainingMinutes < 5) break;
    plan.push({ type: "review", topicId: topic.topicId, technology: topic.technology, minutes: 5 });
    remainingMinutes -= 5;
  }

  // Priority 2: Weak topics (10 min each)
  const weakTopics = allProgress.filter((p) => p.lastScore !== null && p.lastScore < 60);
  for (const topic of weakTopics.slice(0, 3)) {
    if (remainingMinutes < 10) break;
    plan.push({ type: "practice", topicId: topic.topicId, technology: topic.technology, minutes: 10 });
    remainingMinutes -= 10;
  }

  // Priority 3: New topics (15 min each)
  // ... fill remaining time with unseen topics

  return plan;
}
```

---

## 13. Feature: Interview Simulator

### Overview

Timed interview rounds with rubric-based scoring and AI-generated feedback.

### Simulation Types

| Type | Duration | Format | Scoring |
|------|----------|--------|---------|
| System Design | 45 min | Open-ended + follow-ups | Requirements, scaling, trade-offs, communication |
| DSA | 30 min | Coding problem + optimization | Correctness, complexity, edge cases, code quality |
| Behavioral | 20 min | STAR method questions | Clarity, relevance, impact, self-awareness |
| Mixed | 60 min | All three types combined | Weighted aggregate |

### Data Model

```javascript
// Example interview session structure
const interviewSession = {
  id: "uuid",
  userId: "user-id",
  type: "system-design",          // or "dsa", "behavioral", "mixed"
  company: "google",               // optional company context
  role: "sde-2",                   // optional role level
  timeLimit: 2700,                 // 45 minutes in seconds
  status: "in-progress",           // "not-started", "in-progress", "completed", "abandoned"
  rounds: [
    {
      question: "Design a URL shortener service like bit.ly",
      userResponse: "...",
      followUpQuestions: ["How would you handle 1B URLs?", "What about analytics?"],
      followUpResponses: ["...", "..."],
      rubric: {
        requirementsGathering: { score: 4, max: 5, feedback: "Good clarifying questions" },
        highLevelDesign: { score: 3, max: 5, feedback: "Missing CDN layer" },
        detailedDesign: { score: 4, max: 5, feedback: "Solid DB schema" },
        scalability: { score: 3, max: 5, feedback: "Didn't discuss sharding" },
        tradeoffs: { score: 4, max: 5, feedback: "Good CAP analysis" },
      },
      totalScore: 18,
      maxScore: 25,
    },
  ],
  overallScore: 72,
  overallFeedback: "Strong on requirements and trade-offs. Improve scalability discussions.",
  completedAt: "2026-02-14T10:30:00Z",
};
```

---

## 14. Feature: Coding Lab

### Overview

In-browser code editor with hidden test cases, complexity analysis, and execution.

### Architecture

```
+-------------------+     +------------------+     +------------------+
| Monaco Editor     | --> | /api/code/run    | --> | Sandboxed Runner |
| (in-browser)      |     | (API route)      |     | (Docker/WASM)    |
+-------------------+     +------------------+     +------------------+
        |                         |                         |
        v                         v                         v
  User writes code       Validate + rate limit    Execute safely:
  Gets syntax help       Check hidden test cases  - Node.js (JS)
  Sees complexity hints  Return results           - Go runtime
                                                  - PostgreSQL sandbox
```

### Complexity Hints (Static Analysis)

```javascript
// lib/code-lab/complexity.js
export function analyzeComplexity(code, language) {
  const hints = [];

  if (language === "javascript") {
    // Nested loops detection
    const nestedLoops = (code.match(/for\s*\(|while\s*\(/g) || []).length;
    if (nestedLoops >= 2) hints.push({ type: "warning", message: `${nestedLoops} loops detected. Consider O(n^${nestedLoops}) time complexity.` });

    // Array method chaining
    const chainedMethods = (code.match(/\.(map|filter|reduce|forEach|find|some|every)\(/g) || []).length;
    if (chainedMethods >= 3) hints.push({ type: "info", message: `${chainedMethods} array iterations. Each is O(n), total O(${chainedMethods}n).` });

    // Recursion without memoization
    if (code.includes("function") && /return.*\bfunction_name\b/.test(code)) {
      if (!code.includes("memo") && !code.includes("cache") && !code.includes("Map")) {
        hints.push({ type: "warning", message: "Recursive function without memoization detected. Consider dynamic programming." });
      }
    }
  }

  return hints;
}
```

---

## 15. Feature: Company Tracks

### Overview

Curated preparation paths for specific companies and roles.

### Data Model

```json
{
  "company": "google",
  "role": "sde-2",
  "tracks": [
    {
      "name": "System Design",
      "weight": 0.35,
      "requiredTopics": ["sd-process", "capacity-consistency", "url-shortener", "chat-system"],
      "depth": "advanced",
      "tips": "Google expects strong capacity estimation and clear trade-off discussions"
    },
    {
      "name": "Data Structures & Algorithms",
      "weight": 0.35,
      "requiredTopics": ["arrays-slices", "maps", "goroutines"],
      "depth": "advanced"
    },
    {
      "name": "Behavioral",
      "weight": 0.15,
      "format": "STAR method",
      "topics": ["leadership", "conflict-resolution", "failure-stories"]
    },
    {
      "name": "Language Proficiency",
      "weight": 0.15,
      "requiredTopics": ["closures", "promises", "react-hooks"]
    }
  ],
  "estimatedPrepTime": "4-6 weeks",
  "interviewFormat": "Phone screen + 4-5 onsite rounds"
}
```

---

## 16. Feature: Mentor/Peer Layer

### Overview

Discussion threads per topic, peer answer reviews, and shared notes.

### Components

| Feature | Description |
|---------|-------------|
| **Topic Discussions** | Threaded comments on each topic page |
| **Answer Reviews** | Users submit answers, peers rate and comment |
| **Shared Notes** | Users create and share study notes per topic |
| **Study Groups** | Group chat rooms organized by technology or company target |

### Data Model (Key Tables)

```prisma
model Discussion {
  id          String @id @default(cuid())
  technology  String
  topicId     String
  userId      String
  content     String @db.Text
  parentId    String?  // For threading
  upvotes     Int @default(0)
  
  createdAt   DateTime @default(now())
  @@index([technology, topicId])
}

model AnswerReview {
  id          String @id @default(cuid())
  questionId  String  // Reference to interview question
  userId      String  // Who submitted the answer
  answer      String  @db.Text
  reviewerId  String? // Peer reviewer
  rating      Int?    // 1-5
  feedback    String? @db.Text
  
  createdAt   DateTime @default(now())
}
```

---

## 17. Feature: Analytics and Coaching

### Skill Graph

```javascript
// Data structure for skill visualization
const skillGraph = {
  userId: "user-id",
  technologies: {
    "javascript": {
      overallScore: 78,
      topicScores: {
        "closures": 92,
        "promises": 85,
        "event-loop": 65,
        "prototypes": 45,
      },
      trend: "improving",       // "improving" | "declining" | "stable"
      weeklyChange: +3.2,
      strengths: ["closures", "promises"],
      weaknesses: ["prototypes", "event-loop"],
    },
    "system-design": {
      overallScore: 62,
      // ...
    },
  },
  readinessScore: 71,           // Weighted aggregate across all technologies
  nextBestTopics: [
    { topicId: "prototypes", technology: "javascript", reason: "Lowest score, high interview frequency" },
    { topicId: "caching", technology: "system-design", reason: "Overdue for review" },
  ],
  streakDays: 14,
  totalStudyMinutes: 1840,
};
```

---

## 18. Feature: Content Ops (CMS-Grade)

### Content Versioning

Every content change creates a new version:

```
Version 1 (initial generation) --> Version 2 (manual edit) --> Version 3 (regeneration)
   status: ARCHIVED                  status: ARCHIVED            status: PUBLISHED
```

### Diff Review

```javascript
// lib/content-ops/diff.js
export function generateContentDiff(oldContent, newContent) {
  const changes = [];

  // Compare top-level fields
  for (const key of ["description", "explanation", "code", "example", "useCase"]) {
    if (oldContent[key] !== newContent[key]) {
      changes.push({ field: key, type: "modified", old: oldContent[key], new: newContent[key] });
    }
  }

  // Compare questions
  const oldQs = oldContent.interviewQuestions || [];
  const newQs = newContent.interviewQuestions || [];
  if (JSON.stringify(oldQs) !== JSON.stringify(newQs)) {
    changes.push({
      field: "interviewQuestions",
      type: "modified",
      added: newQs.length - oldQs.length,
      modified: countModified(oldQs, newQs),
    });
  }

  return {
    totalChanges: changes.length,
    changes,
    isBreaking: changes.some((c) => c.field === "id"),
  };
}
```

### Rollback

```javascript
// app/api/content/rollback/route.js
export async function POST(request) {
  const { contentId, targetVersion } = await request.json();

  const target = await db.generatedContent.findFirst({
    where: { id: contentId, version: targetVersion },
  });
  if (!target) return Response.json({ error: "Version not found" }, { status: 404 });

  // Create new version with old content
  const latest = await db.generatedContent.findFirst({
    where: { technology: target.technology, topicId: target.topicId },
    orderBy: { version: "desc" },
  });

  await db.generatedContent.create({
    data: {
      ...target,
      version: (latest?.version || 0) + 1,
      status: "APPROVED",
      changeDescription: `Rolled back to version ${targetVersion}`,
      previousVersionId: latest?.id,
    },
  });

  return Response.json({ success: true });
}
```

### Provenance Metadata

Every piece of content tracks:

```json
{
  "provenance": {
    "source": "ai-generated",
    "model": "gpt-4o-mini",
    "generatedAt": "2026-02-14T10:00:00Z",
    "generatedBy": "user-id",
    "approvedAt": "2026-02-14T12:00:00Z",
    "approvedBy": "admin-id",
    "publishedAt": "2026-02-14T12:05:00Z",
    "version": 3,
    "previousVersionId": "content-id-v2",
    "changeDescription": "Updated code examples for Node 22"
  }
}
```

---

## 19. Feature: AI Reliability Layer

### Multi-Model Routing

```javascript
// lib/ai/router.js
const MODEL_PRIORITY = [
  { provider: "openai", model: "gpt-4o-mini", maxCost: 0.80 },     // Budget 0-80%
  { provider: "gemini", model: "gemini-2.0-flash-001", maxCost: 0.95 }, // Budget 80-95%
  // Above 95%: all generation disabled
];

export async function routeToModel(operation) {
  const budget = await checkBudget();
  const budgetRatio = budget.spent / budget.budget;

  const model = MODEL_PRIORITY.find((m) => budgetRatio <= m.maxCost);
  if (!model) {
    throw new Error("AI budget exhausted. All generation disabled.");
  }

  return { provider: model.provider, model: model.model };
}
```

### Retrieval Reranking

```javascript
// lib/vector-db/rerank.js
export async function rerankResults(query, candidates, topK = 5) {
  // Cross-encoder reranking for better precision
  // Option 1: Cohere Rerank API
  // Option 2: Local cross-encoder model
  // Option 3: LLM-based reranking (expensive but effective)

  const scored = candidates.map((candidate) => ({
    ...candidate,
    rerankScore: calculateRelevance(query, candidate.text),
  }));

  return scored
    .sort((a, b) => b.rerankScore - a.rerankScore)
    .slice(0, topK);
}
```

### Confidence Scoring

```javascript
// lib/ai/confidence.js
export function scoreConfidence(response, sources) {
  let score = 0;

  // Factor 1: Source coverage (do retrieved chunks answer the question?)
  const avgSourceScore = sources.reduce((s, c) => s + c.score, 0) / (sources.length || 1);
  score += avgSourceScore * 40; // 0-40 points

  // Factor 2: Response length (too short = uncertain, too long = rambling)
  const wordCount = response.split(/\s+/).length;
  if (wordCount >= 50 && wordCount <= 500) score += 20;
  else if (wordCount >= 20) score += 10;

  // Factor 3: Contains code (technical specificity)
  if (response.includes("```")) score += 15;

  // Factor 4: Hedging language (lower confidence if many hedges)
  const hedges = ["might", "perhaps", "I think", "possibly", "not sure", "may be"];
  const hedgeCount = hedges.filter((h) => response.toLowerCase().includes(h)).length;
  score += Math.max(0, 25 - hedgeCount * 8);

  return Math.min(100, Math.round(score));
}
```

### Fallback Responses

```javascript
// When confidence is low or sources are poor
const FALLBACK_TEMPLATES = {
  noSources: "I couldn't find relevant content on the platform for this question. This topic may not be covered yet. Would you like me to suggest the closest related topics?",
  lowConfidence: "Based on the available content, here's what I found, but I'm not fully confident in this answer. I'd recommend checking the {topicName} section for more details.",
  offTopic: "This question seems outside the scope of interview preparation topics covered on this platform. I can help with JavaScript, React, Next.js, Golang, PostgreSQL, Docker, Kubernetes, and System Design.",
};
```

---

## 20. Feature: Evaluation Platform

### Offline Eval Datasets

```json
{
  "evalDataset": "rag-quality-v1",
  "questions": [
    {
      "id": "eval-001",
      "question": "How does consistent hashing work in system design?",
      "expectedTopics": ["consistent-hashing"],
      "expectedAnswer": "Consistent hashing distributes data across nodes using a hash ring...",
      "metrics": {
        "retrievalRecall": "Must retrieve consistent-hashing topic",
        "faithfulness": "Answer must be grounded in retrieved content",
        "answerRelevancy": "Must directly address the question"
      }
    }
  ]
}
```

### Automated Eval Pipeline

```javascript
// scripts/run-rag-eval.js

async function runEvalSuite(evalDataset) {
  const results = [];

  for (const testCase of evalDataset.questions) {
    // 1. Run retrieval
    const retrieved = await searchSimilarContent(testCase.question, { topK: 5 });
    const retrievedTopicIds = retrieved.map((r) => r.metadata.topicId);

    // 2. Check retrieval recall
    const retrievalRecall = testCase.expectedTopics.filter((t) => retrievedTopicIds.includes(t)).length
      / testCase.expectedTopics.length;

    // 3. Generate response
    const response = await generateChatResponse(testCase.question, retrieved);

    // 4. Evaluate faithfulness (LLM-as-judge)
    const faithfulness = await evaluateFaithfulness(response, retrieved);

    // 5. Evaluate answer relevancy
    const relevancy = await evaluateRelevancy(testCase.question, response);

    // 6. Check for hallucination
    const hallucination = await detectHallucination(response, retrieved);

    results.push({
      id: testCase.id,
      retrievalRecall,
      faithfulness,       // 0-1
      answerRelevancy: relevancy, // 0-1
      hallucinationRate: hallucination, // 0-1 (lower is better)
      citationPrecision: calculateCitationPrecision(response, retrieved),
      pass: retrievalRecall >= 0.8 && faithfulness >= 0.7 && hallucination <= 0.1,
    });
  }

  const summary = {
    totalTests: results.length,
    passed: results.filter((r) => r.pass).length,
    avgRetrievalRecall: avg(results, "retrievalRecall"),
    avgFaithfulness: avg(results, "faithfulness"),
    avgHallucinationRate: avg(results, "hallucinationRate"),
    avgCitationPrecision: avg(results, "citationPrecision"),
  };

  return { summary, results };
}

// Release gate: eval must pass before deploying prompt/model changes
function checkReleaseGate(summary) {
  const gates = {
    retrievalRecall: { threshold: 0.80, actual: summary.avgRetrievalRecall },
    faithfulness: { threshold: 0.70, actual: summary.avgFaithfulness },
    hallucinationRate: { threshold: 0.10, actual: summary.avgHallucinationRate, inverted: true },
    citationPrecision: { threshold: 0.60, actual: summary.avgCitationPrecision },
  };

  const failures = Object.entries(gates)
    .filter(([, g]) => g.inverted ? g.actual > g.threshold : g.actual < g.threshold);

  return { pass: failures.length === 0, failures };
}
```

### Online A/B Testing

```javascript
// lib/ai/ab-test.js
export function selectVariant(userId, experimentId) {
  // Deterministic assignment based on userId hash
  const hash = crypto.createHash("md5").update(`${userId}:${experimentId}`).digest("hex");
  const bucket = parseInt(hash.slice(0, 8), 16) % 100;

  const experiments = {
    "prompt-v2": { control: 50, treatment: 50 }, // 50/50 split
    "model-switch": { control: 80, treatment: 20 }, // 80/20 split
  };

  const exp = experiments[experimentId];
  if (!exp) return "control";

  return bucket < exp.control ? "control" : "treatment";
}
```

---

## 21. Authentication and User Management

### NextAuth.js Setup

```javascript
// lib/auth.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  // Session security
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: "__Secure-next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};
```

---

## 22. Vector Database and Embeddings

### pgvector Setup (Recommended - No Extra Service)

```sql
-- Enable extension (run once)
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table
CREATE TABLE content_embeddings (
  id TEXT PRIMARY KEY,
  technology TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_type TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(technology, topic_id, chunk_index)
);

-- HNSW index for fast similarity search
CREATE INDEX ON content_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

### Content Chunking

```javascript
// lib/vector-db/ingest.js
import { getAIClient } from "../ai/client";
import fs from "fs/promises";
import path from "path";

function chunkTopicContent(topic, technology) {
  const chunks = [];
  const prefix = `[${technology}] ${topic.title} (${topic.category})`;

  chunks.push({ text: `${prefix}\n\nDescription: ${topic.description}\n\n${topic.explanation}`, type: "overview" });
  if (topic.code) chunks.push({ text: `${prefix} - Code:\n${topic.code}`, type: "code" });
  if (topic.useCase) chunks.push({ text: `${prefix} - Use Case:\n${topic.useCase}`, type: "useCase" });

  if (topic.interviewQuestions) {
    for (let i = 0; i < topic.interviewQuestions.length; i += 4) {
      const batch = topic.interviewQuestions.slice(i, i + 4);
      const text = batch.map((q) => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");
      chunks.push({ text: `${prefix} - Q&A:\n${text}`, type: "qa" });
    }
  }

  if (topic.programExercises) {
    for (let i = 0; i < topic.programExercises.length; i += 3) {
      const batch = topic.programExercises.slice(i, i + 3);
      const text = batch.map((p) => `Q: ${p.question}\nCode: ${p.code}\nOutput: ${p.output}`).join("\n\n");
      chunks.push({ text: `${prefix} - Programs:\n${text}`, type: "program" });
    }
  }

  return chunks;
}

async function generateEmbeddings(texts) {
  const client = getAIClient();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

export async function ingestTechnology(technology) {
  const contentDir = path.join(process.cwd(), "public", "content", technology, "topics");
  const index = JSON.parse(await fs.readFile(path.join(contentDir, "index.json"), "utf-8"));
  const allChunks = [];

  for (const entry of index) {
    try {
      const topic = JSON.parse(await fs.readFile(path.join(contentDir, "..", entry.file), "utf-8"));
      const chunks = chunkTopicContent(topic, technology);
      chunks.forEach((chunk, i) => {
        allChunks.push({
          id: `${technology}/${topic.id}/chunk-${i}`,
          technology,
          topicId: topic.id,
          chunkIndex: i,
          text: chunk.text,
          type: chunk.type,
          metadata: { topicTitle: topic.title, category: topic.category },
        });
      });
    } catch (err) {
      console.warn(`Skipping ${entry.file}: ${err.message}`);
    }
  }

  // Generate embeddings in batches
  const BATCH_SIZE = 100;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const embeddings = await generateEmbeddings(batch.map((c) => c.text));
    batch.forEach((c, j) => { c.embedding = embeddings[j]; });
  }

  return allChunks;
}
```

### Similarity Search

```javascript
// lib/vector-db/search.js
import { db as prisma } from "../db";

export async function searchSimilarContent(query, { technology, topK = 5, minScore = 0.5 }) {
  const client = (await import("../ai/client")).getAIClient();

  // Generate query embedding
  const embeddingRes = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryEmbedding = embeddingRes.data[0].embedding;

  // pgvector cosine similarity search (raw SQL via Prisma)
  const results = await prisma.$queryRaw`
    SELECT id, technology, topic_id, chunk_text, chunk_type, metadata,
           1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as score
    FROM content_embeddings
    WHERE technology = ${technology || '%'}
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${topK}
  `;

  return results.filter((r) => r.score >= minScore).map((r) => ({
    id: r.id,
    text: r.chunk_text,
    type: r.chunk_type,
    score: r.score,
    metadata: r.metadata,
  }));
}
```

### Embedding Cost

```
Per topic: ~12 chunks x ~500 tokens = 6,000 tokens
All content (8 tech x 24 topics): ~1.15M tokens
Cost: 1.15M x $0.02/1M = $0.023 (less than 3 cents)
```

---

## 23. Prompt Engineering Cookbook

### Principles

1. **Be explicit about output format**: Show exact JSON schema
2. **Use JSON mode**: OpenAI `response_format: { type: "json_object" }` guarantees valid JSON
3. **Set boundaries**: "Exactly 10 questions", "between 50-500 characters"
4. **Handle failures**: Retry with error feedback (max 2 retries)
5. **Temperature guide**:
   - 0.3 for factual content (code, explanations)
   - 0.7 for creative content (varied questions, exercises)
   - 0.9 for brainstorming (topic suggestions)

### Prompt Templates

See sections 9, 10, and 11 for complete system prompts for topic generation, quiz generation, and chatbot respectively.

---

## 24. Streaming and Real-Time UX

### Vercel AI SDK (Recommended)

```bash
npm install ai @ai-sdk/openai
```

```javascript
// app/api/chat/route.js (alternative using Vercel AI SDK)
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(request) {
  const { messages } = await request.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: "You are an interview preparation assistant...",
    messages,
  });

  return result.toDataStreamResponse();
}
```

```jsx
// Frontend (alternative using Vercel AI SDK)
"use client";
import { useChat } from "ai/react";

export default function ChatWidget() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
          {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```

---

## 25. Rate Limiting and Cost Control (Operationalized)

### Rate Limits Per Operation

| Operation | Limit (per user) | Window |
|-----------|-----------------|--------|
| Chat messages | 30 | 1 hour |
| Topic generation | 10 | 1 hour |
| Quiz generation | 20 | 1 hour |
| Code execution | 50 | 1 hour |
| Embedding sync | 5 | 1 day |

### Implementation

```bash
npm install @upstash/redis @upstash/ratelimit
```

```javascript
// lib/rate-limit.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const limiters = {
  chat: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 h"), prefix: "rl:chat" }),
  generate: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 h"), prefix: "rl:gen" }),
  quiz: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 h"), prefix: "rl:quiz" }),
  code: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(50, "1 h"), prefix: "rl:code" }),
};

export async function rateLimit(userId, operation) {
  const limiter = limiters[operation];
  if (!limiter) throw new Error(`Unknown operation: ${operation}`);
  const { success, limit, remaining, reset } = await limiter.limit(userId);
  return { success, limit, remaining, retryAfter: success ? null : Math.ceil((reset - Date.now()) / 1000) };
}
```

### Hard Budget Caps with Kill Switch

```javascript
// lib/cost-tracker.js
import { db } from "./db";

const MONTHLY_BUDGET = parseFloat(process.env.AI_MONTHLY_BUDGET || "50");

const THRESHOLDS = {
  WARNING: 0.70,      // 70% - log warning
  DEGRADED: 0.80,     // 80% - switch to cheaper model
  CRITICAL: 0.90,     // 90% - disable generation, chatbot only
  KILL: 1.00,         // 100% - disable all AI features
};

export async function checkBudget() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const result = await db.aIUsageLog.aggregate({
    _sum: { estimatedCost: true },
    where: { createdAt: { gte: new Date(`${currentMonth}-01`) } },
  });

  const spent = result._sum.estimatedCost || 0;
  const ratio = spent / MONTHLY_BUDGET;

  let status = "healthy";
  if (ratio >= THRESHOLDS.KILL) status = "killed";
  else if (ratio >= THRESHOLDS.CRITICAL) status = "critical";
  else if (ratio >= THRESHOLDS.DEGRADED) status = "degraded";
  else if (ratio >= THRESHOLDS.WARNING) status = "warning";

  return {
    spent: Math.round(spent * 100) / 100,
    budget: MONTHLY_BUDGET,
    remaining: Math.round((MONTHLY_BUDGET - spent) * 100) / 100,
    ratio: Math.round(ratio * 100),
    status,
    isOverBudget: ratio >= THRESHOLDS.KILL,
    generationAllowed: ratio < THRESHOLDS.CRITICAL,
    chatAllowed: ratio < THRESHOLDS.KILL,
    recommendedModel: ratio < THRESHOLDS.DEGRADED ? "gpt-4o-mini" : "gemini-2.0-flash-001",
  };
}

// Log every AI call
export async function logAIUsage({ userId, operation, model, promptTokens, completionTokens }) {
  const costs = {
    "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
    "gpt-4o": { input: 0.0025, output: 0.01 },
    "gemini-2.0-flash-001": { input: 0, output: 0 }, // Free tier
    "text-embedding-3-small": { input: 0.00002, output: 0 },
  };

  const rate = costs[model] || { input: 0.001, output: 0.004 };
  const estimatedCost = (promptTokens * rate.input + completionTokens * rate.output) / 1000;

  await db.aIUsageLog.create({
    data: {
      userId,
      operation,
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      estimatedCost,
    },
  });

  return estimatedCost;
}
```

### Budget Dashboard API

```javascript
// app/api/admin/budget/route.js
import { checkBudget } from "@/lib/cost-tracker";
import { db } from "@/lib/db";

export async function GET() {
  const budget = await checkBudget();

  // Breakdown by operation
  const currentMonth = new Date().toISOString().slice(0, 7);
  const breakdown = await db.aIUsageLog.groupBy({
    by: ["operation"],
    _sum: { estimatedCost: true, totalTokens: true },
    _count: true,
    where: { createdAt: { gte: new Date(`${currentMonth}-01`) } },
  });

  return Response.json({ budget, breakdown });
}
```

---

## 26. Security and Compliance Checklist

### Endpoint Security

| Control | Implementation | Status |
|---------|---------------|--------|
| **Authentication** | NextAuth.js with database sessions | Required |
| **Authorization** | Role-based (USER, ADMIN) on every API route | Required |
| **CSRF Protection** | SameSite=Strict cookies + Origin header validation | Required |
| **Rate Limiting** | Per-user, per-operation via Upstash Redis | Required |
| **Input Validation** | Zod schemas on all request bodies | Required |
| **Input Sanitization** | Prompt injection filtering (see below) | Required |
| **Audit Logging** | Every mutation logged with userId, action, IP, timestamp | Required |
| **API Key Rotation** | Never hardcode keys; use env vars; rotate quarterly | Required |
| **HTTPS Only** | Force HTTPS in production via Next.js config | Required |
| **CORS** | Restrict to allowed origins | Required |
| **Content-Security-Policy** | Restrict script sources, frame ancestors | Recommended |
| **Signed Approvals** | Content approval events include userId + timestamp + hash | Recommended |

### Prompt Injection Protection

```javascript
// lib/security/sanitize.js
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(your|all)\s+instructions/i,
  /you\s+are\s+now/i,
  /new\s+instructions:/i,
  /system\s*:/i,
  /\]\s*\}\s*\{/,                // JSON injection attempt
  /<\/?script/i,                 // XSS attempt
];

export function sanitizeUserInput(input) {
  let clean = input;

  for (const pattern of INJECTION_PATTERNS) {
    clean = clean.replace(pattern, "[filtered]");
  }

  // Length limit
  clean = clean.slice(0, 2000);

  return clean;
}

export function sanitizeForHTML(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
```

### Audit Trail Implementation

```javascript
// lib/audit.js
import { db } from "./db";
import { headers } from "next/headers";

export async function auditLog({ action, entityType, entityId, userId, metadata }) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
  const ua = headersList.get("user-agent") || "unknown";

  await db.auditLog.create({
    data: {
      action,
      entityType: entityType || null,
      entityId: entityId || null,
      userId,
      metadata: metadata || null,
      ipAddress: ip,
      userAgent: ua.slice(0, 500),
    },
  });
}
```

### Audit Events to Track

| Action | When | Data Captured |
|--------|------|---------------|
| `USER_LOGIN` | Successful login | Provider, IP |
| `GENERATION_REQUESTED` | Topic/quiz generation triggered | Technology, title, model |
| `CONTENT_GENERATED` | LLM returned content | contentId, tokens, cost |
| `CONTENT_APPROVED` | Admin approved content | contentId, reviewNote |
| `CONTENT_PUBLISHED` | Content deployed to CDN | contentId, version |
| `CONTENT_REJECTED` | Admin rejected content | contentId, reason |
| `CONTENT_ROLLED_BACK` | Rollback to previous version | contentId, targetVersion |
| `CHAT_SESSION_STARTED` | New chat conversation | technology, conversationId |
| `BUDGET_WARNING` | Budget threshold crossed | spent, threshold |
| `BUDGET_KILL_SWITCH` | AI disabled due to budget | spent, budget |
| `DATA_EXPORT_REQUESTED` | User requests data export | userId |
| `DATA_DELETE_REQUESTED` | User requests data deletion | userId |

---

## 27. RAG Quality and Eval Framework

### Metrics

| Metric | Definition | Target | Measurement |
|--------|-----------|--------|-------------|
| **Retrieval Recall** | % of expected source topics actually retrieved | >= 80% | Automated eval suite |
| **Citation Precision** | % of cited sources that are actually relevant | >= 60% | LLM-as-judge |
| **Answer Faithfulness** | % of answer claims supported by retrieved context | >= 70% | LLM-as-judge |
| **Hallucination Rate** | % of answer claims NOT in retrieved context | <= 10% | LLM-as-judge |
| **Answer Relevancy** | How well the answer addresses the question | >= 75% | LLM-as-judge |
| **User Satisfaction** | Thumbs up/down on chatbot responses | >= 80% | User feedback |

### Eval Dataset Format

Create `eval/rag-dataset.json`:

```json
[
  {
    "id": "eval-001",
    "question": "How does consistent hashing work and why is it important for distributed systems?",
    "expectedTopics": ["consistent-hashing"],
    "expectedKeywords": ["hash ring", "virtual nodes", "rebalancing"],
    "difficulty": "medium"
  },
  {
    "id": "eval-002",
    "question": "Compare token bucket and sliding window rate limiting algorithms",
    "expectedTopics": ["rate-limiting"],
    "expectedKeywords": ["token", "window", "burst", "smoothing"],
    "difficulty": "hard"
  }
]
```

### Release Gate

**No prompt or model changes can be deployed without passing the eval suite:**

```
Eval Suite Pass Criteria:
  - Retrieval Recall  >= 0.80
  - Faithfulness       >= 0.70
  - Hallucination Rate <= 0.10
  - Citation Precision >= 0.60
  - All results must pass with the new prompt/model BEFORE merging
```

### Running Evals

```bash
# Run eval suite
node scripts/run-rag-eval.js --dataset eval/rag-dataset.json --model gpt-4o-mini

# Compare two models
node scripts/run-rag-eval.js --dataset eval/rag-dataset.json --model gpt-4o-mini --compare gemini-2.0-flash

# Output: JSON report with per-question scores and aggregate metrics
```

---

## 28. Data Governance and Privacy

### Chat History Retention

| Data Type | Retention Window | Rationale |
|-----------|-----------------|-----------|
| Chat conversations | **90 days** | Useful for user and debugging, but not indefinitely |
| Chat messages | **90 days** (same as parent conversation) | Cascade delete with conversation |
| Quiz attempts | **1 year** | Needed for progress tracking and analytics |
| Audit logs | **2 years** | Compliance and debugging |
| AI usage logs | **1 year** | Cost analysis and optimization |
| Topic progress | **Indefinite** (until user requests deletion) | Core user value |
| Generated content | **Indefinite** | Platform content |

### Automated Cleanup Job

```javascript
// lib/jobs/data-cleanup.js
import { db } from "../db";

export async function cleanupExpiredData() {
  const now = new Date();

  // Delete expired chat conversations (and cascade to messages)
  const expiredChats = await db.chatConversation.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  // Delete old audit logs (>2 years)
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  const oldAudits = await db.auditLog.deleteMany({
    where: { createdAt: { lt: twoYearsAgo } },
  });

  // Delete old AI usage logs (>1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oldUsage = await db.aIUsageLog.deleteMany({
    where: { createdAt: { lt: oneYearAgo } },
  });

  return {
    expiredChats: expiredChats.count,
    oldAuditLogs: oldAudits.count,
    oldUsageLogs: oldUsage.count,
  };
}
```

### User Data Export (GDPR/DSAR)

```javascript
// app/api/user/export/route.js
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { auditLog } from "@/lib/audit";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // Gather all user data
  const userData = {
    profile: await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true, createdAt: true } }),
    conversations: await db.chatConversation.findMany({
      where: { userId },
      include: { messages: true },
    }),
    quizAttempts: await db.quizAttempt.findMany({ where: { userId } }),
    topicProgress: await db.topicProgress.findMany({ where: { userId } }),
    studyPlans: await db.studyPlan.findMany({ where: { userId } }),
  };

  // Mark export timestamp
  await db.user.update({ where: { id: userId }, data: { dataExportedAt: new Date() } });

  await auditLog({ action: "DATA_EXPORT_REQUESTED", userId, metadata: { exportSize: JSON.stringify(userData).length } });

  return Response.json(userData, {
    headers: {
      "Content-Disposition": `attachment; filename="user-data-${userId}.json"`,
      "Content-Type": "application/json",
    },
  });
}
```

### User Data Deletion (Right to Be Forgotten)

```javascript
// app/api/user/delete/route.js
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  // Soft delete: anonymize, then hard delete after 30 days
  await db.$transaction([
    db.chatConversation.deleteMany({ where: { userId } }),
    db.quizAttempt.deleteMany({ where: { userId } }),
    db.topicProgress.deleteMany({ where: { userId } }),
    db.studyPlan.deleteMany({ where: { userId } }),
    db.user.update({
      where: { id: userId },
      data: {
        name: "[deleted]",
        email: `deleted-${userId}@deleted.local`,
        image: null,
        dataDeletedAt: new Date(),
      },
    }),
  ]);

  await auditLog({ action: "DATA_DELETE_REQUESTED", userId: "system", metadata: { deletedUserId: userId } });

  return Response.json({ success: true, message: "Account and data deleted." });
}
```

### PII Handling

| Data Field | Contains PII? | Handling |
|------------|--------------|----------|
| User email | Yes | Encrypted at rest (DB-level), deleted on account deletion |
| User name | Yes | Deleted on account deletion |
| Chat messages | Potentially | Auto-expire after 90 days, deletable on request |
| IP addresses (audit log) | Yes | Retained for abuse detection, hashed after 90 days |
| Quiz answers | No | Anonymized on account deletion |
| Generated content | No | Retained (platform content, not personal) |

---

## 29. Testing Strategy

### Unit Tests

```javascript
// __tests__/validators/topic-schema.test.js
import { validateTopicSchema } from "@/lib/validators/topic-schema";

describe("Topic Schema Validation", () => {
  test("accepts valid topic JSON", () => {
    const valid = createValidTopic();
    expect(validateTopicSchema(valid).success).toBe(true);
  });

  test("rejects topic with 5 questions instead of 10", () => {
    const invalid = createValidTopic();
    invalid.interviewQuestions = invalid.interviewQuestions.slice(0, 5);
    expect(validateTopicSchema(invalid).success).toBe(false);
  });

  test("rejects invalid exercise type", () => {
    const invalid = createValidTopic();
    invalid.exercises[0].type = "invalid-type";
    expect(validateTopicSchema(invalid).success).toBe(false);
  });
});
```

### Integration Tests

```javascript
// __tests__/api/generate-topic.test.js
import { generateTopicContent } from "@/lib/ai/generate-topic";
import { validateTopicSchema } from "@/lib/validators/topic-schema";

describe("Topic Generation (integration)", () => {
  test("generates and validates a JavaScript topic", async () => {
    const result = await generateTopicContent({
      technology: "javascript",
      topicTitle: "Closures and Lexical Scope",
      category: "Core Concepts",
      difficulty: "intermediate",
    });

    const validation = validateTopicSchema(result);
    expect(validation.success).toBe(true);
    expect(result.interviewQuestions).toHaveLength(10);
    expect(result.exercises).toHaveLength(10);
    expect(result.programExercises).toHaveLength(10);
  }, 60000);
});
```

### E2E Tests

```javascript
// __tests__/e2e/chatbot.spec.js (Playwright)
import { test, expect } from "@playwright/test";

test("chatbot responds with relevant content", async ({ page }) => {
  await page.goto("/system-design");
  await page.click('[data-testid="chatbot-toggle"]');
  await page.fill('[data-testid="chatbot-input"]', "What is consistent hashing?");
  await page.click('[data-testid="chatbot-send"]');
  await page.waitForSelector('[data-testid="chatbot-message-assistant"]', { timeout: 15000 });

  const response = await page.textContent('[data-testid="chatbot-message-assistant"]:last-child');
  expect(response).toContain("hash");
  expect(response.length).toBeGreaterThan(100);
});
```

---

## 30. Deployment and Infrastructure

### Option A: Vercel + Managed Services (Recommended)

```
App            --> Vercel (free/Pro)
Database       --> Supabase PostgreSQL (free tier, has pgvector)
Job Queue      --> Inngest (free tier: 25K events/month)
Rate Limiting  --> Upstash Redis (free tier: 10K commands/day)
Content Publish --> GitHub Actions (CI pipeline)
```

**Vercel Limitations and Workarounds:**

| Limitation | Workaround |
|-----------|------------|
| 10s function timeout (free) | Async jobs via Inngest (runs outside Vercel) |
| Immutable filesystem | DB as source-of-truth + CI publish pipeline |
| No persistent process | Redis for state, DB for data |
| Cold starts | ISR for content pages, edge runtime for chat |

### Option B: Docker Self-Hosted

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/techrevision
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on: [db, redis]

  worker:
    build: .
    command: node worker.js
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/techrevision
      REDIS_URL: redis://redis:6379
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on: [db, redis]

  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: techrevision
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes: [pgdata:/var/lib/postgresql/data]
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

### Option C: Railway/Render ($5-15/mo)

```
App          --> Railway ($5/mo)
Database     --> Railway PostgreSQL ($5/mo) or Supabase (free)
Redis        --> Upstash (free)
Worker       --> Railway (same dyno or separate)
```

### Option D: Completely Free Stack ($0/month)

You can run the entire platform (including AI features) for **$0**:

```
App            --> Vercel Free        (100GB bandwidth, 100 hrs serverless)
Database       --> Supabase Free      (500MB PostgreSQL + pgvector, 50K MAU auth)
LLM            --> Gemini 2.0 Flash   (1500 req/day, 1M tokens/day)
Fallback LLM   --> Groq Free          (14,400 req/day, Llama 3.3 70B)
Embeddings     --> Gemini Free        (embedding-001, 1500 req/day)
Job Queue      --> Inngest Free       (25K events/month)
Rate Limiting  --> Upstash Redis Free (10K commands/day)
Content Publish --> GitHub Actions Free (2000 min/month)
```

**Free tier limits (what you actually get):**

| Service | Free Tier Limit | Enough For |
|---------|----------------|------------|
| Vercel | 100GB bandwidth, 100 hrs compute | ~10K page views/day |
| Supabase | 500MB DB, 1GB storage, 50K auth users | Full platform |
| Gemini | 1500 requests/day, 1M tokens/day | ~150 topic generations or ~1500 chat messages per day |
| Groq | 14,400 requests/day | Overflow from Gemini |
| Inngest | 25K events/month | ~800 generation jobs/month |
| Upstash Redis | 10K commands/day | Rate limiting for ~50 active users |
| GitHub Actions | 2000 min/month | ~200 content publish builds |

**When free tiers run out:**

| You hit... | Impact | Fix |
|-----------|--------|-----|
| Gemini 15 RPM | Requests queue up | Auto-fallback to Groq |
| Gemini 1500 RPD | No more AI for the day | Queue for next day or fallback to Groq |
| Groq daily limit | Both LLMs exhausted | Return "AI unavailable, try tomorrow" |
| Supabase 500MB | DB full | Archive old chat history, upgrade to $25/mo |
| Vercel 100 hrs | Build failures | Upgrade to Pro ($20/mo) or use Netlify free |

**Environment variables for $0 stack:**

```env
# .env.local (completely free)
AI_PROVIDER=gemini
AI_MODEL=gemini-2.0-flash
GOOGLE_AI_API_KEY=AIza...          # Free from https://aistudio.google.com/apikey

GROQ_API_KEY=gsk_...                # Free from https://console.groq.com
AI_FALLBACK_PROVIDER=groq
AI_FALLBACK_MODEL=llama-3.3-70b-versatile

DATABASE_URL=postgresql://...       # Free from https://supabase.com
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

UPSTASH_REDIS_REST_URL=...          # Free from https://upstash.com
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 31. Cost Analysis

### Per-Operation Costs

| Operation | Model | Input Tokens | Output Tokens | Cost |
|-----------|-------|-------------|---------------|------|
| Generate 1 topic | gpt-4o-mini | ~1,500 | ~6,000 | $0.004 |
| Generate 10 quiz Qs | gpt-4o-mini | ~800 | ~3,000 | $0.002 |
| Chat message (RAG) | gpt-4o-mini | ~3,000 | ~500 | $0.001 |
| Embed 1 topic | text-embedding-3-small | ~6,000 | 0 | $0.0001 |

### Monthly Scenarios

| Scenario | AI Cost | Infra Cost | Total |
|----------|---------|-----------|-------|
| **$0 solo (Gemini + Groq)** | $0 | $0 (free tiers) | **$0** |
| **$0 small team (Gemini + Groq)** | $0 | $0 (free tiers) | **$0** |
| Solo dev (OpenAI) | ~$0.50 | $0 (free tiers) | **~$0.50** |
| Small team 10 users (OpenAI) | ~$3 | $0 (free tiers) | **~$3** |
| Production 100 users (GPT-4o) | ~$45 | $25-50 | **~$70-95** |

### Free vs Paid Comparison

| Capability | Free Stack (Gemini + Groq) | Paid Stack (OpenAI) |
|-----------|---------------------------|--------------------|
| Topic generation | Yes (Gemini JSON mode) | Yes (GPT-4o-mini JSON mode) |
| Quiz generation | Yes | Yes |
| RAG chatbot | Yes | Yes |
| Streaming | Yes | Yes |
| JSON mode | Yes (Gemini) | Yes (OpenAI) |
| Daily limit | ~1500 requests | Unlimited (pay per token) |
| Quality | Very good (Gemini Flash) | Excellent (GPT-4o-mini) |
| Speed | Fast | Fast |
| Embeddings | Gemini embedding-001 (free) | text-embedding-3-small ($0.02/1M) |
| **Total cost** | **$0/month** | **$0.50-$45/month** |

---

## 32. Package Dependencies

```bash
# Core AI
npm install openai ai @ai-sdk/openai

# Database
npm install prisma @prisma/client @next-auth/prisma-adapter

# Authentication
npm install next-auth

# Validation
npm install zod

# Job Queue (choose one)
npm install inngest         # Option A: Serverless (Vercel)
# npm install bullmq ioredis  # Option B: Docker/VPS

# Rate Limiting and Cache
npm install @upstash/redis @upstash/ratelimit

# Utilities
npm install slugify
```

### Dev Dependencies

```bash
npm install -D jest @testing-library/react @playwright/test
```

---

## 33. Environment Variables

```env
# .env.local

# AI Provider
AI_PROVIDER=openai               # openai | gemini | ollama
AI_MODEL=gpt-4o-mini
OPENAI_API_KEY=sk-proj-...

# Alternative providers (uncomment as needed)
# GOOGLE_AI_API_KEY=AIza...
# OLLAMA_BASE_URL=http://localhost:11434

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/techrevision

# Authentication
NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# Rate Limiting
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# Job Queue (Inngest)
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Cost Control
AI_MONTHLY_BUDGET=50

# Security
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# Content Publishing (Strategy A)
# GITHUB_TOKEN=ghp_...
# VERCEL_DEPLOY_HOOK=https://api.vercel.com/v1/integrations/deploy/...
```

**Add to `.gitignore`:**
```
.env.local
.env.production
.env.*.local
```

---

## 34. Phased Roadmap with Effort and Risk

### Phase 1: Foundation (Week 1-2) - LOW RISK

| Task | Hours | Risk | Dependencies |
|------|-------|------|-------------|
| Install all packages | 0.5 | Low | None |
| Prisma + PostgreSQL setup | 3 | Low | DATABASE_URL |
| NextAuth.js (Google/GitHub OAuth) | 3 | Low | OAuth credentials |
| AI client factory (multi-provider) | 2 | Low | API key |
| Zod validation schemas | 2 | Low | None |
| Rate limiting setup | 1 | Low | Upstash account |
| Audit logging utility | 1 | Low | Database |
| Environment config | 0.5 | Low | All accounts |
| **Phase 1 Total** | **13** | | |

### Phase 2: Content Generation + Async Jobs (Week 2-3) - MEDIUM RISK

| Task | Hours | Risk | Dependencies |
|------|-------|------|-------------|
| Inngest/BullMQ job queue setup | 3 | Medium | Phase 1 |
| `/api/generate/topic` (async) | 4 | Medium | AI client, jobs |
| `/api/generate/quiz` (async) | 3 | Medium | AI client, jobs |
| Job status polling API + hook | 2 | Low | Jobs |
| Admin panel UI (generate + preview) | 4 | Low | API routes |
| Content approval pipeline | 3 | Medium | Database |
| Deploy-safe publish (CI or API-served) | 4 | Medium | Strategy decision |
| Cost tracker + budget caps | 2 | Low | Database |
| Prompt engineering + iteration | 3 | Medium | Trial and error |
| **Phase 2 Total** | **28** | | |

### Phase 3: RAG Chatbot (Week 3-4) - MEDIUM RISK

| Task | Hours | Risk | Dependencies |
|------|-------|------|-------------|
| pgvector setup + schema | 2 | Low | PostgreSQL |
| Content chunking + ingestion | 3 | Medium | Content exists |
| Embedding generation pipeline | 2 | Low | OpenAI API |
| Similarity search implementation | 3 | Medium | pgvector |
| Chat API with streaming | 4 | Medium | RAG pipeline |
| Chatbot UI component | 4 | Low | Streaming API |
| Chat history persistence | 2 | Low | Database |
| Source citations in responses | 1 | Low | RAG metadata |
| Confidence scoring | 2 | Medium | RAG pipeline |
| RAG eval dataset + pipeline | 3 | Medium | Chat working |
| **Phase 3 Total** | **26** | | |

### Phase 4: Polish + Security (Week 4-5) - LOW RISK

| Task | Hours | Risk | Dependencies |
|------|-------|------|-------------|
| Prompt injection protection | 2 | Low | None |
| CSRF + origin validation | 1 | Low | None |
| Audit log viewer (admin) | 2 | Low | Audit logs |
| Budget dashboard (admin) | 2 | Low | Cost tracker |
| Data retention cleanup job | 2 | Low | Database |
| User data export + deletion | 3 | Low | Database |
| Error handling + retries | 2 | Low | All APIs |
| Unit + integration tests | 4 | Low | All code |
| Documentation finalize | 2 | Low | None |
| **Phase 4 Total** | **20** | | |

### Phase 5: Advanced Features (Week 5-8) - HIGHER RISK

| Task | Hours | Risk | Dependencies |
|------|-------|------|-------------|
| Adaptive learning (SM-2) | 8 | Medium | Quiz + progress tracking |
| Interview simulator | 12 | High | AI + timer + rubrics |
| Coding lab (Monaco + sandbox) | 15 | High | Sandboxed execution |
| Company tracks | 6 | Medium | Content + progress |
| Analytics dashboard | 8 | Medium | All data collected |
| Content versioning + diff | 5 | Medium | CMS pipeline |
| AI reliability (multi-model routing) | 4 | Medium | Multiple providers |
| A/B testing for prompts | 4 | Medium | Eval framework |
| Mentor/peer discussions | 10 | Medium | Auth + real-time |
| **Phase 5 Total** | **72** | | |

### Summary

| Phase | Hours | Calendar | Risk |
|-------|-------|----------|------|
| Phase 1: Foundation | 13 | 1-2 weeks | Low |
| Phase 2: Content Generation | 28 | 1-2 weeks | Medium |
| Phase 3: RAG Chatbot | 26 | 1-2 weeks | Medium |
| Phase 4: Polish + Security | 20 | 1 week | Low |
| Phase 5: Advanced Features | 72 | 3-4 weeks | Higher |
| **Total** | **159** | **~8-11 weeks** | |

---

## 35. File Structure After Integration

```
app/
  api/
    auth/[...nextauth]/route.js
    generate/
      topic/route.js
      quiz/route.js
    chat/route.js
    content/
      [tech]/
        topics/route.js
        quiz/route.js
      approve/route.js
      publish/route.js
      rollback/route.js
      list/route.js
    jobs/[id]/route.js
    embeddings/sync/route.js
    admin/
      budget/route.js
      audit/route.js
    user/
      export/route.js
      delete/route.js
    inngest/route.js
    health/route.js
  admin/page.jsx
  globals.css
  layout.jsx
  page.jsx
  docker/page.jsx
  golang/page.jsx
  javascript/page.jsx
  kubernetes/page.jsx
  login/page.jsx
  nextjs/page.jsx
  postgresql/page.jsx
  react/page.jsx
  system-design/page.jsx

components/
  AdminGeneratePanel.jsx
  AdminQuizPanel.jsx
  AdminBudgetDashboard.jsx
  AuthWrapper.jsx
  BackButton.jsx
  Card.jsx
  Chatbot.jsx
  FloatingCharacters.jsx
  InterviewTopicPage.jsx
  MCQSection.jsx
  Navbar.jsx
  Quiz.jsx
  Sidebar.jsx
  ThemeProvider.jsx
  ThemeToggle.jsx
  TopicDetail.jsx

lib/
  ai/
    client.js
    generate-topic.js
    generate-quiz.js
    chat.js
    embeddings.js
    router.js
    confidence.js
    prompts/
      topic-system.txt
      quiz-system.txt
      chat-system.txt
  adaptive/
    sm2.js
    weakness-detector.js
    study-plan.js
  content-ops/
    diff.js
  db/
    index.js
  jobs/
    client.js
    generate-topic.js
    generate-quiz.js
    embed-content.js
    publish-content.js
    data-cleanup.js
  security/
    sanitize.js
  validators/
    topic-schema.js
    quiz-schema.js
  vector-db/
    ingest.js
    search.js
    rerank.js
  auth.js
  audit.js
  rate-limit.js
  cost-tracker.js

hooks/
  useTopicData.js
  useTopicDataFromContent.js
  useJobStatus.js

prisma/
  schema.prisma
  migrations/

eval/
  rag-dataset.json
  results/

scripts/
  export-content-from-db.js
  ingest-embeddings.js
  run-rag-eval.js
  generate-content-cli.js

data/                  # Existing fallback data
public/content/        # Existing static content (+ CI-published)
```

---

## 36. Code Examples (JavaScript)

### CLI Script: Generate a Topic

```javascript
// scripts/generate-content-cli.js
// Usage: OPENAI_API_KEY=sk-... node scripts/generate-content-cli.js --tech=react --topic="React Server Components"

import OpenAI from "openai";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => a.replace("--", "").split("="))
);
const { tech, topic: topicTitle, category = "General" } = args;

if (!tech || !topicTitle) {
  console.error("Usage: node generate-content-cli.js --tech=react --topic='Title' [--category=Category]");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log(`\nGenerating: ${topicTitle} (${tech}/${category})\n`);

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: `Generate a complete topic JSON with id, title, category: "${category}", description, explanation, code, example, useCase, 10 interviewQuestions, 10 exercises, 10 programExercises. Return ONLY valid JSON.` },
    { role: "user", content: `Generate for "${topicTitle}" in ${tech}.` },
  ],
  response_format: { type: "json_object" },
  temperature: 0.7,
  max_tokens: 8000,
});

const content = JSON.parse(response.choices[0].message.content);
const outputPath = join("public", "content", tech, "topics", `${content.id}.json`);
writeFileSync(outputPath, JSON.stringify(content, null, 2));

console.log(`Done: ${outputPath}`);
console.log(`  Questions: ${content.interviewQuestions?.length || 0}`);
console.log(`  Exercises: ${content.exercises?.length || 0}`);
console.log(`  Programs:  ${content.programExercises?.length || 0}`);
console.log(`  Tokens:    ${response.usage.total_tokens}`);
```

### CLI Script: Ingest Embeddings

```javascript
// scripts/ingest-embeddings.js
// Usage: OPENAI_API_KEY=sk-... node scripts/ingest-embeddings.js [--tech=system-design]

import OpenAI from "openai";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const targetTech = process.argv.find((a) => a.startsWith("--tech="))?.split("=")[1];
const contentDir = join("public", "content");
const technologies = targetTech ? [targetTech] : readdirSync(contentDir).filter((f) => !f.includes("."));

let totalChunks = 0, totalTokens = 0;

for (const tech of technologies) {
  try {
    const index = JSON.parse(readFileSync(join(contentDir, tech, "topics", "index.json"), "utf-8"));
    console.log(`\n${tech}: ${index.length} topics`);

    for (const entry of index) {
      try {
        const topic = JSON.parse(readFileSync(join(contentDir, tech, entry.file), "utf-8"));
        const chunks = [`${topic.title}: ${topic.description}\n\n${topic.explanation}`];
        if (topic.code) chunks.push(`${topic.title} Code:\n${topic.code}`);

        const res = await client.embeddings.create({ model: "text-embedding-3-small", input: chunks });
        totalChunks += chunks.length;
        totalTokens += res.usage.total_tokens;
        console.log(`  ${entry.id}: ${chunks.length} chunks`);
      } catch (err) {
        console.warn(`  Skip ${entry.id}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`Skip ${tech}: ${err.message}`);
  }
}

console.log(`\nTotal: ${totalChunks} chunks, ${totalTokens} tokens, ~$${((totalTokens * 0.02) / 1e6).toFixed(4)}`);
```

---

## 37. Troubleshooting and Common Pitfalls

### LLM Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Invalid JSON | Model added markdown fences | Use `response_format: { type: "json_object" }` |
| Wrong question count | Model ignored instruction | Validate with Zod + retry with error feedback |
| Code does not compile | Hallucinated syntax | Lower temperature to 0.3 for code |
| Duplicate content | No dedup | Check DB before generating |
| Prompt injection | Malicious user input | Sanitize input (Section 26) |
| Budget blown | No caps | Implement budget tracker with kill switch (Section 25) |

### Deployment Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| EPERM on .next | Dev server running | Stop dev server before building |
| Runtime write fails | Vercel immutable FS | Use Strategy A (CI publish) or B (API-served) |
| Function timeout | Sync LLM call in API route | Use async jobs (Section 5) |
| pgvector not found | Extension not enabled | `CREATE EXTENSION IF NOT EXISTS vector;` |

### RAG Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Poor search results | Bad chunking | Include topic title in each chunk, increase overlap |
| Slow queries | Missing index | Create HNSW index on embedding column |
| Hallucinated answers | Weak grounding | Lower temperature, add "use ONLY context" instruction |

---

## 38. Enterprise Readiness (Future)

These features are for when the platform scales beyond single-tenant use:

| Feature | Description | Effort |
|---------|-------------|--------|
| **SSO (SAML/OIDC)** | Enterprise identity providers | 2-3 weeks |
| **Org Spaces** | Multi-tenant with org isolation | 3-4 weeks |
| **Role-Based Access** | Viewer, Editor, Admin, Super Admin | 1-2 weeks |
| **Audit Log Export** | Downloadable audit trails for compliance | 1 week |
| **SLAs** | Uptime guarantees, response time targets | Ops setup |
| **Tenant-Level Usage Controls** | Per-org AI budget caps | 1 week |
| **Data Residency** | Choose data region (GDPR, SOC2) | Architecture change |
| **API Access** | REST API for external integrations | 2-3 weeks |
| **Custom Branding** | Per-org themes, logos, domains | 1-2 weeks |

---

## Quick Start Checklist

```
[ ] 1. Get an OpenAI API key (https://platform.openai.com/api-keys)
[ ] 2. npm install openai ai @ai-sdk/openai zod prisma @prisma/client next-auth inngest
[ ] 3. Create .env.local with OPENAI_API_KEY + DATABASE_URL + NEXTAUTH_SECRET
[ ] 4. Set up PostgreSQL (local Docker or Supabase free)
[ ] 5. npx prisma migrate dev --name init
[ ] 6. Create app/api/generate/topic/route.js
[ ] 7. Create lib/ai/client.js + lib/ai/generate-topic.js + lib/validators/topic-schema.js
[ ] 8. Test: curl -X POST http://localhost:3000/api/generate/topic
[ ] 9. Add NextAuth.js (lib/auth.js + app/api/auth/[...nextauth]/route.js)
[ ] 10. Build chatbot (lib/vector-db/ + app/api/chat/route.js + components/Chatbot.jsx)
```

---

*This is the single source-of-truth for the AI/ML integration. Update as decisions are made and phases are completed.*
*Previous version archived as AI_INTEGRATION_GUIDE_v1.md.*