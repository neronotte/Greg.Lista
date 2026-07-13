interface CategoryHeaderProps {
  name: string;
  emoji?: string;
  count?: number;
}

const DEFAULT_EMOJI = "📦";

export default function CategoryHeader({ name, emoji, count }: CategoryHeaderProps) {
  const displayEmoji = emoji || DEFAULT_EMOJI;

  return (
    <div className="mb-2.5 mt-1 flex items-center gap-2 rounded-xl border px-3 py-2 bg-bg-header border-border">
      <span className="text-sm">{displayEmoji}</span>
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-brand-mid">{name}</span>
      {count !== undefined && (
        <span className="ml-auto text-[11px] opacity-60 text-brand-mid">{count}</span>
      )}
    </div>
  );
}
