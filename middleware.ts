// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/auth/login", "/auth/register", "/auth/reset", "/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some(p => pathname.startsWith(p)) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }
  const hasSession = req.cookies.has("session");
  if (!hasSession) return NextResponse.redirect(new URL("/auth/login", req.url));
  return NextResponse.next();
}

export const config = {
  // sin grupos de captura; excluye estáticos y /auth/**
  matcher: ["/((?!_next|.*\\.(?:css|js|png|jpg|svg|ico)|auth/.*).*)"],
};
