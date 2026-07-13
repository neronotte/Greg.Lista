import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import { getServerTranslations } from "@/lib/i18n/server";
import CheckableItem from "@/components/session/CheckableItem";
import CategoryHeader from "@/components/ui/CategoryHeader";
import EmptyState from "@/components/ui/EmptyState";
import { reopenSession } from "@/lib/actions/sessions";
import CompleteSessionButton from "./CompleteSessionButton";
import type { Category, ListItem, SessionEntry } from "@/lib/types";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

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

  const [{ data: session }, { data: entries }, { t, locale }] = await Promise.all([
    supabase
      .from("shopping_sessions")
      .select("*, list:lists(name, visibility, id)")
      .eq("id", id)
      .single(),
    supabase
      .from("session_entries")
      .select(
        "*, list_item:list_items(*, category:categories(id, name, sort_order))",
      )
      .eq("session_id", id)
      .order("list_item(sort_order)"),
    getServerTranslations(),
  ]);

  if (!session) notFound();

  const isCompleted = !!session.completed_at;
  const allEntries = (entries ?? []) as SessionEntryWithItem[];
  const groupedEntries = new Map<string, GroupedEntries>();

  for (const entry of allEntries) {
    const category = entry.list_item?.category;
    const key = category ? `category-${category.id}` : "category-misc";
    const label = category?.name ?? t("listDetail.miscCategory");
    const sortOrder = category?.sort_order ?? Number.MAX_SAFE_INTEGER;

    if (!groupedEntries.has(key)) {
      groupedEntries.set(key, { key, label, sortOrder, entries: [] });
    }

    groupedEntries.get(key)!.entries.push(entry);
  }

  const orderedGroups = Array.from(groupedEntries.values()).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  const checked = allEntries.filter((e) => e.checked).length;
  const total = allEntries.length;
  const pct = total > 0 ? checked / total : 0;

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-3 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Link
            href={session.list?.id ? `/lists/${session.list.id}` : "/"}
            aria-label="Back"
            className="p-2 -ml-2 text-text-secondary rounded-xl active:bg-bg-header transition-colors"
          >
            <ChevronLeft size={22} />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-text-primary text-base truncate">
                {session.supermarket || session.list?.name || "Shopping"}
              </span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isCompleted
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isCompleted ? t("session.completed") : t("session.active")}
              </span>
            </div>
            {session.supermarket && (
              <p className="text-xs text-text-secondary mt-0.5 font-medium">
                {session.list?.name}
              </p>
            )}
          </div>
          {!isCompleted && <CompleteSessionButton sessionId={id} />}
        </div>
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-bg-header rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-mid rounded-full transition-all duration-300"
              style={{ width: `${pct * 100}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-brand-mid whitespace-nowrap tabular-nums">
            {checked}/{total}
          </span>
        </div>
      </div>

      <main className="page-body">
        {allEntries.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={48} />}
            title={t("session.emptyTitle")}
            subtitle={t("session.emptyHint")}
          />
        ) : (
          <div className="page-stack">
            {orderedGroups.map((group) => {
              const groupChecked = group.entries.filter((e) => e.checked).length;
              return (
                <section
                  key={group.key}
                  className={groupChecked === group.entries.length && group.entries.length > 0 ? "opacity-50" : ""}
                >
                  <CategoryHeader
                    name={group.label}
                    count={group.entries.length}
                  />
                  <div className="space-y-2">
                    {group.entries.map((entry) => (
                      <CheckableItem key={entry.id} entry={entry} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {isCompleted && (
        <div className="shrink-0 px-5 pb-5 pt-3 border-t border-border">
          <div className="flex items-center justify-center gap-2 py-1 mb-3">
            <span className="font-extrabold text-brand-mid text-sm">
              {t("session.completedOn", {
                date: new Date(session.completed_at!).toLocaleDateString(
                  locale === "it" ? "it-IT" : "en-US",
                  { month: "short", day: "numeric" },
                ),
              })}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await reopenSession(id);
            }}
          >
            <button
              type="submit"
              className="w-full py-3.5 border-2 border-border text-text-primary rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              {t("session.reopenButton")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
