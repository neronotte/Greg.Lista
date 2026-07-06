import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import AppBar from "@/components/ui/AppBar";
import BottomNav from "@/components/ui/BottomNav";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { Bell, ChevronRight, Users } from "lucide-react";

export default async function InvitesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const normalizedEmail = user.email?.trim().toLowerCase() ?? "";

  const [{ data: invites }, navCounts] = await Promise.all([
    supabase
      .from("family_invites")
      .select("id, token, created_at, family:families(name)")
      .eq("invited_email", normalizedEmail)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    getNavCounts(),
  ]);

  const pendingInvites = invites ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-bg-app">
      <AppBar title="Inviti in attesa" backHref="/profile" />

      <main className="flex-1 overflow-y-auto">
        {pendingInvites.length === 0 ? (
          <EmptyState
            icon={<Bell size={64} />}
            title="Nessun invito"
            subtitle="Quando qualcuno ti invita in una famiglia, lo troverai qui"
          />
        ) : (
          <section>
            <p className="px-4 py-2 text-xs uppercase text-text-secondary tracking-[0.08em]">
              {pendingInvites.length}{" "}
              {pendingInvites.length === 1 ? "invito" : "inviti"}
            </p>
            {pendingInvites.map((invite) => (
              <Link
                key={invite.id}
                href={`/invite/${invite.token}`}
                className="flex items-center gap-3 bg-bg-surface px-4 py-3 border-b border-border"
              >
                <Users size={20} className="text-text-secondary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-base text-text-primary truncate">
                    {invite.family?.name ?? "Famiglia"}
                  </p>
                  <p className="text-sm text-text-secondary">
                    In attesa dal{" "}
                    {new Date(invite.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-text-disabled shrink-0"
                />
              </Link>
            ))}
          </section>
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
