# Backend-First DB Migration Plan

Date: February 14, 2026
Scope: Move content delivery from static JSON reads to backend API reads backed by a database seed.

## Goal

All user/topic pages and admin pages should read content from backend APIs only. Static files remain only as source seed/fallback for migration safety.

## Phase 0: Freeze and Contract

1. Define API response contracts:
   - `GET /api/content/[tech]` -> `{ meta, topicsByCategory, quiz }`
   - `GET /api/content/technologies` -> list of available technologies and metadata
   - `GET /api/content/[tech]/topics/[id]` -> full topic detail
2. Define admin contracts (already started):
   - content inbox, content detail, approve/reject, publish/rollback, jobs, audit, settings.
3. Keep frontend hooks/pages consuming contract, not direct storage implementation.

## Phase 1: DB Seed Layer (Start Here)

1. Create seed script:
   - Read `public/content/*/meta.json`
   - Read `public/content/*/topics/index.json`
   - Read each topic json file from index
   - Read `public/content/*/quiz.json`
2. Build normalized DB seed file:
   - `data/content-db.json`
   - top-level shape:
     - `technologies[]` with `slug`, `meta`, `topics[]`, `quiz[]`
3. Add server-side data access module:
   - `lib/server/contentDb.js`
   - read/query by technology/topic id

Deliverable:
- Backend can serve all topic/quiz/meta data from DB seed file without touching `public/content` in runtime pages.

## Phase 2: Content APIs and Hook Cutover

1. Implement:
   - `GET /api/content/technologies`
   - `GET /api/content/[tech]`
   - `GET /api/content/[tech]/topics/[id]`
2. Update `hooks/useTopicDataFromContent.js` to:
   - primary source: `/api/content/[tech]`
   - fallback only if API fails
3. Validate all 8 technology pages load from API.

Deliverable:
- Topic pages render via backend API payloads.

## Phase 3: Study/Quiz/API Consolidation

1. Reuse same content API in:
   - `/study`
   - `/quiz`
2. Remove page-level hardcoded content arrays where possible.
3. Add loading/error UI states consistently.

Deliverable:
- Core learner pages are API-backed and consistent.

## Phase 4: Admin Content Ops DB Integration

1. Replace temporary mock admin store with same DB-backed repository style.
2. Persist review status transitions and publish events in DB storage.
3. Keep current admin route contracts stable.

Deliverable:
- Admin flows no longer reset on server restart.

## Phase 5: Real Database (Prisma/PostgreSQL)

1. Add Prisma dependencies and init schema.
2. Create tables for technologies/topics/questions/quizzes/admin-ops.
3. Create migration script from `data/content-db.json` into PostgreSQL.
4. Swap repository implementation:
   - file-backed -> Prisma-backed
   - no frontend contract changes.

Deliverable:
- Full production DB backend with stable APIs already used by frontend.

## Execution Order (Immediate)

1. Phase 1 implementation.
2. Phase 2 cutover for topic pages.
3. Validate all routes.
4. Continue Phase 3 and 4.

## Status Log

- [x] Plan document created.
- [x] Seed script added: `scripts/build-content-db.mjs`.
- [x] Seed DB generated: `data/content-db.json` (8 technologies, 112 topics, 864 quiz questions).
- [x] Backend content read module added: `lib/server/contentDb.js`.
- [x] Content APIs added:
  - `GET /api/learning/content/technologies`
  - `GET /api/learning/content/[tech]`
  - `GET /api/learning/content/[tech]/topics/[id]`
- [x] Learning content APIs migrated to PostgreSQL repository (`lib/server/contentRepository.js`).
- [x] Topic data hook cutover completed:
  - `hooks/useTopicDataFromContent.js` now reads from backend API.
- [x] `/quiz` switched to backend API data through shared hook.
- [x] Admin APIs migrated to PostgreSQL repository (`lib/server/adminRepository.js`).
- [ ] Validate all topic and study flows end-to-end.
- [ ] Remove remaining page-level static content usage where API source exists.
- [x] Replaced file/memory API storage with PostgreSQL for active content/admin routes.
- [ ] Introduce Prisma layer and migrate repository queries from `pg` client to Prisma.

## Done Criteria

1. Every topic page fetches from `/api/content/[tech]` (verified).
2. `/study` and `/quiz` also use API source.
3. Admin content flow uses backend API with persistent storage layer.
4. Static JSON is not used directly by page components during normal flow.
