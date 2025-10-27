import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("authToken");
  const pathname = request.nextUrl.pathname;

  // Se não tem cookie de sessão e não está na página de login, redireciona para login
  if (!sessionCookie?.value && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se tem cookie de sessão e está na página de login, redireciona para dashboard
  if (sessionCookie?.value && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (png, jpg, jpeg, svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
};
