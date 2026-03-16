'use client'

import { useState } from 'react'
import { getRiskColor } from '../lib/threatAnalyzer'
import ThreatCard from './ThreatCard'
import GpsMap from './GpsMap'

export default function BatchFileCard({ item, index }) {
  const [expanded, setExpanded] = useState(false)

  const isScanning = item.status === 'scanning'
  const isCleaning = item.status === 'cleaning'
  const isScanned = item.status === 'scanned' || item.status === 'cleaning' || item.status === 'cleaned'
  const isCleaned = item.status === 'cleaned'
  const isError = item.status === 'error'

  const riskColors = item.threat ? getRiskColor(item.threat.riskLevel) : null

  return (
    <div className={`
      rounded-xl border overflow-hidden transition-all duration-200
      ${isCleaned ? 'border-safe/30 bg-safe/5' : isError ? 'border-danger/30 bg-danger/5' : 'border-border bg-surface/50'}
    `}>
      {/* Compact header row */}
      <button
        onClick={() => isScanned && setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 p-3 sm:p-4 text-left ${isScanned ? 'cursor-pointer hover:bg-surface/80' : 'cursor-default'}`}
        disabled={!isScanned}
      >
        {/* Thumbnail */}
        <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-border bg-surface">
          {item.imagePreview ? (
            <img src={item.imagePreview} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{item.file.name}</p>
          <p className="text-xs text-muted mt-0.5">
            {(item.file.size / 1024).toFixed(1)} KB
            {item.threat && ` · ${item.threat.totalFields} metadata fields`}
          </p>
        </div>

        {/* Status / Risk badge */}
        <div className="shrink-0 flex items-center gap-2">
          {(isScanning || isCleaning) && (
            <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          )}

          {isScanned && riskColors && (
            <span className={`
              px-2 py-0.5 rounded-full text-xs font-medium border
              ${item.threat.riskLevel === 'critical' || item.threat.riskLevel === 'high'
                ? 'bg-danger/10 border-danger/30 text-danger'
                : item.threat.riskLevel === 'medium'
                  ? 'bg-warning/10 border-warning/30 text-warning'
                  : 'bg-safe/10 border-safe/30 text-safe'
              }
            `}>
              {item.threat.riskPercentage}%
            </span>
          )}

          {isCleaned && (
            <div className="w-5 h-5 rounded-full bg-safe/20 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-safe">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}

          {isError && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 border border-danger/30 text-danger">
              Error
            </span>
          )}

          {isScanned && (
            <svg
              width="16" height="16"
              viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              className={`text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded detail view */}
      {expanded && isScanned && item.metadata && item.threat && (
        <div className="border-t border-border px-3 sm:px-4 pb-4 pt-3 space-y-4">
          {/* Risk bar */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs text-muted">Privacy Exposure</span>
              <span className={`text-xs font-mono font-medium ${riskColors.color}`}>
                {item.threat.riskPercentage}%
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${riskColors.bg}`}
                style={{ width: `${item.threat.riskPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2 leading-relaxed">{item.threat.summary}</p>
          </div>

          {/* GPS Map */}
          {item.metadata.gps && (
            <GpsMap latitude={item.metadata.gps.latitude} longitude={item.metadata.gps.longitude} />
          )}

          {/* Threat cards */}
          <div className="space-y-2">
            {item.threat.threats.map((t, idx) => (
              <ThreatCard
                key={idx}
                threat={{
                  ...t,
                  items: item.metadata.organized[t.category]?.items || [],
                }}
              />
            ))}
          </div>

          {/* Cleaning result */}
          {isCleaned && item.cleanResult && (
            <div className="flex items-center gap-2 text-xs text-safe pt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Cleaned · {formatBytes(item.cleanResult.originalSize)} → {formatBytes(item.cleanResult.cleanedSize)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
