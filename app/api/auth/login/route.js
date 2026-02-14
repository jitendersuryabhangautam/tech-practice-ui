import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { findUserByCredentials, sanitizeUser } from "@/lib/auth/users";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = body?.email;
  const password = body?.password;

  const user = await findUserByCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const safeUser = sanitizeUser(user);
  const token = await createSessionToken(safeUser);

  const res = NextResponse.json({ user: safeUser });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
