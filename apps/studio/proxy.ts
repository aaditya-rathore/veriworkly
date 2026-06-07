import { NextRequest, NextResponse } from "next/server";

import { getSafeAuthCallback } from "@/lib/auth-redirect";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const PUBLIC_PATH_PREFIXES = ["/login", "/share", "/api/og"];
const PUBLIC_FILES = new Set(["/robots.txt", "/sitemap.xml", "/manifest.json"]);

export function isPublicStudioPath(pathname: string) {
  return (
    PUBLIC_FILES.has(pathname) ||
    pathname.includes(".") ||
    PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie =
    request.cookies.get("__Secure-veriworkly-auth.session_token")?.value ||
    request.cookies.get("veriworkly-auth.session_token")?.value;

  const isLoginPage = pathname === "/login";
  const isPublicPath = isPublicStudioPath(pathname);
  const isAuthenticated = !!sessionCookie;

  if (isLoginPage && isAuthenticated) {
    const callbackURL = getSafeAuthCallback(request.nextUrl.searchParams.get("callbackURL"));
    const redirectUrl = new URL(callbackURL, request.url);

    return NextResponse.redirect(redirectUrl);
  }

  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackURL", `${pathname}${request.nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
