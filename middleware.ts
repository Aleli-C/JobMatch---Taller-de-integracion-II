import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas publicas (accesibles sin login)
const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/reset"];

// Rutas generales privadas (requieren sesion)
const privatePaths = [
  "/profile",
  "/favorite",
//"/publications",
  "/chat",
  "/forum",
  "/publications",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Cookie de autenticacion
  const token = req.cookies.get("authToken")?.value;

  // Intento de acceso a ruta privada sin token → redirigir a login
  if (privatePaths.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Intento de acceso a login/register/reset con token → redirigir a profile
  if (publicPaths.includes(pathname) && token && pathname !== "/") {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

// Configuracion: aplica a todas las rutas excepto assets estáticos
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
