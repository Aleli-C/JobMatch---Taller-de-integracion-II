// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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
