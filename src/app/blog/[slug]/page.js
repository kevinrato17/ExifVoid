import BlogPostContent from './BlogPostContent'
import { POSTS } from '../../../lib/blogData'

export function generateStaticParams() {
  return POSTS.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }) {
  const post = POSTS.find(p => p.slug === params.slug)
  if (!post) return { title: 'Post Not Found — ExifVoid' }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: `https://exifvoid.com/blog/${post.slug}`,
      siteName: 'ExifVoid',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://exifvoid.com/blog/${post.slug}`,
    },
  }
}

export default function BlogPostPage({ params }) {
  return <BlogPostContent slug={params.slug} />
}
