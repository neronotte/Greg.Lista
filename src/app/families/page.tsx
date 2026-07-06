import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import FamiliesActions from "./FamiliesActions";
import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((m: any) => ({
      role: m.role as string,
      family: (Array.isArray(m.families) ? m.families[0] : m.families) as {
        id: string;
        name: string;
      } | null,
    }))
    .filter((m) => m.family);

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Le mie famiglie" backHref="/profile" />

      <main className="flex-1 overflow-y-auto">
        {families.length === 0 ? (
          <EmptyState
            icon={<Users size={64} />}
            title="Nessuna famiglia"
            subtitle="Crea una famiglia per condividere le liste"
          />
        ) : (
          <ul>
            {families.map(
              ({ role, family }) =>
                family && (
                  <li key={family.id}>
                    <Link
                      href={`/families/${family.id}`}
                      className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border active:bg-bg-header"
                    >
                      <Users
                        size={20}
                        className="text-text-secondary shrink-0"
                      />
                      <div className="flex-1">
                        <p className="text-[17px] font-semibold text-text-primary">
                          {family.name}
                        </p>
                        <p className="text-sm text-text-secondary capitalize">
                          {role}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-text-disabled" />
                    </Link>
                  </li>
                ),
            )}
          </ul>
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
