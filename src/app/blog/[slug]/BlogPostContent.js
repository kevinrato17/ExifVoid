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
 * Supports **bold**, paragraphs, and headings
 */
function renderContent(content) {
  const paragraphs = content.split('\n\n').filter(p => p.trim())

  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        const trimmed = para.trim()

        // Heading (starts with **)
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          const text = trimmed.slice(2, -2)
          return (
            <h2 key={idx} className="text-lg font-semibold text-foreground mt-6 mb-2">
              {text}
            </h2>
          )
        }

        // Regular paragraph with inline bold support
        return (
          <p key={idx} className="text-[15px] text-muted leading-relaxed">
            {renderInlineBold(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

/**
 * Render **bold** inline text
 */
function renderInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-foreground font-medium">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
