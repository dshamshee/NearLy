import type { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Define paths that don't require authentication (including dynamic paths)
const publicPaths = [
    "/login",
    "/",
    '/signup',
    '/api/email-verification',
    '/api/signup',
    '/about',
    '/services',
    '/contact',
    '/api/worker/togglestatus/:workerId',
    // "/user/*/profile", // Example: another dynamic path
  ];
  
  function matchesPath(pathname: string, pattern: string): boolean {
    // Convert pattern to regex: * and :param for dynamic segments
    const regexPattern = pattern
      .replace(/\*/g, "[^/]+")
      .replace(/:[^/]+/g, "[^/]+") // Replace :param with one or more non-slash characters
      .replace(/\//g, "\\/");
  
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }
  
  function isPublicPath(pathname: string): boolean {
    if (pathname === "/") return true;
  
    return publicPaths.some((path) => {
      if (path.includes("*") || path.includes(":")) {
        return matchesPath(pathname, path);
      }
      return pathname === path || pathname.startsWith(path + "/");
    });
  }

export default async function proxy(request: NextRequest){
    const { pathname } = request.nextUrl;

    // Use getToken only - no GetServerSessionHere (avoids DB/session resolution on every request)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    const isPublic = isPublicPath(pathname);

    // Debug logging (remove in production)
    console.log(`[Proxy] Path: ${pathname}, Token: ${token ? 'exists' : 'null'}, IsPublic: ${isPublic}`);

    // If user is not logged in and trying to access any non-public route, redirect to login
    if (!token && !isPublic) {
      console.log(`[Proxy] Redirecting ${pathname} to /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && (pathname === "/login" || pathname === "/")) {
      return NextResponse.redirect(new URL(token.role === "CUSTOMER" ? "/c/dashboard" : "/w/dashboard", request.url));
    }

    // Role-based route protection using token (no session/DB lookup)
    const role = token?.role as string | undefined;
    if (role === "CUSTOMER" && pathname.startsWith("/w/"))
      return NextResponse.redirect(new URL("/c/dashboard", request.url));
    if (role === "WORKER" && pathname.startsWith("/c/"))
      return NextResponse.redirect(new URL("/w/dashboard", request.url));

    return NextResponse.next();
  }
  
  export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json)$).*)",
    ],
}