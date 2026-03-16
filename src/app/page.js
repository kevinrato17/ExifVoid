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
          description: 'Free online EXIF remover. Strip EXIF data, GPS coordinates, and hidden metadata from your photos. 100% client-side processing.',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
          featureList: 'EXIF removal, GPS stripping, metadata scanning, privacy analysis, canvas re-encoding, correct orientation, offline support',
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
              <p className="text-sm text-muted mt-1">Processing locally in your browser</p>
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
                  { step: '1', title: 'Upload', desc: 'Drop your photo into ExifVoid or click to browse. Supports JPEG, PNG, WebP, and HEIC files.' },
                  { step: '2', title: 'Scan', desc: 'View every piece of hidden metadata — GPS location on a map, camera details, timestamps, and a privacy risk score.' },
                  { step: '3', title: 'Clean', desc: 'Remove all metadata with one click and download the cleaned file. Your photo is safe to share anywhere.' },
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
