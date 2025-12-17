"use client";


import { signIn } from "next-auth/react";

type Role = "CUSTOMER" | "WORKER" | "ADMIN";

/**
 * Sign in with a specific role
 * This function sets a cookie with the role before calling NextAuth's signIn
 * 
 * @param provider - The authentication provider (e.g., "google")
 * @param role - The role to assign: "CUSTOMER", "WORKER", or "ADMIN"
 * @param callbackUrl - Optional callback URL after sign in
 * 
 * @example
 * // Sign in as a worker
 * signInWithRole("google", "WORKER");
 * 
 * @example
 * // Sign in as an admin with custom callback
 * signInWithRole("google", "ADMIN", "/admin/dashboard");
 */
export async function signInWithRole(
  provider: string,
  role: Role,
  callbackUrl?: string
) {
  // Set cookie with role before signing in
  // The cookie will be read by the signIn callback in options.ts
  document.cookie = `authRole=${role}; path=/; max-age=300`; // Cookie expires in 5 minutes
  
  // Call NextAuth signIn with redirect: false to handle response manually
  const result = await signIn(provider, {
    // callbackUrl: callbackUrl || "/",
    redirect: false,
  });

  console.log("helper result", result);

  return result;
}

