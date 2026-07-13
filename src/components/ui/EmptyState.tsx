interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="mb-4 text-brand-mid">{icon}</span>
      <p className="font-bold text-text-primary text-lg">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
