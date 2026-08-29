/**
 * Subdomain deploy routing — rewrites public URLs to internal /blog/* paths.
 * Active only when DEPLOY_MODE=subdomain; no-op for subdirectory/standalone.
 *
 * Next.js 16+ deprecates middleware.ts in favor of proxy.ts. This template keeps
 * middleware.ts for Next.js 15 compatibility. See docs/DEPLOY-ROUTING.md.
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (process.env.DEPLOY_MODE !== "subdomain") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/blog") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/blog", request.url));
  }

  if (pathname.startsWith("/category/") || pathname.startsWith("/tag/") || pathname.startsWith("/author/")) {
    return NextResponse.rewrite(new URL(`/blog${pathname}`, request.url));
  }

  if (pathname === "/sitemap.xml") {
    return NextResponse.rewrite(new URL("/blog/sitemap.xml", request.url));
  }

  // FEATURES_RSS is injected at build time from openblog.config via next.config env.
  if (pathname === "/rss.xml") {
    if (process.env.FEATURES_RSS === "false") {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL("/blog/rss.xml", request.url));
  }

  return NextResponse.rewrite(new URL(`/blog${pathname}`, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
