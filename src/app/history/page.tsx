import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import BottomNav from "@/components/ui/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: sessions }, navCounts] = await Promise.all([
    supabase
      .from("shopping_sessions")
      .select(
        `
        *,
        list:lists(name),
        entries:session_entries(count),
        checked:session_entries(count)
      `,
      )
      .order("started_at", { ascending: false }),
    getNavCounts(),
  ]);

  const sessionList = sessions ?? [];
  const active = sessionList.filter((s) => !s.completed_at);
  const completed = sessionList.filter((s) => !!s.completed_at);

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-4">
        <h1 className="text-[26px] font-black text-text-primary leading-tight">Sessions</h1>
        <p className="text-sm font-medium text-text-secondary">Your shopping history</p>
      </div>

      <main className="page-body">
        {sessionList.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={48} />}
            title="No sessions yet"
            subtitle="Start a shopping session from a list"
          />
        ) : (
          <div className="page-stack">
            {active.length > 0 && (
              <section>
                <div className="section-caption">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  Active & Paused
                </div>
                <div className="space-y-3">
                  {active.map((s) => (
                    <SessionCard key={s.id} session={s} />
                  ))}
                </div>
              </section>
            )}
            {completed.length > 0 && (
              <section>
                <div className="section-caption">Completed</div>
                <div className="space-y-3">
                  {completed.map((s) => (
                    <SessionCard key={s.id} session={s} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}

function SessionCard({ session }: { session: { id: string; supermarket?: string | null; started_at: string; completed_at?: string | null; list?: { name: string } | null } }) {
  const isCompleted = !!session.completed_at;
  const date = new Date(session.started_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/session/${session.id}`}
      className="block bg-bg-surface rounded-2xl p-4 border border-border shadow-[0_10px_30px_rgba(44,36,32,0.06)] active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-0.5">🛒</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[15px] text-text-primary">
              {session.supermarket || session.list?.name || "Shopping"}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                isCompleted
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isCompleted ? "Completed" : "Active"}
            </span>
          </div>
          {session.supermarket && (
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              {session.list?.name}
            </p>
          )}
          <p className="text-xs text-text-secondary mt-1">{date}</p>
        </div>
      </div>
    </Link>
  );
}

