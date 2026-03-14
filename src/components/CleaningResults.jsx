'use client'

export default function CleaningResults({ result, filename, onDownload, onReset }) {
  const savedBytes = result.originalSize - result.cleanedSize
  const savedPercent = ((savedBytes / result.originalSize) * 100).toFixed(1)

  return (
    <div className="rounded-2xl border border-safe/30 bg-safe/5 overflow-hidden animate-fade-in-up">
      {/* Success header */}
      <div className="p-5 sm:p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-safe">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-foreground">Metadata Removed</h3>
        <p className="text-sm text-muted mt-1">
          Your photo has been cleaned using {result.method}
        </p>
      </div>

      {/* Before / After comparison */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <div className="grid grid-cols-2 gap-3">
          {/* Before */}
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-[10px] text-muted uppercase tracking-wide mb-2">Before</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {formatBytes(result.originalSize)}
            </p>
            <p className="text-xs text-danger mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              Metadata present
            </p>
          </div>

          {/* After */}
          <div className="rounded-xl border border-safe/30 bg-safe/5 p-4">
            <p className="text-[10px] text-muted uppercase tracking-wide mb-2">After</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {formatBytes(result.cleanedSize)}
            </p>
            <p className="text-xs text-safe mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-safe" />
              Clean
            </p>
          </div>
        </div>

        {/* Savings badge */}
        {savedBytes > 0 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-muted">
              {formatBytes(savedBytes)} removed ({savedPercent}% smaller)
            </span>
          </div>
        )}

        {/* Method info */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-safe">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {result.method.includes('Binary') || result.method.includes('Chunk')
            ? 'Zero quality loss — original image data preserved'
            : 'Re-encoded to remove metadata'
          }
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          <button
            onClick={onDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-white font-medium text-sm hover:bg-brand/90 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Clean Image
          </button>

          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-surface transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Clean Another File
          </button>
        </div>
      </div>
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
