"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type Theme = "light" | "dark" | "system";

export async function updateThemePreference(theme: Theme) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Try to update, ignore errors if column doesn't exist yet
  const { error } = await supabase
    .from("profiles")
    .update({ theme })
    .eq("id", user.id);

  if (error && !error.message.includes("column")) {
    throw new Error(`Failed to update theme: ${error.message}`);
  }

  revalidatePath("/profile");
  revalidatePath("/");
}
