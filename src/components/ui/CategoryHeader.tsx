interface CategoryHeaderProps {
  name: string
}

export default function CategoryHeader({ name }: CategoryHeaderProps) {
  return (
    <div className="bg-bg-header px-4 py-2 sticky top-0 z-[5]">
      <span className="text-xs font-normal text-text-secondary uppercase tracking-[0.08em]">
        {name}
      </span>
    </div>
  )
}
