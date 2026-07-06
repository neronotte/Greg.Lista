import { createClient } from "@/lib/supabase/server";

export async function getNavCounts() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      pendingInvites: 0,
      activeSessions: 0,
      latestActiveSessionId: null,
    };
  }
  const normalizedEmail = user.email?.trim().toLowerCase() ?? "";

  const [invitesRes, sessionsRes, latestSessionRes] = await Promise.all([
    supabase
      .from("family_invites")
      .select("*", { count: "exact", head: true })
      .eq("invited_email", normalizedEmail)
      .eq("status", "pending"),
    supabase
      .from("shopping_sessions")
      .select("*", { count: "exact", head: true })
      .eq("created_by", user.id)
      .is("completed_at", null),
    supabase
      .from("shopping_sessions")
      .select("id")
      .eq("created_by", user.id)
      .is("completed_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    pendingInvites: invitesRes.count ?? 0,
    activeSessions: sessionsRes.count ?? 0,
    latestActiveSessionId: latestSessionRes.data?.id ?? null,
  };
}
