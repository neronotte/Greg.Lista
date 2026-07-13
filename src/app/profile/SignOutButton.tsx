"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";

export default function SignOutButton() {
  const router = useRouter();
  const t = useT();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={signOut}
      className="w-full py-4 border-2 border-error/30 text-error rounded-2xl font-extrabold text-sm active:bg-red-50 transition-colors"
    >
      {t("profile.signOut")}
    </button>
  );
}
