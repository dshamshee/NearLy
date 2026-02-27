import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { SocketSync } from "@/components/providers/SocketSync";

export default function WorkerLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
            <Suspense fallback={<LoadingSkeleton />}>
            <SocketSync />
            {children}
            </Suspense>
    );
  }
  