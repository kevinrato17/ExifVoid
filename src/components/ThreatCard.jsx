'use client'

import { useState } from 'react'
import { getThreatColor } from '../lib/threatAnalyzer'

export default function ThreatCard({ threat }) {
  const [expanded, setExpanded] = useState(false)
  const colors = getThreatColor(threat.severity)

  return (
    <div
      className={`
        rounded-xl border transition-all duration-200
        ${colors.bg} ${colors.border}
        ${expanded ? 'ring-1 ring-brand/20' : ''}
      `}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{threat.icon}</span>
          <div>
            <p className="font-medium text-foreground text-sm">{threat.label}</p>
            <p className="text-xs text-muted mt-0.5">
              {threat.itemCount} field{threat.itemCount !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-medium
            ${colors.bg} ${colors.text} border ${colors.border}
          `}>
            {threat.severity === 'high' ? 'High Risk' :
             threat.severity === 'medium' ? 'Medium' : 'Low'}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          <p className="text-xs text-muted leading-relaxed mb-3">{threat.description}</p>
          {threat.items && threat.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start gap-4 py-1.5 border-t border-border/50">
              <span className="text-xs text-muted font-mono shrink-0">{item.key}</span>
              <span className="text-xs text-foreground font-mono text-right break-all">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
