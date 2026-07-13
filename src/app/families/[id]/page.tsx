import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import Avatar from "@/components/ui/Avatar";
import FamilyDetailActions from "./FamilyDetailActions";

type FamilyMemberRow = {
  role: string;
  user_id: string;
  profile:
    | {
        id: string;
        email: string;
        display_name: string | null;
        avatar_url: string | null;
      }[]
    | {
        id: string;
        email: string;
        display_name: string | null;
        avatar_url: string | null;
      }
    | null;
};

export default async function FamilyDetailPage({
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

  const [{ data: family }, { data: members }, navCounts] = await Promise.all([
    supabase.from("families").select("*").eq("id", id).single(),
    supabase
      .from("family_members")
      .select(
        "role, user_id, joined_at, profile:profiles(id, email, display_name, avatar_url)",
      )
      .eq("family_id", id),
    getNavCounts(),
  ]);

  if (!family) notFound();

  const isOwner = family.created_by === user.id;

  return (
    <div className="app-shell">
      <AppBar
        title={family.name}
        subtitle={`${(members ?? []).length} ${((members ?? []).length === 1) ? "membro" : "membri"}`}
        backHref="/families"
      />

      <main className="page-body">
        <section>
          <div className="section-caption">Membri</div>
          <div className="space-y-3">
            {(members ?? []).map((member) => {
              const row = member as FamilyMemberRow;
              const profile = Array.isArray(row.profile) ? row.profile[0] : row.profile;
              if (!profile) return null;
              const name = profile.display_name ?? profile.email.split("@")[0];
              return (
                <div key={row.user_id} className="surface-card flex items-center gap-3 p-4">
                  <Avatar
                    name={name}
                    email={profile.email}
                    avatarUrl={profile.avatar_url}
                    size={40}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-base font-extrabold text-text-primary">{name}</p>
                    <p className="text-sm text-text-secondary">{profile.email}</p>
                  </div>
                  <span
                    className={`soft-badge ${row.role === "owner" ? "bg-brand-mid/10 text-brand-mid" : "bg-bg-header text-text-secondary"}`}
                  >
                    {row.role === "owner" ? "Owner" : "Membro"}
                  </span>
                  {isOwner && row.user_id !== user.id && (
                    <FamilyDetailActions
                      familyId={id}
                      memberId={row.user_id}
                      action="remove"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <FamilyDetailActions
        familyId={id}
        isOwner={isOwner}
        familyName={family.name}
        fab
      />
      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}
