import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Este middleware se ejecuta antes de que una petición se complete.
export function middleware(req: NextRequest) {
  // 1. Obtenemos el token de la cookie "session".
  //    Actualizado para coincidir con `getSessionUser.ts`.
  const token = req.cookies.get("session")?.value;

  // 2. Definimos rutas que queremos proteger.
  const protectedRoutes = ["/chat", "/profile", "/favorite", "/forum"];

  // 3. Verificamos si la URL actual es una de las rutas protegidas.
  const isProtectedRoute = protectedRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // 4. Lógica de seguridad:
  //    Si la ruta es protegida Y no hay un token, redirigimos al usuario a la página de login.
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Si todo está en orden, permitimos que la petición continúe.
  return NextResponse.next();
}

// El 'config' le dice a Next.js en qué rutas específicas debe ejecutarse este middleware.
export const config = {
  matcher: [
    "/chat/:path*",
    "/profile/:path*",
    "/favorite/:path*",
    "/forum/:path*",
  ],
};
