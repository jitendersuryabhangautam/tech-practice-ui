import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { registerUser, sanitizeUser } from "@/lib/auth/users";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const { error, user } = await registerUser({ name, email, password });
  if (error) {
    return NextResponse.json({ error }, { status: 409 });
  }

  const safeUser = sanitizeUser(user);
  const token = await createSessionToken(safeUser);
  const res = NextResponse.json({ user: safeUser }, { status: 201 });
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
