interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-5 py-16 text-center">
      <span className="text-text-disabled mb-4">{icon}</span>
      <p className="text-[17px] font-semibold text-text-secondary">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-text-disabled">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
