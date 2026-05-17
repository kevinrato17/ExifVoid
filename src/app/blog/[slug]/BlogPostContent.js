'use client'

import Link from 'next/link'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { POSTS } from '../../../lib/blogData'

export default function BlogPostContent({ slug }) {
  const post = POSTS.find((p) => p.slug === slug)
  const related = POSTS.filter(
    (p) => p.slug !== slug && p.category === post?.category
  ).slice(0, 3)

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <article className="max-w-2xl mx-auto px-4 py-12">

          {/* Meta row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-surface text-muted border border-border">
              {post.category}
            </span>
            <span className="text-sm text-muted">
              {formatDate(post.date)} · {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-base text-muted leading-relaxed mb-8 pb-8 border-b border-border">
            {post.description}
          </p>

          {/* Body */}
          <div className="space-y-5">
            {renderContent(post.content)}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 rounded-xl bg-surface border border-border text-center">
            <p className="text-sm font-semibold text-foreground mb-1">
              Check your photos for hidden metadata
            </p>
            <p className="text-sm text-muted mb-4">
              Free, instant, and 100% in your browser. No upload. No account.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Scan a Photo Free →
            </Link>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                Related Articles
              </p>
              <div className="space-y-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block p-4 rounded-lg border border-border hover:border-brand/40 hover:bg-surface transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <p className="text-xs text-muted mt-0.5">{p.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>
      <Footer />
    </>
  )
}

// ---------------------------------------------------------------------------
// Content renderer
// Handles: ## H2, ### H3, | tables |, numbered lists, bullet lists,
//          **bold**, [text](url) links, plain paragraphs
// ---------------------------------------------------------------------------

function renderContent(content) {
  const blocks = content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean)
  return blocks.map((block, idx) => renderBlock(block, idx))
}

function renderBlock(block, idx) {
  // ## H2
  if (block.startsWith('## ')) {
    return (
      <h2 key={idx} className="text-xl font-bold text-foreground mt-10 mb-1 leading-snug">
        {renderInline(block.slice(3).trim())}
      </h2>
    )
  }

  // ### H3
  if (block.startsWith('### ')) {
    return (
      <h3 key={idx} className="text-base font-semibold text-foreground mt-6 mb-1">
        {renderInline(block.slice(4).trim())}
      </h3>
    )
  }

  const lines = block.split('\n')

  // Table — lines that start with |
  if (lines.length >= 2 && lines[0].startsWith('|') && lines[1].startsWith('|')) {
    return renderTable(lines, idx)
  }

  // Numbered list
  if (/^\d+\.\s/.test(lines[0])) {
    return (
      <ol key={idx} className="list-decimal list-outside ml-5 space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="text-[15px] text-muted leading-relaxed pl-1">
            {renderInline(line.replace(/^\d+\.\s*/, ''))}
          </li>
        ))}
      </ol>
    )
  }

  // Bullet list
  if (/^[*-]\s/.test(lines[0])) {
    return (
      <ul key={idx} className="list-disc list-outside ml-5 space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="text-[15px] text-muted leading-relaxed pl-1">
            {renderInline(line.replace(/^[*-]\s*/, ''))}
          </li>
        ))}
      </ul>
    )
  }

  // Default paragraph (join soft-wrapped lines)
  return (
    <p key={idx} className="text-[15px] text-muted leading-relaxed">
      {renderInline(lines.join(' '))}
    </p>
  )
}

function renderTable(lines, idx) {
  const isSeparator = (l) => /^\|[-| :]+\|?$/.test(l)
  const dataRows = lines.filter((l) => !isSeparator(l))
  if (dataRows.length === 0) return null

  const parseRow = (line) =>
    line.split('|').map((c) => c.trim()).filter((c) => c !== '')

  const [headerRow, ...bodyRows] = dataRows

  return (
    <div key={idx} className="overflow-x-auto my-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            {parseRow(headerRow).map((cell, i) => (
              <th key={i} className="text-left py-2 px-3 font-semibold text-foreground text-xs uppercase tracking-wide">
                {renderInline(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr key={ri} className="border-b border-border/50 hover:bg-surface/50 transition-colors">
              {parseRow(row).map((cell, ci) => (
                <td key={ci} className="py-2.5 px-3 text-muted align-top">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Handles **bold** and [text](url) inline
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const [, label, href] = linkMatch
      return href.startsWith('http') ? (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
          {label}
        </a>
      ) : (
        <Link key={i} href={href} className="text-brand hover:underline">
          {label}
        </Link>
      )
    }
    return part
  })
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
