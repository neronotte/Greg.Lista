import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="app-shell">
      <div className="shrink-0 px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 rounded-xl mb-2" />
            <Skeleton className="h-4 w-24 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <main className="page-body">
        <div className="page-stack">
          <div>
            <Skeleton className="h-3 w-20 rounded-full mb-3" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-bg-surface rounded-2xl p-4 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
