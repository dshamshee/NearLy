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
    // "/user/*/profile", // Example: another dynamic path
  ];
  
  function matchesPath(pathname: string, pattern: string): boolean {
    // Convert pattern with wildcards to regex
    const regexPattern = pattern
      .replace(/\*/g, "[^/]+") // Replace * with one or more non-slash characters
      .replace(/\//g, "\\/"); // Escape forward slashes
  
    const regex = new RegExp(`^${regexPattern}$`);
  
    return regex.test(pathname);
  }
  
  function isPublicPath(pathname: string): boolean {
    // Check for root path
    if (pathname === "/") return true;
  
    // Check against all public paths (including dynamic ones)
    return publicPaths.some((path) => {
      if (path.includes("*")) {
        return matchesPath(pathname, path);
      }
  
      // Exact match or path starts with the public path followed by a slash
      return pathname === path || pathname.startsWith(path + "/");
    });
  }

export default async function proxy(request: NextRequest){
    const { pathname } = request.nextUrl;
    
    // Get token with explicit secret for Next.js 16 proxy.ts
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    });
  
    const isPublic = isPublicPath(pathname);
  
    // Debug logging (remove in production)
    console.log(`[Proxy] Path: ${pathname}, Token: ${token ? 'exists' : 'null'}, IsPublic: ${isPublic}`);
  
    // If user is logged in and trying to access login page, redirect to home
    if (token && pathname === "/login") {
    //   return NextResponse.redirect(new URL("/", request.url));
    console.log("User already logged in with ", token);
    }
  
    // If user is not logged in and trying to access any non-public route, redirect to login
    if (!token && !isPublic) {
      console.log(`[Proxy] Redirecting ${pathname} to /login`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  
    return NextResponse.next();
  }
  
  export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json)$).*)",
    ],
}