import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Profilo" />

      <main className="flex-1 overflow-y-auto">
        <div className="bg-bg-surface px-4 py-6 flex flex-col items-center gap-3 border-b border-border">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        <section className="mt-4 bg-bg-surface border-y border-border">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="px-4 py-3 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
