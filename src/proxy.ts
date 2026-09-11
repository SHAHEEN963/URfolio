import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

/**
 * Next.js 16 renamed `middleware` to `proxy`.
 *
 * This is an *optimistic* gate: it bounces obviously-signed-out visitors
 * away from /dashboard before any page work happens. It is not the
 * security boundary — every server action calls requireAdmin(), which
 * re-verifies the cookie and the configured admin email.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") return NextResponse.next();

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
