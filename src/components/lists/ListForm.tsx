"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createList, updateList } from "@/lib/actions/lists";
import type { Visibility } from "@/lib/types";

const EMOJI_OPTIONS = [
  "🧺",
  "🛒",
  "🛍️",
  "🍎",
  "🥦",
  "🍞",
  "🥛",
  "🥩",
  "🍕",
  "🍔",
  "☕",
  "🍷",
  "🎉",
  "🏠",
  "🧹",
  "🧴",
  "💊",
  "🐕",
  "🐈",
  "👶",
  "🏋️",
  "🧑‍💻",
  "🔥",
  "❄️",
  "🎄",
  "🐣",
  "🎃",
  "🌴",
  "⛺",
  "✈️",
  "🚗",
  "📦",
];

interface ListFormProps {
  families?: { id: string; name: string }[];
  initial?: {
    id: string;
    name: string;
    visibility: Visibility;
    familyId?: string | null;
    icon?: string | null;
  };
  onDone: () => void;
}

export default function ListForm({
  families = [],
  initial,
  onDone,
}: ListFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "🧺");
  const [visibility, setVisibility] = useState<Visibility>(
    initial?.visibility ?? "private",
  );
  const [familyId, setFamilyId] = useState(initial?.familyId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Il nome è obbligatorio");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        if (initial) {
          await updateList(
            initial.id,
            name.trim(),
            visibility,
            visibility === "family" ? familyId || undefined : null,
            icon,
          );
        } else {
          await createList(
            name.trim(),
            visibility,
            visibility === "family" ? familyId || undefined : undefined,
            icon,
          );
        }
        router.refresh();
        onDone();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          List name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Weekly Groceries"
          autoFocus
          className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-mid font-medium placeholder:font-normal"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          Icon
        </label>
        <div className="grid grid-cols-8 gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`flex items-center justify-center h-10 w-10 rounded-xl text-xl transition-all ${
                icon === emoji
                  ? "bg-brand-mid/20 ring-2 ring-brand-mid scale-110"
                  : "bg-bg-header hover:bg-bg-header/80 active:scale-95"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
          Visibility
        </label>
        <div className="flex gap-3">
          {(["private", "family"] as Visibility[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVisibility(v)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${
                visibility === v
                  ? "border-brand-mid bg-brand-mid/8 text-brand-mid"
                  : "border-border text-text-secondary"
              }`}
            >
              {v === "private" ? "🔒 Personal" : "👥 Family"}
            </button>
          ))}
        </div>
      </div>

      {visibility === "family" && families.length > 0 && (
        <div>
          <label className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-widest text-text-secondary">
            Family
          </label>
          <select
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            className="w-full bg-bg-header rounded-xl px-4 py-3 text-sm outline-none appearance-none focus:ring-2 focus:ring-brand-mid font-medium"
          >
            <option value="">Select family…</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 bg-brand-mid text-white rounded-2xl font-extrabold text-sm active:scale-[0.98] transition-transform mt-1"
        style={{ boxShadow: "0 4px 16px rgba(61,122,86,0.32)" }}
      >
        {pending ? "Saving…" : initial ? "Save Changes" : "Create List"}
      </button>
    </form>
  );
}
