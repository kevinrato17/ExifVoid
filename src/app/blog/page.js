import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getAllPosts, getCategories } from '../../lib/blogData'

export const metadata = {
  title: 'Photo Privacy & Metadata Guide — ExifVoid Blog',
  description: 'Everything you need to know about photo metadata, digital privacy, and protecting your personal information online.',
  alternates: { canonical: 'https://exifvoid.com/blog' },
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getCategories()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12">

          <Link href="/" className="text-sm text-muted hover:text-brand transition-colors mb-8 inline-block">
            ← Back to tool
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy & Metadata Guide</h1>
          <p className="text-muted mb-8">
            Everything you need to know about photo metadata, digital privacy, and protecting your personal information online.
          </p>

          {/* Category filter — visual only, JS-free static version */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['All', ...categories].map((cat) => (
              <span
                key={cat}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="space-y-px">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block py-5 border-b border-border hover:border-brand/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-muted">{post.category}</span>
                  <span className="text-muted/40">·</span>
                  <span className="text-xs text-muted">{formatDate(post.date)}</span>
                  <span className="text-muted/40">·</span>
                  <span className="text-xs text-muted">{post.readTime}</span>
                </div>
                <h2 className="text-base font-semibold text-foreground group-hover:text-brand transition-colors mb-1">
                  {post.title}
                </h2>
                <p className="text-sm text-muted leading-relaxed">{post.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-16 p-6 rounded-xl bg-surface border border-border text-center">
            <p className="text-sm font-semibold text-foreground mb-1">Ready to protect your photos?</p>
            <p className="text-sm text-muted mb-4">Scan and clean metadata from your images — free, private, and instant.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
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
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
