'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="ExifVoid"
            className="w-8 h-8 rounded-md"
          />
          <span className="text-lg font-semibold text-foreground tracking-tight">
            Exif<span className="text-brand">Void</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            className="hidden sm:inline-flex px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="hidden sm:inline-flex px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <div className="hidden sm:block w-px h-5 bg-border" />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
