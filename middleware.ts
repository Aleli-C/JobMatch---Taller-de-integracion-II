// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
<<<<<<< HEAD

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
=======
import { jwtVerify } from "jose";

const PUBLIC = ["/", "/auth/login", "/auth/register", "/auth/reset"];
const PRIVATE = ["/profile", "/favorite", "/chat", "/forum", "/publications"];
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);

async function isValid(token?: string) {
  if (!token) return false;
  try { await jwtVerify(token, key()); return true; } catch { return false; }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authToken")?.value;

  const needsAuth = PRIVATE.some(p => pathname.startsWith(p));
  if (needsAuth && !(await isValid(token))) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const goingPublic = PUBLIC.includes(pathname);
  if (goingPublic && pathname !== "/" && (await isValid(token))) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
>>>>>>> main
