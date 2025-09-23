import { NextResponse } from "next/server";
export function middleware() {
  return NextResponse.next(); // sin auth, todo público
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
