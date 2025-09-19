//middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/jwt";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session")?.value;

  // Si no hay token, redirigir a login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Verificar token
  const payload = verifyJWT<{ id: number; correo: string; tipo: string }>(token);

  if (!payload) {
    // Token inválido o expirado → borrar cookie y redirigir
    const res = NextResponse.redirect(new URL("/auth/login", req.url));
    res.cookies.delete("session");
    return res;
  }

  // Token válido → dejar pasar
  return NextResponse.next();
}

// Configuración de rutas a proteger
export const config = {
  matcher: [
    "/dashboard/:path*",  // Ejemplo: proteger todo el dashboard
    "/perfil/:path*",     // Ejemplo: proteger perfil de usuario
  ],
};
