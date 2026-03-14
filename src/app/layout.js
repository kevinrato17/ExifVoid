import './globals.css'

export const metadata = {
  title: 'ExifVoid — Remove Photo Metadata Privately',
  description: 'Strip EXIF data, GPS coordinates, and hidden metadata from your photos. 100% client-side processing — your files never leave your device.',
  keywords: 'EXIF remover, metadata remover, photo privacy, GPS removal, client-side, privacy tool',
  openGraph: {
    title: 'ExifVoid — Remove Photo Metadata Privately',
    description: 'Strip EXIF data, GPS coordinates, and hidden metadata from your photos. 100% client-side.',
    url: 'https://exifvoid.com',
    siteName: 'ExifVoid',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExifVoid — Remove Photo Metadata Privately',
    description: 'Your files never leave your device. 100% browser-based metadata removal.',
  },
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ExifVoid',
    url: 'https://exifvoid.com',
    logo: 'https://exifvoid.com/logo.png',
    description: 'Privacy-first photo metadata removal tool. 100% client-side processing.',
    sameAs: [],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ExifVoid',
    url: 'https://exifvoid.com',
    description: 'Strip EXIF data, GPS coordinates, and hidden metadata from your photos entirely in your browser.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://exifvoid.com/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="canonical" href="https://exifvoid.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
