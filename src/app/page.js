'use client'

import { useState, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FileUploader from '../components/FileUploader'
import TrustBadges from '../components/TrustBadges'
import PrivacyScanResults from '../components/PrivacyScanResults'
import CleaningResults from '../components/CleaningResults'
import BatchFileCard from '../components/BatchFileCard'
import { readMetadata } from '../lib/exifReader'
import { stripMetadata, getCleanFilename, downloadCleanFile, downloadAllAsZip } from '../lib/metadataStripper'
import { analyzeThreat } from '../lib/threatAnalyzer'

export default function HomePage() {
  // Main app state: idle | scanning | scanned | cleaning | cleaned
  const [state, setState] = useState('idle')
  // Array of file objects: { file, imagePreview, metadata, threat, cleanResult, cleanBlob, status }
  const [files, setFiles] = useState([])
  // Progress tracking
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 })
  const [cleanProgress, setCleanProgress] = useState({ current: 0, total: 0 })

  const isBatch = files.length > 1

  // === FILE SELECTION ===
  const handleFilesSelected = useCallback(async (selectedFiles) => {
    const fileItems = selectedFiles.map(f => ({
      file: f,
      imagePreview: URL.createObjectURL(f),
      metadata: null,
      threat: null,
      cleanResult: null,
      cleanBlob: null,
      status: 'pending',
    }))

    setFiles(fileItems)
    setState('scanning')
    setScanProgress({ current: 0, total: selectedFiles.length })

    // Scan files sequentially to avoid overwhelming the browser
    const scannedItems = [...fileItems]
    for (let i = 0; i < scannedItems.length; i++) {
      // Update current file to scanning
      scannedItems[i] = { ...scannedItems[i], status: 'scanning' }
      setFiles([...scannedItems])
      setScanProgress({ current: i, total: scannedItems.length })

      try {
        const meta = await readMetadata(scannedItems[i].file)
        const threatResult = analyzeThreat(meta.organized)
        scannedItems[i] = {
          ...scannedItems[i],
          metadata: meta,
          threat: threatResult,
          status: 'scanned',
        }
      } catch (error) {
        console.error(`Scan error for ${scannedItems[i].file.name}:`, error)
        scannedItems[i] = { ...scannedItems[i], status: 'error' }
      }

      setFiles([...scannedItems])
    }

    setScanProgress({ current: scannedItems.length, total: scannedItems.length })
    setState('scanned')
  }, [])

  // === CLEANING ===
  const handleClean = useCallback(async () => {
    setState('cleaning')
    setCleanProgress({ current: 0, total: files.length })

    const cleanedItems = [...files]
    for (let i = 0; i < cleanedItems.length; i++) {
      if (cleanedItems[i].status === 'error') continue

      cleanedItems[i] = { ...cleanedItems[i], status: 'cleaning' }
      setFiles([...cleanedItems])
      setCleanProgress({ current: i, total: cleanedItems.length })

      try {
        const result = await stripMetadata(cleanedItems[i].file)
        cleanedItems[i] = {
          ...cleanedItems[i],
          cleanResult: result,
          cleanBlob: result.blob,
          status: 'cleaned',
        }
      } catch (error) {
        console.error(`Cleaning error for ${cleanedItems[i].file.name}:`, error)
        cleanedItems[i] = { ...cleanedItems[i], status: 'error' }
      }

      setFiles([...cleanedItems])
    }

    setCleanProgress({ current: cleanedItems.length, total: cleanedItems.length })
    setState('cleaned')
  }, [files])

  // === DOWNLOADS ===
  const handleDownloadSingle = useCallback((index) => {
    const item = files[index]
    if (!item?.cleanBlob) return
    const filename = getCleanFilename(item.file.name)
    downloadCleanFile(item.cleanBlob, filename)
  }, [files])

  const handleDownloadAll = useCallback(async () => {
    const cleanedFiles = files
      .filter(f => f.cleanBlob)
      .map(f => ({
        blob: f.cleanBlob,
        filename: getCleanFilename(f.file.name),
      }))
    await downloadAllAsZip(cleanedFiles)
  }, [files])

  // === RESET ===
  const handleReset = useCallback(() => {
    files.forEach(f => {
      if (f.imagePreview) URL.revokeObjectURL(f.imagePreview)
    })
    setFiles([])
    setState('idle')
    setScanProgress({ current: 0, total: 0 })
    setCleanProgress({ current: 0, total: 0 })
  }, [files])

  // Helpers for single-file mode (backwards compat with PrivacyScanResults)
  const singleFile = files[0] || null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'ExifVoid',
          url: 'https://exifvoid.com',
          description: 'Free online EXIF remover. Strip EXIF data, GPS coordinates, and hidden metadata from your photos. Batch process up to 10 images at once. 100% client-side processing.',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
          featureList: 'EXIF removal, GPS stripping, metadata scanning, privacy analysis, batch processing up to 10 images, ZIP download, canvas re-encoding, correct orientation, offline support',
          browserRequirements: 'Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.',
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is EXIF data and why is it a privacy risk?',
              acceptedAnswer: { '@type': 'Answer', text: 'EXIF (Exchangeable Image File Format) data is hidden metadata embedded in every digital photo. It can include GPS coordinates accurate to a few metres, camera serial numbers, timestamps, device model, and editing software. Anyone who downloads your photo can extract this data in seconds, potentially revealing your home address, workplace, or daily routine.' },
            },
            {
              '@type': 'Question',
              name: 'Does ExifVoid upload my photos to a server?',
              acceptedAnswer: { '@type': 'Answer', text: 'No. ExifVoid processes files entirely in your web browser using JavaScript. Your photos never leave your device. You can verify this by opening your browser Developer Tools, checking the Network tab, and confirming zero outbound image data. The tool even works offline after the page loads.' },
            },
            {
              '@type': 'Question',
              name: 'Which social media platforms strip EXIF data automatically?',
              acceptedAnswer: { '@type': 'Answer', text: 'Facebook, Instagram, and Twitter/X strip most EXIF data on upload. However, many platforms do not — including some messaging apps, forums, marketplaces, and cloud storage services. The safest approach is to always remove metadata yourself before sharing.' },
            },
            {
              '@type': 'Question',
              name: 'Does removing metadata affect image quality?',
              acceptedAnswer: { '@type': 'Answer', text: 'ExifVoid uses canvas re-encoding at high quality (95% for JPEG). The visual difference is imperceptible to the human eye. The browser also automatically handles orientation, so your cleaned photos always display correctly.' },
            },
            {
              '@type': 'Question',
              name: 'Can I remove EXIF data from iPhone and Android photos?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes. ExifVoid works in any modern browser on any device — iPhone, Android, Mac, Windows, or Linux. Simply open exifvoid.com in your browser, drop in your photo, and clean it. No app installation required.' },
            },
            {
              '@type': 'Question',
              name: 'How many photos can I process at once?',
              acceptedAnswer: { '@type': 'Answer', text: 'ExifVoid supports batch processing of up to 10 images at once. Simply select or drag multiple images, review the scan results for each, and clean them all with a single click. You can download the cleaned files individually or as a ZIP archive.' },
            },
            {
              '@type': 'Question',
              name: 'Is ExifVoid free to use?',
              acceptedAnswer: { '@type': 'Answer', text: 'Yes, ExifVoid is completely free with no accounts, no sign-ups, no usage limits, and no ads.' },
            },
          ],
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
              <FileUploader onFilesSelected={handleFilesSelected} />
              <TrustBadges />
            </div>
          )}

          {/* ===================== */}
          {/* SCANNING STATE        */}
          {/* ===================== */}
          {state === 'scanning' && (
            <div className="animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-2 border-brand/30 rounded-full" />
                  <div className="absolute inset-0 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-foreground font-medium mt-5">
                  Scanning {isBatch ? `${scanProgress.current + 1} of ${scanProgress.total} images` : 'metadata'}...
                </p>
                <p className="text-sm text-muted mt-1">Analysing your {isBatch ? 'files' : 'file'} locally in the browser</p>

                {/* Progress bar for batch */}
                {isBatch && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((scanProgress.current) / scanProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Show file cards as they scan */}
              {isBatch && (
                <div className="space-y-2 mt-6">
                  {files.map((item, idx) => (
                    <BatchFileCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================== */}
          {/* SCANNED STATE         */}
          {/* ===================== */}
          {state === 'scanned' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  {isBatch ? 'Start over' : 'Scan another file'}
                </button>

                {isBatch && (
                  <span className="text-xs text-muted">
                    {files.length} images scanned
                  </span>
                )}
              </div>

              {/* SINGLE FILE: Show existing detailed view */}
              {!isBatch && singleFile && singleFile.metadata && singleFile.threat && (
                <PrivacyScanResults
                  metadata={singleFile.metadata}
                  threat={singleFile.threat}
                  file={singleFile.file}
                  imagePreview={singleFile.imagePreview}
                />
              )}

              {/* BATCH: Show compact file cards */}
              {isBatch && (
                <div className="space-y-2">
                  {/* Batch summary bar */}
                  <div className="rounded-xl border border-border bg-surface/50 p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-xl font-semibold text-foreground">{files.length}</span>
                        <p className="text-[10px] text-muted uppercase tracking-wide">Images</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <span className="text-xl font-semibold text-foreground">
                          {files.reduce((sum, f) => sum + (f.threat?.totalFields || 0), 0)}
                        </span>
                        <p className="text-[10px] text-muted uppercase tracking-wide">Total Fields</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <span className="text-xl font-semibold text-danger">
                          {files.filter(f => f.threat && (f.threat.riskLevel === 'high' || f.threat.riskLevel === 'critical')).length}
                        </span>
                        <p className="text-[10px] text-muted uppercase tracking-wide">High Risk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                      Tap any file to expand
                    </div>
                  </div>

                  {/* File cards */}
                  {files.map((item, idx) => (
                    <BatchFileCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              )}

              {/* Clean button */}
              <button
                onClick={handleClean}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand text-white font-semibold text-base hover:bg-brand/90 transition-all hover:shadow-lg hover:shadow-brand/20 active:scale-[0.99]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {isBatch ? `Remove Metadata from All ${files.length} Images` : 'Remove All Metadata'}
              </button>
            </div>
          )}

          {/* ===================== */}
          {/* CLEANING STATE        */}
          {/* ===================== */}
          {state === 'cleaning' && (
            <div className="animate-fade-in-up">
              <div className="text-center py-8">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 border-2 border-brand/30 rounded-full" />
                  <div className="absolute inset-0 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-3 border-2 border-safe border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
                </div>
                <p className="text-foreground font-medium mt-5">
                  {isBatch
                    ? `Cleaning ${cleanProgress.current + 1} of ${cleanProgress.total} images...`
                    : 'Stripping metadata...'
                  }
                </p>
                <p className="text-sm text-muted mt-1">Processing locally in your browser</p>

                {/* Progress bar for batch */}
                {isBatch && (
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-safe rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${((cleanProgress.current) / cleanProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Show file cards during cleaning */}
              {isBatch && (
                <div className="space-y-2">
                  {files.map((item, idx) => (
                    <BatchFileCard key={idx} item={item} index={idx} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===================== */}
          {/* CLEANED STATE         */}
          {/* ===================== */}
          {state === 'cleaned' && (
            <div className="space-y-6">
              <CleaningResults
                files={files.filter(f => f.cleanResult)}
                onDownloadSingle={handleDownloadSingle}
                onDownloadAll={handleDownloadAll}
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

          {/* SEO Content Section - always visible for crawlers */}
          <div className="mt-16 space-y-10 border-t border-border pt-10">

            {/* How It Works */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Free Online EXIF Data Remover
              </h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  ExifVoid is a free online EXIF remover that strips hidden metadata from your photos entirely
                  in your browser. Unlike other metadata removal tools that upload your files to remote servers,
                  ExifVoid processes everything client-side — your photos never leave your device.
                </p>
                <p>
                  Every digital photo contains embedded EXIF data including GPS coordinates, camera serial numbers,
                  timestamps, and device information. This hidden metadata can reveal your home address, daily
                  routines, and the exact device you use. ExifVoid scans for all of this, scores the privacy risk,
                  and removes it with a single click.
                </p>
              </div>
            </section>

            {/* How It Works Steps */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                How to Remove Metadata from Photos
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { step: '1', title: 'Upload', desc: 'Drop your photos into ExifVoid or click to browse. Process up to 10 images at once. Supports JPEG, PNG, WebP, and HEIC.' },
                  { step: '2', title: 'Scan', desc: 'View every piece of hidden metadata — GPS location on a map, camera details, timestamps, and a privacy risk score for each image.' },
                  { step: '3', title: 'Clean', desc: 'Remove all metadata with one click and download cleaned files individually or as a ZIP archive. Safe to share anywhere.' },
                ].map((item) => (
                  <div key={item.step} className="rounded-xl border border-border p-4 bg-surface/30">
                    <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-bold mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Use Cases */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Who Needs to Remove Photo Metadata?
              </h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  Anyone sharing photos online should consider removing EXIF data first. This includes sellers
                  uploading product photos to eBay, Etsy, or Facebook Marketplace — where listing photos can
                  expose your home GPS coordinates. Online daters should clean photos before uploading to dating
                  profiles. Journalists and activists need to strip metadata to protect sources and locations.
                  Businesses handling customer photos need to comply with GDPR requirements around personal data
                  in metadata.
                </p>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: 'What is EXIF data and why is it a privacy risk?',
                    a: 'EXIF (Exchangeable Image File Format) data is hidden metadata embedded in every digital photo. It can include GPS coordinates accurate to a few metres, camera serial numbers, timestamps, device model, and editing software. Anyone who downloads your photo can extract this data in seconds, potentially revealing your home address, workplace, or daily routine.'
                  },
                  {
                    q: 'Does ExifVoid upload my photos to a server?',
                    a: 'No. ExifVoid processes files entirely in your web browser using JavaScript. Your photos never leave your device. You can verify this by opening your browser Developer Tools (F12), checking the Network tab, and confirming zero outbound image data. The tool even works offline after the page loads.'
                  },
                  {
                    q: 'How many photos can I process at once?',
                    a: 'ExifVoid supports batch processing of up to 10 images at once. Simply select or drag multiple images into the upload area. You can review the metadata scan results for each file, then clean them all with a single click and download as a ZIP archive.'
                  },
                  {
                    q: 'Which social media platforms strip EXIF data automatically?',
                    a: 'Facebook, Instagram, and Twitter/X strip most EXIF data on upload. However, many platforms do not — including some messaging apps, forums, marketplaces, and cloud storage services. The safest approach is to always remove metadata yourself before sharing, rather than relying on the platform.'
                  },
                  {
                    q: 'Does removing metadata affect image quality?',
                    a: 'ExifVoid uses canvas re-encoding at high quality (95% for JPEG). The visual difference is imperceptible to the human eye. The browser also automatically handles orientation, so your cleaned photos always display correctly.'
                  },
                  {
                    q: 'Can I remove EXIF data from iPhone and Android photos?',
                    a: 'Yes. ExifVoid works in any modern browser on any device — iPhone, Android, Mac, Windows, or Linux. Simply open exifvoid.com in Safari or Chrome, drop in your photo, and clean it. No app installation required.'
                  },
                  {
                    q: 'Is ExifVoid free to use?',
                    a: 'Yes, ExifVoid is completely free. There are no accounts, no sign-ups, no usage limits, and no ads. It is a privacy-first tool built for people who want to protect their personal information.'
                  },
                ].map((faq, idx) => (
                  <details key={idx} className="group rounded-xl border border-border bg-surface/30 overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium text-foreground hover:bg-surface/60 transition-colors">
                      {faq.q}
                      <svg className="w-4 h-4 text-muted shrink-0 ml-2 transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </summary>
                    <p className="px-4 pb-4 text-sm text-muted leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
