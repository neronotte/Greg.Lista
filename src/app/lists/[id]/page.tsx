import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import { getServerTranslations } from "@/lib/i18n/server";
import CategoryHeader from "@/components/ui/CategoryHeader";
import EmptyState from "@/components/ui/EmptyState";
import ListDetailActions from "./ListDetailActions";
import DeleteListButton from "./DeleteListButton";
import {
  ChevronLeft,
  Lock,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ListItem, Category } from "@/lib/types";

interface GroupedItems {
  category: Category;
  items: ListItem[];
}

export default async function ListDetailPage({
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

  const [
    { data: list },
    { data: rawItems },
    { data: categories },
    navCounts,
    { t },
  ] = await Promise.all([
    supabase
      .from("lists")
      .select("*, family:families(name)")
      .eq("id", id)
      .single(),
    supabase
      .from("list_items")
      .select("*, category:categories(id, name, emoji, sort_order)")
      .eq("list_id", id)
      .order("sort_order"),
    supabase.from("categories").select("*").order("sort_order"),
    getNavCounts(),
    getServerTranslations(),
  ]);

  if (!list) notFound();

  const items: ListItem[] = rawItems ?? [];
  const cats: Category[] = categories ?? [];

  // Group items by category
  const grouped: GroupedItems[] = [];
  const uncategorized: ListItem[] = [];
  const catMap = new Map<number, GroupedItems>();

  for (const item of items) {
    if (!item.category) {
      uncategorized.push(item);
      continue;
    }
    if (!catMap.has(item.category.id)) {
      const g = { category: item.category as Category, items: [] };
      catMap.set(item.category.id, g);
      grouped.push(g);
    }
    catMap.get(item.category.id)!.items.push(item);
  }
  grouped.sort((a, b) => a.category.sort_order - b.category.sort_order);

  return (
    <div className="app-shell relative">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-3 flex items-center gap-3 border-b border-border">
        <Link
          href="/"
          aria-label="Back"
          className="p-2 -ml-2 text-text-secondary rounded-xl active:bg-bg-header transition-colors"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-text-primary text-lg leading-tight truncate">
            {list.name}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                list.visibility === "family"
                  ? "bg-brand-mid/10 text-brand-mid"
                  : "bg-bg-header text-text-secondary"
              }`}
            >
              {list.visibility === "family" ? (
                <>
                  <Users size={9} /> {t("visibility.family")}
                </>
              ) : (
                <>
                  <Lock size={9} /> {t("visibility.personal")}
                </>
              )}
            </span>
            <span className="text-xs text-text-secondary">
              {items.length}{" "}
              {items.length === 1 ? t("home.item") : t("home.items")}
            </span>
          </div>
        </div>
        <DeleteListButton listId={id} />
      </div>

      <main className="page-body">
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag size={48} />}
            title={t("listDetail.emptyTitle")}
            subtitle={t("listDetail.emptyHint")}
          />
        ) : (
          <div className="page-stack">
            {grouped.map((g) => (
              <section key={g.category.id}>
                <CategoryHeader name={g.category.name} emoji={g.category.emoji} count={g.items.length} />
                <ListDetailActions
                  key={`${id}:${g.category.id}:${g.items.map((item) => item.id).join(",")}`}
                  listId={id}
                  categories={cats}
                  items={g.items}
                  sectionOnly
                />
              </section>
            ))}
            {uncategorized.length > 0 && (
              <section>
                <CategoryHeader
                  name={t("listDetail.miscCategory")}
                  count={uncategorized.length}
                />
                <ListDetailActions
                  key={`${id}:misc:${uncategorized.map((item) => item.id).join(",")}`}
                  listId={id}
                  categories={cats}
                  items={uncategorized}
                  sectionOnly
                />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Bottom actions */}
      <div className="shrink-0 px-5 pb-5 pt-3 border-t border-border flex gap-3">
        <ListDetailActions
          listId={id}
          categories={cats}
          items={items}
          inlineButton
        />
        <form action="/session/new" method="GET" className="flex-1">
          <input type="hidden" name="listId" value={id} />
          <button
            type="submit"
            className="w-full py-3.5 bg-brand-mid text-white rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.35)" }}
          >
            <ShoppingCart size={17} /> {t("listDetail.startShopping")}
          </button>
        </form>
      </div>
    </div>
  );
}
