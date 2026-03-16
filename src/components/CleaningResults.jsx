'use client'

import { useState } from 'react'

export default function CleaningResults({ files, onDownloadSingle, onDownloadAll, onReset }) {
  const [downloading, setDownloading] = useState(false)
  const isBatch = files.length > 1

  const totalOriginal = files.reduce((sum, f) => sum + f.cleanResult.originalSize, 0)
  const totalCleaned = files.reduce((sum, f) => sum + f.cleanResult.cleanedSize, 0)
  const savedBytes = totalOriginal - totalCleaned
  const savedPercent = ((savedBytes / totalOriginal) * 100).toFixed(1)

  const handleDownloadAll = async () => {
    setDownloading(true)
    try {
      await onDownloadAll()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-safe/30 bg-safe/5 overflow-hidden animate-fade-in-up">
      {/* Success header */}
      <div className="p-5 sm:p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-safe/20 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-safe">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-foreground">
          {isBatch ? `${files.length} Photos Cleaned` : 'Metadata Removed'}
        </h3>
        <p className="text-sm text-muted mt-1">
          {isBatch
            ? 'All metadata has been stripped from your photos'
            : `Your photo has been cleaned using ${files[0].cleanResult.method}`
          }
        </p>
      </div>

      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        {/* Before / After comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-[10px] text-muted uppercase tracking-wide mb-2">Before</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {formatBytes(totalOriginal)}
            </p>
            <p className="text-xs text-danger mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger" />
              {isBatch ? `${files.length} files with metadata` : 'Metadata present'}
            </p>
          </div>

          <div className="rounded-xl border border-safe/30 bg-safe/5 p-4">
            <p className="text-[10px] text-muted uppercase tracking-wide mb-2">After</p>
            <p className="text-lg font-semibold text-foreground font-mono">
              {formatBytes(totalCleaned)}
            </p>
            <p className="text-xs text-safe mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-safe" />
              {isBatch ? `${files.length} files clean` : 'Clean'}
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
          All metadata stripped — image quality preserved at 95%
        </div>

        {/* Batch: individual file list */}
        {isBatch && (
          <div className="mt-5 space-y-2">
            <p className="text-xs text-muted font-medium uppercase tracking-wide">Individual Downloads</p>
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
              {files.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 hover:bg-surface/50 transition-colors">
                  {/* Thumbnail */}
                  <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-border bg-surface">
                    {item.imagePreview && (
                      <img src={item.imagePreview} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  {/* Name + size */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.file.name}</p>
                    <p className="text-[10px] text-muted">
                      {formatBytes(item.cleanResult.originalSize)} → {formatBytes(item.cleanResult.cleanedSize)}
                    </p>
                  </div>
                  {/* Download button */}
                  <button
                    onClick={() => onDownloadSingle(idx)}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-brand/10 text-muted hover:text-brand transition-colors"
                    title="Download this file"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-5">
          {isBatch ? (
            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-white font-medium text-sm hover:bg-brand/90 transition-colors disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating ZIP...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download All as ZIP
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => onDownloadSingle(0)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand text-white font-medium text-sm hover:bg-brand/90 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Clean Image
            </button>
          )}

          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-surface transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Clean More Files
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
