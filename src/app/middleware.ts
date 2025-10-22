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
    {
      source: "/*",
      regexp: "^/(.*)",
      locale: false,
      has: [{ type: "cookie", key: "authToken", value: "active" }],
      missing: [{ type: "cookie", key: "authToken", value: "active" }],
    },
  ],
};
