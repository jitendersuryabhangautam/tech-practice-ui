import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5433/techrevision";

let pool;

export function getPgPool() {
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 10,
    });
  }
  return pool;
}

export async function pgQuery(text, params = []) {
  const db = getPgPool();
  return db.query(text, params);
}
