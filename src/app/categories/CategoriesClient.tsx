"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import {
  initUserCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "@/lib/actions/categories";
import BottomSheet from "@/components/ui/BottomSheet";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import FAB from "@/components/ui/FAB";
import EmptyState from "@/components/ui/EmptyState";
import CategoryForm from "./CategoryForm";
import type { Category } from "@/lib/types";
import {
  GripVertical,
  Pencil,
  Plus,
  Sparkles,
  Tags,
  Trash2,
} from "lucide-react";

interface CategoriesClientProps {
  categories: Category[];
  defaultCategories: Category[];
  hasCustomized: boolean;
}

export default function CategoriesClient({
  categories,
  defaultCategories,
  hasCustomized,
}: CategoriesClientProps) {
  const router = useRouter();
  const t = useT();
  const [pending, startTransition] = useTransition();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  // Drag state
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [localCategories, setLocalCategories] = useState(categories);

  // Keep local state in sync
  if (categories !== localCategories && draggedId === null) {
    setLocalCategories(categories);
  }

  async function handleInit() {
    startTransition(async () => {
      try {
        await initUserCategories();
        router.refresh();
      } catch (err) {
        console.error("Failed to init categories:", err);
        alert("Failed to initialize categories. Check console for details.");
      }
    });
  }

  async function handleAdd(data: { name: string; emoji: string }) {
    startTransition(async () => {
      await addCategory(data);
      setShowAddSheet(false);
      router.refresh();
    });
  }

  async function handleUpdate(data: { name: string; emoji: string }) {
    if (!editingCategory) return;
    startTransition(async () => {
      await updateCategory(editingCategory.id, data);
      setEditingCategory(null);
      router.refresh();
    });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      router.refresh();
    });
  }

  function handleDragStart(e: React.DragEvent, id: number) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, targetId: number) {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) return;

    const newOrder = [...localCategories];
    const draggedIndex = newOrder.findIndex((c) => c.id === draggedId);
    const targetIndex = newOrder.findIndex((c) => c.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);
    setLocalCategories(newOrder);
  }

  function handleDragEnd() {
    if (draggedId === null) return;

    const orderedIds = localCategories.map((c) => c.id);
    startTransition(async () => {
      await reorderCategories(orderedIds);
      router.refresh();
    });
    setDraggedId(null);
  }

  // Show initialization prompt if not customized
  if (!hasCustomized) {
    return (
      <main className="page-body">
        <div className="page-stack">
          <div className="bg-bg-surface rounded-2xl border border-border p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-faint mb-4">
              <Sparkles size={28} className="text-brand-mid" />
            </div>
            <h2 className="font-bold text-lg text-text-primary mb-2">
              {t("categories.initializeButton")}
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              {t("categories.initializeHint")}
            </p>

            <button
              onClick={handleInit}
              disabled={pending}
              className="w-full py-3.5 bg-brand-mid text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {pending ? t("loading") : t("categories.initializeButton")}
            </button>
          </div>

          {/* Preview of default categories */}
          <section>
            <p className="section-caption mb-3">{t("categories.subtitle")}</p>
            <div className="bg-bg-surface rounded-2xl border border-border overflow-hidden">
              {defaultCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-semibold text-sm text-text-primary flex-1">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Show category list with management
  return (
    <>
      <main className="page-body">
        {localCategories.length === 0 ? (
          <EmptyState
            icon={<Tags size={48} />}
            title={t("categories.noCategories")}
            subtitle={t("categories.noCategoriesHint")}
          />
        ) : (
          <div className="page-stack">
            <p className="text-xs text-text-secondary px-1 flex items-center gap-1.5">
              <GripVertical size={14} />
              {t("categories.reorderHint")}
            </p>
            <div className="bg-bg-surface rounded-2xl border border-border overflow-hidden">
              {localCategories.map((cat, i) => (
                <div
                  key={cat.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, cat.id)}
                  onDragOver={(e) => handleDragOver(e, cat.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 px-4 py-3 cursor-grab active:cursor-grabbing ${
                    i > 0 ? "border-t border-border" : ""
                  } ${draggedId === cat.id ? "opacity-50 bg-bg-header" : ""}`}
                >
                  <GripVertical
                    size={18}
                    className="text-text-secondary shrink-0"
                  />
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-semibold text-sm text-text-primary flex-1 truncate">
                    {cat.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(cat)}
                    className="p-2 text-text-secondary hover:text-brand-mid transition-colors"
                    aria-label={t("edit")}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(cat)}
                    className="p-2 text-text-secondary hover:text-error transition-colors"
                    aria-label={t("delete")}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <FAB onClick={() => setShowAddSheet(true)} />

      {/* Add category sheet */}
      <BottomSheet
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        title={t("categories.addCategory")}
      >
        <CategoryForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddSheet(false)}
          pending={pending}
        />
      </BottomSheet>

      {/* Edit category sheet */}
      <BottomSheet
        open={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        title={t("categories.editCategory")}
      >
        {editingCategory && (
          <CategoryForm
            initial={editingCategory}
            onSubmit={handleUpdate}
            onCancel={() => setEditingCategory(null)}
            pending={pending}
          />
        )}
      </BottomSheet>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title={t("delete")}
        message={t("categories.deleteConfirm")}
        confirmLabel={t("delete")}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        destructive
      />
    </>
  );
}
