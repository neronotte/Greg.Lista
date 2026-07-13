import Skeleton from "@/components/ui/Skeleton";

export default function CategoriesLoading() {
  return (
    <div className="app-shell">
      <div className="shrink-0 px-5 pt-2 pb-4 flex items-center gap-3">
        <div className="w-10 h-10" />
        <div className="flex-1">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-48 mt-1" />
        </div>
      </div>

      <main className="page-body">
        <div className="page-stack">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-bg-surface rounded-2xl p-4 border border-border"
            >
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-6 w-6" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
