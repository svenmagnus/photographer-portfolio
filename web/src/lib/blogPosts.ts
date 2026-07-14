import type { Media } from './photoLoader'

export interface BlogPost {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  content: Record<string, unknown>
  status: 'draft' | 'published'
  publishedAt?: string | null
  featuredImage?: Media | number | null
  metaTitle?: string | null
  metaDescription?: string | null
  blogPage?: {
    id: string | number
    slug: string
    title: string
    pageType?: string
  } | number | null
}

interface BlogPostsResponse {
  docs: BlogPost[]
  totalDocs: number
}

function getPayloadUrl(): string {
  return (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')
}

function getPostSortTime(post: BlogPost): number {
  const published = post.publishedAt ? Date.parse(post.publishedAt) : Number.NaN
  if (!Number.isNaN(published)) return published
  return typeof post.id === 'number' ? post.id : 0
}

export function sortBlogPostsNewestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => getPostSortTime(b) - getPostSortTime(a))
}

export async function fetchBlogPostsForPage(blogPageSlug: string): Promise<BlogPost[]> {
  const pageParams = new URLSearchParams({
    depth: '0',
    limit: '1',
    'where[slug][equals]': blogPageSlug,
    'where[pageType][equals]': 'blog',
    'where[status][equals]': 'published',
  })

  try {
    const pageResponse = await fetch(`${getPayloadUrl()}/api/pages?${pageParams.toString()}`)
    if (!pageResponse.ok) return []

    const pageData = (await pageResponse.json()) as { docs: Array<{ id: string | number }> }
    const pageId = pageData.docs?.[0]?.id
    if (pageId == null) return []

    const postParams = new URLSearchParams({
      depth: '1',
      limit: '100',
      sort: '-publishedAt',
      'where[status][equals]': 'published',
      'where[blogPage][equals]': String(pageId),
    })

    const response = await fetch(`${getPayloadUrl()}/api/blog-posts?${postParams.toString()}`)
    if (!response.ok) return []

    const data = (await response.json()) as BlogPostsResponse
    return sortBlogPostsNewestFirst(data.docs ?? [])
  } catch (error) {
    console.warn('Blog posts API unreachable:', error)
    return []
  }
}

export async function fetchBlogPost(
  blogPageSlug: string,
  postSlug: string,
): Promise<BlogPost | null> {
  const params = new URLSearchParams({
    depth: '2',
    limit: '1',
    'where[slug][equals]': postSlug,
    'where[status][equals]': 'published',
    'where[blogPage.slug][equals]': blogPageSlug,
  })

  try {
    const response = await fetch(`${getPayloadUrl()}/api/blog-posts?${params.toString()}`)
    if (!response.ok) return null

    const data = (await response.json()) as BlogPostsResponse
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}
