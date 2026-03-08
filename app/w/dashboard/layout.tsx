import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/loadingSkeleton";
import { WorkerAvailability } from "@/components/workerAvailability";
import { IncomingBookingCard } from "@/components/incomingBookingCard";
import { WorkerPaymentCard } from "@/components/workerPaymentCard";
import { WorkerMap } from "@/components/workerMap";
import { WorkerStatsCard } from "@/components/workerStatsCard";
import { WorkerRecentBooking } from "@/components/workerRecentBooking";

export default function WorkerDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
        <div className="mainContainer min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">

      {children}
      <WorkerAvailability />
      <IncomingBookingCard type="worker" />
      <WorkerPaymentCard />
      <WorkerMap />
      <WorkerStatsCard />
      <WorkerRecentBooking />
      </div>
    </Suspense>
  );
}
