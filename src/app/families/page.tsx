import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import BottomNav from "@/components/ui/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import FamiliesActions from "./FamiliesActions";
import Link from "next/link";
import { Users, ChevronRight, Crown } from "lucide-react";

type MembershipRow = {
  role: string;
  families: { id: string; name: string }[] | { id: string; name: string } | null;
};

export default async function FamiliesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: memberships }, navCounts] = await Promise.all([
    supabase
      .from("family_members")
      .select("role, families(id, name)")
      .eq("user_id", user.id),
    getNavCounts(),
  ]);

  const families = (memberships ?? [])
    .map((membership) => {
      const row = membership as MembershipRow;
      return {
        role: row.role,
        family: Array.isArray(row.families) ? row.families[0] : row.families,
      };
    })
    .filter((m) => m.family);

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-4">
        <h1 className="text-[26px] font-black text-text-primary leading-tight">Family</h1>
        <p className="text-sm font-medium text-text-secondary">
          {families.length === 0
            ? "No families yet"
            : `${families.length} ${families.length === 1 ? "group" : "groups"}`}
        </p>
      </div>

      <main className="page-body">
        {families.length === 0 ? (
          <EmptyState
            icon={<Users size={48} />}
            title="No family yet"
            subtitle="Create a family to share lists with others"
          />
        ) : (
          <div className="space-y-3">
            {families.map(
              ({ role, family }) =>
                family && (
                  <Link
                    key={family.id}
                    href={`/families/${family.id}`}
                    className="block bg-bg-surface rounded-2xl p-4 border border-border shadow-[0_10px_30px_rgba(44,36,32,0.06)] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold text-white shrink-0"
                        style={{ backgroundColor: "#3D7A56" }}
                      >
                        {family.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-text-primary">{family.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {role === "owner" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-brand-mid/10 text-brand-mid">
                              <Crown size={9} /> Admin
                            </span>
                          ) : (
                            <span className="text-xs text-text-secondary font-medium capitalize">
                              {role}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-text-secondary shrink-0" />
                    </div>
                  </Link>
                ),
            )}
          </div>
        )}
      </main>

      <FamiliesActions />
      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}
