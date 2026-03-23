"use client";

import { usePathname } from "next/navigation";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { WorkerDashboardSkeleton } from "@/components/workerDashboardSkeleton";
import { WorkerProfileSkeleton } from "@/components/workerProfileSkeleton";
import { CustomerDashboardSkeleton } from "@/components/customerDashboardSkeleton";
import { CustomerProfileSkeleton } from "@/components/customerProfileSkeleton";

/**
 * Renders the appropriate loading skeleton based on the current route.
 * Used as Suspense fallback so route-specific skeletons show instead of the default.
 */
export function RouteAwareSuspenseFallback() {
  const pathname = usePathname();

  if (pathname?.startsWith("/w/dashboard")) {
    return <WorkerDashboardSkeleton />;
  }
  if (pathname?.startsWith("/w/profile")) {
    return <WorkerProfileSkeleton />;
  }
  if (pathname?.startsWith("/c/dashboard")) {
    return <CustomerDashboardSkeleton />;
  }
  if (pathname?.startsWith("/c/profile")) {
    return <CustomerProfileSkeleton />;
  }

  return <LoadingSkeleton />;
}
