'use client'

import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { getPostBySlug, getRelatedPosts } from '../../../lib/blogData'

export default function BlogPostContent({ slug }) {
  const post = getPostBySlug(slug)
  const related = getRelatedPosts(slug, 3)

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
            <Link href="/blog" className="text-brand mt-4 inline-block hover:underline">
              Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const categoryColors = {
    Educational: { bg: 'bg-brand/10', text: 'text-brand', border: 'border-brand/20' },
    Forensic: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    Compliance: { bg: 'bg-safe/10', text: 'text-safe', border: 'border-safe/20' },
  }
  const colors = categoryColors[post.category] || categoryColors.Educational

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          author: { '@type': 'Organization', name: 'ExifVoid', url: 'https://exifvoid.com' },
          publisher: { '@type': 'Organization', name: 'ExifVoid', logo: { '@type': 'ImageObject', url: 'https://exifvoid.com/logo.png' } },
          mainEntityOfPage: { '@type': 'WebPage', '@id': `https://exifvoid.com/blog/${post.slug}` },
          articleSection: post.category,
        }) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://exifvoid.com' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://exifvoid.com/blog' },
            { '@type': 'ListItem', position: 3, name: post.title, item: `https://exifvoid.com/blog/${post.slug}` },
          ],
        }) }}
      />
      <Navbar />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            All articles
          </Link>

          {/* Article header */}
          <header className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                {post.category}
              </span>
              <span className="text-xs text-muted">{formatDate(post.date)}</span>
              <span className="text-xs text-muted">·</span>
              <span className="text-xs text-muted">{post.readTime}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight leading-tight">
              {post.title}
            </h1>

            <p className="text-muted mt-3 text-base sm:text-lg leading-relaxed">
              {post.description}
            </p>

            {/* Divider */}
            <div className="mt-6 border-b border-border" />
          </header>

          {/* Article body */}
          <div className="animate-fade-in-up-delay-1">
            {renderContent(post.content)}
          </div>

          {/* CTA box */}
          <div className="mt-10 rounded-xl border border-brand/20 bg-brand/5 p-6 animate-fade-in-up-delay-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Protect your photos now</h3>
                <p className="text-sm text-muted mt-0.5">Scan and remove metadata — free, private, instant.</p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Try ExifVoid
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12 animate-fade-in-up-delay-3">
              <h3 className="text-lg font-semibold text-foreground mb-4">Related Articles</h3>
              <div className="space-y-3">
                {related.map(rp => {
                  const rc = categoryColors[rp.category] || categoryColors.Educational
                  return (
                    <Link
                      key={rp.slug}
                      href={`/blog/${rp.slug}`}
                      className="block rounded-xl border border-border p-4 hover:border-brand/30 hover:bg-surface/50 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${rc.bg} ${rc.text} ${rc.border}`}>
                          {rp.category}
                        </span>
                        <span className="text-xs text-muted">{rp.readTime}</span>
                      </div>
                      <h4 className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                        {rp.title}
                      </h4>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </>
  )
}

/**
 * Render blog content with basic formatting
 * Supports **bold**, paragraphs, headings, and internal link detection
 */
function renderContent(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim())
  let inFaq = false

  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim()

        // Heading (starts with **)
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          const text = trimmed.slice(2, -2)

          // Detect FAQ section
          if (text.toLowerCase().includes('frequently asked')) {
            inFaq = true
            return (
              <h2 key={idx} className="text-lg font-semibold text-foreground mt-8 mb-3">
                {text}
              </h2>
            )
          }

          // FAQ question (bold heading after FAQ section start)
          if (inFaq) {
            return (
              <h3 key={idx} className="text-[15px] font-semibold text-foreground mt-4 mb-1">
                {text}
              </h3>
            )
          }

          return (
            <h2 key={idx} className="text-lg font-semibold text-foreground mt-6 mb-2">
              {text}
            </h2>
          )
        }

        // FAQ answer paragraph (slightly different styling)
        if (inFaq && !trimmed.startsWith('**')) {
          return (
            <p key={idx} className="text-[15px] text-muted leading-relaxed ml-0">
              {renderInlineFormatting(trimmed)}
            </p>
          )
        }

        // Regular paragraph with inline bold and link support
        return (
          <p key={idx} className="text-[15px] text-muted leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

/**
 * Internal link mapping — maps natural language phrases to blog slugs
 */
const internalLinks = {
  'EXIF vs XMP vs IPTC': '/blog/exif-vs-xmp-vs-iptc-metadata-explained',
  'which platforms strip metadata': '/blog/do-social-media-platforms-strip-metadata',
  'which social media platforms strip metadata': '/blog/do-social-media-platforms-strip-metadata',
  'social media metadata guide': '/blog/do-social-media-platforms-strip-metadata',
  'social media platform guide': '/blog/do-social-media-platforms-strip-metadata',
  'whether metadata can be used to track you': '/blog/can-metadata-be-used-to-track-you',
  'GDPR photo metadata': '/blog/gdpr-photo-metadata-what-businesses-need-to-know',
  'GDPR and photo metadata': '/blog/gdpr-photo-metadata-what-businesses-need-to-know',
  'C2PA and Content Credentials': '/blog/ai-image-provenance-c2pa-and-metadata-future',
  'photo privacy tips for online dating': '/blog/photo-privacy-tips-for-online-dating',
  'eBay seller guide': '/blog/how-to-remove-metadata-before-selling-on-ebay',
  'removing metadata before selling on eBay': '/blog/how-to-remove-metadata-before-selling-on-ebay',
  'iPhone guide': '/blog/how-to-remove-location-data-from-iphone-photos',
  'iPhone': '/blog/how-to-remove-location-data-from-iphone-photos',
  'Android guide': '/blog/how-to-remove-metadata-from-android-photos',
  'Android': '/blog/how-to-remove-metadata-from-android-photos',
  'Windows guide': '/blog/how-to-remove-metadata-from-photos-on-windows',
  'Windows': '/blog/how-to-remove-metadata-from-photos-on-windows',
  'Mac guide': '/blog/how-to-remove-metadata-from-photos-on-mac',
  'Mac': '/blog/how-to-remove-metadata-from-photos-on-mac',
  'how to check if your photos have metadata': '/blog/how-to-check-if-your-photos-have-metadata',
}

/**
 * Render inline formatting: **bold** and internal links
 * Internal links are detected by matching phrases from the internalLinks map
 * when preceded by "our guide to", "our article on", "see our", etc.
 */
function renderInlineFormatting(text) {
  // First handle bold
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-foreground font-medium">
          {part.slice(2, -2)}
        </strong>
      )
    }

    // Check for internal link phrases in non-bold text
    return renderWithLinks(part, i)
  })
}

/**
 * Detect and render internal links within text
 */
function renderWithLinks(text, keyPrefix) {
  // Sort link phrases by length (longest first) to match greedily
  const phrases = Object.keys(internalLinks).sort((a, b) => b.length - a.length)

  // Try to find the first matching phrase
  for (const phrase of phrases) {
    const lowerText = text.toLowerCase()
    const lowerPhrase = phrase.toLowerCase()
    const idx = lowerText.indexOf(lowerPhrase)

    if (idx !== -1) {
      // Only link contextual references (preceded by "our", "see our", "the", "full", etc.)
      const before = text.substring(0, idx)
      const match = text.substring(idx, idx + phrase.length)
      const after = text.substring(idx + phrase.length)

      // Check if preceded by a linking phrase
      const linkContext = /(?:our (?:guide to |article on |full )?|see our |the |for |our )$/i.test(before)

      if (linkContext) {
        return (
          <span key={keyPrefix}>
            {before}
            <a href={internalLinks[phrase]} className="text-brand hover:underline">
              {match}
            </a>
            {renderWithLinks(after, `${keyPrefix}-after`)}
          </span>
        )
      }
    }
  }

  return text
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
