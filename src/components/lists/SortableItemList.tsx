"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MoreVertical } from "lucide-react";
import { reorderItems } from "@/lib/actions/items";
import type { ListItem } from "@/lib/types";

interface SortableItemListProps {
  listId: string;
  items: ListItem[];
  onEdit: (item: ListItem) => void;
  onDelete: (item: ListItem) => void;
}

export default function SortableItemList({
  listId,
  items: initialItems,
  onEdit,
  onDelete,
}: SortableItemListProps) {
  const [items, setItems] = useState(initialItems);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    setItems(newOrder);
    startTransition(() =>
      reorderItems(
        listId,
        newOrder.map((i) => i.id),
      ),
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <SortableRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  item,
  onEdit,
  onDelete,
}: {
  item: ListItem;
  onEdit: (i: ListItem) => void;
  onDelete: (i: ListItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });
  const [menuOpen, setMenuOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 bg-bg-surface rounded-xl px-3 py-2.5 border border-border"
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab shrink-0 touch-none text-text-disabled active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={18} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary leading-tight">{item.name}</p>
        {item.notes && (
          <p className="text-xs text-text-secondary mt-0.5">{item.notes}</p>
        )}
      </div>

      {(item.quantity || item.unit) && (
        <span className="text-xs font-bold text-text-secondary whitespace-nowrap">
          {[item.quantity, item.unit].filter(Boolean).join(" ")}
        </span>
      )}

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Item options"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary active:text-text-primary"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-9 z-20 min-w-[140px] overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-xl"
          >
            <button
              className="w-full px-4 py-3 text-left text-sm font-semibold text-text-primary hover:bg-bg-header"
              onClick={() => {
                onEdit(item);
                setMenuOpen(false);
              }}
            >
              Edit
            </button>
            <button
              className="w-full px-4 py-3 text-left text-sm font-semibold text-error hover:bg-bg-header"
              onClick={() => {
                onDelete(item);
                setMenuOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
