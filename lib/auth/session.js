import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "tp_session";

function getSecret() {
  const raw = process.env.AUTH_SECRET || "dev-only-change-this-secret";
  return new TextEncoder().encode(raw);
}

export async function createSessionToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(token) {
  try {
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
