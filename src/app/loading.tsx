import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="List@" />

      <main className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-4 pb-2">
          <Skeleton className="h-3 w-28 rounded-full" />
        </div>

        <section className="bg-bg-surface border-y border-border">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="px-4 py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="fixed bottom-20 right-4 z-20 h-14 w-14 rounded-full bg-bg-header animate-pulse motion-reduce:animate-none" aria-hidden="true" />
      <BottomNav />
    </div>
  )
}
