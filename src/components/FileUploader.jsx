'use client'

import { useState, useRef, useCallback } from 'react'

const MAX_FILES = 10

export default function FileUploader({ onFilesSelected, disabled }) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const processFiles = useCallback((fileList) => {
    const imageFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    if (imageFiles.length > MAX_FILES) {
      alert(`You can process up to ${MAX_FILES} images at once. You selected ${imageFiles.length}.`)
      return
    }

    onFilesSelected(imageFiles)
  }, [onFilesSelected])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleChange = useCallback((e) => {
    if (e.target.files?.length > 0) {
      processFiles(e.target.files)
    }
    // Reset input so the same files can be selected again
    e.target.value = ''
  }, [processFiles])

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div
      className={`
        relative group cursor-pointer rounded-2xl border-2 border-dashed
        transition-all duration-300 ease-out
        ${dragActive
          ? 'border-brand bg-brand/5 scale-[1.02]'
          : 'border-border hover:border-brand/50 hover:bg-surface/50'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        {/* Upload icon */}
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-5
          transition-all duration-300
          ${dragActive ? 'bg-brand/20 text-brand scale-110' : 'bg-surface text-muted group-hover:text-brand group-hover:bg-brand/10'}
        `}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        <p className="text-foreground font-medium text-lg mb-1.5">
          {dragActive ? 'Drop your images here' : 'Drop images or click to browse'}
        </p>
        <p className="text-muted text-sm">
          JPEG, PNG, WebP, HEIC — up to {MAX_FILES} images at once
        </p>

        {/* Trust indicator */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-safe">
          <div className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
          <span>Files are processed locally — nothing is uploaded</span>
        </div>
      </div>
    </div>
  )
}
