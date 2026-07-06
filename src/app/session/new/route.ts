import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const listId = request.nextUrl.searchParams.get("listId");
  if (!listId) return new Response("Missing listId", { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    return Response.redirect(loginUrl, 302);
  }

  const { data: session, error } = await supabase
    .from("shopping_sessions")
    .insert({
      list_id: listId,
      created_by: user.id,
      supermarket: null,
    })
    .select()
    .single();

  if (error || !session) {
    return new Response(
      error?.message ?? "Errore nella creazione della sessione",
      { status: 500 },
    );
  }

  const { data: items } = await supabase
    .from("list_items")
    .select("id")
    .eq("list_id", listId)
    .order("sort_order");

  if (items && items.length > 0) {
    const { error: entriesError } = await supabase
      .from("session_entries")
      .insert(
        items.map((item) => ({
          session_id: session.id,
          list_item_id: item.id,
          checked: false,
        })),
      );

    if (entriesError) {
      return new Response(entriesError.message, { status: 500 });
    }
  }

  revalidatePath(`/lists/${listId}`);

  const sessionUrl = request.nextUrl.clone();
  sessionUrl.pathname = `/session/${session.id}`;
  sessionUrl.search = "";
  return Response.redirect(sessionUrl, 302);
}
