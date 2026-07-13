import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import { getServerTranslations } from "@/lib/i18n/server";
import BottomNav from "@/components/ui/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import ListCard from "@/components/ui/ListCard";
import HomeActions from "./HomeActions";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import { Lock, ShoppingCart, Users } from "lucide-react";

type FamilyOptionRow = {
  families:
    | { id: string; name: string }[]
    | { id: string; name: string }
    | null;
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: lists }, { data: families }, navCounts, { t }] =
    await Promise.all([
      supabase
        .from("lists")
        .select(
          `
        *,
        family:families(id, name),
        item_count:list_items(count),
        items:list_items(category_id)
      `,
        )
        .order("updated_at", { ascending: false }),
      supabase
        .from("family_members")
        .select("families(id, name)")
        .eq("user_id", user.id),
      getNavCounts(),
      getServerTranslations(),
    ]);

  const myLists = (lists ?? []).filter(
    (l) => l.owner_id === user.id && l.visibility === "private",
  );
  const familyLists = (lists ?? []).filter((l) => l.visibility === "family");
  const firstName =
    user.user_metadata?.full_name?.split(" ")[0] ??
    user.email?.split("@")[0] ??
    "there";

  const fullName = user.user_metadata?.full_name ?? firstName;

  const familyOptions = (families ?? [])
    .map((membership) => {
      const row = membership as FamilyOptionRow;
      return Array.isArray(row.families) ? row.families[0] : row.families;
    })
    .filter(Boolean) as { id: string; name: string }[];

  return (
    <div className="app-shell relative">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] font-black text-text-primary leading-tight">
              {t("home.title")}
            </h1>
            <p className="text-sm font-medium text-text-secondary">
              {t("home.greeting", { name: firstName })}
            </p>
          </div>
          <Link href="/profile" className="block">
            <Avatar
              name={fullName}
              email={user.email ?? `${firstName}@example.com`}
              avatarUrl={user.user_metadata?.avatar_url}
              size={40}
            />
          </Link>
        </div>
      </div>

      <main className="page-body">
        {myLists.length === 0 && familyLists.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={48} />}
            title={t("home.noLists")}
            subtitle={t("home.noListsHint")}
          />
        ) : (
          <div className="page-stack">
            {familyLists.length > 0 && (
              <section>
                <div className="section-caption">
                  <Users size={12} />
                  {t("home.familySection")}
                </div>
                <div className="space-y-3">
                  {familyLists.map((l) => (
                    <ListCard
                      key={l.id}
                      id={l.id}
                      name={l.name}
                      visibility="family"
                      itemCount={l.item_count?.[0]?.count ?? 0}
                      updatedAt={l.updated_at}
                      familyName={l.family?.name}
                      categoryCount={
                        new Set(
                          (l.items ?? [])
                            .map(
                              (item: { category_id: number | null }) =>
                                item.category_id,
                            )
                            .filter(Boolean),
                        ).size
                      }
                      icon={l.icon}
                    />
                  ))}
                </div>
              </section>
            )}
            {myLists.length > 0 && (
              <section>
                <div className="section-caption">
                  <Lock size={12} />
                  {t("home.personalSection")}
                </div>
                <div className="space-y-3">
                  {myLists.map((l) => (
                    <ListCard
                      key={l.id}
                      id={l.id}
                      name={l.name}
                      visibility="private"
                      itemCount={l.item_count?.[0]?.count ?? 0}
                      updatedAt={l.updated_at}
                      categoryCount={
                        new Set(
                          (l.items ?? [])
                            .map(
                              (item: { category_id: number | null }) =>
                                item.category_id,
                            )
                            .filter(Boolean),
                        ).size
                      }
                      icon={l.icon}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <HomeActions families={familyOptions} />
      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}
