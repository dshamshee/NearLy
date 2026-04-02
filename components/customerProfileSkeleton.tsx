import { Skeleton } from "@/components/ui/skeleton";

/** Customer profile page skeleton - use in loading.tsx */
export function CustomerProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background mt-14">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Skeleton className="h-9 w-40 mb-6 rounded-lg" />

        {/* Header card */}
        <div className="rounded-2xl border border-border/50 bg-card shadow-xl mb-8 overflow-hidden">
          <div className="px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="size-28 shrink-0 rounded-full" />
              <div className="flex-1 text-center sm:text-left space-y-3">
                <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
                <Skeleton className="h-6 w-20 rounded-full mx-auto sm:mx-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border/50 mb-6">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>

        {/* Stats cards (when own profile with bookings) */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Details list */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden divide-y divide-border/50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <Skeleton className="size-5 shrink-0 rounded" />
              <Skeleton className="h-4 w-24 shrink-0" />
              <Skeleton className="h-4 flex-1 max-w-[200px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
