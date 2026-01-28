import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { Suspense } from "react";





export default async function WorkerEditProfileLayout({
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
  