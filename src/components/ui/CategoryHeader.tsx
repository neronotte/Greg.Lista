interface CategoryHeaderProps {
  name: string;
  count?: number;
}

const CAT_STYLE: Record<
  string,
  { emoji: string; bg: string; fg: string; border: string }
> = {
  "Frutta e verdura": { emoji: "🥦", bg: "bg-emerald-50", fg: "text-emerald-700", border: "border-emerald-100" },
  "Pane e panificati": { emoji: "🍞", bg: "bg-amber-50", fg: "text-amber-700", border: "border-amber-100" },
  "Carne e pesce": { emoji: "🥩", bg: "bg-red-50", fg: "text-red-700", border: "border-red-100" },
  "Salumi e formaggi": { emoji: "🧀", bg: "bg-orange-50", fg: "text-orange-700", border: "border-orange-100" },
  "Latticini e uova": { emoji: "🥛", bg: "bg-sky-50", fg: "text-sky-700", border: "border-sky-100" },
  "Surgelati": { emoji: "🧊", bg: "bg-cyan-50", fg: "text-cyan-700", border: "border-cyan-100" },
  "Dispensa": { emoji: "🫙", bg: "bg-stone-50", fg: "text-stone-600", border: "border-stone-100" },
  "Bevande": { emoji: "☕", bg: "bg-orange-50", fg: "text-orange-700", border: "border-orange-100" },
  "Igiene e pulizia casa": { emoji: "🧹", bg: "bg-slate-50", fg: "text-slate-600", border: "border-slate-100" },
  "Varie": { emoji: "📦", bg: "bg-stone-50", fg: "text-stone-600", border: "border-stone-100" },
};

const DEFAULT_STYLE = { emoji: "📦", bg: "bg-bg-header", fg: "text-brand-mid", border: "border-border" };

export default function CategoryHeader({ name, count }: CategoryHeaderProps) {
  const style = CAT_STYLE[name] ?? DEFAULT_STYLE;
  return (
    <div className={`mb-2.5 mt-1 flex items-center gap-2 rounded-xl border px-3 py-2 ${style.bg} ${style.border}`}>
      <span className="text-sm">{style.emoji}</span>
      <span className={`text-[11px] font-extrabold uppercase tracking-widest ${style.fg}`}>{name}</span>
      {count !== undefined && (
        <span className={`ml-auto text-[11px] opacity-60 ${style.fg}`}>{count}</span>
      )}
    </div>
  );
}
