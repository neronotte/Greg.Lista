"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Category } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get user's custom categories OR global defaults
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .or(`owner_id.is.null,owner_id.eq.${user.id}`)
    .order("sort_order");

  if (error) throw error;

  // If user has custom categories, prefer those; otherwise use globals
  const userCats = data?.filter((c) => c.owner_id === user.id) ?? [];
  const globalCats = data?.filter((c) => c.owner_id === null) ?? [];

  return userCats.length > 0 ? userCats : globalCats;
}

export async function getUserCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("owner_id", user.id)
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function initUserCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Check if user already has custom categories
  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1);

  if (existingError) {
    console.error("Error checking existing categories:", existingError);
    throw new Error(
      `Database error: ${existingError.message}. Make sure the 'owner_id' column exists.`,
    );
  }

  if (existing && existing.length > 0) {
    return getUserCategories();
  }

  // Copy global categories to user
  const { data: globals, error: globalsError } = await supabase
    .from("categories")
    .select("*")
    .is("owner_id", null)
    .order("sort_order");

  if (globalsError) {
    console.error("Error fetching global categories:", globalsError);
    throw new Error(`Database error: ${globalsError.message}`);
  }

  if (!globals || globals.length === 0) return [];

  const userCats = globals.map((g) => ({
    name: g.name,
    emoji: g.emoji || "📦",
    sort_order: g.sort_order,
    owner_id: user.id,
  }));

  const { data: inserted, error } = await supabase
    .from("categories")
    .insert(userCats)
    .select();

  if (error) {
    console.error("Error inserting user categories:", error);
    throw new Error(`Database error: ${error.message}`);
  }

  revalidatePath("/categories");
  return inserted ?? [];
}

export async function addCategory(data: {
  name: string;
  emoji: string;
}): Promise<Category> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get max sort_order for user's categories
  const { data: maxRow } = await supabase
    .from("categories")
    .select("sort_order")
    .eq("owner_id", user.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxRow?.sort_order ?? 0) + 10;

  const { data: cat, error } = await supabase
    .from("categories")
    .insert({
      name: data.name.trim(),
      emoji: data.emoji,
      sort_order: nextOrder,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/categories");
  revalidatePath("/lists");
  return cat;
}

export async function updateCategory(
  id: number,
  data: { name?: string; emoji?: string },
): Promise<Category> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const updates: Record<string, unknown> = {};
  if (data.name !== undefined) updates.name = data.name.trim();
  if (data.emoji !== undefined) updates.emoji = data.emoji;

  const { data: cat, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/categories");
  revalidatePath("/lists");
  return cat;
}

export async function deleteCategory(id: number): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw error;

  revalidatePath("/categories");
  revalidatePath("/lists");
}

export async function reorderCategories(orderedIds: number[]): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Update each category with new sort_order
  const updates = orderedIds.map((id, index) =>
    supabase
      .from("categories")
      .update({ sort_order: (index + 1) * 10 })
      .eq("id", id)
      .eq("owner_id", user.id),
  );

  await Promise.all(updates);

  revalidatePath("/categories");
  revalidatePath("/lists");
}
