# Docker DB Setup

This project now includes a Dockerized PostgreSQL setup seeded from `data/content-db.json`.

## Files Added

- `docker-compose.db.yml`
- `docker/postgres/init/01_schema.sql`
- `docker/postgres/init/02_seed_content.sql` (generated)
- `scripts/generate-postgres-seed-sql.mjs`

## Commands

1. Build content DB JSON (if needed):

```bash
npm run build:content-db
```

2. Generate PostgreSQL seed SQL from content JSON:

```bash
npm run build:seed-sql
```

3. Start DB:

```bash
npm run db:up
```

4. Reset DB (drop volume + re-init schema/seed):

```bash
npm run db:reset
```

5. Stop DB:

```bash
npm run db:down
```

## Connection

- Host: `localhost`
- Port: `5433`
- Database: `techrevision`
- User: `postgres`
- Password: `postgres`

Example `DATABASE_URL`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/techrevision
```

## Verification Queries

```sql
SELECT COUNT(*) FROM technologies;
SELECT COUNT(*) FROM topics;
SELECT COUNT(*) FROM quiz_questions;
SELECT COUNT(*) FROM interview_questions;
SELECT COUNT(*) FROM exercises;
SELECT COUNT(*) FROM program_exercises;
```
