import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getNavCounts } from "@/lib/nav-counts";
import { getServerTranslations } from "@/lib/i18n/server";
import BottomNav from "@/components/ui/BottomNav";
import Avatar from "@/components/ui/Avatar";
import ProfileEditForm from "./ProfileEditForm";
import SignOutButton from "./SignOutButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { LocaleToggle } from "@/components/ui/LocaleToggle";
import Link from "next/link";
import { Bell, ChevronLeft, Crown, Users } from "lucide-react";

type FamilyMembershipRow = {
  role: string;
  families:
    | { id: string; name: string }[]
    | { id: string; name: string }
    | null;
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: families }, { data: invites }, navCounts, { t }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("family_members")
        .select("role, families(id, name)")
        .eq("user_id", user.id),
      supabase
        .from("family_invites")
        .select("*, family:families(name)")
        .eq("status", "pending"),
      getNavCounts(),
      getServerTranslations(),
    ]);

  const displayName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "User";
  const email = user.email ?? "";
  const profileFamilies = (families ?? []).flatMap((membership) => {
    const row = membership as FamilyMembershipRow;
    const family = Array.isArray(row.families) ? row.families[0] : row.families;
    return family ? [{ role: row.role, family }] : [];
  });

  return (
    <div className="app-shell">
      {/* Header */}
      <div className="shrink-0 px-5 pt-2 pb-4">
        <h1 className="text-[26px] font-black text-text-primary leading-tight">
          {t("profile.title")}
        </h1>
      </div>

      <main className="page-body">
        <div className="page-stack">
          {/* Profile card */}
          <div className="flex items-center gap-4 bg-bg-surface rounded-2xl p-4 border border-border">
            <Avatar
              name={displayName}
              email={email}
              avatarUrl={profile?.avatar_url}
              size={64}
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-black text-lg text-text-primary leading-tight">
                {displayName}
              </h2>
              <p className="text-sm text-text-secondary">{email}</p>
              {profileFamilies[0] && (
                <div className="flex items-center gap-1 mt-1 text-xs font-bold text-brand-mid">
                  <Crown size={11} /> Admin · {profileFamilies[0].family.name}
                </div>
              )}
            </div>
          </div>

          {/* Account section */}
          <section>
            <p className="section-caption">{t("profile.accountSection")}</p>
            <div className="bg-bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="px-4 py-3.5 border-b border-border">
                <ProfileEditForm currentName={displayName} />
              </div>
              {(invites ?? []).length > 0 && (
                <Link
                  href="/invites"
                  className="flex items-center justify-between px-4 py-3.5 active:bg-bg-header border-b border-border"
                >
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-text-secondary" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {t("invite.pendingInvites")}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {t("invite.toReview", { count: (invites ?? []).length })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-accent px-1 text-[11px] font-bold text-white">
                      {(invites ?? []).length}
                    </span>
                    <ChevronLeft
                      size={16}
                      className="rotate-180 text-text-secondary"
                    />
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* Families section */}
          {profileFamilies.length > 0 && (
            <section>
              <p className="section-caption">{t("profile.familiesSection")}</p>
              <div className="bg-bg-surface rounded-2xl border border-border overflow-hidden">
                {profileFamilies.map(({ role, family }, i) => (
                  <Link
                    key={family.id}
                    href={`/families/${family.id}`}
                    className={`flex items-center justify-between px-4 py-3.5 active:bg-bg-header ${i > 0 ? "border-t border-border" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={16} className="text-text-secondary" />
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {family.name}
                        </p>
                        {role === "owner" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-brand-mid">
                            <Crown size={9} /> {t("families.admin")}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronLeft
                      size={16}
                      className="rotate-180 text-text-secondary"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* App section */}
          <section>
            <p className="section-caption">{t("profile.settingsSection")}</p>
            <div className="bg-bg-surface rounded-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <span className="text-sm font-semibold text-text-primary">
                  {t("profile.themeLabel")}
                </span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <span className="text-sm font-semibold text-text-primary">
                  {t("profile.languageLabel")}
                </span>
                <LocaleToggle />
              </div>
              <Link
                href="/families"
                className="flex items-center justify-between px-4 py-3.5 active:bg-bg-header border-b border-border"
              >
                <span className="text-sm font-semibold text-text-primary">
                  {t("profile.manageFamilies")}
                </span>
                <ChevronLeft
                  size={16}
                  className="rotate-180 text-text-secondary"
                />
              </Link>
              <Link
                href="/invites"
                className="flex items-center justify-between px-4 py-3.5 active:bg-bg-header"
              >
                <span className="text-sm font-semibold text-text-primary">
                  {t("profile.invitations")}
                </span>
                <ChevronLeft
                  size={16}
                  className="rotate-180 text-text-secondary"
                />
              </Link>
            </div>
          </section>

          <SignOutButton />
        </div>
      </main>

      <BottomNav
        pendingInvites={navCounts.pendingInvites}
        activeSessions={navCounts.activeSessions}
        latestActiveSessionId={navCounts.latestActiveSessionId}
      />
    </div>
  );
}
