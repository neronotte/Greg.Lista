"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Visibility } from "@/lib/types";

export async function createList(
  name: string,
  visibility: Visibility,
  familyId?: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { data, error } = await supabase
    .from("lists")
    .insert({
      name,
      visibility,
      owner_id: user.id,
      family_id: familyId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/");
  return data;
}

export async function updateList(
  id: string,
  name: string,
  visibility: Visibility,
  familyId?: string | null,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase
    .from("lists")
    .update({ name, visibility, family_id: familyId ?? null })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/lists/${id}`);
}

export async function deleteList(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase
    .from("lists")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/");
  redirect("/");
}

export async function copyList(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  // Load original list + items
  const { data: list, error: listErr } = await supabase
    .from("lists")
    .select("*, list_items(*)")
    .eq("id", id)
    .single();

  if (listErr || !list) throw new Error("Lista non trovata");

  // Create new list
  const { data: newList, error: newErr } = await supabase
    .from("lists")
    .insert({
      name: `${list.name} (copia)`,
      visibility: "private",
      owner_id: user.id,
      family_id: null,
    })
    .select()
    .single();

  if (newErr || !newList) throw new Error("Errore nella copia");

  // Copy items
  if (list.list_items?.length > 0) {
    const items = list.list_items.map(
      ({ id: _id, list_id: _lid, ...item }: Record<string, unknown>) => ({
        ...item,
        list_id: newList.id,
      }),
    );
    await supabase.from("list_items").insert(items);
  }

  revalidatePath("/");
  return newList;
}
