import Link from "next/link";
import { Lock, Users } from "lucide-react";

interface ListCardProps {
  id: string;
  name: string;
  visibility: "private" | "family";
  itemCount: number;
  updatedAt: string;
  familyName?: string;
  categoryCount?: number;
  color?: string;
  icon?: string | null;
}

export default function ListCard({
  id,
  name,
  visibility,
  itemCount,
  familyName,
  categoryCount,
  color = "#3D7A56",
  icon,
}: ListCardProps) {
  const emoji = icon || listEmoji(name);

  return (
    <Link
      href={`/lists/${id}`}
      className="block bg-bg-surface rounded-2xl p-4 border border-border shadow-[0_10px_30px_rgba(44,36,32,0.06)] active:scale-[0.98] transition-transform"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: color + "20" }}
        >
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-bold text-text-primary">
            {name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                visibility === "family"
                  ? "bg-brand-mid/10 text-brand-mid"
                  : "bg-bg-header text-text-secondary"
              }`}
            >
              {visibility === "family" ? (
                <>
                  <Users size={9} /> Family
                </>
              ) : (
                <>
                  <Lock size={9} /> Personal
                </>
              )}
            </span>
            <span className="text-xs text-text-secondary">
              {itemCount === 0
                ? "Empty"
                : `${itemCount} item${itemCount === 1 ? "" : "s"}${categoryCount ? ` · ${categoryCount} categories` : ""}`}
            </span>
          </div>
          {familyName && (
            <p className="mt-1.5 text-xs font-medium text-text-secondary">
              {familyName}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function listEmoji(name: string): string {
  const value = name.toLowerCase();
  if (value.includes("bbq") || value.includes("grill")) return "🔥";
  if (
    value.includes("fruit") ||
    value.includes("apple") ||
    value.includes("snack")
  )
    return "🍎";
  if (value.includes("office")) return "🧑‍💻";
  if (
    value.includes("weekly") ||
    value.includes("spesa") ||
    value.includes("groc")
  )
    return "🛒";
  if (value.includes("party") || value.includes("festa")) return "🎉";
  return "🧺";
}
