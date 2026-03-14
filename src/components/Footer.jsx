'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ExifVoid" className="w-5 h-5 rounded" />
            <span className="text-sm text-muted">
              ExifVoid — Your files never leave your device.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <span className="text-border">·</span>
            <Link href="/about" className="hover:text-foreground transition-colors">
              How It Works
            </Link>
            <span className="text-border">·</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
