# Golang Page Audit (Current State + Expansion Plan)

## 1) Current State Snapshot
- Route: `app/golang/page.jsx`
- Loader: `hooks/useTopicDataFromContent.js`
- Topic index: `public/content/golang/topics/index.json`
- Quiz source: `public/content/golang/quiz.json`

Current content metrics:
- Topics in index: `14`
- Quiz questions in content file: `112`
- Additional Go quiz merged at runtime: `12`
- Effective quiz pool on page: `124`

Observed topic depth from JSON files:
- Core topics (`syntax`, `functions`, `structs`, `interfaces`, `goroutines`, `channels`, `select`, `sync`, `arrays-slices`, `maps`) are often `3-6` interview/exercise/program items each.
- Backend topics (`db-connection`, `redis-connection`, `api-development`, `inbuilt-functions`) are already at `10/10/10`.
- Route-level enrichers force minimum `10/10/10` using generic fallback content.

## 2) What Is Good (Pros)
1. Strong topic coverage for fundamentals + backend.
2. Good breadth in quiz bank (`112`) and no duplicate question text in source.
3. Includes practical backend-oriented topics (DB, Redis, HTTP API).
4. Content structure is mostly consistent and render-safe.
5. Runtime enrichment guarantees minimum depth so sections are never empty.
6. Uses content loader (`public/content/...`) with fallback support.
7. Golang loading loop issue was fixed by memoizing fallback arrays.

## 3) What Is Weak (Cons)
1. Forced fallback (`ensureMinimum`) inflates quantity with generic prompts, reducing signal quality.
2. Early core topics have lower native practical depth than backend topics.
3. Program exercises are uneven: many are mini snippets vs real multi-step tasks.
4. No explicit leveling (`Medium`, `Hard`, `Very Hard`) for Go exercises/programs.
5. No project-style capstone labs (multi-file, module-based, testable workflows).
6. No grading rubric or expected evaluation criteria for practical problems.
7. No benchmark/profiling tracks (`pprof`, `benchstat`) despite Go interview relevance.
8. No reliability patterns module (retries, circuit breaker, idempotency, rate limiting).
9. No observability module (structured logs, tracing correlation, metrics instrumentation).
10. No security-focused practicals (JWT auth pitfalls, SQL injection hardening patterns, secret handling).

## 4) Key Gaps (Areas Lacking)
1. Real-world systems design in Go services (service boundaries, contracts, failure modes).
2. Production concurrency beyond basics (bounded pools, backpressure, cancellation trees).
3. Data layer robustness (migrations, transactions at scale, retry semantics, connection exhaustion handling).
4. Testing maturity:
- Table tests exist conceptually but not enough end-to-end practical suites.
- Missing fuzz testing practice.
- Missing integration test setups for HTTP + DB + Redis.
5. Performance engineering:
- Missing memory profile and CPU profile practicals.
- Missing GC pressure and allocation reduction tasks.
6. API design quality:
- Missing OpenAPI-first or contract-first exercises.
- Missing versioning and backward-compat patterns.

## 5) Architecture Findings (Code/Flow)
1. `app/golang/page.jsx` merges content and enriches every topic at runtime.
2. Runtime fallback factories are useful for safety but hide content quality debt.
3. Enriched quiz merge logic is clean and deduplicates by question string.
4. Page quality depends heavily on route-level generated items rather than curated topic JSON.

## 6) Priority Recommendations

## P0 (Immediate)
1. Move away from generic fallback prompts for Go route.
2. Curate real questions/exercises/programs directly in Go topic JSON files.
3. Add level tags (`Medium`, `Hard`, `Very Hard`) for Go exercises/programs.
4. Add one "Real-World Go Service Challenges" bulk topic similar to JS/Postgres hubs.

## P1 (Next)
1. Add advanced concurrency module:
- Worker pool with cancellation, bounded queues, fan-in/fan-out, leak prevention.
2. Add testing module:
- unit + table + mock + integration + fuzz + benchmark.
3. Add performance module:
- profiling, allocations, latency tuning, lock contention diagnosis.

## P2 (After)
1. Add distributed systems practicals:
- idempotency keys, outbox pattern, saga compensation, eventual consistency drills.
2. Add production readiness track:
- config management, health/readiness, graceful shutdown, observability end-to-end.

## 7) Questions To Add (High-Value Interview Bank)
Add at least these 50 interview questions:
1. How does Go scheduler map goroutines to OS threads?
2. What is work stealing and why does it matter in Go runtime?
3. When does preemption occur in modern Go?
4. How do you detect and prevent goroutine leaks in production?
5. What are anti-patterns for context usage?
6. How do you propagate cancellation across layered architecture?
7. Explain nil interface vs typed nil with a real bug example.
8. When is `sync.Map` a better choice than map+mutex?
9. How do you choose mutex vs channel for synchronization?
10. Why can `append` unexpectedly mutate another slice?
11. How to design safe APIs around shared backing arrays?
12. How to tune `sql.DB` pools under high concurrency?
13. What failure modes occur with DB pool starvation?
14. How to implement retry with idempotency in DB writes?
15. What does serializable isolation protect against?
16. How to model optimistic vs pessimistic locking in Go services?
17. How do you enforce request deadlines in HTTP handlers?
18. What is graceful shutdown sequence for HTTP + workers?
19. How do you avoid partial success in multi-resource workflows?
20. How to structure error types for observability and API mapping?
21. What belongs in middleware vs handler business logic?
22. How to design reusable package boundaries in Go monorepos?
23. What are common pitfalls with `time.After` in loops?
24. How to avoid memory leaks with timers/tickers?
25. How to instrument latency histograms in critical endpoints?
26. How to design idempotent webhook consumers?
27. How to protect APIs against replay and duplicate requests?
28. How to handle partial Redis outages gracefully?
29. How to use Redis for cache-aside with stampede protection?
30. How to benchmark critical code paths properly?
31. How to interpret `go test -bench` and `-benchmem` outputs?
32. How to identify allocation hot spots using `pprof`?
33. How to reduce GC pressure in high-throughput services?
34. What are trade-offs of reflection in production code?
35. How do generics help eliminate duplication safely?
36. When to avoid generics despite possible reuse?
37. How to design robust request validation pipelines?
38. How to build consistent JSON error envelopes?
39. How to manage API versioning and deprecations?
40. How to test race-prone code deterministically?
41. What are good table-driven test design patterns?
42. How to design integration tests with ephemeral dependencies?
43. How to safely run background jobs from API services?
44. How to coordinate periodic tasks with leader election?
45. How to design health endpoints with meaningful checks?
46. How to separate readiness vs liveness probes?
47. How to secure config/secret handling in Go services?
48. How to implement audit logging without coupling handlers?
49. How to model domain errors vs infra errors cleanly?
50. How to keep Go codebase maintainable at team scale?

## 8) Practical Exercise Backlog (All Types, Large Set)
Add at least these 75 practical exercises.

Implement (25):
1. Build bounded worker pool with context cancellation.
2. Implement fan-out/fan-in pipeline with error propagation.
3. Create HTTP middleware chain: request ID, logging, auth, recover.
4. Implement retry with exponential backoff + jitter.
5. Build rate limiter middleware (token bucket).
6. Implement idempotency-key middleware for POST endpoints.
7. Add DB repository with context-aware methods and typed errors.
8. Implement transaction wrapper helper with rollback guarantees.
9. Build cache-aside layer using Redis + DB fallback.
10. Implement read-through cache invalidation on write.
11. Create paginated API with cursor pagination.
12. Add partial update endpoint with patch validation.
13. Implement optimistic locking using version column.
14. Build graceful shutdown manager for HTTP + workers.
15. Add background job queue with retry and dead-letter list.
16. Implement structured logger wrapper with field enrichment.
17. Add request-scoped tracing IDs propagation.
18. Build file upload handler with size/type validation.
19. Implement webhook signature verification.
20. Create configuration loader with env defaults and validation.
21. Build generic in-memory LRU cache with TTL.
22. Implement debounced write-behind buffer for metrics events.
23. Add OpenAPI-aligned handler response validator.
24. Build SSE endpoint with client disconnect handling.
25. Implement health/readiness endpoints with dependency probes.

Debug (15):
26. Fix goroutine leak in consumer loop waiting on channel forever.
27. Fix deadlock caused by lock acquisition order inversion.
28. Fix race condition in shared map writes.
29. Debug intermittent 504 due to missing context timeout.
30. Resolve DB pool exhaustion under burst traffic.
31. Fix memory growth caused by unbounded buffered channel.
32. Debug ticker leak in periodic cleanup job.
33. Fix duplicate event processing due to non-idempotent consumer.
34. Resolve panic from nil interface assertion in handler.
35. Debug stale cache read after successful write.
36. Fix Redis retry storm during partial outage.
37. Debug blocked shutdown due to hanging goroutines.
38. Fix JSON decode bug when unknown fields are ignored.
39. Debug wrong HTTP status mapping for domain errors.
40. Resolve benchmark regressions after refactor.

Output/Reasoning (15):
41. Predict output for nested defer with named returns.
42. Predict output for select with closed channel + default.
43. Analyze slice append/capacity mutation side effects.
44. Determine map iteration unpredictability impact.
45. Explain output order for goroutine scheduling sample.
46. Predict race detector findings for given code.
47. Evaluate timeout behavior with nested contexts.
48. Predict transaction results under conflicting updates.
49. Explain output for interface typed nil comparisons.
50. Predict behavior of `sync.Once` across goroutines.
51. Analyze waitgroup misuse output and failure modes.
52. Predict channel close + receive patterns.
53. Explain behavior of `recover` scope boundaries.
54. Predict middleware execution ordering.
55. Evaluate read-write lock outcomes under load.

Scenario/System Design (10):
56. Design checkout service with DB + Redis + queue consistency.
57. Design notification service with retries and deduplication.
58. Plan migration from monolith handler to layered architecture.
59. Design multi-tenant API rate limiting strategy.
60. Architect event ingestion with backpressure control.
61. Design low-latency leaderboard with eventual consistency.
62. Plan blue/green release health verification in Go service.
63. Design audit logging with minimal request overhead.
64. Plan disaster recovery for cache + DB corruption incident.
65. Design resilient external API integration with circuit breaker.

Theory/Trade-offs (10):
66. Mutex vs channel trade-offs by workload pattern.
67. Generic vs interface design trade-offs.
68. Goroutine-per-request vs pool-based execution model.
69. Repository abstraction depth trade-offs.
70. Read-through vs write-through cache trade-offs.
71. Consistency models for distributed Go services.
72. Profiling-first optimization strategy.
73. Fuzz tests value in API and parser layers.
74. Structured errors vs plain strings in large codebases.
75. Middleware layering and ownership boundaries.

## 9) Program Backlog (Large Practical Program Set)
Add these 60 serious programs (end-to-end style):

Concurrency & Reliability (15):
1. Worker pool with bounded queue + cancellation.
2. Dynamic worker scaler by queue depth.
3. Fan-out/fan-in with error group and early cancel.
4. Timeout-wrapped external call helper.
5. Retry with backoff+jitter+max elapsed time.
6. Circuit breaker with half-open probe state.
7. Token bucket HTTP rate limiter middleware.
8. Leaky bucket variant and comparison.
9. Deduplication service with TTL keys (Redis/in-memory).
10. Idempotent POST handler with key-store lock.
11. Priority queue scheduler for background jobs.
12. Cron-like ticker scheduler with graceful stop.
13. Dead-letter queue flow simulation.
14. Concurrent batch processor with partial failure report.
15. Graceful shutdown orchestrator with dependency ordering.

HTTP/API (15):
16. REST users API with validation and typed errors.
17. JSON envelope standardizer middleware.
18. Request ID + trace correlation middleware.
19. Auth middleware with role-based access control.
20. Multipart upload with streaming + size guard.
21. Pagination with cursor tokens.
22. Search endpoint with filter parser and validation.
23. SSE notification stream endpoint.
24. Webhook receiver with signature verification.
25. OpenAPI-like response contract tester.
26. API version router with deprecation warnings.
27. Throttled endpoint with retry-after header.
28. ETag-based conditional GET handler.
29. Batch endpoint with per-item result statuses.
30. Unified error-to-status mapper package.

Data Layer (15):
31. SQL repository with transaction helper.
32. Unit-of-work pattern with rollback safety.
33. Optimistic locking update with retries.
34. Read replica failover strategy simulator.
35. Connection pool stats dashboard endpoint.
36. Query timeout and cancellation propagation sample.
37. Prepared statement cache wrapper.
38. Migration bootstrap checker.
39. Outbox pattern producer implementation.
40. Inbox dedupe consumer implementation.
41. Cache-aside read path with stale fallback.
42. Write-through cache invalidation pipeline.
43. Redis distributed lock helper with renewal.
44. Hot key protection with request coalescing.
45. Multi-get cache layer with partial miss handling.

Testing/Performance/Ops (15):
46. Table-driven tests for API validation.
47. Race-condition test harness with failing/fixed versions.
48. Fuzz tests for JSON parser and query parser.
49. Benchmarks for serializer alternatives.
50. `pprof` instrumented API with CPU/memory endpoints.
51. Allocation reduction refactor with benchmark proof.
52. Golden-file tests for API responses.
53. Integration test setup with testcontainers.
54. Chaos simulation: delayed dependency and timeouts.
55. Structured log formatter + redaction filter.
56. Metrics collector with histograms/counters.
57. Health/readiness probe framework.
58. Feature flag driven behavior switcher.
59. Config loader with env/file precedence and validation.
60. End-to-end service skeleton combining all above.

## 10) Suggested New Go Topic Packs To Add
1. Real-World Go Service Challenges (bulk practical hub)
2. Advanced Concurrency Patterns
3. Go Testing Mastery (unit/integration/fuzz/bench)
4. Performance Tuning and Profiling
5. Reliability Patterns for Go Services
6. Security and API Hardening
7. Distributed Systems Fundamentals in Go
8. Observability and Incident Readiness

## 11) Implementation Plan (If You Want Me To Execute)
1. Add `public/content/golang/topics/real-world-service-challenges.json` with:
- 50 interview questions
- 100 exercises
- 80 practical programs
2. Register it in `public/content/golang/topics/index.json`.
3. Add levels (`Medium`, `Hard`, `Very Hard`) across exercises/programs.
4. Reduce route-level generic fallback usage in `app/golang/page.jsx`.
5. Add content validator script for Go tracks similar to PostgreSQL validation approach.

