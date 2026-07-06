import AppBar from '@/components/ui/AppBar'
import BottomNav from '@/components/ui/BottomNav'
import Skeleton from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Storico spese" />

      <main className="flex-1 overflow-y-auto">
        <section className="bg-bg-surface border-y border-border">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="px-4 py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-3 w-52 mt-2" />
                </div>
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
