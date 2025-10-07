// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "authToken";

// Solo vistas públicas. "/" NO está aquí → es privada.
const PUBLIC: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/reset",
  "/auth/homepublic",
];

// Público por defecto para redirigir cuando no hay sesión:
const DEFAULT_PUBLIC_REDIRECT = "/auth/homepublic";

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);

function isPublicPath(pathname: string) {
  return PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

async function hasValidSession(token?: string) {
  if (!token) return false;
  try {
    await jwtVerify(token, key()); // valida firma y exp/nbf si existen
    return true;
  } catch {
    return false;
  }
}

// Redirige a una ruta pública válida; si no lo es, cae al DEFAULT_PUBLIC_REDIRECT
function redirectToPublic(req: NextRequest, target?: string) {
  const path =
    target && isPublicPath(target) ? target : DEFAULT_PUBLIC_REDIRECT;
  const url = req.nextUrl.clone();
  url.pathname = path;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  const authed = await hasValidSession(token);

  // No autenticado → solo entra a PUBLIC
  if (!authed) {
    if (isPublicPath(pathname)) return NextResponse.next();
    // "/" es privada por definición → redirige a login u otra pública
    return redirectToPublic(req); // o redirectToPublic(req, "/auth/register")
  }

  // Autenticado → evita páginas públicas (ej.: login) si lo deseas
  if (isPublicPath(pathname)) {
    // Ajusta tu “home” privada
    const PRIVATE_HOME = "/profile";
    const url = req.nextUrl.clone();
    url.pathname = PRIVATE_HOME;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Evita estáticos, imágenes y API
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:png|jpg|jpeg|svg|gif|ico|webp)|api/).*)",
  ],
};
