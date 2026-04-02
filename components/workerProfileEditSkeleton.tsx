import { Skeleton } from "@/components/ui/skeleton";

/** Matches `WorkerProfileEdit` layout — use in `app/w/profile/edit/loading.tsx` */
export function WorkerProfileEditSkeleton() {
  return (
    <div className="mainContainer mt-14 min-h-screen bg-linear-to-br from-background via-background to-accent/20 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Skeleton className="h-5 w-44 mb-6" />
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="size-12 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-10 w-[min(100%,20rem)] max-w-md" />
              <Skeleton className="h-5 w-full max-w-lg" />
            </div>
          </div>
          <Skeleton className="h-px w-full mt-6 rounded-full" />
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <Skeleton className="size-9 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-11 w-full rounded-md" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-3 w-40" />
            </div>
          </section>

          {/* Professional Information */}
          <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <Skeleton className="size-9 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-56" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-11 w-full rounded-md" />
                </div>
              ))}
            </div>
          </section>

          {/* Verification */}
          <section className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <Skeleton className="size-9 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-36" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-11 w-full max-w-md rounded-md" />
              <Skeleton className="h-3 w-64" />
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-border/50">
            <Skeleton className="h-4 w-[min(100%,18rem)]" />
            <div className="flex gap-3 w-full sm:w-auto">
              <Skeleton className="h-10 flex-1 sm:w-24 rounded-md" />
              <Skeleton className="h-10 flex-1 sm:w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
