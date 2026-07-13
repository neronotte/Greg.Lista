"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addItem, updateItem } from "@/lib/actions/items";
import { useT } from "@/lib/i18n";
import type { Category } from "@/lib/types";

interface ItemFormProps {
  listId: string;
  categories: Category[];
  initial?: {
    id: string;
    name: string;
    quantity?: string | null;
    unit?: string | null;
    notes?: string | null;
    categoryName?: string | null;
  };
  onDone: () => void;
}

export default function ItemForm({
  listId,
  categories,
  initial,
  onDone,
}: ItemFormProps) {
  const router = useRouter();
  const t = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? "");
  const [unit, setUnit] = useState(initial?.unit ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [categoryName, setCategoryName] = useState(
    initial?.categoryName ?? "auto",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("itemForm.nameRequired"));
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const data = {
          name: name.trim(),
          categoryName: categoryName === "auto" ? null : categoryName,
          quantity: quantity || null,
          unit: unit || null,
          notes: notes || null,
        };
        if (initial) {
          await updateItem(initial.id, listId, data);
        } else {
          await addItem(listId, data);
        }
        router.refresh();
        onDone();
      } catch (err) {
        setError(err instanceof Error ? err.message : t("error"));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          {t("itemForm.nameLabel")} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("itemForm.namePlaceholder")}
          autoFocus
          className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium placeholder:font-normal"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
            {t("itemForm.quantityLabel")}
          </label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={t("itemForm.quantityPlaceholder")}
            className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium"
          />
        </div>
        <div className="w-24">
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
            {t("itemForm.unitLabel")}
          </label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder={t("itemForm.unitPlaceholder")}
            className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          {t("itemForm.categoryLabel")}
        </label>
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:ring-2 focus:ring-brand-mid font-medium"
        >
          <option value="auto">{t("itemForm.selectCategory")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          {t("itemForm.notesLabel")}
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("itemForm.notesPlaceholder")}
          className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid placeholder:font-normal"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full mt-1 py-4 bg-brand-mid text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform"
        style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.32)" }}
      >
        {pending
          ? t("saving")
          : initial
            ? t("itemForm.saveButton")
            : t("itemForm.addButton")}
      </button>
    </form>
  );
}
