import { Skeleton } from "@/components/ui/skeleton";

/** Worker profile page skeleton - use in loading.tsx */
export function WorkerProfileSkeleton() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Skeleton className="h-9 w-40 rounded-lg" />

        {/* Split layout: sidebar + content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-12">
          {/* Left: Identity block */}
          <aside className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <Skeleton className="size-24 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
                <Skeleton className="h-4 w-48 mt-2" />
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-9 w-full lg:w-28 mt-4 rounded-lg" />
              </div>
            </div>
          </aside>

          {/* Right: Data table */}
          <main className="flex-1 min-w-0">
            <div className="border border-border rounded-lg divide-y divide-border overflow-hidden bg-card">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <Skeleton className="size-4 shrink-0 rounded" />
                  <Skeleton className="h-4 w-28 shrink-0" />
                  <Skeleton className="h-4 flex-1 max-w-[200px]" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
