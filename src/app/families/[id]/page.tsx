import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import Avatar from "@/components/ui/Avatar";
import FamilyDetailActions from "./FamilyDetailActions";

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
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title={family.name} backHref="/families" />

      <main className="flex-1 overflow-y-auto">
        <section>
          <p className="px-4 py-2 text-xs uppercase text-text-secondary tracking-[0.08em]">
            Membri ({(members ?? []).length})
          </p>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(members ?? []).map((m: any) => {
            const profile = (
              Array.isArray(m.profile) ? m.profile[0] : m.profile
            ) as {
              id: string;
              email: string;
              display_name: string | null;
              avatar_url: string | null;
            } | null;
            if (!profile) return null;
            const name = profile.display_name ?? profile.email.split("@")[0];
            return (
              <div
                key={m.user_id}
                className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border"
              >
                <Avatar
                  name={name}
                  email={profile.email}
                  avatarUrl={profile.avatar_url}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-base text-text-primary truncate">{name}</p>
                  <p className="text-sm text-text-secondary">{profile.email}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${m.role === "owner" ? "bg-brand-mid/20 text-brand-mid" : "bg-bg-header text-text-secondary"}`}
                >
                  {m.role === "owner" ? "Owner" : "Membro"}
                </span>
                {isOwner && m.user_id !== user.id && (
                  <FamilyDetailActions
                    familyId={id}
                    memberId={m.user_id}
                    action="remove"
                  />
                )}
              </div>
            );
          })}
        </section>
      </main>

      <FamilyDetailActions
        familyId={id}
        isOwner={isOwner}
        currentUserId={user.id}
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
