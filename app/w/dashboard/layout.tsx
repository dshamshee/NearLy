import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/loadingSkeleton";

export default function WorkerDashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
            <Suspense fallback={<LoadingSkeleton />}>
            {children}
            </Suspense>
    );
  }
  