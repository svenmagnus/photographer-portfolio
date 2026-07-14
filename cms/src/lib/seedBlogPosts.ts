import type { Payload } from 'payload'

import { lexicalParagraphs } from './defaultLexical'

const DEFAULT_BLOG_POSTS = [
  {
    title: 'Schnittakademie Berlin',
    slug: 'schnittakademie-berlin',
    blogPageSlug: 'blog',
    excerpt: 'Film editing academy in Berlin.',
    content: lexicalParagraphs(
      'Inhalte zu Schnittakademie Berlin — hier im CMS bearbeiten.',
    ),
  },
] as const

export async function seedBlogPosts(payload: Payload): Promise<void> {
  try {
    for (const post of DEFAULT_BLOG_POSTS) {
      const existing = await payload.find({
        collection: 'blog-posts',
        where: { slug: { equals: post.slug } },
        limit: 1,
        depth: 0,
      })

      if (existing.docs.length > 0) continue

      const blogPage = await payload.find({
        collection: 'pages',
        where: {
          or: [
            { slug: { equals: post.blogPageSlug } },
            { slug: { equals: 'film-editor' } },
          ],
        },
        limit: 1,
        depth: 0,
      })

      const page = blogPage.docs[0]
      if (!page) {
        payload.logger.warn(`Blog post seed skipped (${post.slug}): blog page not found`)
        continue
      }

      await payload.create({
        collection: 'blog-posts',
        data: {
          title: post.title,
          slug: post.slug,
          blogPage: page.id,
          status: 'published',
          publishedAt: new Date().toISOString(),
          excerpt: post.excerpt,
          content: post.content,
        },
      })

      payload.logger.info(`Created blog post: ${post.slug}`)
    }
  } catch (error) {
    payload.logger.error(
      `Blog posts seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
