// lib/session.ts
import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const COOKIE = "authToken";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);

export type SessionClaims = JWTPayload & { sub: string; correo: string; role: string };

export async function createSession(payload: SessionClaims) {
  // firma con claims de app y fija sub de forma explícita
  const token = await new SignJWT({ correo: payload.correo, role: payload.role })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)          // ← id en sub
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(key());

  const store = cookies();            // ← no es async
  (await store).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // evita fallo en http local
    sameSite: "lax",
    path: "/",
    // sin maxAge → cookie de sesión
  });
}

export async function getSession(): Promise<SessionClaims | null> {
  const store = cookies();            // ← no es async
  const token = (await store).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    if (!sub) return null;
    // devuelve tu shape con sub, correo, role y los std claims si existen
    return {
      ...(payload as JWTPayload),
      sub,
      correo: String((payload as any).correo ?? ""),
      role: String((payload as any).role ?? ""),
    };
  } catch {
    return null;
  }
}