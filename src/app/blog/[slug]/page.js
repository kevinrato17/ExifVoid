import BlogPostContent from './BlogPostContent'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '../../../lib/blogData'

export const dynamic = 'force-static'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: 'Post Not Found — ExifVoid' }
  return {
    title: `${post.title} — ExifVoid`,
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
  const post = getPostBySlug(params.slug)
  const related = getRelatedPosts(params.slug, 3)
  return <BlogPostContent post={post} related={related} />
}
