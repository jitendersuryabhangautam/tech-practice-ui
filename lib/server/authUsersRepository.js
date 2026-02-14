import bcrypt from "bcryptjs";
import { pgQuery } from "@/lib/server/postgres";

let initialized = false;

async function ensureAuthUsersReady() {
  if (initialized) return;

  await pgQuery(`
    CREATE TABLE IF NOT EXISTS auth_users (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const existing = await pgQuery("SELECT COUNT(*)::int AS count FROM auth_users");
  if ((existing.rows[0]?.count || 0) === 0) {
    const defaults = [
      {
        userId: "admin-1",
        name: "Admin",
        email: process.env.ADMIN_EMAIL || "admin@platform.dev",
        password: process.env.ADMIN_PASSWORD || "admin123",
        role: "admin",
      },
      {
        userId: "user-1",
        name: "Learner",
        email: process.env.USER_EMAIL || "user@platform.dev",
        password: process.env.USER_PASSWORD || "user123",
        role: "user",
      },
    ];

    for (const user of defaults) {
      const hash = await bcrypt.hash(user.password, 10);
      await pgQuery(
        `INSERT INTO auth_users (user_id, name, email, password_hash, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [user.userId, user.name, user.email.toLowerCase(), hash, user.role]
      );
    }
  }

  initialized = true;
}

export async function getAuthUserByEmail(email) {
  await ensureAuthUsersReady();
  const normalized = String(email || "").trim().toLowerCase();
  const { rows } = await pgQuery(
    `SELECT user_id, name, email, password_hash, role
     FROM auth_users
     WHERE email = $1
     LIMIT 1`,
    [normalized]
  );
  return rows[0] || null;
}

export async function createAuthUser({ name, email, password, role = "user" }) {
  await ensureAuthUsersReady();
  const normalized = String(email || "").trim().toLowerCase();
  const hash = await bcrypt.hash(password, 10);
  const userId = `user-${Date.now()}`;

  const { rows } = await pgQuery(
    `INSERT INTO auth_users (user_id, name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING user_id, name, email, role`,
    [userId, name, normalized, hash, role]
  );
  return rows[0] || null;
}

export async function verifyUserPassword(user, password) {
  if (!user?.password_hash) return false;
  return bcrypt.compare(password, user.password_hash);
}
