import './globals.css'
import Script from 'next/script'

export const metadata = {
  metadataBase: new URL('https://exifvoid.com'),
  title: {
    default: 'ExifVoid — Free Online EXIF Data Remover | Batch Remove Photo Metadata',
    template: '%s — ExifVoid',
  },
  description: 'Free online EXIF remover and metadata scanner. Batch process up to 10 images at once. Strip GPS coordinates, camera IDs, and hidden data from photos. 100% client-side — your files never leave your device.',
  keywords: 'EXIF remover, remove EXIF data online, metadata remover, photo privacy, GPS removal, strip metadata, client-side, photo metadata remover, remove photo metadata free, batch EXIF removal, bulk metadata remover',
  openGraph: {
    title: 'ExifVoid — Free Online EXIF Data Remover | Batch Processing',
    description: 'Strip EXIF data, GPS coordinates, and hidden metadata from up to 10 photos at once. 100% client-side processing.',
    url: 'https://exifvoid.com',
    siteName: 'ExifVoid',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ExifVoid — Free Online EXIF Data Remover',
    description: 'Batch process up to 10 photos at once. Your files never leave your device. 100% browser-based metadata removal.',
  },
  alternates: {
    canonical: 'https://exifvoid.com',
  },
}

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ExifVoid',
    url: 'https://exifvoid.com',
    logo: 'https://exifvoid.com/logo.png',
    description: 'Privacy-first photo metadata removal tool. Batch process up to 10 images. 100% client-side processing.',
    sameAs: [],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ExifVoid',
    url: 'https://exifvoid.com',
    description: 'Strip EXIF data, GPS coordinates, and hidden metadata from your photos entirely in your browser. Batch process up to 10 images at once.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://exifvoid.com/blog?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-74DYM8RS83"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-74DYM8RS83');
          `}
        </Script>
        <link rel="icon" href="/logo.png" />
        <meta name="theme-color" content="#4F46E5" />
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
