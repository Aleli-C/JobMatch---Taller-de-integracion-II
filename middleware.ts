import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // ejemplo: proteger /admin
  const isAdmin = request.cookies.get("role")?.value === "ADMIN";
  if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  return NextResponse.next();
}

// opcional: limitar rutas donde corre el middleware
export const config = {
  matcher: ["/admin/:path*"],
};
