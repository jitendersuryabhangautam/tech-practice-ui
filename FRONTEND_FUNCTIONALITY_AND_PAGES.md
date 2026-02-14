# Frontend Functionality and Page Map (From `AI_INTEGRATION_GUIDE.md`)

Source: `AI_INTEGRATION_GUIDE.md` (v2.0, February 14, 2026)

## 1. User Frontend Functionalities Required

### A. Learning Content Experience
- Browse technologies and topic index by category.
- Open topic detail pages with explanation, code, example, and use case.
- View interview questions, exercises, and program exercises per topic.
- Mermaid/diagram rendering support inside topic content.
- Fallback loading strategy: API content -> static JSON -> local fallback modules.

### B. Quiz and Assessment
- Start quizzes by technology/topic.
- Answer MCQs with instant/summary scoring.
- Show explanations for answers.
- Persist quiz attempts and progress.
- Support adaptive difficulty and weak-topic detection.

### C. AI Chatbot (RAG)
- Floating/openable chat widget across learning pages.
- Ask interview-prep questions and receive streamed responses.
- Ground responses in platform content with citations/sources.
- Show confidence/grounding hint (where available).
- Persist chat history per user.
- Fallback behavior when provider/quota fails (queue/retry/status messaging).

### D. Personalized Learning
- Weak-topic dashboard/view.
- Personalized revision plan generation and display.
- Spaced repetition review queue.
- Topic recommendations based on user performance.

### E. Interview Preparation
- Interview simulator setup (role/domain/difficulty/time).
- Timed interview rounds with question flow.
- Rubric-based feedback and score summary.
- Session history and replay/review.

### F. Coding Practice
- In-browser coding lab/editor for program exercises.
- Run code with test cases.
- Show complexity hints and feedback.
- Track coding attempt history and outcomes.

### G. Progress and Analytics
- User progress dashboard (topic completion, quiz trends, weak areas).
- Goal/streak/progress indicators.
- Coaching insights from historical performance.

### H. Account, Privacy, and Safety UX
- Login/signup and session management.
- Profile and preferences.
- Export personal data.
- Request account/data deletion.
- Clear messaging for AI limits/errors/unavailability.

## 2. Admin Frontend Functionalities Required

### A. AI Content Generation Ops
- Generate topic content via AI (tech/topic/category/difficulty inputs).
- Generate quiz questions via AI.
- Queue-based generation with live job progress/status.
- Retry/regenerate failed or low-quality generations.

### B. Content Review and Publishing
- Preview generated content before publishing.
- Edit generated content in review flow.
- Approve/reject/regenerate generated items.
- Publish approved content.
- Rollback previously published versions.
- Content list/filter by status (pending/approved/published/rejected).
- Version diff/history for content ops.

### C. Budget, Reliability, and Provider Controls
- Budget dashboard (usage %, spend trend, limits).
- Provider mode visibility (free mode, primary/fallback provider).
- Quota/rate-limit monitoring.
- Kill-switch and feature throttle controls.
- Queue health and job throughput visibility.

### D. Audit and Governance
- Audit log viewer (who generated/approved/published and when).
- Security/abuse event visibility.
- Retention policy and cleanup status visibility.

### E. User Oversight
- User activity and engagement tracking (high-level).
- Generation/quiz/chat usage per user.
- Optional intervention flags for abnormal usage.

## 3. Required Frontend Pages (Route-Oriented)

## User Pages
- `/` -> Landing/home with technology navigation and AI entry points.
- `/login` -> Authentication page.
- `/{technology}` -> Technology learning hub (topic list + quiz + chat context).
- `/study` -> Unified study mode with full question/exercise flow.
- `/quiz` or `/{technology}/quiz` -> Quiz-focused experience and results.
- `/chat` (optional if widget-only) -> Full-screen AI prep chat history view.
- `/plan` -> Personalized revision plan and spaced repetition queue.
- `/progress` -> User analytics/progress dashboard.
- `/interview-simulator` -> Interview simulation setup and session runner.
- `/coding-lab` -> Coding practice workspace and submissions.
- `/account` -> Profile/preferences.
- `/account/privacy` -> Export/delete data controls and retention info.

## Admin Pages
- `/admin` -> Admin overview dashboard (generation, ops, user tracking snapshot).
- `/admin/generate` -> AI generation workspace (topics/quizzes + queue status).
- `/admin/content` -> Generated content inbox/review list.
- `/admin/content/[id]` -> Content detail review/edit/approve/reject/regenerate.
- `/admin/publish` -> Publish center with publish history and rollback actions.
- `/admin/ops` -> Budget, quota, provider fallback, kill-switch, reliability metrics.
- `/admin/jobs` -> Job queue monitor (queued/running/failed/completed with retry).
- `/admin/audit` -> Audit trail viewer and filters.
- `/admin/users` -> User activity/usage tracking dashboard.
- `/admin/settings` -> AI mode/settings (free mode flags, provider defaults, limits).

## 4. Suggested Build Priority (Frontend)

1. Core user learning flow: `/{technology}`, `/study`, quiz integration, chatbot widget.
2. Core admin ops: `/admin`, `/admin/generate`, `/admin/content`, `/admin/ops`.
3. Reliability and governance: `/admin/jobs`, `/admin/audit`, `/admin/publish`.
4. Personalization layer: `/plan`, `/progress`.
5. Advanced simulations/lab: `/interview-simulator`, `/coding-lab`.

## 5. Notes

- The guide supports both static content and API-served DB content; frontend should remain source-agnostic.
- Keep free-mode UX explicit: show provider, fallback state, queueing, and quota messaging.
- Treat this file as frontend execution checklist aligned with `AI_INTEGRATION_GUIDE.md`.

## 6. Required Database Schema (Prisma Reference)

Use this as the minimum schema baseline to support all required user/admin pages.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  USER
  ADMIN
}

enum ContentStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  PUBLISHED
  REJECTED
}

enum JobType {
  GENERATE_TOPIC
  GENERATE_QUIZ
  EMBEDDING_SYNC
  PUBLISH_CONTENT
}

enum JobStatus {
  QUEUED
  RUNNING
  COMPLETED
  FAILED
  RETRYING
}

enum ChatRole {
  USER
  ASSISTANT
  SYSTEM
}

enum Difficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum ExportStatus {
  PENDING
  COMPLETED
  FAILED
}

enum DeletionStatus {
  REQUESTED
  CONFIRMED
  COMPLETED
  FAILED
}

model User {
  id                String               @id @default(cuid())
  name              String?
  email             String?              @unique
  image             String?
  role              UserRole             @default(USER)
  isActive          Boolean              @default(true)
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  accounts          Account[]
  sessions          Session[]
  topicsCreated     Topic[]              @relation("TopicCreatedBy")
  topicsReviewed    Topic[]              @relation("TopicReviewedBy")
  quizAttempts      QuizAttempt[]
  topicProgress     UserTopicProgress[]
  chatSessions      ChatSession[]
  jobsRequested     Job[]                @relation("JobRequestedBy")
  auditLogs         AuditLog[]
  studyPlanItems    StudyPlanItem[]
  reviewQueueItems  ReviewQueueItem[]
  codingAttempts    CodingAttempt[]
  exports           DataExportRequest[]
  deletions         DataDeletionRequest[]
}

model Technology {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String?
  isActive    Boolean  @default(true)
  topics      Topic[]
  quizzes     Quiz[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Topic {
  id               String        @id @default(cuid())
  technologyId     String
  technology       Technology    @relation(fields: [technologyId], references: [id], onDelete: Cascade)
  slug             String
  title            String
  category         String
  description      String
  explanationMd    String
  codeSnippet      String?
  exampleText      String?
  useCaseText      String?
  difficulty       Difficulty?
  interviewQCount  Int           @default(0)
  exerciseCount    Int           @default(0)
  programQCount    Int           @default(0)
  status           ContentStatus @default(PENDING_REVIEW)
  version          Int           @default(1)
  createdById      String?
  createdBy        User?         @relation("TopicCreatedBy", fields: [createdById], references: [id], onDelete: SetNull)
  reviewedById     String?
  reviewedBy       User?         @relation("TopicReviewedBy", fields: [reviewedById], references: [id], onDelete: SetNull)
  approvedAt       DateTime?
  publishedAt      DateTime?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  interviewQuestions InterviewQuestion[]
  exercises        Exercise[]
  programExercises ProgramExercise[]
  topicVersions    TopicVersion[]
  reviewQueueItems ReviewQueueItem[]
  userProgress     UserTopicProgress[]

  @@unique([technologyId, slug, version])
}

model TopicVersion {
  id            String   @id @default(cuid())
  topicId        String
  topic          Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  version        Int
  payloadJson    Json
  changeSummary  String?
  createdById    String?
  createdAt      DateTime @default(now())

  @@unique([topicId, version])
}

model InterviewQuestion {
  id        String   @id @default(cuid())
  topicId    String
  topic      Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  question   String
  answer     String
  sortOrder  Int      @default(0)
  createdAt  DateTime @default(now())
}

model Exercise {
  id        String   @id @default(cuid())
  topicId    String
  topic      Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  type       String
  question   String
  answer     String
  sortOrder  Int      @default(0)
  createdAt  DateTime @default(now())
}

model ProgramExercise {
  id         String   @id @default(cuid())
  topicId     String
  topic       Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  question    String
  starterCode String?
  expectedOutput String?
  testCases   Json?
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
}

model Quiz {
  id            String      @id @default(cuid())
  technologyId  String
  technology    Technology  @relation(fields: [technologyId], references: [id], onDelete: Cascade)
  title         String
  difficulty    Difficulty?
  status        ContentStatus @default(PENDING_REVIEW)
  version       Int         @default(1)
  createdById   String?
  publishedAt   DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  questions     QuizQuestion[]
  attempts      QuizAttempt[]
}

model QuizQuestion {
  id            String   @id @default(cuid())
  quizId         String
  quiz           Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  question       String
  options        Json
  correctAnswer  Int
  explanation    String
  sortOrder      Int      @default(0)
}

model QuizAttempt {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  quizId         String
  quiz           Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  score          Int
  totalQuestions Int
  accuracy       Float
  durationSec    Int?
  createdAt      DateTime @default(now())
  answers        QuizAttemptAnswer[]
}

model QuizAttemptAnswer {
  id              String   @id @default(cuid())
  attemptId        String
  attempt          QuizAttempt @relation(fields: [attemptId], references: [id], onDelete: Cascade)
  quizQuestionId   String
  selectedAnswer   Int
  isCorrect        Boolean
}

model UserTopicProgress {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId         String
  topic           Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  masteryScore    Float    @default(0)
  attempts        Int      @default(0)
  lastPracticedAt DateTime?
  updatedAt       DateTime @updatedAt

  @@unique([userId, topicId])
}

model StudyPlanItem {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId     String?
  title       String
  priority    Int      @default(1)
  dueAt       DateTime?
  completedAt DateTime?
  createdAt   DateTime @default(now())
}

model ReviewQueueItem {
  id            String   @id @default(cuid())
  userId        String?
  user          User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  topicId       String
  topic         Topic    @relation(fields: [topicId], references: [id], onDelete: Cascade)
  nextReviewAt  DateTime
  intervalDays  Int      @default(1)
  easeFactor    Float    @default(2.5)
  repetition    Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ChatSession {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String?
  technology  String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  messages    ChatMessage[]
}

model ChatMessage {
  id             String    @id @default(cuid())
  sessionId       String
  session         ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  role            ChatRole
  content         String
  citationsJson   Json?
  confidenceScore Float?
  modelUsed       String?
  createdAt       DateTime  @default(now())
}

model CodingChallenge {
  id           String   @id @default(cuid())
  technology   String
  title        String
  description  String
  starterCode  String?
  testCases    Json
  difficulty   Difficulty?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  attempts     CodingAttempt[]
}

model CodingAttempt {
  id              String   @id @default(cuid())
  challengeId      String
  challenge        CodingChallenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  userId           String
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  submittedCode    String
  passedCount      Int      @default(0)
  totalCount       Int      @default(0)
  runtimeMs        Int?
  memoryKb         Int?
  aiFeedback       String?
  createdAt        DateTime @default(now())
}

model Job {
  id               String    @id @default(cuid())
  type             JobType
  status           JobStatus @default(QUEUED)
  requestedById    String?
  requestedBy      User?     @relation("JobRequestedBy", fields: [requestedById], references: [id], onDelete: SetNull)
  provider         String?
  model            String?
  inputJson        Json?
  outputJson       Json?
  errorMessage     String?
  retries          Int       @default(0)
  queuedAt         DateTime  @default(now())
  startedAt        DateTime?
  completedAt      DateTime?
}

model PublishEvent {
  id             String   @id @default(cuid())
  triggeredById  String?
  targetType     String
  targetId       String?
  summary        String?
  status         String
  rollbackRef    String?
  createdAt      DateTime @default(now())
}

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  action      String
  entityType  String
  entityId    String?
  metadata    Json?
  ipAddress   String?
  createdAt   DateTime @default(now())
}

model BudgetMetric {
  id            String   @id @default(cuid())
  day           DateTime
  provider      String
  model         String?
  requests      Int      @default(0)
  inputTokens   Int      @default(0)
  outputTokens  Int      @default(0)
  estimatedCost Float    @default(0)

  @@unique([day, provider, model])
}

model FeatureConfig {
  id                String   @id @default(cuid())
  aiMode            String   @default("free")
  primaryProvider   String   @default("gemini")
  fallbackProvider  String   @default("groq")
  openAiEnabled     Boolean  @default(false)
  topicDailyLimit   Int      @default(5)
  quizDailyLimit    Int      @default(20)
  chatDailyLimit    Int      @default(200)
  monthlyBudgetUsd  Float    @default(0)
  killSwitchEnabled Boolean  @default(false)
  updatedAt         DateTime @updatedAt
}

model DataExportRequest {
  id          String       @id @default(cuid())
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  status      ExportStatus @default(PENDING)
  fileUrl     String?
  requestedAt DateTime     @default(now())
  completedAt DateTime?
}

model DataDeletionRequest {
  id           String         @id @default(cuid())
  userId       String
  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  status       DeletionStatus @default(REQUESTED)
  requestedAt  DateTime       @default(now())
  confirmedAt  DateTime?
  completedAt  DateTime?
}

// NextAuth Prisma Adapter models
model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?
  user               User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id            String   @id @default(cuid())
  sessionToken  String   @unique
  userId        String
  expires       DateTime
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## 7. Dependencies Required

Install these to support all required functionality and pages.

```bash
# Core app + AI
npm install ai @google/generative-ai openai zod slugify

# Database + auth
npm install prisma @prisma/client next-auth @next-auth/prisma-adapter

# Jobs + cache/rate-limit
npm install inngest @upstash/redis @upstash/ratelimit

# Optional queue (if not using Inngest)
# npm install bullmq ioredis

# Optional editor/simulator support
npm install @monaco-editor/react

# Dev/testing
npm install -D jest @testing-library/react @playwright/test
```

## 8. Environment Variables Required

```env
# App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_with_secure_value

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# AI mode and providers
AI_MODE=free
FREE_PRIMARY_PROVIDER=gemini
FREE_FALLBACK_PROVIDER=groq
OPENAI_ENABLED=false

# Provider keys
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
# OPENAI_API_KEY=sk-...  # optional, keep disabled in free mode

# Caching / limits
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Jobs (if using Inngest)
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Budget / ops
AI_MONTHLY_BUDGET=0
ALLOWED_ORIGINS=http://localhost:3000
```

## 9. API Surface Required for the New Pages

- `POST /api/generate/topic` -> enqueue topic generation job.
- `POST /api/generate/quiz` -> enqueue quiz generation job.
- `GET /api/jobs/[id]` -> poll job status and progress.
- `GET /api/content/list` -> list generated content by status/filter.
- `GET /api/content/[id]` -> content detail for admin review.
- `POST /api/content/approve` -> approve content.
- `POST /api/content/reject` -> reject content.
- `POST /api/content/publish` -> publish approved content.
- `POST /api/content/rollback` -> rollback publish.
- `GET /api/admin/audit` -> audit trail feed.
- `GET /api/admin/budget` -> budget and provider usage metrics.
- `GET /api/admin/jobs` -> queue monitor data.
- `GET /api/admin/users` -> user usage tracking.
- `GET /api/progress/summary` -> progress metrics for `/progress`.
- `GET /api/plan` and `POST /api/plan/rebuild` -> revision plan and regen.
- `POST /api/chat` -> streaming chat response with citations.
- `POST /api/user/export` -> request data export.
- `POST /api/user/delete` -> request account deletion.

## 10. Execution Guidance

1. Implement schema and migrations first (`prisma migrate dev`).
2. Build data/service layer per module (`content`, `jobs`, `chat`, `progress`, `admin`).
3. Remove page-level hardcoded `MOCK_*` constants and replace with API-backed hooks.
4. Keep `/admin` tabs for overview, but add dedicated routes listed in Section 3.
5. Gate admin routes by role (`USER` vs `ADMIN`) at layout/middleware level.
