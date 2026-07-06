'use client'

import { useEffect, useState, useTransition } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical } from 'lucide-react'
import { reorderItems } from '@/lib/actions/items'
import type { ListItem } from '@/lib/types'

interface SortableItemListProps {
  listId: string
  items: ListItem[]
  onEdit: (item: ListItem) => void
  onDelete: (item: ListItem) => void
}

export default function SortableItemList({ listId, items: initialItems, onEdit, onDelete }: SortableItemListProps) {
  const [items, setItems] = useState(initialItems)
  const [mounted, setMounted] = useState(false)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  useEffect(() => {
    setMounted(true)
  }, [])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex(i => i.id === active.id)
    const newIndex = items.findIndex(i => i.id === over.id)
    const newOrder = arrayMove(items, oldIndex, newIndex)
    setItems(newOrder)
    startTransition(() => reorderItems(listId, newOrder.map(i => i.id)))
  }

  if (!mounted) {
    return (
      <>
        {items.map(item => (
          <PlainRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map(item => (
          <SortableRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </SortableContext>
    </DndContext>
  )
}

function PlainRow({ item, onEdit, onDelete }: { item: ListItem; onEdit: (i: ListItem) => void; onDelete: (i: ListItem) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 bg-bg-surface px-4 min-h-[60px] border-b border-border">
      <span className="text-text-disabled shrink-0" aria-hidden="true">
        <GripVertical size={20} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-base text-text-primary truncate">{item.name}</p>
        {(item.quantity || item.unit) && (
          <p className="text-sm text-text-secondary">
            {[item.quantity, item.unit].filter(Boolean).join(' ')}
          </p>
        )}
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Opzioni articolo"
          className="w-8 h-8 flex items-center justify-center text-text-secondary"
        >
          <MoreVertical size={20} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-8 z-20 bg-bg-surface rounded-lg border border-border min-w-[140px]"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          >
            <button
              className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-header"
              onClick={() => { onEdit(item); setMenuOpen(false) }}
            >
              Modifica
            </button>
            <button
              className="w-full text-left px-4 py-3 text-sm text-error hover:bg-bg-header"
              onClick={() => { onDelete(item); setMenuOpen(false) }}
            >
              Elimina
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SortableRow({ item, onEdit, onDelete }: { item: ListItem; onEdit: (i: ListItem) => void; onDelete: (i: ListItem) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })
  const [menuOpen, setMenuOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-bg-surface px-4 min-h-[60px] border-b border-border"
    >
      <span
        {...attributes}
        {...listeners}
        className="text-text-disabled cursor-grab active:cursor-grabbing touch-none shrink-0"
        aria-label="Trascina per riordinare"
      >
        <GripVertical size={20} />
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-base text-text-primary truncate">{item.name}</p>
        {(item.quantity || item.unit) && (
          <p className="text-sm text-text-secondary">
            {[item.quantity, item.unit].filter(Boolean).join(' ')}
          </p>
        )}
      </div>

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Opzioni articolo"
          className="w-8 h-8 flex items-center justify-center text-text-secondary"
        >
          <MoreVertical size={20} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-8 z-20 bg-bg-surface rounded-lg border border-border min-w-[140px]"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          >
            <button
              className="w-full text-left px-4 py-3 text-sm text-text-primary hover:bg-bg-header"
              onClick={() => { onEdit(item); setMenuOpen(false) }}
            >
              Modifica
            </button>
            <button
              className="w-full text-left px-4 py-3 text-sm text-error hover:bg-bg-header"
              onClick={() => { onDelete(item); setMenuOpen(false) }}
            >
              Elimina
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
