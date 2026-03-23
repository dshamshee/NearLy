import { Suspense } from "react";
import { RouteAwareSuspenseFallback } from "@/components/routeAwareSuspenseFallback";
import { SocketSync } from "@/components/providers/SocketSync";

export default function WorkerLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
            <Suspense fallback={<RouteAwareSuspenseFallback />}>
            <SocketSync />
            {children}
            </Suspense>
    );
  }
  