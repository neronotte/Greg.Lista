const FALLBACK_COLORS = ['#075E54', '#128C7E', '#6B4C9A', '#D97706', '#DC2626', '#0891B2']

function colorForEmail(email: string): string {
  let hash = 0
  for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash)
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length]
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

interface AvatarProps {
  name: string
  email: string
  avatarUrl?: string | null
  size?: number
}

export default function Avatar({ name, email, avatarUrl, size = 40 }: AvatarProps) {
  const bg = colorForEmail(email)
  const style = { width: size, height: size, fontSize: size * 0.35 }

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={style}
      />
    )
  }

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{ ...style, backgroundColor: bg }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  )
}
