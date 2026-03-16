'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is EXIF metadata?',
        acceptedAnswer: { '@type': 'Answer', text: 'EXIF (Exchangeable Image File Format) metadata is hidden data embedded in every digital photo, including GPS coordinates, camera details, timestamps, and device serial numbers.' },
      },
      {
        '@type': 'Question',
        name: 'Does ExifVoid upload my photos to a server?',
        acceptedAnswer: { '@type': 'Answer', text: 'No. ExifVoid processes files entirely in your web browser using JavaScript. Your photos never leave your device. You can verify this by checking the Network tab in your browser developer tools.' },
      },
      {
        '@type': 'Question',
        name: 'Does removing metadata reduce image quality?',
        acceptedAnswer: { '@type': 'Answer', text: 'ExifVoid uses canvas re-encoding at high quality to strip metadata while the browser automatically handles correct image orientation. The visual difference is imperceptible, and the output is always correctly oriented.' },
      },
      {
        '@type': 'Question',
        name: 'Does ExifVoid work offline?',
        acceptedAnswer: { '@type': 'Answer', text: 'Yes. Once the page has loaded, ExifVoid works without an internet connection because all processing happens locally in your browser.' },
      },
      {
        '@type': 'Question',
        name: 'What file formats does ExifVoid support?',
        acceptedAnswer: { '@type': 'Answer', text: 'ExifVoid supports JPEG, PNG, WebP, and HEIC files. All formats use canvas re-encoding which strips all metadata while preserving correct image orientation.' },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <link rel="canonical" href="https://exifvoid.com/about" />
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* Header */}
          <div className="mb-10 animate-fade-in-up">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to tool
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              How ExifVoid Works
            </h1>
            <p className="text-muted mt-3 text-base sm:text-lg leading-relaxed">
              A transparent look at what we do, how we do it, and why your privacy is genuinely protected.
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-10">

            {/* What is EXIF data */}
            <section className="animate-fade-in-up-delay-1">
              <h2 className="text-xl font-semibold text-foreground mb-3">What is EXIF metadata?</h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  Every photo you take with a smartphone or digital camera contains hidden data called EXIF
                  (Exchangeable Image File Format) metadata. This invisible information is embedded directly
                  into the image file and travels with it wherever it goes — social media uploads, email
                  attachments, cloud storage.
                </p>
                <p>
                  This metadata can include your exact GPS coordinates (often accurate to within a few metres),
                  the make and model of your device, unique serial numbers that can link photos back to your
                  specific camera, timestamps showing exactly when a photo was taken, and even the software
                  you used to edit it.
                </p>
              </div>
            </section>

            {/* The risk */}
            <section className="animate-fade-in-up-delay-2">
              <h2 className="text-xl font-semibold text-foreground mb-3">Why is this a problem?</h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  When you share a photo online — on marketplaces like eBay, on social media, in forums, or
                  even via messaging apps that don't strip metadata — anyone who downloads that image can
                  extract this data in seconds. That means a stranger could pinpoint your home location from
                  a casual photo of your pet, or link multiple anonymous uploads to the same physical device.
                </p>
              </div>

              {/* Risk examples grid */}
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { icon: '📍', title: 'Location Tracking', desc: 'GPS coordinates reveal where you live, work, and travel' },
                  { icon: '🔑', title: 'Device Fingerprinting', desc: 'Serial numbers link photos to your specific camera' },
                  { icon: '🕐', title: 'Schedule Mapping', desc: 'Timestamps expose your daily routines and habits' },
                  { icon: '👤', title: 'Identity Linking', desc: 'Owner names and software reveal personal information' },
                ].map((risk, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface/50">
                    <span className="text-lg">{risk.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{risk.title}</p>
                      <p className="text-xs text-muted mt-0.5">{risk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How ExifVoid is different */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">How ExifVoid is different</h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  Most metadata removal tools require you to upload your photos to their servers for processing.
                  This defeats the purpose — you're handing your private data (the very data you want to remove)
                  to a third party.
                </p>
                <p>
                  ExifVoid works entirely within your web browser. When you drop a file into the tool, JavaScript
                  running on your device reads and processes the file locally. The image data never leaves your
                  computer. There are no server uploads, no temporary cloud storage, no data retention.
                </p>
              </div>
            </section>

            {/* Technical approach */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">The technical approach</h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  ExifVoid uses canvas re-encoding to strip metadata from your images. When you clean a file,
                  the browser loads the image onto an HTML canvas element and re-exports it as a fresh file.
                  Because canvas export creates a completely new image, no metadata from the original file
                  carries over — it is all stripped automatically.
                </p>
                <p>
                  A key advantage of this approach is that the browser automatically handles EXIF orientation
                  tags when rendering to canvas. This means your cleaned photos always display with the correct
                  orientation, regardless of how the original camera saved them.
                </p>
                <p>
                  For JPEG files, re-encoding is performed at 95% quality — a level where the visual difference
                  from the original is imperceptible to the human eye. The result is a clean, correctly-oriented
                  photo with all hidden metadata completely removed.
                </p>
              </div>
            </section>

            {/* Verification */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Verify it yourself</h2>
              <div className="text-muted leading-relaxed space-y-3 text-[15px]">
                <p>
                  You don't need to trust our word. Open your browser's Developer Tools (F12), go to the
                  Network tab, and watch what happens when you process a file. You'll see zero outbound
                  requests containing image data. The only network activity is the initial page load itself.
                </p>
                <p>
                  You can even disconnect from the internet after the page loads and the tool will continue
                  to work normally. Try it.
                </p>
              </div>
            </section>

            {/* Comparison table */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">How we compare</h2>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      <th className="text-left px-4 py-3 font-medium text-foreground">Feature</th>
                      <th className="text-center px-4 py-3 font-medium text-brand">ExifVoid</th>
                      <th className="text-center px-4 py-3 font-medium text-muted">Others</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted">
                    {[
                      ['Client-side processing', true, false],
                      ['Zero file uploads', true, false],
                      ['Works offline', true, false],
                      ['Preserves correct orientation', true, false],
                      ['GPS location preview', true, true],
                      ['Threat risk scoring', true, false],
                      ['Free to use', true, true],
                      ['No account required', true, false],
                    ].map(([feature, us, them], idx) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-foreground">{feature}</td>
                        <td className="text-center px-4 py-2.5">
                          {us ? (
                            <span className="text-safe">✓</span>
                          ) : (
                            <span className="text-danger">✗</span>
                          )}
                        </td>
                        <td className="text-center px-4 py-2.5">
                          {them ? (
                            <span className="text-safe">✓</span>
                          ) : (
                            <span className="text-danger">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CTA */}
            <section className="text-center pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-medium text-sm hover:bg-brand/90 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Scan Your Photos Now
              </Link>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
