"use client";

import { useState, useTransition } from "react";
import FAB from "@/components/ui/FAB";
import BottomSheet from "@/components/ui/BottomSheet";
import ItemForm from "@/components/lists/ItemForm";
import SortableItemList from "@/components/lists/SortableItemList";
import { deleteItem } from "@/lib/actions/items";
import { startSession } from "@/lib/actions/sessions";
import type { ListItem, Category } from "@/lib/types";

interface ListDetailActionsProps {
  listId: string;
  categories: Category[];
  items: ListItem[];
  fab?: boolean;
  fabClassName?: string;
  sectionOnly?: boolean;
}

export default function ListDetailActions({
  listId,
  categories,
  items,
  fab,
  fabClassName,
  sectionOnly,
}: ListDetailActionsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editItem, setEditItem] = useState<ListItem | null>(null);
  const [sessionSheetOpen, setSessionSheetOpen] = useState(false);
  const [supermarket, setSupermarket] = useState("");
  const [, startTransition] = useTransition();

  if (sectionOnly) {
    return (
      <SortableItemList
        listId={listId}
        items={items}
        onEdit={(item) => {
          setEditItem(item);
          setSheetOpen(true);
        }}
        onDelete={(item) => {
          startTransition(() => deleteItem(item.id, listId));
        }}
      />
    );
  }

  return (
    <>
      {fab && (
        <FAB
          onClick={() => {
            setEditItem(null);
            setSheetOpen(true);
          }}
          ariaLabel="Aggiungi articolo"
          className={fabClassName}
        />
      )}

      <BottomSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditItem(null);
        }}
        title={editItem ? "Modifica articolo" : "Nuovo articolo"}
      >
        <ItemForm
          listId={listId}
          categories={categories}
          initial={
            editItem
              ? {
                  id: editItem.id,
                  name: editItem.name,
                  quantity: editItem.quantity,
                  unit: editItem.unit,
                  notes: editItem.notes,
                  categoryName: editItem.category?.name,
                }
              : undefined
          }
          onDone={() => {
            setSheetOpen(false);
            setEditItem(null);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={sessionSheetOpen}
        onClose={() => setSessionSheetOpen(false)}
        title="Avvia spesa"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(() =>
              startSession(listId, supermarket || undefined),
            );
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs text-text-secondary mb-1">
              Supermercato (opzionale)
            </label>
            <input
              type="text"
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              placeholder="es. Carrefour, Esselunga…"
              className="w-full border-b border-border focus:border-brand-mid outline-none py-2 text-base text-text-primary bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-brand-bright text-white font-semibold text-base mt-2"
          >
            Inizia
          </button>
        </form>
      </BottomSheet>
    </>
  );
}
