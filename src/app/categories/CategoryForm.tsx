"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import type { Category } from "@/lib/types";

// Common shopping-related emojis
const EMOJI_OPTIONS = [
  // Food & Produce
  "🥦",
  "🥕",
  "🍎",
  "🍊",
  "🍋",
  "🍌",
  "🍇",
  "🍓",
  "🫐",
  "🍑",
  "🥬",
  "🥒",
  // Bread & Bakery
  "🍞",
  "🥖",
  "🥐",
  "🧁",
  "🍰",
  "🍪",
  "🥯",
  // Meat & Fish
  "🥩",
  "🍗",
  "🥓",
  "🐟",
  "🦐",
  "🦞",
  // Dairy & Eggs
  "🥛",
  "🧀",
  "🥚",
  "🧈",
  "🍦",
  // Drinks
  "☕",
  "🍵",
  "🧃",
  "🍺",
  "🍷",
  "🥤",
  "💧",
  // Frozen & Packaged
  "🧊",
  "🫙",
  "🥫",
  "🍝",
  "🍚",
  // Household
  "🧹",
  "🧼",
  "🧴",
  "🧽",
  "🪥",
  "🧻",
  // Misc
  "📦",
  "🛒",
  "🏷️",
  "✨",
  "💊",
  "🪴",
  "🐾",
];

interface CategoryFormProps {
  initial?: Category;
  onSubmit: (data: { name: string; emoji: string }) => void;
  onCancel: () => void;
  pending?: boolean;
}

export default function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  pending,
}: CategoryFormProps) {
  const t = useT();
  const [name, setName] = useState(initial?.name ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? "📦");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("categories.nameRequired"));
      return;
    }
    setError(null);
    onSubmit({ name: name.trim(), emoji });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name input */}
      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          {t("categories.nameLabel")} *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("categories.namePlaceholder")}
          autoFocus
          className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium placeholder:font-normal"
        />
      </div>

      {/* Emoji picker */}
      <div>
        <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          {t("categories.emojiLabel")}
        </label>

        {/* Selected emoji preview */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 flex items-center justify-center bg-brand-faint rounded-2xl text-3xl">
            {emoji}
          </div>
          <span className="text-sm text-text-secondary">
            {name || t("categories.namePlaceholder")}
          </span>
        </div>

        {/* Emoji grid */}
        <div className="grid grid-cols-8 gap-1 p-2 bg-bg-header rounded-xl max-h-48 overflow-y-auto">
          {EMOJI_OPTIONS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setEmoji(em)}
              className={`aspect-square flex items-center justify-center text-xl rounded-lg transition-all ${
                emoji === em
                  ? "bg-brand-mid text-white scale-110"
                  : "hover:bg-bg-surface active:scale-95"
              }`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3.5 bg-bg-header text-text-primary rounded-2xl font-bold text-sm active:scale-[0.98] transition-transform"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-3.5 bg-brand-mid text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {pending ? t("saving") : initial ? t("save") : t("create")}
        </button>
      </div>
    </form>
  );
}
