import { Suspense } from "react";
import { RouteAwareSuspenseFallback } from "@/components/routeAwareSuspenseFallback";





export default function CustomerLayout({
    children,
    modal,
  }: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
  }>) {


  
    return (
            <Suspense fallback={<RouteAwareSuspenseFallback />}>
            {children}
            {modal}
            </Suspense>
    );
  }
  