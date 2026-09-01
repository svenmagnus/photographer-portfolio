import type { Locale } from '../i18n/locale'
import { withLocaleParam } from '../i18n/locale'
import type { Media } from './photoLoader'
import { cmsFetchJson } from './cmsFetch'

export interface BlogPost {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  content: Record<string, unknown>
  status: 'draft' | 'published'
  publishedAt?: string | null
  featuredImage?: Media | Media[] | number | number[] | null
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

function getPostSortTime(post: BlogPost): number {
  const published = post.publishedAt ? Date.parse(post.publishedAt) : Number.NaN
  if (!Number.isNaN(published)) return published
  return typeof post.id === 'number' ? post.id : 0
}

export function sortBlogPostsNewestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => getPostSortTime(b) - getPostSortTime(a))
}

export async function fetchBlogPostsForPage(blogPageSlug: string, locale: Locale = 'de'): Promise<BlogPost[]> {
  const pageParams = withLocaleParam(
    new URLSearchParams({
      depth: '0',
      limit: '1',
      'where[slug][equals]': blogPageSlug,
      'where[pageType][equals]': 'blog',
      'where[status][equals]': 'published',
    }),
    locale,
  )

  const pageData = await cmsFetchJson<{ docs: Array<{ id: string | number }> }>(
    `/api/pages?${pageParams.toString()}`,
  )
  const pageId = pageData?.docs?.[0]?.id
  if (pageId == null) return []

  const postParams = withLocaleParam(
    new URLSearchParams({
      depth: '2',
      limit: '100',
      sort: '-publishedAt',
      'where[status][equals]': 'published',
      'where[blogPage][equals]': String(pageId),
    }),
    locale,
  )

  const data = await cmsFetchJson<BlogPostsResponse>(`/api/blog-posts?${postParams.toString()}`)
  return sortBlogPostsNewestFirst(data?.docs ?? [])
}

export async function fetchBlogPost(
  blogPageSlug: string,
  postSlug: string,
  locale: Locale = 'de',
): Promise<BlogPost | null> {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: '2',
      limit: '1',
      'where[slug][equals]': postSlug,
      'where[status][equals]': 'published',
      'where[blogPage.slug][equals]': blogPageSlug,
    }),
    locale,
  )

  const data = await cmsFetchJson<BlogPostsResponse>(`/api/blog-posts?${params.toString()}`)
  return data?.docs?.[0] ?? null
}
