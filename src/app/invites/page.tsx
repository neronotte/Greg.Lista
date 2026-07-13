import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import { getServerTranslations } from "@/lib/i18n/server";
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

  const [{ data: invites }, navCounts, { t, locale }] = await Promise.all([
    supabase
      .from("family_invites")
      .select("id, token, created_at, family:families(name)")
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
    getNavCounts(),
    getServerTranslations(),
  ]);

  const pendingInvites = invites ?? [];

  return (
    <div className="app-shell">
      <AppBar title={t("invite.pendingInvites")} backHref="/profile" />

      <main className="page-body">
        {pendingInvites.length === 0 ? (
          <EmptyState
            icon={<Bell size={64} />}
            title={t("invite.noInvites")}
            subtitle={t("invite.noInvitesHint")}
          />
        ) : (
          <section>
            <p className="section-caption">
              {pendingInvites.length === 1
                ? t("invite.inviteCountSingle")
                : t("invite.inviteCount", { count: pendingInvites.length })}
            </p>
            <div className="space-y-3">
            {pendingInvites.map((invite) => {
              const family = (
                Array.isArray(invite.family) ? invite.family[0] : invite.family
              ) as { name: string } | null;

              return (
                <Link
                  key={invite.id}
                  href={`/invite/${invite.token}`}
                  className="surface-card flex items-center gap-3 p-4"
                >
                  <span className="surface-icon">
                    <Users size={18} className="shrink-0" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-base font-extrabold text-text-primary">
                      {family?.name ?? "Famiglia"}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {t("invite.pendingFrom")}{" "}
                      {new Date(invite.created_at).toLocaleDateString(locale === "it" ? "it-IT" : "en-US", {
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
              );
            })}
            </div>
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
