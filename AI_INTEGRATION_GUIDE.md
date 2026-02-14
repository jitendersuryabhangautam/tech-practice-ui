# AI/ML Integration Guide — Tech Revision Platform

## Complete Blueprint for Integrating Machine Learning into the Interview Preparation Platform

> **Document Version**: 1.0  
> **Created**: February 14, 2026  
> **Scope**: Auto-generation of topic content, quizzes, and a RAG-powered chatbot  
> **Current Stack**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + Static JSON content

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current Architecture Analysis](#2-current-architecture-analysis)
3. [Target Architecture](#3-target-architecture)
4. [LLM Provider Selection](#4-llm-provider-selection)
5. [Backend API Layer](#5-backend-api-layer)
6. [Database Requirements](#6-database-requirements)
7. [Feature 1: Auto-Generate Topic Content](#7-feature-1-auto-generate-topic-content)
8. [Feature 2: Auto-Generate Quizzes](#8-feature-2-auto-generate-quizzes)
9. [Feature 3: RAG Chatbot](#9-feature-3-rag-chatbot)
10. [Authentication & User Management](#10-authentication--user-management)
11. [Vector Database & Embeddings](#11-vector-database--embeddings)
12. [Prompt Engineering Cookbook](#12-prompt-engineering-cookbook)
13. [Streaming & Real-Time UX](#13-streaming--real-time-ux)
14. [Rate Limiting & Cost Control](#14-rate-limiting--cost-control)
15. [Security Considerations](#15-security-considerations)
16. [Testing Strategy](#16-testing-strategy)
17. [Deployment & Infrastructure](#17-deployment--infrastructure)
18. [Cost Analysis](#18-cost-analysis)
19. [Package Dependencies](#19-package-dependencies)
20. [Environment Variables](#20-environment-variables)
21. [Implementation Phases & Timeline](#21-implementation-phases--timeline)
22. [File Structure After Integration](#22-file-structure-after-integration)
23. [Code Examples](#23-code-examples)
24. [Troubleshooting & Common Pitfalls](#24-troubleshooting--common-pitfalls)
25. [Future Enhancements](#25-future-enhancements)

---

## 1. Executive Summary

### Goal
Transform the Tech Revision Platform from a **static content delivery system** into an **AI-powered adaptive learning platform** that can:

1. **Auto-generate** interview questions, exercises, and program exercises for any topic
2. **Auto-generate** MCQ quizzes with explanations, adjustable difficulty, and deduplication
3. **Provide a chatbot** that answers questions using the platform's content as context (RAG)

### Why AI Integration?

| Problem Today | AI Solution |
|---------------|-------------|
| Content is manually authored in JSON files — slow, error-prone | LLM generates content following the exact JSON schema |
| Adding a new topic requires writing 10 Q&A + 10 exercises + 10 programs manually | One API call generates a complete topic in seconds |
| Quiz questions are static, no difficulty levels | LLM generates quizzes at Easy/Medium/Hard with explanations |
| No interactive help — users read cards passively | RAG chatbot answers questions using platform content |
| Scaling to 50+ topics per technology is infeasible manually | AI scales content generation infinitely |

### What Changes

| Layer | Before | After |
|-------|--------|-------|
| Content | Static JSON files only | Static JSON + AI-generated JSON |
| Backend | None (client-side only) | Next.js API routes |
| Database | None | PostgreSQL (content + users + chat history) |
| Auth | Placeholder login page | NextAuth.js with real authentication |
| AI | None | OpenAI/Gemini API + Vector DB for RAG |

---

## 2. Current Architecture Analysis

### How Content Works Today

```
public/content/{technology}/
├── meta.json                    # Page title & description
├── quiz.json                    # Array of MCQ questions
└── topics/
    ├── index.json               # Topic listing with file paths & categories
    ├── topic-1.json             # Full topic content
    ├── topic-2.json             # Full topic content
    └── ...
```

### Current Content Schema (Topic JSON)

```json
{
  "id": "string",
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
Browser → fetch('/content/{tech}/topics/index.json')
       → fetch('/content/{tech}/topics/{id}.json')
       → fetch('/content/{tech}/quiz.json')
       → useTopicDataFromContent hook
       → InterviewTopicPage component
       → TopicDetail / MCQSection / Sidebar
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
- All existing static JSON content (serves as seed data and fallback)
- All existing React components
- The `useTopicDataFromContent` hook pattern
- Tailwind CSS styling
- Next.js App Router structure

### What We Add
- Next.js API routes for AI operations
- Database for persistence
- Authentication
- AI provider integration
- Vector database for chatbot RAG
- New UI components (chatbot widget, admin panel, generation controls)

---

## 3. Target Architecture

### High-Level System Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Topic     │  │  Quiz      │  │  Chatbot    │  │  Admin   │ │
│  │  Pages     │  │  Section   │  │  Widget     │  │  Panel   │ │
│  │            │  │            │  │  (Floating) │  │          │ │
│  └─────┬──────┘  └─────┬──────┘  └──────┬──────┘  └─────┬────┘ │
│        │               │                │               │       │
├────────┼───────────────┼────────────────┼───────────────┼───────┤
│        ▼               ▼                ▼               ▼       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js API Routes (app/api/)               │   │
│  │                                                          │   │
│  │  /api/generate/topic     POST  → Generate topic content  │   │
│  │  /api/generate/quiz      POST  → Generate quiz questions │   │
│  │  /api/chat               POST  → Chat with RAG context   │   │
│  │  /api/content/approve    POST  → Approve generated content│  │
│  │  /api/content/list       GET   → List generated content  │   │
│  │  /api/auth/[...nextauth] ALL   → Authentication          │   │
│  └───┬──────────────┬──────────────┬──────────────┬─────────┘   │
│      │              │              │              │              │
└──────┼──────────────┼──────────────┼──────────────┼──────────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│  LLM API   │ │ PostgreSQL │ │ Vector DB  │ │   Redis    │
│            │ │            │ │            │ │            │
│ - OpenAI   │ │ - Users    │ │ - Pinecone │ │ - Rate     │
│ - Gemini   │ │ - Content  │ │ - pgvector │ │   limiting │
│ - Claude   │ │ - Chat log │ │ - Chroma   │ │ - Caching  │
│ - Ollama   │ │ - Quizzes  │ │            │ │ - Sessions │
│            │ │ - Scores   │ │            │ │            │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### Request Flow: Generate Topic Content

```
User clicks "Generate Topic" in Admin Panel
    │
    ▼
POST /api/generate/topic
    │  Body: { technology: "react", topicTitle: "React Server Components", difficulty: "advanced" }
    │
    ▼
API Route Handler
    │
    ├─→ Auth check (is user admin?)
    ├─→ Rate limit check (Upstash Redis)
    ├─→ Check DB for existing content (deduplication)
    │
    ▼
Construct prompt using topic title + technology context
    │
    ▼
Call LLM API (OpenAI / Gemini / Claude)
    │  System prompt: "You are a technical content generator..."
    │  User prompt: "Generate a complete topic JSON for React Server Components..."
    │
    ▼
Parse & validate LLM response
    │
    ├─→ JSON.parse() the response
    ├─→ Zod schema validation (matches topic JSON schema)
    ├─→ If invalid: retry with error feedback (max 2 retries)
    │
    ▼
Store in database as "pending_review"
    │
    ▼
Return to frontend for preview
    │
    ▼
Admin reviews → clicks "Approve"
    │
    ▼
POST /api/content/approve
    │
    ├─→ Write to public/content/{tech}/topics/{id}.json
    ├─→ Update public/content/{tech}/topics/index.json
    ├─→ Update database status to "approved"
    │
    ▼
Content is live on the platform
```

### Request Flow: Chatbot (RAG)

```
User types question in chatbot widget
    │  "How does consistent hashing work in system design?"
    │
    ▼
POST /api/chat
    │  Body: { message: "...", conversationId: "uuid", technology: "system-design" }
    │
    ▼
API Route Handler
    │
    ├─→ Auth check
    ├─→ Rate limit check
    │
    ▼
Generate embedding for user's question
    │  OpenAI text-embedding-3-small → [0.023, -0.041, ...]  (1536 dimensions)
    │
    ▼
Query vector database for similar content
    │  Top-K similarity search (K=5)
    │  Returns: relevant topic chunks, quiz explanations, code examples
    │
    ▼
Construct RAG prompt
    │  System: "You are an interview preparation assistant..."
    │  Context: [5 most relevant content chunks]
    │  History: [last 10 messages in conversation]
    │  User: "How does consistent hashing work in system design?"
    │
    ▼
Stream LLM response back to frontend
    │  Using Server-Sent Events (SSE) or ReadableStream
    │
    ▼
Frontend renders tokens as they arrive (real-time typing effect)
    │
    ▼
Store conversation in database
```

---

## 4. LLM Provider Selection

### Detailed Comparison

#### OpenAI

| Aspect | Details |
|--------|---------|
| **Models** | GPT-4o (best quality), GPT-4o-mini (budget), o3-mini (reasoning) |
| **Pricing** | GPT-4o: $2.50/1M input, $10/1M output; GPT-4o-mini: $0.15/1M input, $0.60/1M output |
| **Latency** | GPT-4o: 500ms–2s first token; GPT-4o-mini: 200ms–800ms |
| **Context Window** | 128K tokens (all models) |
| **Streaming** | Yes (SSE) |
| **JSON Mode** | Yes (`response_format: { type: "json_object" }`) — critical for our use case |
| **Structured Output** | Yes (function calling + JSON schema enforcement) |
| **Rate Limits** | Tier 1: 500 RPM, 30K TPM; Tier 2: 5000 RPM, 450K TPM |
| **SDK** | `openai` npm package — excellent, well-documented |
| **Best For** | Highest quality content generation, JSON mode is perfect for our schema |

**Why OpenAI is recommended**: JSON mode guarantees valid JSON output, reducing parsing failures. GPT-4o-mini is extremely cheap for content generation. Structured outputs let us enforce our exact topic schema.

#### Google Gemini

| Aspect | Details |
|--------|---------|
| **Models** | Gemini 2.0 Flash (fast), Gemini 1.5 Pro (quality) |
| **Pricing** | Flash: FREE up to 15 RPM / 1M TPD; Pro: $1.25–$5/1M tokens |
| **Latency** | Flash: 300ms–1s; Pro: 600ms–2s |
| **Context Window** | 1M tokens (Flash), 2M tokens (Pro) — massive |
| **Streaming** | Yes |
| **JSON Mode** | Yes (via `responseMimeType: "application/json"`) |
| **Rate Limits** | Free tier: 15 RPM, 1M TPD, 1500 RPD |
| **SDK** | `@google/generative-ai` npm package |
| **Best For** | Prototyping (free tier), processing very large context |

**Why Gemini is good for prototyping**: The free tier gives you 1500 requests/day — enough to build and test everything without spending a cent.

#### Anthropic Claude

| Aspect | Details |
|--------|---------|
| **Models** | Claude 3.5 Sonnet (balanced), Claude 3 Opus (best), Claude 3 Haiku (fast) |
| **Pricing** | Sonnet: $3/1M input, $15/1M output; Haiku: $0.25/1M input, $1.25/1M output |
| **Latency** | Sonnet: 500ms–2s; Haiku: 200ms–600ms |
| **Context Window** | 200K tokens |
| **Streaming** | Yes |
| **JSON Mode** | Not native — must instruct via prompt (less reliable) |
| **Rate Limits** | Tier 1: 50 RPM, 40K TPM |
| **SDK** | `@anthropic-ai/sdk` npm package |
| **Best For** | Nuanced explanations, safety, longer-form content |

#### Self-Hosted (Ollama + Open Source Models)

| Aspect | Details |
|--------|---------|
| **Models** | Llama 3.1 70B, Mistral Large, CodeLlama, DeepSeek Coder |
| **Pricing** | Free (GPU costs only) |
| **Latency** | Depends on GPU — RTX 4090: ~30 tok/s for 70B |
| **Context Window** | 8K–128K depending on model |
| **Streaming** | Yes |
| **JSON Mode** | Model-dependent, less reliable |
| **Requirements** | GPU with 24GB+ VRAM for 70B models; 8GB for 7B models |
| **SDK** | `ollama` npm package, OpenAI-compatible API |
| **Best For** | Full privacy, no API costs, offline development |

**How to set up Ollama locally**:
```bash
# Install Ollama (Windows)
winget install Ollama.Ollama

# Pull a model
ollama pull llama3.1:70b    # Best quality (requires 48GB VRAM)
ollama pull llama3.1:8b     # Good quality (requires 8GB VRAM)
ollama pull mistral          # Fast, 7B model

# Ollama exposes OpenAI-compatible API at http://localhost:11434
# Use the OpenAI SDK with baseURL: "http://localhost:11434/v1"
```

### Recommendation Matrix

| Scenario | Recommended Provider |
|----------|---------------------|
| **Prototype / learning** | Gemini 2.0 Flash (free) |
| **Production (best quality)** | OpenAI GPT-4o-mini (cheap + JSON mode) |
| **Chatbot conversations** | OpenAI GPT-4o or Claude Sonnet (nuanced) |
| **Full privacy / offline** | Ollama + Llama 3.1 8B |
| **Budget production** | Gemini Flash (free) + OpenAI mini (fallback) |

---

## 5. Backend API Layer

### API Routes Structure

```
app/api/
├── auth/
│   └── [...nextauth]/
│       └── route.js          # NextAuth.js handler
├── generate/
│   ├── topic/
│   │   └── route.js          # POST: Generate topic content
│   └── quiz/
│       └── route.js          # POST: Generate quiz questions
├── chat/
│   └── route.js              # POST: Chat with RAG (streaming)
├── content/
│   ├── approve/
│   │   └── route.js          # POST: Approve generated content
│   ├── list/
│   │   └── route.js          # GET: List all content (with status)
│   └── publish/
│       └── route.js          # POST: Write approved content to JSON files
├── embeddings/
│   └── sync/
│       └── route.js          # POST: Sync content to vector DB
└── health/
    └── route.js              # GET: Health check
```

### API Route Implementation Pattern

Every API route follows this pattern:

```javascript
// app/api/generate/topic/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { generateTopicContent } from "@/lib/ai/generate-topic";
import { validateTopicSchema } from "@/lib/validators";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting
    const rateLimitResult = await rateLimit(session.user.id, "generate", {
      maxRequests: 20,
      windowMs: 60 * 60 * 1000, // 20 per hour
    });
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded", retryAfter: rateLimitResult.retryAfter },
        { status: 429 }
      );
    }

    // 3. Parse & validate input
    const body = await request.json();
    const { technology, topicTitle, category, difficulty } = body;
    if (!technology || !topicTitle) {
      return NextResponse.json(
        { error: "technology and topicTitle are required" },
        { status: 400 }
      );
    }

    // 4. Deduplication check
    const existing = await db.generatedContent.findFirst({
      where: { technology, title: topicTitle, status: { in: ["approved", "pending"] } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Content already exists", existingId: existing.id },
        { status: 409 }
      );
    }

    // 5. Generate content via LLM
    const generated = await generateTopicContent({
      technology,
      topicTitle,
      category: category || "General",
      difficulty: difficulty || "intermediate",
    });

    // 6. Validate output matches schema
    const validation = validateTopicSchema(generated);
    if (!validation.success) {
      // Retry once with error feedback
      const retried = await generateTopicContent({
        technology, topicTitle, category, difficulty,
        errorFeedback: validation.errors,
      });
      const retryValidation = validateTopicSchema(retried);
      if (!retryValidation.success) {
        return NextResponse.json(
          { error: "Generated content failed validation", details: retryValidation.errors },
          { status: 422 }
        );
      }
    }

    // 7. Store in database
    const saved = await db.generatedContent.create({
      data: {
        technology,
        topicId: slugify(topicTitle),
        title: topicTitle,
        category,
        content: generated,
        status: "pending",
        generatedBy: session.user.id,
        model: "gpt-4o-mini",
        tokenUsage: generated._tokenUsage,
      },
    });

    // 8. Return for preview
    return NextResponse.json({
      id: saved.id,
      status: "pending",
      content: generated,
      message: "Content generated successfully. Awaiting approval.",
    });
  } catch (error) {
    console.error("Generate topic error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Shared Utilities Structure

```
lib/
├── ai/
│   ├── client.js              # LLM client factory (OpenAI/Gemini/Ollama)
│   ├── generate-topic.js      # Topic generation logic + prompts
│   ├── generate-quiz.js       # Quiz generation logic + prompts
│   ├── chat.js                # RAG chat logic
│   ├── embeddings.js          # Embedding generation
│   └── prompts/
│       ├── topic-system.txt   # System prompt for topic generation
│       ├── quiz-system.txt    # System prompt for quiz generation
│       └── chat-system.txt    # System prompt for chatbot
├── db/
│   ├── index.js               # Prisma client singleton
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Prisma migrations
├── validators/
│   ├── topic-schema.js        # Zod schema for topic JSON
│   └── quiz-schema.js         # Zod schema for quiz JSON
├── rate-limit.js              # Rate limiting with Upstash Redis
├── auth.js                    # NextAuth configuration
└── vector-db/
    ├── client.js              # Vector DB client (Pinecone/pgvector)
    ├── ingest.js              # Content → chunks → embeddings → store
    └── search.js              # Similarity search
```

---

## 6. Database Requirements

### Why a Database is Needed

| Use Case | Data Stored |
|----------|-------------|
| Generated content management | AI-generated topics in pending/approved/rejected states |
| User authentication | User accounts, roles (admin/user) |
| Chat history | Conversation threads, messages with timestamps |
| Quiz scores | Per-user quiz attempts, scores, timestamps |
| Rate limiting | Request counts per user per time window |
| Content versioning | Track edits to generated content over time |
| Analytics | Which topics are most viewed, quiz pass rates |

### Database Options

#### Option A: PostgreSQL (Recommended)

**Hosted options**:
- **Supabase**: Free tier (500MB, 50K monthly active users)
- **Neon**: Free tier (512MB, auto-scaling)
- **Railway**: $5/mo (1GB)
- **Local**: Docker `postgres:16`

**Why PostgreSQL**:
- pgvector extension eliminates need for separate vector DB
- JSONB columns store topic content natively
- Full-text search for content discovery
- Battle-tested, well-supported by Prisma ORM

#### Option B: SQLite + Turso (Simplest)

- **Turso**: Free tier (9GB storage, 500M rows read/mo)
- **Local**: Zero setup, file-based
- No separate server needed
- Limitation: No pgvector (need separate vector DB)

#### Option C: MongoDB Atlas (Flexible Schema)

- Free tier (512MB)
- Native JSON storage (matches our content format)
- Atlas Vector Search (built-in vector DB!)
- Limitation: Less familiar for SQL-oriented developers

### Database Schema (Prisma)

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

  accounts      Account[]
  sessions      Session[]
  generatedContent GeneratedContent[]
  chatConversations ChatConversation[]
  quizAttempts  QuizAttempt[]
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

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum Role {
  USER
  ADMIN
}

// ============================================================
// Generated Content
// ============================================================

model GeneratedContent {
  id           String        @id @default(cuid())
  technology   String        // "javascript", "react", "system-design", etc.
  topicId      String        // Slug: "consistent-hashing"
  title        String        // "Consistent Hashing"
  category     String        // "Foundations", "Company HLD", etc.
  content      Json          // The full topic JSON object
  status       ContentStatus @default(PENDING)
  version      Int           @default(1)
  
  // Generation metadata
  model        String        // "gpt-4o-mini", "gemini-2.0-flash"
  promptTokens Int?
  completionTokens Int?
  totalCost    Float?        // Estimated cost in USD
  
  // Relationships
  generatedBy  String
  user         User          @relation(fields: [generatedBy], references: [id])
  reviewedBy   String?
  reviewNote   String?
  
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  publishedAt  DateTime?

  @@unique([technology, topicId, version])
  @@index([technology, status])
  @@index([status])
}

enum ContentStatus {
  PENDING     // Just generated, awaiting review
  APPROVED    // Reviewed and approved
  PUBLISHED   // Written to JSON files and live
  REJECTED    // Reviewed and rejected
  ARCHIVED    // Old version, replaced by newer
}

// ============================================================
// Generated Quizzes
// ============================================================

model GeneratedQuiz {
  id           String        @id @default(cuid())
  technology   String
  topicId      String?       // null = general quiz for the technology
  difficulty   Difficulty    @default(MEDIUM)
  questions    Json          // Array of quiz question objects
  questionCount Int
  status       ContentStatus @default(PENDING)
  model        String
  
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

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
  technology   String?  // If scoped to a specific technology
  title        String?  // Auto-generated from first message
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  messages     ChatMessage[]
  
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([userId])
}

model ChatMessage {
  id             String   @id @default(cuid())
  conversationId String
  role           MessageRole
  content        String   @db.Text
  
  // RAG metadata
  sources        Json?    // Array of source topic IDs used for context
  tokenUsage     Int?
  
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
// Quiz Attempts & Scoring
// ============================================================

model QuizAttempt {
  id           String   @id @default(cuid())
  userId       String
  technology   String
  quizType     String   // "static" or "generated"
  quizId       String?  // Reference to GeneratedQuiz if generated
  
  totalQuestions Int
  correctAnswers Int
  score        Float    // Percentage
  timeTaken    Int?     // Seconds
  answers      Json     // { questionIndex: selectedOption }
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt    DateTime @default(now())

  @@index([userId, technology])
}

// ============================================================
// Vector Embeddings (if using pgvector instead of external vector DB)
// ============================================================

// Note: Requires pgvector extension enabled
// Run: CREATE EXTENSION IF NOT EXISTS vector;

model ContentEmbedding {
  id           String   @id @default(cuid())
  technology   String
  topicId      String
  chunkIndex   Int      // Which chunk of the topic (topics are split into chunks)
  chunkText    String   @db.Text
  embedding    Unsupported("vector(1536)") // OpenAI text-embedding-3-small dimension
  
  createdAt    DateTime @default(now())

  @@unique([technology, topicId, chunkIndex])
  @@index([technology])
}
```

### Database Setup Commands

```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma (creates prisma/ directory)
npx prisma init

# After writing schema.prisma, generate client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# View database in browser
npx prisma studio
```

---

## 7. Feature 1: Auto-Generate Topic Content

### Overview

Build a system that takes a topic title + technology and generates a complete topic JSON with:
- Description, explanation (markdown), code examples, use cases
- 10 interview questions with detailed answers
- 10 exercises (conceptual, practical, debugging, etc.)
- 10 program exercises with code solutions and expected output

### Validation Layer

Content must match our exact schema. Use Zod for runtime validation:

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
    "true-false", "fill-in-the-blank"
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
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    errors: result.error.issues.map(i => ({
      path: i.path.join("."),
      message: i.message,
    })),
  };
}
```

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
8. The "code" field should contain a comprehensive code example demonstrating the core concept
9. Return ONLY valid JSON, no markdown code fences

OUTPUT SCHEMA:
{
  "id": "kebab-case-slug",
  "title": "Topic Title",
  "category": "${category}",
  "description": "2-3 sentence overview",
  "explanation": "Detailed markdown explanation with sections, bullet points, and examples",
  "code": "Primary code example demonstrating the concept",
  "example": "Practical real-world example or scenario",
  "useCase": "When and why to use this in production",
  "interviewQuestions": [
    { "question": "...", "answer": "..." }
  ],
  "exercises": [
    { "type": "conceptual|practical|debugging|...", "question": "...", "answer": "..." }
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
    response_format: { type: "json_object" }, // OpenAI JSON mode
    temperature: 0.7,
    max_tokens: 8000,
  });

  const content = JSON.parse(response.choices[0].message.content);
  
  // Attach token usage for cost tracking
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
      clientInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      break;

    case "gemini":
      // Gemini has an OpenAI-compatible endpoint
      clientInstance = new OpenAI({
        apiKey: process.env.GOOGLE_AI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });
      break;

    case "ollama":
      clientInstance = new OpenAI({
        apiKey: "ollama", // Not used but required
        baseURL: "http://localhost:11434/v1",
      });
      break;

    case "anthropic":
      // Anthropic doesn't have OpenAI-compatible API
      // Use @anthropic-ai/sdk directly
      const Anthropic = require("@anthropic-ai/sdk");
      clientInstance = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      break;

    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }

  return clientInstance;
}
```

### Admin UI Component for Content Generation

```jsx
// components/AdminGeneratePanel.jsx
"use client";
import { useState } from "react";

const TECHNOLOGIES = [
  "javascript", "react", "nextjs", "golang",
  "postgresql", "docker", "kubernetes", "system-design"
];

export default function AdminGeneratePanel() {
  const [technology, setTechnology] = useState("javascript");
  const [topicTitle, setTopicTitle] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch("/api/generate/topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technology, topicTitle, category, difficulty }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPreview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(contentId) {
    const res = await fetch("/api/content/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: contentId }),
    });
    if (res.ok) {
      alert("Content approved and published!");
      setPreview(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Generate Topic Content</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Technology</label>
          <select value={technology} onChange={e => setTechnology(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800">
            {TECHNOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Topic Title</label>
          <input type="text" value={topicTitle}
            onChange={e => setTopicTitle(e.target.value)}
            placeholder="e.g., React Server Components"
            className="w-full p-2 border rounded dark:bg-gray-800" />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Category</label>
          <input type="text" value={category}
            onChange={e => setCategory(e.target.value)}
            placeholder="e.g., Advanced Patterns"
            className="w-full p-2 border rounded dark:bg-gray-800" />
        </div>
      </div>

      <button onClick={handleGenerate} disabled={loading || !topicTitle}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Generating..." : "Generate Content"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {preview && (
        <div className="mt-6 border rounded-lg p-6 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-2">{preview.content.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{preview.content.description}</p>
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
              <span className="text-2xl font-bold">{preview.content.interviewQuestions?.length || 0}</span>
              <p className="text-sm">Questions</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
              <span className="text-2xl font-bold">{preview.content.exercises?.length || 0}</span>
              <p className="text-sm">Exercises</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
              <span className="text-2xl font-bold">{preview.content.programExercises?.length || 0}</span>
              <p className="text-sm">Programs</p>
            </div>
          </div>

          <details className="mb-4">
            <summary className="cursor-pointer font-medium">View Raw JSON</summary>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs max-h-96">
              {JSON.stringify(preview.content, null, 2)}
            </pre>
          </details>

          <button onClick={() => handleApprove(preview.id)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Approve & Publish
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 8. Feature 2: Auto-Generate Quizzes

### Overview

Generate MCQ quiz questions for any technology/topic with:
- Adjustable difficulty (Easy/Medium/Hard/Mixed)
- Configurable question count (10, 20, 50, 100)
- Deduplication against existing quiz.json
- Explanations for each answer

### Quiz Generation Logic

```javascript
// lib/ai/generate-quiz.js
import { getAIClient } from "./client";

export async function generateQuizQuestions({
  technology,
  topicId = null,      // null = general quiz
  difficulty = "mixed",
  count = 10,
  existingQuestions = [], // For deduplication
}) {
  const client = getAIClient();

  const existingSummary = existingQuestions.length > 0
    ? `\n\nEXISTING QUESTIONS TO AVOID DUPLICATING:\n${existingQuestions.map(q => `- ${q.question}`).join("\n")}`
    : "";

  const systemPrompt = `You are a technical quiz creator for a software engineering interview preparation platform.

Generate exactly ${count} multiple-choice questions about ${technology}${topicId ? ` (specifically: ${topicId})` : ""}.

DIFFICULTY: ${difficulty}
- easy: Definition recall, basic concepts, simple syntax
- medium: Application of concepts, comparing approaches, common patterns
- hard: Edge cases, performance implications, architectural decisions, tricky gotchas
- mixed: Roughly 30% easy, 40% medium, 30% hard

RULES:
1. Each question must have EXACTLY 4 options
2. correctAnswer is the 0-based index of the correct option
3. Explanation must explain WHY the answer is correct AND why others are wrong
4. Questions should be practical and interview-relevant
5. Avoid trivially obvious questions
6. No duplicate or near-duplicate questions
7. Return ONLY valid JSON array

OUTPUT FORMAT:
[
  {
    "question": "What is...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Option A is correct because... Option B is wrong because..."
  }
]`;

  const userPrompt = `Generate ${count} ${difficulty} MCQ questions for ${technology}${topicId ? ` focusing on ${topicId}` : ""}.${existingSummary}`;

  const response = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.8, // Slightly higher for variety
    max_tokens: count * 400, // ~400 tokens per question
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  
  // Handle both { questions: [...] } and direct array
  const questions = Array.isArray(parsed) ? parsed : parsed.questions;
  
  return questions;
}
```

### Quiz Validation

```javascript
// lib/validators/quiz-schema.js
import { z } from "zod";

const quizQuestionSchema = z.object({
  question: z.string().min(10),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(20),
});

export const quizArraySchema = z.array(quizQuestionSchema).min(1);

export function validateQuizSchema(data) {
  const result = quizArraySchema.safeParse(data);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    errors: result.error.issues.map(i => ({
      path: i.path.join("."),
      message: i.message,
    })),
  };
}
```

---

## 9. Feature 3: RAG Chatbot

### What is RAG (Retrieval-Augmented Generation)?

RAG is a technique that enhances LLM responses by:
1. **Retrieving** relevant documents/chunks from a knowledge base
2. **Augmenting** the LLM's prompt with this context
3. **Generating** a response grounded in your actual content

This prevents hallucination and ensures the chatbot answers using YOUR platform's content.

### RAG Pipeline Architecture

```
User Question: "How does rate limiting work with token buckets?"
         │
         ▼
┌─────────────────────────────┐
│  1. EMBED the question      │
│  text-embedding-3-small     │
│  → [0.023, -0.041, ...]    │
│    (1536-dimensional vector)│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  2. SEARCH vector database  │
│  Cosine similarity search   │
│  Top-K = 5 most similar     │
│                             │
│  Results:                   │
│  - rate-limiting.json chunk │  (score: 0.92)
│  - api-design.json chunk    │  (score: 0.78)
│  - load-balancing.json chunk│  (score: 0.71)
│  - caching.json chunk       │  (score: 0.65)
│  - microservices.json chunk │  (score: 0.61)
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  3. CONSTRUCT prompt        │
│                             │
│  System: "You are an        │
│  interview prep assistant.  │
│  Answer using ONLY the      │
│  provided context."         │
│                             │
│  Context:                   │
│  [5 retrieved chunks]       │
│                             │
│  Chat History:              │
│  [last 10 messages]         │
│                             │
│  User: "How does rate       │
│  limiting work with token   │
│  buckets?"                  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  4. STREAM LLM response     │
│  GPT-4o processes context   │
│  + question, streams answer │
│  token by token via SSE     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  5. DISPLAY in chatbot UI   │
│  Real-time typing effect    │
│  with source citations      │
└─────────────────────────────┘
```

### Content Ingestion Pipeline

Before the chatbot can work, we need to:
1. Read all topic JSON files
2. Split them into manageable chunks (~500 tokens each)
3. Generate embeddings for each chunk
4. Store in vector database

```javascript
// lib/vector-db/ingest.js
import { getAIClient } from "../ai/client";
import fs from "fs/promises";
import path from "path";

const CHUNK_SIZE = 500; // tokens (roughly 2000 characters)
const CHUNK_OVERLAP = 50; // tokens overlap between chunks

/**
 * Split a topic JSON into text chunks for embedding
 */
function chunkTopicContent(topic, technology) {
  const chunks = [];
  const prefix = `[${technology}] ${topic.title} (${topic.category})`;

  // Chunk 1: Overview
  chunks.push({
    text: `${prefix}\n\nDescription: ${topic.description}\n\nExplanation: ${topic.explanation}`,
    type: "overview",
  });

  // Chunk 2: Code example
  if (topic.code) {
    chunks.push({
      text: `${prefix} - Code Example:\n\n${topic.code}\n\nExample: ${topic.example || ""}`,
      type: "code",
    });
  }

  // Chunk 3: Use case
  if (topic.useCase) {
    chunks.push({
      text: `${prefix} - Use Case:\n\n${topic.useCase}`,
      type: "useCase",
    });
  }

  // Chunk 4-6: Interview questions (batched in groups of 3-4)
  if (topic.interviewQuestions) {
    for (let i = 0; i < topic.interviewQuestions.length; i += 4) {
      const batch = topic.interviewQuestions.slice(i, i + 4);
      const text = batch.map(q => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");
      chunks.push({
        text: `${prefix} - Interview Q&A (${i + 1}-${Math.min(i + 4, topic.interviewQuestions.length)}):\n\n${text}`,
        type: "interviewQuestions",
      });
    }
  }

  // Chunk 7-9: Exercises (batched)
  if (topic.exercises) {
    for (let i = 0; i < topic.exercises.length; i += 4) {
      const batch = topic.exercises.slice(i, i + 4);
      const text = batch.map(e => `[${e.type}] Q: ${e.question}\nA: ${e.answer}`).join("\n\n");
      chunks.push({
        text: `${prefix} - Exercises (${i + 1}-${Math.min(i + 4, topic.exercises.length)}):\n\n${text}`,
        type: "exercises",
      });
    }
  }

  // Chunk 10-12: Program exercises (batched)
  if (topic.programExercises) {
    for (let i = 0; i < topic.programExercises.length; i += 3) {
      const batch = topic.programExercises.slice(i, i + 3);
      const text = batch.map(p =>
        `Q: ${p.question}\nCode:\n${p.code}\nOutput: ${p.output}`
      ).join("\n\n---\n\n");
      chunks.push({
        text: `${prefix} - Program Exercises (${i + 1}-${Math.min(i + 3, topic.programExercises.length)}):\n\n${text}`,
        type: "programExercises",
      });
    }
  }

  return chunks;
}

/**
 * Generate embeddings for text chunks
 */
async function generateEmbeddings(texts) {
  const client = getAIClient();
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return response.data.map(d => d.embedding);
}

/**
 * Ingest all content for a technology into vector DB
 */
export async function ingestTechnology(technology) {
  const contentDir = path.join(process.cwd(), "public", "content", technology, "topics");
  const indexPath = path.join(contentDir, "index.json");
  
  const index = JSON.parse(await fs.readFile(indexPath, "utf-8"));
  const allChunks = [];

  for (const entry of index) {
    const topicPath = path.join(path.dirname(contentDir), entry.file);
    try {
      const topic = JSON.parse(await fs.readFile(topicPath, "utf-8"));
      const chunks = chunkTopicContent(topic, technology);
      chunks.forEach((chunk, i) => {
        allChunks.push({
          id: `${technology}/${topic.id}/chunk-${i}`,
          technology,
          topicId: topic.id,
          chunkIndex: i,
          text: chunk.text,
          type: chunk.type,
          metadata: {
            technology,
            topicId: topic.id,
            topicTitle: topic.title,
            category: topic.category,
            chunkType: chunk.type,
          },
        });
      });
    } catch (err) {
      console.warn(`Skipping ${entry.file}: ${err.message}`);
    }
  }

  // Generate embeddings in batches of 100 (API limit)
  const BATCH_SIZE = 100;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(c => c.text);
    const embeddings = await generateEmbeddings(texts);
    
    for (let j = 0; j < batch.length; j++) {
      batch[j].embedding = embeddings[j];
    }
  }

  return allChunks;
}
```

### Chat API Route with Streaming

```javascript
// app/api/chat/route.js
import { getAIClient } from "@/lib/ai/client";
import { searchSimilarContent } from "@/lib/vector-db/search";
import { db } from "@/lib/db";

export async function POST(request) {
  const { message, conversationId, technology } = await request.json();
  const client = getAIClient();

  // 1. Search for relevant content
  const relevantChunks = await searchSimilarContent(message, {
    technology,
    topK: 5,
    minScore: 0.5,
  });

  const context = relevantChunks
    .map(c => `--- Source: ${c.metadata.topicTitle} (${c.metadata.category}) ---\n${c.text}`)
    .join("\n\n");

  // 2. Get conversation history
  let history = [];
  if (conversationId) {
    const messages = await db.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 20, // Last 20 messages
    });
    history = messages.map(m => ({ role: m.role.toLowerCase(), content: m.content }));
  }

  // 3. Construct messages
  const systemMessage = `You are an expert technical interview preparation assistant for the Tech Revision Platform.

BEHAVIOR:
- Answer questions using ONLY the provided context from the platform's content
- If the context doesn't contain enough information, say so honestly
- Provide code examples when relevant
- Reference specific topics by name so users can find them on the platform
- Be concise but thorough
- Format responses with markdown for readability

CONTEXT FROM PLATFORM:
${context}

If the user asks about something not covered in the context, suggest which topics on the platform might be most relevant, or honestly say the topic isn't covered yet.`;

  const messages = [
    { role: "system", content: systemMessage },
    ...history,
    { role: "user", content: message },
  ];

  // 4. Stream response
  const stream = await client.chat.completions.create({
    model: process.env.AI_MODEL || "gpt-4o-mini",
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1500,
  });

  // 5. Create ReadableStream for SSE
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      let fullResponse = "";
      
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
      }

      // Send sources
      const sources = relevantChunks.map(c => ({
        topicId: c.metadata.topicId,
        topicTitle: c.metadata.topicTitle,
        technology: c.metadata.technology,
        score: c.score,
      }));
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ sources, done: true })}\n\n`));

      // Store in database
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
    { role: "assistant", content: "Hi! I'm your interview prep assistant. Ask me anything about the topics on this platform." }
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
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsStreaming(true);

    // Add empty assistant message for streaming
    setMessages(prev => [...prev, { role: "assistant", content: "", sources: [] }]);

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

        const text = decoder.decode(value);
        const lines = text.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          const data = JSON.parse(line.slice(6));
          
          if (data.done) {
            // Update sources on the last message
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].sources = data.sources;
              return updated;
            });
          } else if (data.content) {
            // Append streamed content
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content += data.content;
              return updated;
            });
          }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Sorry, something went wrong. Please try again.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full 
                   shadow-lg hover:bg-blue-700 transition-all z-50 flex items-center justify-center"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 
                        rounded-xl shadow-2xl border dark:border-gray-700 flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b dark:border-gray-700 bg-blue-600 text-white rounded-t-xl">
            <h3 className="font-bold">Interview Prep Assistant</h3>
            <p className="text-xs text-blue-200">Ask about any topic on the platform</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources?.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium mb-1">Sources:</p>
                      {msg.sources.map((s, j) => (
                        <a key={j} href={`/${s.technology}?topic=${s.topicId}`}
                          className="text-xs text-blue-400 hover:underline block">
                          📄 {s.topicTitle}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 text-sm"
                disabled={isStreaming}
              />
              <button onClick={handleSend} disabled={isStreaming || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           disabled:opacity-50 text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

## 10. Authentication & User Management

### Why Authentication is Needed

| Reason | Details |
|--------|---------|
| **Admin protection** | Only admins should generate/approve content |
| **Rate limiting** | Must be per-user to prevent abuse |
| **Chat history** | Conversations are per-user |
| **Quiz scores** | Track individual progress |
| **API key security** | AI API calls cost money — can't be anonymous |

### NextAuth.js Setup

```javascript
// lib/auth.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";

export const authOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    // OAuth providers (recommended)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Email/password (optional)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Implement your own logic
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && verifyPassword(credentials.password, user.passwordHash)) {
          return user;
        }
        return null;
      },
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
};
```

### Auth API Route

```javascript
// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 11. Vector Database & Embeddings

### What Are Embeddings?

Embeddings convert text into numerical vectors (arrays of floating-point numbers) that capture semantic meaning. Similar texts have similar vectors.

```
"How does caching work?"     → [0.023, -0.041, 0.089, ...]  (1536 numbers)
"What is a cache strategy?"  → [0.025, -0.038, 0.091, ...]  (very similar!)
"What is Docker compose?"    → [-0.012, 0.067, -0.034, ...]  (very different)
```

### Vector Database Options

#### Option A: pgvector (PostgreSQL Extension) — Recommended for Simplicity

No separate service needed. Add vector support to your existing PostgreSQL.

```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table
CREATE TABLE content_embeddings (
  id SERIAL PRIMARY KEY,
  technology TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1536),  -- OpenAI text-embedding-3-small dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(technology, topic_id, chunk_index)
);

-- Create index for fast similarity search
CREATE INDEX ON content_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Example similarity search
SELECT topic_id, chunk_text, 1 - (embedding <=> $1::vector) as similarity
FROM content_embeddings
WHERE technology = 'system-design'
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

**Pros**: No extra service, free, included in Supabase/Neon  
**Cons**: Performance degrades past ~1M vectors (fine for this project)

#### Option B: Pinecone (Managed Vector DB)

```javascript
import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pinecone.index("tech-revision");

// Upsert vectors
await index.upsert([
  {
    id: "system-design/rate-limiting/chunk-0",
    values: [0.023, -0.041, ...], // 1536-dim embedding
    metadata: {
      technology: "system-design",
      topicId: "rate-limiting",
      topicTitle: "Rate Limiting",
      category: "Foundations",
      chunkType: "overview",
      text: "Rate limiting controls the rate of requests...",
    },
  },
]);

// Query
const results = await index.query({
  vector: queryEmbedding,
  topK: 5,
  filter: { technology: "system-design" },
  includeMetadata: true,
});
```

**Pros**: Managed, fast, scales to billions of vectors, free tier (100K vectors)  
**Cons**: External dependency, network latency

#### Option C: ChromaDB (Self-Hosted)

```bash
# Run with Docker
docker run -p 8000:8000 chromadb/chroma

# Or install Python package
pip install chromadb
```

```javascript
import { ChromaClient } from "chromadb";

const chroma = new ChromaClient({ path: "http://localhost:8000" });
const collection = await chroma.getOrCreateCollection({
  name: "tech-revision",
  metadata: { "hnsw:space": "cosine" },
});

// Add documents (auto-embeds with default model)
await collection.add({
  ids: ["system-design/rate-limiting/chunk-0"],
  documents: ["Rate limiting controls the rate of requests..."],
  metadatas: [{ technology: "system-design", topicId: "rate-limiting" }],
});

// Query
const results = await collection.query({
  queryTexts: ["How does rate limiting work?"],
  nResults: 5,
  where: { technology: "system-design" },
});
```

**Pros**: Open source, self-hosted, auto-embedding  
**Cons**: Requires Docker, less battle-tested

### Embedding Cost Calculation

Using OpenAI `text-embedding-3-small` ($0.02 per 1M tokens):

```
Per topic: ~12 chunks × ~500 tokens = 6,000 tokens
Per technology (24 topics): 24 × 6,000 = 144,000 tokens
All 8 technologies: 8 × 144,000 = 1,152,000 tokens

Cost: 1.152M tokens × $0.02/1M = $0.023 (less than 3 cents!)

Re-ingesting monthly: 12 × $0.023 = $0.28/year
```

Embedding costs are negligible.

---

## 12. Prompt Engineering Cookbook

### Principles for Reliable LLM Output

1. **Be explicit about output format**: Show the exact JSON schema
2. **Use JSON mode**: OpenAI's `response_format: { type: "json_object" }` guarantees valid JSON
3. **Provide examples**: One-shot or few-shot examples improve consistency
4. **Set boundaries**: "Exactly 10 questions", "between 50-500 characters"
5. **Handle failures**: Always have retry logic with error feedback
6. **Temperature matters**: 
   - 0.3 for factual content (code, technical explanations)
   - 0.7 for creative content (varied questions, different exercises)
   - 0.9 for brainstorming (topic suggestions)

### System Prompt for Topic Generation

```
You are an expert technical content creator for a software engineering interview 
preparation platform called "Tech Revision Platform".

YOUR ROLE:
- Generate comprehensive, accurate, and practical interview preparation content
- Content is consumed by software engineers preparing for technical interviews
- All content must be technically accurate and up-to-date as of 2026

CONTENT QUALITY STANDARDS:
- Explanations should use markdown with headers (##), bullet points, bold text
- Code must be syntactically correct, complete, and runnable
- Answers should be 3-5 sentences minimum, covering key nuances
- Interview questions should progressively increase in difficulty
- Exercise types must vary across: conceptual, practical, debugging, 
  code-review, design, comparison, scenario, optimization
- Program exercises must have complete working code (not pseudocode) 
  with accurate expected output

TECHNOLOGIES COVERED:
JavaScript, ReactJS, Next.js, Golang, PostgreSQL, Docker, Kubernetes, System Design

OUTPUT RULES:
1. Return ONLY valid JSON (no markdown fences, no extra text)
2. Follow the exact schema provided
3. All arrays must have exactly the count specified
4. IDs must be kebab-case (lowercase, hyphen-separated)
5. No placeholder content like "TODO" or "..."
```

### System Prompt for Quiz Generation

```
You are a technical quiz creator for a software engineering interview preparation 
platform. You create challenging, practical multiple-choice questions that test 
real understanding, not just memorization.

QUESTION QUALITY STANDARDS:
- Questions should test practical understanding, not trivial facts
- Wrong options (distractors) should be plausible, not obviously wrong
- Explanations must explain why the correct answer is right AND why each 
  wrong answer is wrong
- Avoid questions with "All of the above" or "None of the above"
- Each question should be unambiguous with exactly one correct answer
- Code snippets in questions must be syntactically correct

DIFFICULTY LEVELS:
- EASY: Definition recall, basic syntax, fundamental concepts
  Example: "What does the 'useState' hook return in React?"
  
- MEDIUM: Application of concepts, comparing approaches, common patterns
  Example: "What will be the output of this code snippet?" (with a closure)
  
- HARD: Edge cases, performance implications, architectural trade-offs
  Example: "In a distributed system with eventual consistency, what happens 
  when two concurrent writes conflict using a last-write-wins strategy with 
  clock skew?"
```

### System Prompt for Chatbot

```
You are an expert interview preparation assistant for the "Tech Revision Platform", 
a learning platform covering JavaScript, React, Next.js, Golang, PostgreSQL, 
Docker, Kubernetes, and System Design.

BEHAVIOR RULES:
1. Answer questions using ONLY the provided context from the platform's content
2. If the context doesn't contain enough information, say: "This topic isn't 
   fully covered on the platform yet. Based on my general knowledge: [answer]. 
   You might want to check the [suggest nearest topic] section."
3. Reference specific topics by name so users can navigate to them
4. Provide code examples when relevant, using the appropriate language
5. For system design questions, think in terms of components, trade-offs, 
   and scalability
6. Be concise but thorough — aim for the depth of a senior engineer's explanation
7. Use markdown formatting: headers, bullet points, code blocks
8. If asked to compare two approaches, use a table format
9. Never make up facts about the platform's content

PERSONALITY:
- Professional but approachable
- Like a helpful senior engineer mentoring a colleague
- Encourages deeper exploration ("To learn more about this, check out the 
  [topic name] section")
```

---

## 13. Streaming & Real-Time UX

### Why Streaming Matters

Without streaming, users wait 5-15 seconds for a complete response. With streaming, they see the first token in ~200ms and watch the response build in real-time — creating a much better experience.

### Implementation with Vercel AI SDK

The Vercel AI SDK (`ai` package) provides the cleanest streaming integration for Next.js:

```bash
npm install ai @ai-sdk/openai
```

```javascript
// app/api/chat/route.js (using Vercel AI SDK)
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
// components/Chatbot.jsx (using Vercel AI SDK)
"use client";
import { useChat } from "ai/react";

export default function Chatbot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  return (
    <div>
      {messages.map(m => (
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

The `useChat` hook handles:
- Streaming token-by-token
- Automatic message state management
- Loading states
- Abort/cancel support
- Retry logic

---

## 14. Rate Limiting & Cost Control

### Why Rate Limiting is Critical

Each LLM API call costs money. Without rate limiting:
- A malicious user could cost you hundreds in API calls
- A buggy frontend could fire unlimited requests
- Free users shouldn't have the same access as premium users

### Implementation with Upstash Redis

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

// Different rate limits for different operations
const limiters = {
  chat: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, "1 h"),   // 30 messages/hour
    analytics: true,
    prefix: "ratelimit:chat",
  }),
  generate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 h"),   // 10 generations/hour
    analytics: true,
    prefix: "ratelimit:generate",
  }),
  quiz: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, "1 h"),   // 20 quiz generations/hour
    analytics: true,
    prefix: "ratelimit:quiz",
  }),
};

export async function rateLimit(userId, operation) {
  const limiter = limiters[operation];
  if (!limiter) throw new Error(`Unknown operation: ${operation}`);

  const { success, limit, remaining, reset } = await limiter.limit(userId);
  
  return {
    success,
    limit,
    remaining,
    retryAfter: success ? null : Math.ceil((reset - Date.now()) / 1000),
  };
}
```

### Cost Caps

```javascript
// lib/cost-tracker.js

const COST_PER_1K_TOKENS = {
  "gpt-4o": { input: 0.0025, output: 0.01 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
  "text-embedding-3-small": { input: 0.00002, output: 0 },
};

const MONTHLY_BUDGET = parseFloat(process.env.AI_MONTHLY_BUDGET || "50"); // $50 default

export async function checkBudget() {
  const currentMonth = new Date().toISOString().slice(0, 7); // "2026-02"
  
  // Sum all costs for current month from database
  const result = await db.generatedContent.aggregate({
    _sum: { totalCost: true },
    where: {
      createdAt: { gte: new Date(`${currentMonth}-01`) },
    },
  });

  const spent = result._sum.totalCost || 0;
  const remaining = MONTHLY_BUDGET - spent;

  return {
    spent,
    remaining,
    budget: MONTHLY_BUDGET,
    isOverBudget: remaining <= 0,
    percentUsed: (spent / MONTHLY_BUDGET) * 100,
  };
}
```

---

## 15. Security Considerations

### API Key Protection

```
NEVER expose API keys to the frontend.

✗ BAD:  Calling OpenAI directly from React components
✓ GOOD: Calling your own /api/generate route, which calls OpenAI server-side
```

All LLM calls must go through Next.js API routes (`app/api/`), which run server-side.

### Input Sanitization

```javascript
// Prevent prompt injection
function sanitizeUserInput(input) {
  // Remove any attempt to override system prompts
  const forbidden = [
    "ignore previous instructions",
    "ignore all previous",
    "disregard your instructions",
    "you are now",
    "new instructions:",
    "system:",
    "assistant:",
  ];
  
  let clean = input;
  for (const phrase of forbidden) {
    clean = clean.replace(new RegExp(phrase, "gi"), "[filtered]");
  }
  
  // Limit length
  clean = clean.slice(0, 2000);
  
  return clean;
}
```

### Content Review Pipeline

Never auto-publish AI-generated content. Always have a human review step:

```
Generated → Pending Review → Approved → Published
                           → Rejected (with feedback)
```

### Environment Variable Checklist

```
# Never commit these to git!
# Add to .gitignore: .env.local, .env.production

OPENAI_API_KEY=        # Keep secret
DATABASE_URL=          # Keep secret
NEXTAUTH_SECRET=       # Keep secret (generate: openssl rand -base64 32)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 16. Testing Strategy

### Unit Tests

```javascript
// __tests__/validators/topic-schema.test.js
import { validateTopicSchema } from "@/lib/validators/topic-schema";

describe("Topic Schema Validation", () => {
  test("accepts valid topic JSON", () => {
    const validTopic = {
      id: "test-topic",
      title: "Test Topic Title",
      category: "Foundations",
      description: "A valid description that is at least 50 characters long for testing.",
      explanation: "A detailed explanation...".repeat(20),
      code: "console.log('hello world');",
      example: "This is a practical example that is at least 50 characters.",
      useCase: "This is a use case description that is at least 50 characters.",
      interviewQuestions: Array(10).fill({
        question: "What is a valid question here?",
        answer: "A valid answer that is at least 50 characters long for this test.",
      }),
      exercises: Array(10).fill({
        type: "conceptual",
        question: "What is a valid exercise question?",
        answer: "A valid exercise answer here.",
      }),
      programExercises: Array(10).fill({
        question: "Write a valid program exercise?",
        code: "const x = 1; console.log(x);",
        output: "1",
      }),
    };

    const result = validateTopicSchema(validTopic);
    expect(result.success).toBe(true);
  });

  test("rejects topic with only 5 interview questions", () => {
    const invalid = { /* ... with 5 questions instead of 10 */ };
    const result = validateTopicSchema(invalid);
    expect(result.success).toBe(false);
  });
});
```

### Integration Tests

```javascript
// __tests__/api/generate-topic.test.js
import { generateTopicContent } from "@/lib/ai/generate-topic";
import { validateTopicSchema } from "@/lib/validators/topic-schema";

describe("Topic Generation", () => {
  test("generates valid topic JSON", async () => {
    const result = await generateTopicContent({
      technology: "javascript",
      topicTitle: "Closures and Lexical Scope",
      category: "Core Concepts",
      difficulty: "intermediate",
    });

    // Validate structure
    const validation = validateTopicSchema(result);
    expect(validation.success).toBe(true);

    // Validate content quality
    expect(result.interviewQuestions).toHaveLength(10);
    expect(result.exercises).toHaveLength(10);
    expect(result.programExercises).toHaveLength(10);

    // Validate code is executable
    for (const prog of result.programExercises) {
      expect(prog.code.length).toBeGreaterThan(20);
      expect(prog.output.length).toBeGreaterThan(0);
    }
  }, 60000); // 60s timeout for API call
});
```

### E2E Test (Chatbot)

```javascript
// __tests__/e2e/chatbot.test.js
import { test, expect } from "@playwright/test";

test("chatbot responds to questions", async ({ page }) => {
  await page.goto("/system-design");
  
  // Open chatbot
  await page.click('[data-testid="chatbot-toggle"]');
  
  // Type question
  await page.fill('[data-testid="chatbot-input"]', "What is consistent hashing?");
  await page.click('[data-testid="chatbot-send"]');
  
  // Wait for response (streaming)
  await page.waitForSelector('[data-testid="chatbot-message-assistant"]', { timeout: 15000 });
  
  const response = await page.textContent('[data-testid="chatbot-message-assistant"]:last-child');
  expect(response).toContain("hash");
  expect(response.length).toBeGreaterThan(100);
});
```

---

## 17. Deployment & Infrastructure

### Option A: Vercel (Simplest)

```
Frontend + API Routes → Vercel (free tier)
Database             → Supabase or Neon (free tier)
Vector DB            → Pinecone (free tier) or pgvector on Supabase
Redis                → Upstash (free tier)
```

**Limitations**:
- Serverless function timeout: 10s (free), 60s (Pro)
- Content generation might hit timeout → use streaming or background jobs

### Option B: Docker Self-Hosted

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/techrevision
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - db
      - redis

  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: techrevision
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### Option C: Cloud VPS (DigitalOcean/AWS/Railway)

```
App         → Railway ($5/mo) or DigitalOcean App Platform ($5/mo)
Database    → Railway PostgreSQL ($5/mo) or Supabase (free)
Redis       → Upstash (free) or Railway Redis ($5/mo)
Vector DB   → pgvector (included in PostgreSQL)

Total: $5-15/mo
```

---

## 18. Cost Analysis

### Per-Operation Cost Breakdown

| Operation | Model | Input Tokens | Output Tokens | Cost |
|-----------|-------|-------------|---------------|------|
| Generate 1 topic | gpt-4o-mini | ~1,500 | ~6,000 | $0.0038 |
| Generate 10 quiz Qs | gpt-4o-mini | ~800 | ~3,000 | $0.0019 |
| Chat message (with RAG) | gpt-4o-mini | ~3,000 | ~500 | $0.0007 |
| Embed 1 topic (12 chunks) | text-embedding-3-small | ~6,000 | 0 | $0.0001 |
| Generate 1 topic | gpt-4o | ~1,500 | ~6,000 | $0.0638 |

### Monthly Cost Scenarios

#### Scenario 1: Solo Developer (Prototyping)

```
Content generation: 50 topics/month × $0.004  = $0.20
Quiz generation:    20 quizzes/month × $0.002  = $0.04
Chat messages:      200/month × $0.001         = $0.20
Embeddings:         50 topics × $0.0001        = $0.005
──────────────────────────────────────────────────────
Total AI cost:                                   $0.45/month
Database (Supabase free):                        $0.00
Hosting (Vercel free):                           $0.00
══════════════════════════════════════════════════════
GRAND TOTAL:                                     ~$0.50/month
```

#### Scenario 2: Small Team (10 Users)

```
Content generation: 100 topics/month × $0.004  = $0.40
Quiz generation:    50 quizzes/month × $0.002   = $0.10
Chat messages:      2,000/month × $0.001        = $2.00
Embeddings:         100 topics × $0.0001        = $0.01
──────────────────────────────────────────────────────
Total AI cost:                                   $2.51/month
Database (Supabase free):                        $0.00
Hosting (Vercel free):                           $0.00
══════════════════════════════════════════════════════
GRAND TOTAL:                                     ~$3/month
```

#### Scenario 3: Production (100+ Users, GPT-4o for Quality)

```
Content generation: 200 topics/month × $0.064  = $12.80
Quiz generation:    100 quizzes/month × $0.02   = $2.00
Chat messages:      10,000/month × $0.003       = $30.00
Embeddings:         200 topics × $0.0001        = $0.02
──────────────────────────────────────────────────────
Total AI cost:                                   $44.82/month
Database (Supabase Pro):                         $25.00
Hosting (Vercel Pro):                            $20.00
Redis (Upstash):                                 $0.00
══════════════════════════════════════════════════════
GRAND TOTAL:                                     ~$90/month
```

### Cost Optimization Strategies

1. **Use GPT-4o-mini by default**, GPT-4o only for content that will be reviewed
2. **Cache chat responses**: Same questions get cached answers (Redis, 1-hour TTL)
3. **Batch embedding generation**: Don't re-embed unchanged content
4. **Set monthly budget caps**: Hard stop at $X/month
5. **Use Gemini free tier** for development/testing
6. **Pre-generate popular content**: Run generation script once, serve statically

---

## 19. Package Dependencies

### Required Packages

```bash
# Core AI
npm install openai                       # OpenAI SDK (also works with Gemini/Ollama)
npm install ai @ai-sdk/openai            # Vercel AI SDK for streaming

# Database
npm install prisma @prisma/client        # ORM + database client
npm install @next-auth/prisma-adapter    # NextAuth Prisma adapter

# Authentication
npm install next-auth                    # Authentication framework

# Validation
npm install zod                          # Runtime schema validation

# Rate Limiting
npm install @upstash/redis @upstash/ratelimit  # Rate limiting

# Vector Database (choose one)
npm install @pinecone-database/pinecone  # Option A: Pinecone
# OR pgvector is used via Prisma (no extra package)

# Utilities
npm install slugify                      # Generate URL-safe IDs
npm install nanoid                       # Short unique IDs
```

### Optional Packages

```bash
# Alternative AI providers
npm install @google/generative-ai        # Google Gemini SDK
npm install @anthropic-ai/sdk            # Anthropic Claude SDK
npm install @ai-sdk/anthropic            # Vercel AI + Claude
npm install @ai-sdk/google               # Vercel AI + Gemini

# Testing
npm install -D jest @testing-library/react  # Unit tests
npm install -D @playwright/test             # E2E tests

# Development
npm install -D prisma                    # Prisma CLI (if not already)
```

### Updated package.json (additions only)

```json
{
  "dependencies": {
    "openai": "^4.x",
    "ai": "^3.x",
    "@ai-sdk/openai": "^0.x",
    "@prisma/client": "^5.x",
    "next-auth": "^4.x",
    "@next-auth/prisma-adapter": "^1.x",
    "zod": "^3.x",
    "@upstash/redis": "^1.x",
    "@upstash/ratelimit": "^1.x",
    "slugify": "^1.x"
  },
  "devDependencies": {
    "prisma": "^5.x"
  }
}
```

---

## 20. Environment Variables

### Complete `.env.local` Template

```env
# ============================================================
# AI Provider Configuration
# ============================================================

# Choose provider: "openai" | "gemini" | "anthropic" | "ollama"
AI_PROVIDER=openai

# Model to use (provider-specific)
AI_MODEL=gpt-4o-mini

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Google Gemini (alternative)
# GOOGLE_AI_API_KEY=AIza...

# Anthropic Claude (alternative)
# ANTHROPIC_API_KEY=sk-ant-...

# Ollama (local, alternative)
# OLLAMA_BASE_URL=http://localhost:11434

# ============================================================
# Database
# ============================================================

# PostgreSQL connection string
# Local: postgresql://user:password@localhost:5432/techrevision
# Supabase: postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
# Neon: postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/techrevision
DATABASE_URL=postgresql://user:password@localhost:5432/techrevision

# ============================================================
# Authentication (NextAuth.js)
# ============================================================

# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth (optional)
GITHUB_ID=
GITHUB_SECRET=

# ============================================================
# Rate Limiting (Upstash Redis)
# ============================================================

UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...

# ============================================================
# Vector Database
# ============================================================

# Pinecone (if using external vector DB)
PINECONE_API_KEY=
PINECONE_INDEX=tech-revision

# If using pgvector, no extra config needed (uses DATABASE_URL)

# ============================================================
# Cost Control
# ============================================================

# Monthly budget cap in USD (stops generation when exceeded)
AI_MONTHLY_BUDGET=50

# ============================================================
# Application
# ============================================================

NODE_ENV=development
```

### Add to `.gitignore`

```
.env.local
.env.production
.env.*.local
```

---

## 21. Implementation Phases & Timeline

### Phase 1: Foundation (Week 1-2)

**Goal**: Set up backend infrastructure

| Task | Details | Time |
|------|---------|------|
| Install dependencies | All packages from Section 19 | 30 min |
| Set up Prisma + PostgreSQL | Schema, migrations, seed | 2-3 hours |
| Set up NextAuth.js | Google/GitHub OAuth + login page | 2-3 hours |
| Create AI client factory | OpenAI SDK wrapper with provider switching | 1-2 hours |
| Create validation schemas | Zod schemas for topic + quiz | 1-2 hours |
| Environment setup | .env.local with all variables | 30 min |
| **Total** | | **~8-12 hours** |

### Phase 2: Content Generation (Week 2-3)

**Goal**: Auto-generate topic content and quizzes

| Task | Details | Time |
|------|---------|------|
| `/api/generate/topic` route | Topic generation with validation + retry | 3-4 hours |
| `/api/generate/quiz` route | Quiz generation with deduplication | 2-3 hours |
| Admin generate panel UI | Form + preview + approve workflow | 3-4 hours |
| Content approval pipeline | Approve → write to JSON files | 2-3 hours |
| `/api/content/list` route | List all generated content with status | 1-2 hours |
| Prompt engineering + testing | Iterate on prompts for quality | 2-3 hours |
| **Total** | | **~14-19 hours** |

### Phase 3: RAG Chatbot (Week 3-4)

**Goal**: Build context-aware chatbot

| Task | Details | Time |
|------|---------|------|
| Set up vector database | pgvector or Pinecone + ingestion pipeline | 3-4 hours |
| Content chunking + embedding | Split topics → chunks → embeddings | 2-3 hours |
| `/api/chat` route with RAG | Vector search + LLM + streaming | 3-4 hours |
| Chatbot UI component | Floating widget with streaming display | 3-4 hours |
| Chat history persistence | Store in database per user | 2-3 hours |
| Source citations | Show which topics were used | 1-2 hours |
| **Total** | | **~15-20 hours** |

### Phase 4: Polish & Production (Week 4-5)

**Goal**: Production-ready with monitoring

| Task | Details | Time |
|------|---------|------|
| Rate limiting | Per-user, per-operation limits | 2-3 hours |
| Cost tracking dashboard | Budget monitoring in admin panel | 2-3 hours |
| Error handling + retries | Graceful failures, retry logic | 2-3 hours |
| Prompt injection protection | Input sanitization | 1-2 hours |
| Testing (unit + integration) | Jest + API tests | 3-4 hours |
| Deployment | Docker or Vercel setup | 2-3 hours |
| **Total** | | **~13-18 hours** |

### Total Estimated Time: **50-70 hours** (4-5 weeks part-time)

---

## 22. File Structure After Integration

```
app/
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.js
│   ├── generate/
│   │   ├── topic/
│   │   │   └── route.js
│   │   └── quiz/
│   │       └── route.js
│   ├── chat/
│   │   └── route.js
│   ├── content/
│   │   ├── approve/
│   │   │   └── route.js
│   │   ├── list/
│   │   │   └── route.js
│   │   └── publish/
│   │       └── route.js
│   ├── embeddings/
│   │   └── sync/
│   │       └── route.js
│   └── health/
│       └── route.js
├── admin/
│   └── page.jsx              # Admin panel for content management
├── globals.css
├── layout.jsx
├── page.jsx
├── docker/
│   └── page.jsx
├── golang/
│   └── page.jsx
├── javascript/
│   └── page.jsx
├── kubernetes/
│   └── page.jsx
├── login/
│   └── page.jsx
├── nextjs/
│   └── page.jsx
├── postgresql/
│   └── page.jsx
├── react/
│   └── page.jsx
└── system-design/
    └── page.jsx

components/
├── AdminGeneratePanel.jsx     # NEW: Content generation UI
├── AdminQuizPanel.jsx         # NEW: Quiz generation UI
├── AuthWrapper.jsx
├── BackButton.jsx
├── Card.jsx
├── Chatbot.jsx                # NEW: Floating chatbot widget
├── ChatMessage.jsx            # NEW: Individual chat message
├── FloatingCharacters.jsx
├── InterviewTopicPage.jsx
├── MCQSection.jsx
├── Navbar.jsx
├── Quiz.jsx
├── Sidebar.jsx
├── ThemeProvider.jsx
├── ThemeToggle.jsx
└── TopicDetail.jsx

lib/
├── ai/
│   ├── client.js              # NEW: LLM client factory
│   ├── generate-topic.js      # NEW: Topic generation logic
│   ├── generate-quiz.js       # NEW: Quiz generation logic
│   ├── chat.js                # NEW: RAG chat logic
│   ├── embeddings.js          # NEW: Embedding generation
│   └── prompts/               # NEW: Prompt templates
│       ├── topic-system.txt
│       ├── quiz-system.txt
│       └── chat-system.txt
├── db/
│   └── index.js               # NEW: Prisma client singleton
├── validators/
│   ├── topic-schema.js        # NEW: Zod schema for topics
│   └── quiz-schema.js         # NEW: Zod schema for quizzes
├── vector-db/
│   ├── client.js              # NEW: Vector DB client
│   ├── ingest.js              # NEW: Content ingestion
│   └── search.js              # NEW: Similarity search
├── auth.js                    # NEW: NextAuth configuration
├── rate-limit.js              # NEW: Rate limiting
├── cost-tracker.js            # NEW: Budget monitoring
└── topicUtils.js

prisma/
├── schema.prisma              # NEW: Database schema
└── migrations/                # NEW: Migration files

data/                          # Existing fallback data
hooks/                         # Existing hooks
public/content/                # Existing static content
scripts/
├── ingest-embeddings.mjs      # NEW: One-time embedding ingestion script
├── generate-content.mjs       # NEW: CLI script for batch generation
└── ... (existing scripts)
```

---

## 23. Code Examples

### Complete Working Example: Generate Topic via CLI Script

```javascript
// scripts/generate-content.mjs
// Usage: node scripts/generate-content.mjs --tech=react --topic="React Server Components" --category="Advanced"

import OpenAI from "openai";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.replace("--", "").split("="))
);

const { tech, topic: topicTitle, category = "General" } = args;

if (!tech || !topicTitle) {
  console.error("Usage: node generate-content.mjs --tech=react --topic='Topic Title' [--category='Category']");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log(`\nGenerating content for: ${topicTitle} (${tech}/${category})\n`);

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "system",
      content: `You are a technical content generator. Generate a complete topic JSON with:
- id (kebab-case), title, category: "${category}", description, explanation (markdown), code, example, useCase
- Exactly 10 interviewQuestions [{question, answer}]
- Exactly 10 exercises [{type, question, answer}] with varied types
- Exactly 10 programExercises [{question, code, output}]
Return ONLY valid JSON.`,
    },
    {
      role: "user",
      content: `Generate complete content for "${topicTitle}" in ${tech}. Category: ${category}`,
    },
  ],
  response_format: { type: "json_object" },
  temperature: 0.7,
  max_tokens: 8000,
});

const content = JSON.parse(response.choices[0].message.content);
const topicId = content.id;
const outputDir = join("public", "content", tech, "topics");
const outputPath = join(outputDir, `${topicId}.json`);

writeFileSync(outputPath, JSON.stringify(content, null, 2));

console.log(`✅ Generated: ${outputPath}`);
console.log(`   Title: ${content.title}`);
console.log(`   Questions: ${content.interviewQuestions?.length || 0}`);
console.log(`   Exercises: ${content.exercises?.length || 0}`);
console.log(`   Programs: ${content.programExercises?.length || 0}`);
console.log(`   Tokens: ${response.usage.total_tokens}`);
console.log(`   Cost: ~$${((response.usage.prompt_tokens * 0.00015 + response.usage.completion_tokens * 0.0006) / 1000).toFixed(4)}`);

// Update index.json
const indexPath = join(outputDir, "index.json");
if (existsSync(indexPath)) {
  const index = JSON.parse(readFileSync(indexPath, "utf-8"));
  if (!index.find(e => e.id === topicId)) {
    index.push({
      id: topicId,
      file: `topics/${topicId}.json`,
      title: content.title,
      category,
    });
    writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.log(`   Updated index.json (${index.length} topics total)`);
  }
}
```

### Complete Working Example: Embedding Ingestion Script

```javascript
// scripts/ingest-embeddings.mjs
// Usage: OPENAI_API_KEY=sk-... node scripts/ingest-embeddings.mjs [--tech=system-design]

import OpenAI from "openai";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const targetTech = process.argv.find(a => a.startsWith("--tech="))?.split("=")[1];

const contentDir = join("public", "content");
const technologies = targetTech
  ? [targetTech]
  : readdirSync(contentDir).filter(f => !f.includes("."));

let totalChunks = 0;
let totalTokens = 0;

for (const tech of technologies) {
  const indexPath = join(contentDir, tech, "topics", "index.json");
  try {
    const index = JSON.parse(readFileSync(indexPath, "utf-8"));
    console.log(`\n📦 ${tech}: ${index.length} topics`);

    for (const entry of index) {
      const topicPath = join(contentDir, tech, entry.file);
      try {
        const topic = JSON.parse(readFileSync(topicPath, "utf-8"));
        
        // Create chunks
        const chunks = [];
        chunks.push(`${topic.title}: ${topic.description}\n\n${topic.explanation}`);
        if (topic.code) chunks.push(`${topic.title} - Code:\n${topic.code}`);
        if (topic.interviewQuestions) {
          const qaText = topic.interviewQuestions
            .map(q => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");
          chunks.push(`${topic.title} - Interview Q&A:\n${qaText}`);
        }

        // Generate embeddings
        const response = await client.embeddings.create({
          model: "text-embedding-3-small",
          input: chunks,
        });

        totalChunks += chunks.length;
        totalTokens += response.usage.total_tokens;
        
        console.log(`  ✅ ${entry.id}: ${chunks.length} chunks, ${response.usage.total_tokens} tokens`);
        
        // In production: store embeddings in vector DB here
        // await vectorDB.upsert(chunks.map((text, i) => ({
        //   id: `${tech}/${entry.id}/chunk-${i}`,
        //   values: response.data[i].embedding,
        //   metadata: { technology: tech, topicId: entry.id, text },
        // })));

      } catch (err) {
        console.warn(`  ⚠️ Skipping ${entry.id}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Skipping ${tech}: ${err.message}`);
  }
}

const cost = (totalTokens * 0.02) / 1_000_000;
console.log(`\n📊 Summary:`);
console.log(`   Technologies: ${technologies.length}`);
console.log(`   Total chunks: ${totalChunks}`);
console.log(`   Total tokens: ${totalTokens.toLocaleString()}`);
console.log(`   Estimated cost: $${cost.toFixed(4)}`);
```

---

## 24. Troubleshooting & Common Pitfalls

### LLM Output Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Invalid JSON returned | Model added markdown fences | Use `response_format: { type: "json_object" }` (OpenAI) |
| Wrong number of questions | Model ignored count instruction | Add explicit count in system prompt + validate + retry |
| Code doesn't compile | Hallucinated syntax | Set `temperature: 0.3` for code generation; validate with AST parser |
| Duplicate content | No dedup check | Query database for existing content before generating |
| Prompt injection in chat | User enters "ignore instructions" | Sanitize input, use separate system/user messages |
| Rate limit exceeded | Too many concurrent requests | Implement request queue with exponential backoff |
| High costs | Using GPT-4o for everything | Default to GPT-4o-mini, use GPT-4o only for review |

### Database Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| `EPERM` on `.next` | Dev server running | Stop dev server before building |
| Prisma migration fails | Schema conflict | `npx prisma migrate reset` (dev only) |
| pgvector not found | Extension not enabled | `CREATE EXTENSION IF NOT EXISTS vector;` |
| Connection timeout | Wrong DATABASE_URL | Check connection string, SSL settings |

### Vector DB Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Poor search results | Bad chunking | Increase chunk overlap, include topic title in each chunk |
| Slow queries | Missing index | Create HNSW or IVFFlat index on embedding column |
| Embeddings don't match | Different model used | Always use same embedding model for ingestion and query |

### Streaming Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Response appears all at once | Not using streaming API | Set `stream: true` in API call, use `ReadableStream` |
| Partial JSON in stream | Trying to parse mid-stream | Accumulate full response, parse only at end |
| Connection drops mid-stream | Timeout | Increase timeout, implement reconnection logic |

---

## 25. Future Enhancements

### Short-Term (After Initial Integration)

1. **Adaptive difficulty**: Track quiz scores per topic, automatically adjust difficulty
2. **Spaced repetition**: Resurface topics the user struggles with at optimal intervals
3. **Code execution sandbox**: Run program exercises in-browser (Monaco editor + WASM)
4. **Progress dashboard**: Visual progress across all technologies
5. **Flashcard mode**: Auto-generate flashcards from interview Q&A

### Medium-Term

6. **Voice chat**: Voice input/output for interview simulation
7. **Mock interview mode**: Timed Q&A sessions with scoring
8. **Collaborative features**: Share notes, discuss topics
9. **Custom study plans**: AI generates personalized study schedule based on target company
10. **Multi-language code**: Generate program exercises in JS, Go, Python, etc.

### Long-Term

11. **Fine-tuned model**: Train on high-quality interview Q&A datasets for better content
12. **Company-specific prep**: "Prepare me for Google's system design round"
13. **Video explanations**: AI-generated explanation videos (ElevenLabs + D-ID)
14. **Resume analysis**: Upload resume → get personalized topic recommendations
15. **Interview recording analysis**: Upload mock interview recording → get feedback

---

## Quick Start Checklist

```
□ 1. Get an OpenAI API key (https://platform.openai.com/api-keys)
□ 2. npm install openai ai @ai-sdk/openai zod
□ 3. Create .env.local with OPENAI_API_KEY
□ 4. Create app/api/generate/topic/route.js
□ 5. Create lib/ai/client.js + lib/ai/generate-topic.js
□ 6. Create lib/validators/topic-schema.js
□ 7. Test: curl -X POST http://localhost:3000/api/generate/topic -d '{"technology":"react","topicTitle":"React Suspense"}'
□ 8. Set up PostgreSQL + Prisma (for persistence)
□ 9. Add NextAuth.js (for auth)
□ 10. Build chatbot with RAG
```

---

*This document is the single source of truth for the AI/ML integration roadmap. Update it as decisions are made and implementation progresses.*
