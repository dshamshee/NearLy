import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/loadingSkeleton";





export default function CustomerLayout({
    children,
    modal,
  }: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
  }>) {


  
    return (
            <Suspense fallback={<LoadingSkeleton />}>
            {children}
            {modal}
            </Suspense>
    );
  }
  