import fs from 'fs'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }

  const frontmatter = match[1]
  const content = match[2].trim()
  const data = {}

  frontmatter.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) return
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '')
    data[key] = value
  })

  return { data, content }
}

function getPostFiles() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
}

function parsePost(filename) {
  const slug = filename.replace(/\.mdx$/, '')
  const filepath = path.join(BLOG_DIR, filename)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = parseFrontmatter(raw)
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

export const POSTS = getAllPosts()
