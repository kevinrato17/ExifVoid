'use client'

import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FileUploader from '../components/FileUploader'
import TrustBadges from '../components/TrustBadges'
import PrivacyScanResults from '../components/PrivacyScanResults'
import CleaningResults from '../components/CleaningResults'
import { readMetadata, countMetadata } from '../lib/exifReader'
import { stripMetadata, getCleanFilename, downloadCleanFile } from '../lib/metadataStripper'
import { analyzeThreat } from '../lib/threatAnalyzer'

export default function HomePage() {
  const [state, setState] = useState('idle') // idle | scanning | scanned | cleaning | cleaned
  const [file, setFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [threat, setThreat] = useState(null)
  const [cleanResult, setCleanResult] = useState(null)
  const [cleanBlob, setCleanBlob] = useState(null)

  const handleFileSelected = useCallback(async (selectedFile) => {
    setFile(selectedFile)
    setState('scanning')

    // Create image preview
    const previewUrl = URL.createObjectURL(selectedFile)
    setImagePreview(previewUrl)

    try {
      // Read metadata
      const meta = await readMetadata(selectedFile)
      setMetadata(meta)

      // Analyze threats
      const threatResult = analyzeThreat(meta.organized)
      setThreat(threatResult)

      setState('scanned')
    } catch (error) {
      console.error('Scan error:', error)
      setState('idle')
    }
  }, [])

  const handleClean = useCallback(async () => {
    if (!file) return
    setState('cleaning')

    try {
      const result = await stripMetadata(file)
      setCleanResult(result)
      setCleanBlob(result.blob)
      setState('cleaned')
    } catch (error) {
      console.error('Cleaning error:', error)
      setState('scanned')
    }
  }, [file])

  const handleDownload = useCallback(() => {
    if (!cleanBlob || !file) return
    const filename = getCleanFilename(file.name)
    downloadCleanFile(cleanBlob, filename)
  }, [cleanBlob, file])

  const handleReset = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setFile(null)
    setImagePreview(null)
    setMetadata(null)
    setThreat(null)
    setCleanResult(null)
    setCleanBlob(null)
    setState('idle')
  }, [imagePreview])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'ExifVoid',
          url: 'https://exifvoid.com',
          description: 'Strip EXIF data, GPS coordinates, and hidden metadata from your photos. 100% client-side processing.',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
          featureList: 'EXIF removal, GPS stripping, metadata scanning, privacy analysis, binary excision, zero quality loss, offline support',
          browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
        }) }}
      />
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* Hero - only show in idle state */}
          {state === 'idle' && (
            <div className="text-center mb-8 sm:mb-10 animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
                See what your photos
                <br />
                <span className="text-brand">reveal about you</span>
              </h1>
              <p className="text-muted mt-3 sm:mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Scan and remove hidden metadata — GPS coordinates, camera IDs,
                timestamps — entirely in your browser. Your files never touch a server.
              </p>
            </div>
          )}

          {/* Uploader - show in idle state */}
          {state === 'idle' && (
            <div className="space-y-6 animate-fade-in-up-delay-1">
              <FileUploader onFileSelected={handleFileSelected} />
              <TrustBadges />
            </div>
          )}

          {/* Scanning state */}
          {state === 'scanning' && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="w-12 h-12 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-foreground font-medium mt-4">Scanning metadata...</p>
              <p className="text-sm text-muted mt-1">Analysing your file locally in the browser</p>
            </div>
          )}

          {/* Scan results */}
          {state === 'scanned' && metadata && threat && (
            <div className="space-y-6">
              {/* Back / file name header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Scan another file
                </button>
              </div>

              {/* Privacy Scan Report */}
              <PrivacyScanResults
                metadata={metadata}
                threat={threat}
                file={file}
                imagePreview={imagePreview}
              />

              {/* Clean button */}
              <button
                onClick={handleClean}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand text-white font-semibold text-base hover:bg-brand/90 transition-all hover:shadow-lg hover:shadow-brand/20 active:scale-[0.99]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Remove All Metadata
              </button>
            </div>
          )}

          {/* Cleaning state */}
          {state === 'cleaning' && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-2 border-brand/30 rounded-full" />
                <div className="absolute inset-0 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-3 border-2 border-safe border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
              </div>
              <p className="text-foreground font-medium mt-5">Stripping metadata...</p>
              <p className="text-sm text-muted mt-1">Performing binary excision — zero quality loss</p>
            </div>
          )}

          {/* Clean results */}
          {state === 'cleaned' && cleanResult && (
            <div className="space-y-6">
              <CleaningResults
                result={cleanResult}
                filename={file?.name}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Bottom social proof - only show in idle */}
          {state === 'idle' && (
            <div className="mt-12 text-center animate-fade-in-up-delay-3">
              <p className="text-xs text-muted">
                Open source privacy tool. No accounts. No tracking. No cookies.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
