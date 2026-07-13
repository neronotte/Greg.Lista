"use client";

import { useState, useTransition } from "react";
import FAB from "@/components/ui/FAB";
import BottomSheet from "@/components/ui/BottomSheet";
import ItemForm from "@/components/lists/ItemForm";
import SortableItemList from "@/components/lists/SortableItemList";
import { deleteItem } from "@/lib/actions/items";
import type { ListItem, Category } from "@/lib/types";
import { Plus } from "lucide-react";

interface ListDetailActionsProps {
  listId: string;
  categories: Category[];
  items: ListItem[];
  fab?: boolean;
  fabClassName?: string;
  sectionOnly?: boolean;
  inlineButton?: boolean;
}

export default function ListDetailActions({
  listId,
  categories,
  items,
  fab,
  fabClassName,
  sectionOnly,
  inlineButton,
}: ListDetailActionsProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editItem, setEditItem] = useState<ListItem | null>(null);
  const [, startTransition] = useTransition();

  return (
    <>
      {sectionOnly && (
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
      )}

      {fab && !sectionOnly && !inlineButton && (
        <FAB
          onClick={() => {
            setEditItem(null);
            setSheetOpen(true);
          }}
          ariaLabel="Add item"
          className={fabClassName ?? "bottom-20"}
        />
      )}

      {inlineButton && (
        <button
          onClick={() => {
            setEditItem(null);
            setSheetOpen(true);
          }}
          className="flex-1 py-3.5 border-2 border-brand-mid text-brand-mid rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          <Plus size={17} strokeWidth={3} /> Add Item
        </button>
      )}

      <BottomSheet
        open={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditItem(null);
        }}
        title={editItem ? "Edit item" : "Add Item"}
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
    </>
  );
}
