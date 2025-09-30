// lib/session.ts
import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE = "authToken";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);

export type SessionClaims = JWTPayload & { sub: string; correo: string; role: string };

export async function createSession(payload: SessionClaims) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("30m")            // ← exp obligatorio
    .sign(key());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true, secure: true, sameSite: "lax", path: "/",
    // sin maxAge → cookie de sesión
  });
}

export async function getSession(): Promise<SessionClaims | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key())).payload as SessionClaims; }
  catch { return null; }
}
