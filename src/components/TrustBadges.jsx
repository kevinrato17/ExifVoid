'use client'

export default function TrustBadges() {
  const badges = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      label: '100% Client-Side',
      detail: 'Files never leave your browser',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      label: 'Zero Quality Loss',
      detail: 'Binary-level metadata excision',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      label: 'Works Offline',
      detail: 'No internet needed after first load',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface/50 hover:border-brand/30 transition-colors"
        >
          <div className="text-brand shrink-0">{badge.icon}</div>
          <div>
            <p className="text-sm font-medium text-foreground">{badge.label}</p>
            <p className="text-xs text-muted">{badge.detail}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
