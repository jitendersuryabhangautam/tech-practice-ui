# System Design Page Audit (Current State + Expansion Plan)

## 1) Current State Snapshot

- Route: `app/system-design/page.jsx`
- Data source: **Hardcoded inline** (no JSON content files, no `data/` JS module, no `public/content/system-design/` folder)
- Loader: None — raw array constant `systemDesignData` inside the page component
- Quiz: Hardcoded inline array `systemDesignQuiz` inside the page component
- Component: Custom `SystemDesignTopicDetail` renderer (does **not** use shared `InterviewTopicPage` or `TopicDetail`)
- Diagrams: Custom inline SVG components via `TopicDiagram` (no Mermaid support)

### Current Content Metrics

| Metric                                     | Count                        |
| ------------------------------------------ | ---------------------------- |
| Categories                                 | 2 (Foundations, Company LLD) |
| Total topics                               | 8                            |
| Quiz questions                             | 6                            |
| Total exercises across all topics          | 10                           |
| Total programExercises across all topics   | 8                            |
| Total interviewQuestions across all topics | 19                           |

### Per-Topic Breakdown

| #   | ID                   | Title                                                 | Category    | InterviewQs | Exercises | ProgramExercises | Diagrams   |
| --- | -------------------- | ----------------------------------------------------- | ----------- | ----------- | --------- | ---------------- | ---------- |
| 1   | sd-process           | System Design Interview Framework                     | Foundations | 3 ❌        | 3 ❌      | 2 ❌             | Generic ⚠️ |
| 2   | capacity-consistency | Capacity Planning, Consistency, and Trade-offs        | Foundations | 3 ❌        | 3 ❌      | 1 ❌             | Generic ⚠️ |
| 3   | netflix-lld          | Netflix LLD: Playback Session and Streaming           | Company LLD | 3 ❌        | 3 ❌      | 1 ❌             | Generic ⚠️ |
| 4   | facebook-feed-lld    | Facebook LLD: News Feed Generation                    | Company LLD | 3 ❌        | 2 ❌      | 1 ❌             | Generic ⚠️ |
| 5   | youtube-lld          | YouTube LLD: Upload, Transcode, and Publish Pipeline  | Company LLD | 2 ❌        | 1 ❌      | 1 ❌             | Generic ⚠️ |
| 6   | zomato-lld           | Zomato LLD: Order Lifecycle and Dispatch              | Company LLD | 2 ❌        | 1 ❌      | 1 ❌             | Generic ⚠️ |
| 7   | bookmyshow-lld       | BookMyShow LLD: Seat Locking and Booking              | Company LLD | 2 ❌        | 1 ❌      | 1 ❌             | Custom ✅  |
| 8   | delhivery-lld        | Delhivery LLD: Shipment Tracking and Logistics Events | Company LLD | 2 ❌        | 1 ❌      | 1 ❌             | Custom ✅  |

**Common pattern**: Most topics have only 2–3 interview questions, 1–3 exercises, and 1–2 program exercises. This is **far below** the 10/10/10 standard used across other pages (Docker, Golang, PostgreSQL, etc.).

---

## 2) What Is Good (Pros)

1. **Strong topic selection**: Netflix, Facebook, YouTube, Zomato, BookMyShow, Delhivery are highly relevant real-world system design interview topics.
2. **Structured content fields**: Each topic consistently has `explanation`, `designPatterns`, `hld`, `lld`, `interviewQuestions`, `exercises`, and `programExercises` — good schema.
3. **HLD + LLD separation**: Topics properly separate high-level architecture from low-level implementation details.
4. **Design patterns per topic**: Each topic lists relevant design patterns, which is great for interview preparation.
5. **Exercise variety**: Exercises include type labels (`framework`, `scenario`, `estimation`, `design`, `lld`, `tricky`, `debug`, `output`) — more granular than other pages.
6. **Two custom SVG diagrams**: BookMyShow and Delhivery have dedicated architecture flow diagrams (not just generic fallback).
7. **Foundations category**: Includes a meta-topic on interview framework and capacity planning — useful for general preparation.

---

## 3) Bugs & Issues Found

### BUG 1: Not Using Shared Content Architecture (Critical — Architectural)

- **Problem**: Every other technology page (Docker, Golang, PostgreSQL, React, Next.js, Kubernetes, JavaScript) uses:
  - `public/content/{tech}/topics/*.json` for granular topic files
  - `public/content/{tech}/meta.json` for page metadata
  - `public/content/{tech}/quiz.json` for quiz questions
  - `hooks/useTopicDataFromContent.js` to load content
  - `components/InterviewTopicPage.jsx` as the shared page shell
  - `components/TopicDetail.jsx` as the shared topic renderer
- **System Design uses none of this.** All content is hardcoded inline in the page component.
- **Impact**:
  1. Content cannot be updated without touching React code
  2. No topic search functionality (sidebar search is in shared `InterviewTopicPage`, not available here)
  3. No content loading/caching benefits
  4. Missed features from shared renderer (Mermaid diagrams, implementation blocks, use case sections, etc.)
  5. Inconsistent user experience vs all other pages

### BUG 2: No `public/content/system-design/` Folder Exists

- **Problem**: The content folder structure has entries for all 7 other technologies but **no `system-design/` folder** at all.
- **Impact**: Cannot migrate to JSON-based content without creating the folder structure first.

### BUG 3: Only 6 Quiz Questions (Severely Insufficient)

- **Problem**: The quiz has only **6 questions**. Every other page has 90–124 quiz questions.
- **Impact**: Quiz section is effectively useless — a user will see the same 6 questions every time with no variety.

### BUG 4: Generic Fallback Diagram for 6 of 8 Topics

- **Problem**: `TopicDiagram` component has custom SVGs for only `bookmyshow-lld` and `delhivery-lld`. All other 6 topics render a generic `Client -> API/Gateway -> Service -> Storage` diagram that does not reflect their actual architecture.
- **Impact**: Diagrams are misleading. Netflix's playback pipeline, Facebook's fanout architecture, YouTube's transcoding pipeline, and Zomato's dispatch system all show the same generic 4-box flow.

### BUG 5: Missing `code`/`command` Fields in Program Exercises

- **Problem**: Program exercises use pseudo-code and plain text rather than actual executable code snippets.
- **Examples**:
  - Netflix program: `INIT -> AUTHORIZED -> PLAYING -> ENDED` — just a state diagram, not code
  - Facebook program: `cursor = base64(...)` — single-line pseudo-code
  - Delhivery program: `sha256(...)` — formula, not implementation
- **Impact**: No real programming practice value compared to other pages which have full code + output.

### BUG 6: No `implementation` or `useCase` Fields

- **Problem**: Other pages' topics have `implementation` (code block) and `useCase` (practical application) fields rendered by `TopicDetail.jsx`. System design topics have none of these.
- **Impact**: Missing important learning dimensions that users expect from other pages.

### BUG 7: No Dark Mode Support in SVG Diagrams

- **Problem**: Custom SVG diagrams use hardcoded light-mode colors (`fill="#f8fafc"`, `stroke="#94a3b8"`, `fill="#0f172a"`).
- **Impact**: Diagrams look washed out or unreadable in dark mode.

---

## 4) Content Quality Assessment

### 4.1 Explanation Depth

| Topic                | Explanation Quality                                                                |
| -------------------- | ---------------------------------------------------------------------------------- |
| sd-process           | Medium — covers framework steps but lacks examples of real interview walkthroughs  |
| capacity-consistency | Medium — mentions QPS, replication but no worked-through estimation example        |
| netflix-lld          | Good — covers playback path, ABR, QoE but misses CDN architecture details          |
| facebook-feed-lld    | Good — covers fanout tradeoff well but lacks ranking model detail                  |
| youtube-lld          | Thin — misses content moderation pipeline, preview generation, metadata extraction |
| zomato-lld           | Thin — misses payment integration, restaurant SLA, surge pricing logic             |
| bookmyshow-lld       | Good — seat locking well explained but misses concurrent user handling at scale    |
| delhivery-lld        | Medium — event sourcing approach good but misses geo-routing, hub assignment       |

### 4.2 Interview Questions Quality

- Questions are high quality and interview-relevant
- But **quantity is far too low** — most topics have only 2–3 questions vs the 10-question standard
- Missing common interview angles:
  - Scale-specific questions ("How would you handle 100M DAU?")
  - Failure mode questions ("What happens when X goes down?")
  - Data model questions ("What does the schema look like?")
  - Monitoring/observability questions

### 4.3 Exercises Quality

- Exercise types are well-labeled and question quality is good
- But **quantity is critically low** — most topics have only 1 exercise vs the 10-exercise standard
- Many exercises have no answers provided (only some `tricky` and `output` types include answers)

---

## 5) Missing Topics (Major Gaps)

The page covers only 8 topics. Critical system design interview topics that are **completely missing**:

### 5.1 Missing Foundation Topics

| Topic                            | Priority | Why It Matters                                                     |
| -------------------------------- | -------- | ------------------------------------------------------------------ |
| Load Balancing & Reverse Proxy   | HIGH     | Core infrastructure pattern asked in every system design interview |
| Caching Strategies               | HIGH     | Cache-aside, write-through, write-behind, cache invalidation       |
| Database Partitioning & Sharding | HIGH     | Horizontal/vertical partitioning, consistent hashing               |
| Message Queues & Event Streaming | HIGH     | Kafka, RabbitMQ, pub/sub patterns, exactly-once semantics          |
| Rate Limiting & Throttling       | HIGH     | Token bucket, sliding window, distributed rate limiting            |
| API Design & Versioning          | MEDIUM   | REST, GraphQL, gRPC, API gateway patterns                          |
| CDN Architecture                 | MEDIUM   | Content delivery, edge caching, cache invalidation                 |
| Microservices Patterns           | MEDIUM   | Service discovery, circuit breaker, saga, API gateway              |
| Monitoring & Observability       | MEDIUM   | Metrics, logging, tracing, alerting, SLI/SLO/SLA                   |
| CAP Theorem Deep Dive            | MEDIUM   | Partition tolerance trade-offs with practical examples             |
| Distributed Locking              | MEDIUM   | Redis-based locks, Zookeeper, fencing tokens                       |
| Consistent Hashing               | MEDIUM   | Ring-based distribution, virtual nodes, rebalancing                |

### 5.2 Missing Company HLD/LLD Topics

| Topic                               | Priority | Why It Matters                                            |
| ----------------------------------- | -------- | --------------------------------------------------------- |
| URL Shortener (TinyURL)             | HIGH     | Classic warm-up system design question                    |
| Chat/Messaging System (WhatsApp)    | HIGH     | Real-time communication, WebSocket, message ordering      |
| Notification System                 | HIGH     | Push notifications, email, SMS — multi-channel delivery   |
| Search/Autocomplete (Google)        | HIGH     | Inverted index, trie, ranking, real-time suggestions      |
| Uber/Ola Ride Matching              | HIGH     | Geo-spatial indexing, real-time matching, ETA calculation |
| Twitter Timeline                    | MEDIUM   | Differences from Facebook feed, real-time tweet delivery  |
| Payment System (Razorpay/Stripe)    | MEDIUM   | Transaction safety, idempotency, reconciliation           |
| E-commerce (Amazon)                 | MEDIUM   | Catalog, cart, checkout, inventory, recommendations       |
| File Storage (Dropbox/Google Drive) | MEDIUM   | Sync engine, chunking, conflict resolution                |
| Distributed Task Scheduler          | MEDIUM   | Job scheduling, priority queues, failure recovery         |
| Key-Value Store (Redis)             | LOW      | In-memory data structures, persistence, replication       |
| Log Aggregation System              | LOW      | Collection, processing, storage, querying at scale        |

---

## 6) Feature Gaps vs Other Pages

| Feature                     | Other Pages                   | System Design Page       | Gap      |
| --------------------------- | ----------------------------- | ------------------------ | -------- |
| JSON content files          | ✅ Granular `public/content/` | ❌ Hardcoded inline      | Critical |
| Shared page shell           | ✅ `InterviewTopicPage`       | ❌ Custom component      | Major    |
| Shared topic renderer       | ✅ `TopicDetail`              | ❌ Custom component      | Major    |
| Content loader hook         | ✅ `useTopicDataFromContent`  | ❌ None                  | Major    |
| Sidebar search              | ✅ Built into shared sidebar  | ❌ Not available         | Medium   |
| Mermaid diagrams            | ✅ Auto-rendered              | ❌ Only hardcoded SVGs   | Medium   |
| `implementation` field      | ✅ Code blocks shown          | ❌ Not present           | Medium   |
| `useCase` field             | ✅ Practical context          | ❌ Not present           | Medium   |
| `example` field             | ✅ Concrete examples          | ❌ Not present           | Medium   |
| Minimum content enforcement | ✅ 10/10/10 via enricher      | ❌ Topics have 1–3 items | Major    |
| Quiz depth                  | ✅ 90–124 questions           | ❌ Only 6 questions      | Critical |
| Topic count                 | ✅ 7–14 topics                | ⚠️ 8 topics (borderline) | Medium   |
| Content hot-reload          | ✅ JSON can be edited live    | ❌ Requires code change  | Minor    |
| Dark mode diagrams          | ✅ Tailwind classes           | ❌ Hardcoded SVG colors  | Minor    |

---

## 7) Expansion Plan

### Phase 1: Architecture Migration (Priority: Critical)

**Goal**: Migrate system design page to use the same content architecture as all other pages.

1. **Create content folder structure**:

   ```
   public/content/system-design/
   ├── meta.json
   ├── quiz.json
   └── topics/
       ├── index.json
       ├── sd-process.json
       ├── capacity-consistency.json
       ├── netflix-lld.json
       ├── facebook-feed-lld.json
       ├── youtube-lld.json
       ├── zomato-lld.json
       ├── bookmyshow-lld.json
       └── delhivery-lld.json
   ```

2. **Extract hardcoded data** into JSON files matching the shared schema.

3. **Add missing fields** to each topic: `implementation`, `useCase`, `example`.

4. **Replace custom page component** with `InterviewTopicPage` + `useTopicDataFromContent`.

5. **Add `data/system-design.js`** as JS fallback module (matching pattern of other pages).

6. **Convert SVG diagrams to Mermaid** format so they render via the shared `TopicDetail` renderer.

### Phase 2: Content Depth Expansion (Priority: High)

**Goal**: Bring every existing topic to the 10/10/10 standard (10 interview questions, 10 exercises, 10 program exercises).

For each of the 8 existing topics, add:

- 7–8 more interview questions (focus on failure modes, scale, data modeling, monitoring)
- 7–9 more exercises (mix of design, estimation, scenario, output, debug types)
- 8–9 more program exercises (real pseudocode/code with meaningful output)

### Phase 3: Quiz Expansion (Priority: High)

**Goal**: Expand quiz from 6 to 100+ questions.

- Add 15–20 questions per category (Foundations, Netflix, Facebook, YouTube, Zomato, BookMyShow, Delhivery)
- Include output-based, scenario-based, and architecture-choice question types
- Ensure no duplicate or near-duplicate questions

### Phase 4: New Foundation Topics (Priority: High)

Add these foundational system design topics with full 10/10/10 content:

1. Load Balancing & Reverse Proxy
2. Caching Strategies (Cache-aside, Write-through, Invalidation)
3. Database Partitioning & Sharding
4. Message Queues & Event Streaming
5. Rate Limiting & Throttling
6. API Design & Versioning
7. Microservices Patterns
8. Consistent Hashing
9. CDN Architecture
10. Monitoring & Observability

### Phase 5: New Company LLD Topics (Priority: Medium)

Add these company-specific system design topics:

1. URL Shortener (TinyURL)
2. Chat System (WhatsApp/Slack)
3. Notification System
4. Search & Autocomplete
5. Ride Matching (Uber/Ola)
6. Payment System
7. E-commerce System
8. File Storage (Dropbox)

### Phase 6: Diagram Enrichment (Priority: Medium)

- Replace generic SVG diagrams with topic-specific Mermaid diagrams
- Add sequence diagrams for key flows (payment callback, order lifecycle, video upload)
- Add ER diagrams for data models
- Ensure all diagrams support dark mode

---

## 8) Summary Scorecard

| Dimension                       | Score      | Notes                                                          |
| ------------------------------- | ---------- | -------------------------------------------------------------- |
| Topic selection quality         | 7/10       | Good real-world topics but missing many critical foundations   |
| Content depth per topic         | 3/10       | Most topics at 2–3 items vs 10-item standard                   |
| Quiz coverage                   | 1/10       | Only 6 questions — unusable for real practice                  |
| Architecture consistency        | 2/10       | Does not use shared content system at all                      |
| Diagram quality                 | 4/10       | 6 of 8 topics use generic fallback diagram                     |
| Interview readiness             | 5/10       | Good Q&A quality but insufficient quantity and no HLD classics |
| Feature parity with other pages | 3/10       | Missing search, Mermaid, implementation, useCase, example      |
| Code/program exercise quality   | 3/10       | Pseudocode only, no real implementations                       |
| **Overall**                     | **3.5/10** | Needs significant structural migration and content expansion   |

---

## 9) Recommended Priority Order

1. ❗ **Migrate to shared content architecture** (unblocks all other improvements)
2. ❗ **Expand quiz to 100+ questions** (currently unusable)
3. ❗ **Bring all 8 topics to 10/10/10 standard** (content depth)
4. 🔶 **Add 10 foundation topics** (critical interview coverage)
5. 🔶 **Add topic-specific diagrams** (replace generic SVGs)
6. 🔶 **Add missing fields** (`implementation`, `useCase`, `example`)
7. 🔷 **Add 8 company HLD/LLD topics** (broader coverage)
8. 🔷 **Fix dark mode SVG colors** (cosmetic but impacts usability)
