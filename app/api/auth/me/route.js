import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const user = await verifySessionToken(token);
  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }
  return Response.json({ user });
}
