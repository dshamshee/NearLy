import { Skeleton } from "@/components/ui/skeleton";

/** Full customer dashboard skeleton - use in loading.tsx */
export function CustomerDashboardSkeleton() {
  return (
    <div className="mainContainer min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero section */}
      <div className="hero w-full flex md:flex-row flex-col items-center justify-between gap-10 md:px-16 py-5">
        <div className="text text-center w-full max-w-xl">
          <Skeleton className="h-11 w-full max-w-md mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-sm mx-auto mb-6" />
          {/* Search form area */}
          <div className="search mt-4 space-y-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="hidden md:block w-[300px] h-[300px]">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </div>

      {/* Nearby Professionals section */}
      <section className="py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border/50 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-row gap-4">
                  <Skeleton className="size-16 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2 min-w-0">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex flex-wrap gap-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-14" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-9 w-full mt-4 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Professionals section */}
      <section className="py-12 md:py-20 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-card border border-border/50 rounded-xl p-6 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="size-14 shrink-0 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:ml-auto">
                    <div className="flex gap-3">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-9 w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
