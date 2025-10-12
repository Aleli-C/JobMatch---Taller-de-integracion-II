import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC = ["/auth/homepublic", "/auth/login", "/auth/register", "/reset", "/_next", "_next_image","/favicon.ico"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();

  // Paso temporal: si existe la cookie dev_auth, permite el acceso
  if (req.cookies.get("dev_auth")?.value === "1") return NextResponse.next();

  return NextResponse.redirect(new URL("/auth/homepublic", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
};
