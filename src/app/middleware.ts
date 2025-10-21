import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (public login page)
     * - Files with extensions (.png, .jpg, .jpeg, .gif, .svg, .ico, .webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|.*\\.(png|jpg|jpeg|gif|svg|ico|webp)$).*)'
  ]
};
