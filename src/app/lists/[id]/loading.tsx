import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import Skeleton from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Caricamento lista" backHref="/" />

      <main className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-4 pb-2">
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>

        <section className="bg-bg-surface border-y border-border">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="px-4 py-3 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-3 w-28 mt-2" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="sticky bottom-16 px-4 pb-2 pt-2 bg-bg-app">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      <div
        className="fixed bottom-36 right-4 z-20 h-14 w-14 rounded-full bg-bg-header animate-pulse motion-reduce:animate-none"
        aria-hidden="true"
      />
      <BottomNav />
    </div>
  );
}
