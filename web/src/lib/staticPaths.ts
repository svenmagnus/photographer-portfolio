import type { Locale } from '../i18n/locale'
import { fetchBlogPostsForPage } from './blogPosts'
import { fetchPublishedPages } from './pages'

const FALLBACK_SLUGS = [
  'contact',
  'imprint',
  'blog',
  'model-bewerbung',
  'publications',
  'advertorial',
  'motion',
]

export async function slugStaticPaths(locale: Locale) {
  const pages = await fetchPublishedPages(locale)
  const slugs = new Set(FALLBACK_SLUGS)

  for (const page of pages) {
    if (page.slug && page.slug !== 'film-editor') slugs.add(page.slug)
  }

  return [...slugs].map((slug) => ({ params: { slug } }))
}

export async function blogPostStaticPaths(locale: Locale) {
  const pages = await fetchPublishedPages(locale)
  const blogSlugs = pages
    .filter((page) => page.pageType === 'blog' && page.slug)
    .map((page) => page.slug as string)

  const slugs = blogSlugs.length > 0 ? blogSlugs : ['blog']
  const paths: Array<{ params: { slug: string; postSlug: string } }> = []

  for (const slug of slugs) {
    const posts = await fetchBlogPostsForPage(slug, locale)
    for (const post of posts) {
      if (post.slug) {
        paths.push({ params: { slug, postSlug: post.slug } })
      }
    }
  }

  return paths
}
