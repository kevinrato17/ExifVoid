'use client'

import { useState } from 'react'
import ThreatCard from './ThreatCard'
import GpsMap from './GpsMap'
import { getRiskColor } from '../lib/threatAnalyzer'

export default function PrivacyScanResults({ metadata, threat, file, imagePreview }) {
  const [showAllMetadata, setShowAllMetadata] = useState(false)
  const riskColors = getRiskColor(threat.riskLevel)

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* File Preview + Risk Score Header */}
      <div className="rounded-2xl border border-border bg-surface/50 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Image thumbnail */}
            {imagePreview && (
              <div className="shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-border bg-surface">
                  <img
                    src={imagePreview}
                    alt="Uploaded file"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* File info + risk score */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground truncate">{file.name}</h2>
                  <p className="text-sm text-muted mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB · {file.type || 'Unknown type'}
                  </p>
                </div>

                {/* Risk badge */}
                <div className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-full border shrink-0
                  ${threat.riskLevel === 'critical' || threat.riskLevel === 'high'
                    ? 'bg-danger/10 border-danger/30'
                    : threat.riskLevel === 'medium'
                      ? 'bg-warning/10 border-warning/30'
                      : 'bg-safe/10 border-safe/30'
                  }
                `}>
                  <div className={`w-2 h-2 rounded-full ${riskColors.bg}`} />
                  <span className={`text-sm font-medium ${riskColors.color}`}>
                    {threat.riskLevel === 'critical' ? 'Critical Risk' :
                     threat.riskLevel === 'high' ? 'High Risk' :
                     threat.riskLevel === 'medium' ? 'Medium Risk' :
                     threat.riskLevel === 'low' ? 'Low Risk' : 'Clean'}
                  </span>
                </div>
              </div>

              {/* Risk bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-muted">Privacy Exposure</span>
                  <span className={`text-xs font-mono font-medium ${riskColors.color}`}>
                    {threat.riskPercentage}%
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${riskColors.bg}`}
                    style={{ width: `${threat.riskPercentage}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-muted mt-3 leading-relaxed">
                {threat.summary}
              </p>

              {/* Stats row */}
              <div className="flex gap-4 mt-3">
                <div className="text-center">
                  <span className="text-xl font-semibold text-foreground">{threat.totalFields}</span>
                  <p className="text-[10px] text-muted uppercase tracking-wide">Fields Found</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <span className="text-xl font-semibold text-foreground">{threat.threats.length}</span>
                  <p className="text-[10px] text-muted uppercase tracking-wide">Categories</p>
                </div>
                <div className="w-px bg-border" />
                <div className="text-center">
                  <span className="text-xl font-semibold text-foreground">
                    {threat.threats.filter(t => t.severity === 'high').length}
                  </span>
                  <p className="text-[10px] text-muted uppercase tracking-wide">High Risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Map (if location data exists) */}
      {metadata.gps && (
        <div className="animate-fade-in-up-delay-1">
          <GpsMap latitude={metadata.gps.latitude} longitude={metadata.gps.longitude} />
        </div>
      )}

      {/* Threat Cards */}
      <div className="animate-fade-in-up-delay-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Metadata Breakdown</h3>
          <span className="text-xs text-muted">{threat.threats.length} categories</span>
        </div>
        <div className="space-y-2">
          {threat.threats.map((t, idx) => (
            <ThreatCard
              key={idx}
              threat={{
                ...t,
                items: metadata.organized[t.category]?.items || [],
              }}
            />
          ))}
        </div>
      </div>

      {/* Raw metadata toggle */}
      {metadata.raw && (
        <div className="animate-fade-in-up-delay-3">
          <button
            onClick={() => setShowAllMetadata(!showAllMetadata)}
            className="text-xs text-muted hover:text-brand transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
            </svg>
            {showAllMetadata ? 'Hide' : 'Show'} Raw Metadata
          </button>

          {showAllMetadata && (
            <div className="mt-3 rounded-xl border border-border bg-surface p-4 overflow-auto max-h-96">
              <pre className="text-xs font-mono text-muted whitespace-pre-wrap break-all">
                {JSON.stringify(metadata.raw, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
