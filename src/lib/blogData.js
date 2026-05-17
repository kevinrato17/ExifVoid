import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

function getPostFiles() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
}

function parsePost(filename) {
  const slug = filename.replace(/\.mdx$/, '')
  const filepath = path.join(BLOG_DIR, filename)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'Educational',
    date: data.date || '',
    readTime: data.readTime || '5 min read',
    content,
  }
}

export function getAllPosts() {
  return getPostFiles()
    .map(parsePost)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getPostBySlug(slug) {
  const filename = `${slug}.mdx`
  const filepath = path.join(BLOG_DIR, filename)
  if (!fs.existsSync(filepath)) return null
  return parsePost(filename)
}

export function getRelatedPosts(slug, limit = 3) {
  const current = getPostBySlug(slug)
  if (!current) return []
  return getAllPosts()
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit)
}

// Keep POSTS export for any pages that still use it directly
export const POSTS = getAllPosts()
