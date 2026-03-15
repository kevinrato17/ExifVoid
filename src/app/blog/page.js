'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getAllPosts, getCategories } from '../../lib/blogData'

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = ['All', ...getCategories()]
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const categoryColors = {
    Educational: { bg: 'bg-brand/10', text: 'text-brand', border: 'border-brand/20' },
    Forensic: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    Compliance: { bg: 'bg-safe/10', text: 'text-safe', border: 'border-safe/20' },
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

          {/* Header */}
          <div className="mb-8 sm:mb-10 animate-fade-in-up">
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
              Privacy & Metadata Guide
            </h1>
            <p className="text-muted mt-3 text-base sm:text-lg leading-relaxed">
              Everything you need to know about photo metadata, digital privacy, and protecting your personal information online.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up-delay-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${activeCategory === cat
                    ? 'bg-brand text-white'
                    : 'bg-surface text-muted hover:text-foreground border border-border'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          <div className="space-y-4 animate-fade-in-up-delay-2">
            {filtered.map((post) => {
              const colors = categoryColors[post.category] || categoryColors.Educational

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <article className="rounded-xl border border-border bg-surface/30 p-5 sm:p-6 hover:border-brand/30 hover:bg-surface/60 transition-all duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Category + date row */}
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={`
                            px-2 py-0.5 rounded text-[11px] font-medium border
                            ${colors.bg} ${colors.text} ${colors.border}
                          `}>
                            {post.category}
                          </span>
                          <span className="text-xs text-muted">{formatDate(post.date)}</span>
                          <span className="text-xs text-muted">·</span>
                          <span className="text-xs text-muted">{post.readTime}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-semibold text-foreground group-hover:text-brand transition-colors leading-snug">
                          {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0 mt-1 text-muted group-hover:text-brand transition-all group-hover:translate-x-0.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted">No articles in this category yet.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 rounded-xl border border-brand/20 bg-brand/5 p-6 text-center animate-fade-in-up-delay-3">
            <h3 className="text-lg font-semibold text-foreground">Ready to protect your photos?</h3>
            <p className="text-sm text-muted mt-1">Scan and clean metadata from your images — free, private, and instant.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Try ExifVoid
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
