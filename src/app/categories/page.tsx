import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getServerTranslations } from "@/lib/i18n/server";
import { getNavCounts } from "@/lib/nav-counts";
import BottomNav from "@/components/ui/BottomNav";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CategoriesClient from "./CategoriesClient";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: userCats }, { data: globalCats }, navCounts, { t }] =
    await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .eq("owner_id", user.id)
        .order("sort_order"),
      supabase
        .from("categories")
        .select("*")
        .is("owner_id", null)
        .order("sort_order"),
      getNavCounts(),
      getServerTranslations(),
    ]);

  // If user has custom categories, use those; otherwise show initialization prompt
  const categories: Category[] = userCats ?? [];
  const hasCustomized = categories.length > 0;
  const defaultCategories: Category[] = globalCats ?? [];

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-4 flex items-center gap-3">
        <Link
          href="/profile"
          aria-label="Back"
          className="p-2 -ml-2 text-text-secondary rounded-xl active:bg-bg-header transition-colors"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] font-black text-text-primary leading-tight">
            {t("categories.title")}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {t("categories.subtitle")}
          </p>
        </div>
      </div>

      <CategoriesClient
        categories={categories}
        defaultCategories={defaultCategories}
        hasCustomized={hasCustomized}
      />

      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}
