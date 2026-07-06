import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import SessionHeader from "@/components/session/SessionHeader";
import CheckableItem from "@/components/session/CheckableItem";
import CategoryHeader from "@/components/ui/CategoryHeader";
import { completeSession, reopenSession } from "@/lib/actions/sessions";
import CompleteSessionButton from "./CompleteSessionButton";
import type { Category, ListItem, SessionEntry } from "@/lib/types";

interface SessionEntryWithItem extends SessionEntry {
  list_item: ListItem & { category?: Category | null };
}

interface GroupedEntries {
  key: string;
  label: string;
  sortOrder: number;
  entries: SessionEntryWithItem[];
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: session }, { data: entries }, navCounts] = await Promise.all([
    supabase
      .from("shopping_sessions")
      .select("*, list:lists(name, visibility)")
      .eq("id", id)
      .single(),
    supabase
      .from("session_entries")
      .select(
        "*, list_item:list_items(*, category:categories(id, name, sort_order))",
      )
      .eq("session_id", id)
      .order("list_item(sort_order)"),
    getNavCounts(),
  ]);

  if (!session) notFound();

  const isCompleted = !!session.completed_at;
  const allEntries = (entries ?? []) as SessionEntryWithItem[];
  const groupedEntries = new Map<string, GroupedEntries>();

  for (const entry of allEntries) {
    const category = entry.list_item?.category;
    const key = category ? `category-${category.id}` : "category-misc";
    const label = category?.name ?? "Varie";
    const sortOrder = category?.sort_order ?? Number.MAX_SAFE_INTEGER;

    if (!groupedEntries.has(key)) {
      groupedEntries.set(key, { key, label, sortOrder, entries: [] });
    }

    groupedEntries.get(key)!.entries.push(entry);
  }

  const orderedGroups = Array.from(groupedEntries.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar
        title={session.supermarket || session.list?.name || "Spesa"}
        backHref={`/lists/${session.list_id}`}
        variant={isCompleted ? "default" : "shopping"}
        actions={
          !isCompleted ? <CompleteSessionButton sessionId={id} /> : undefined
        }
      />

      <SessionHeader
        supermarket={session.supermarket}
        startedAt={session.started_at}
        total={allEntries.length}
        checked={allEntries.filter((entry) => entry.checked).length}
      />

      <main
        className={`flex-1 overflow-y-auto ${isCompleted ? "pb-40" : "pb-24"}`}
      >
        {orderedGroups.map((group) => (
          <section key={group.key}>
            <CategoryHeader name={group.label} />
            {group.entries.map((entry) => (
              <CheckableItem key={entry.id} entry={entry} />
            ))}
          </section>
        ))}

        {allEntries.length === 0 && (
          <p className="text-center text-text-disabled py-8">Sessione vuota</p>
        )}
      </main>

      {isCompleted && (
        <div className="fixed bottom-16 left-0 right-0 z-20 px-4 pb-3 pt-4 bg-gradient-to-t from-bg-app via-bg-app/95 to-transparent">
          <form
            action={async () => {
              "use server";
              await reopenSession(id);
            }}
          >
            <button
              type="submit"
              className="w-full py-3 rounded-lg border border-brand-mid text-brand-mid font-semibold text-base bg-bg-surface"
            >
              Riapri sessione
            </button>
          </form>
        </div>
      )}

      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}
