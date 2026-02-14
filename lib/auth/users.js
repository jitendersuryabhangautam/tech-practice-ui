import {
  createAuthUser,
  getAuthUserByEmail,
  verifyUserPassword,
} from "@/lib/server/authUsersRepository";

export async function findUserByCredentials(email, password) {
  const user = await getAuthUserByEmail(email);
  if (!user) return null;
  const ok = await verifyUserPassword(user, password);
  if (!ok) return null;
  return {
    id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser({ name, email, password }) {
  const existing = await getAuthUserByEmail(email);
  if (existing) {
    return { error: "Email already exists", user: null };
  }
  const created = await createAuthUser({ name, email, password, role: "user" });
  return { error: null, user: created };
}

export function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id || user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
