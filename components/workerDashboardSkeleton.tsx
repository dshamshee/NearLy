import { Skeleton } from "@/components/ui/skeleton";

function WorkerDashboardSkeletonContent() {
  return (
    <>
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
      </div>

      {/* Availability Status card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-12" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
      </div>

      {/* Recent Bookings section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm mt-10">
        <Skeleton className="h-6 w-36 mb-6" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <div className="flex flex-wrap gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Full dashboard skeleton with container - use as Suspense fallback in layout */
export function WorkerDashboardSkeleton() {
  return (
    <div className="mainContainer min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">
      <WorkerDashboardSkeletonContent />
    </div>
  );
}
