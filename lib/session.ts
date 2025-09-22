// lib/session.ts
import { cookies } from "next/headers";
import { signJWT, verifyJWT } from "./jwt";
import type { JWTPayload } from "jose";

export type SessionClaims = JWTPayload & {
  sub: string;                   // <- string por RFC 7519
  correo: string;
  role?: "EMPLEADOR" | "EMPLEADO";
};

export type SessionInput = {     // lo que pasa tu app
  sub: number;                   // id numérico
  correo: string;
  role?: "EMPLEADOR" | "EMPLEADO";
};

export const sessionConfig = {
  name: "session",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  },
} as const;

export async function createSession(s: SessionInput) {
  const payload: SessionClaims = { sub: String(s.sub), correo: s.correo, role: s.role };
  const token = await signJWT(payload, "7d");
  const store = await cookies();                 // Next 15: async
  store.set(sessionConfig.name, token, sessionConfig.options);
}

export async function getSession<T extends JWTPayload = SessionClaims>(): Promise<T | null> {
  const store = await cookies();                 // Next 15: async
  const token = store.get(sessionConfig.name)?.value;
  if (!token) return null;
  return (await verifyJWT<T>(token));
}

export async function destroySession() {
  const store = await cookies();                 // Next 15: async
  store.set(sessionConfig.name, "", { ...sessionConfig.options, maxAge: 0 });
}
