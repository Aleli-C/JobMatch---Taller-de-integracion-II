// lib/session.ts
import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

// Configuración de la cookie
export const sessionConfig = {
  name: "session", // nombre de la cookie
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // solo HTTPS en prod
    sameSite: "lax", // protege contra CSRF
    path: "/", // accesible en toda la app
    maxAge: 60 * 60 * 24 * 7, // 7 días
  } as const,
};

// Función genérica para obtener la sesión desde la cookie
export async function getSession<T>(cookieName: string): Promise<T | null> {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;

  return verifyJWT<T>(token);
}
