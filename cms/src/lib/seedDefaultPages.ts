import type { Payload } from 'payload'

import { PHOTO_CATEGORIES } from '@/collections/Photos'
import { lexicalParagraphs } from './defaultLexical'

/** Gallery pages on the homepage — the blog lives at /blog instead. */
const GALLERY_PAGE_CATEGORIES = PHOTO_CATEGORIES.filter((category) => category.value !== 'film-editor')
const GALLERY_COUNT = GALLERY_PAGE_CATEGORIES.length
const BLOG_PAGE_SLUG = 'blog'
const LEGACY_BLOG_PAGE_SLUG = 'film-editor'
const BLOG_NAV_ORDER =
  PHOTO_CATEGORIES.findIndex((category) => category.value === 'film-editor') + 1

const DEFAULT_PAGES = [
  {
    title: 'Contact',
    slug: 'contact',
    pageType: 'content' as const,
    navOrder: GALLERY_COUNT + 3,
    layout: [
      {
        blockType: 'heading',
        text: 'Contact',
        level: 'h1',
        align: 'center',
      },
      {
        blockType: 'contactForm',
        showPhone: true,
        showEmail: true,
        submitLabel: 'Send Message',
        successMessage: 'Thank you — your message has been sent.',
        intro: lexicalParagraphs(
          "I'm available for local projects as well as potential employment opportunities. Use the form to inquire about rates and availability, or just to say hi.",
        ),
      },
    ],
  },
  {
    title: 'Imprint',
    slug: 'imprint',
    pageType: 'content' as const,
    navOrder: GALLERY_COUNT + 1,
    layout: [
      {
        blockType: 'heading',
        text: 'Imprint',
        level: 'h1',
        align: 'left',
      },
      {
        blockType: 'richText',
        width: 'narrow',
        content: lexicalParagraphs(
          'Angaben gemäß § 5 TMG',
          'Sven Magnus Hanefeld — Photographer',
          'Kontakt: info@svenmagnus.com',
          'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Sven Magnus Hanefeld',
        ),
      },
    ],
  },
  {
    title: 'Store',
    slug: 'store',
    pageType: 'content' as const,
    navOrder: GALLERY_COUNT + 2,
    layout: [
      {
        blockType: 'heading',
        text: 'Store',
        level: 'h1',
        align: 'center',
      },
      {
        blockType: 'richText',
        width: 'narrow',
        content: lexicalParagraphs(
          'Prints und Limited Editions — Inhalte und Links kannst du hier im CMS bearbeiten.',
        ),
      },
    ],
  },
  {
    title: 'Blog',
    slug: BLOG_PAGE_SLUG,
    pageType: 'blog' as const,
    navOrder: BLOG_NAV_ORDER,
    layout: [
      {
        blockType: 'heading',
        text: 'Blog',
        level: 'h1',
        align: 'center',
      },
    ],
  },
] as const

export async function seedDefaultPages(payload: Payload): Promise<void> {
  try {
    await seedDefaultPagesInner(payload)
    await seedGalleryPages(payload)
    await ensureBlogPage(payload)
    await syncContentPageNavigation(payload)
    await removeDuplicateContactInfoBlock(payload)
  } catch (error) {
    payload.logger.error(
      `Default pages seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

async function seedGalleryPages(payload: Payload): Promise<void> {
  for (const [index, category] of GALLERY_PAGE_CATEGORIES.entries()) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: category.value } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) continue

    await payload.create({
      collection: 'pages',
      data: {
        title: category.label,
        slug: category.value,
        pageType: 'gallery',
        galleryCategory: category.value,
        status: 'published',
        showInNavigation: true,
        navOrder: index + 1,
        layout: [
          {
            blockType: 'photoGrid',
            category: category.value,
            showTitle: false,
          },
        ],
      },
    })

    payload.logger.info(`Created gallery page: ${category.value}`)
  }
}

async function ensureBlogPage(payload: Payload): Promise<void> {
  const blogPage = DEFAULT_PAGES.find((page) => page.slug === BLOG_PAGE_SLUG)
  if (!blogPage) return

  const [existingBlog, legacyBlog] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: BLOG_PAGE_SLUG } },
      limit: 1,
      depth: 0,
    }),
    payload.find({
      collection: 'pages',
      where: { slug: { equals: LEGACY_BLOG_PAGE_SLUG } },
      limit: 1,
      depth: 0,
    }),
  ])

  let doc = existingBlog.docs[0]

  if (!doc && legacyBlog.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: legacyBlog.docs[0].id,
      data: {
        slug: BLOG_PAGE_SLUG,
        pageType: 'blog',
        galleryCategory: null,
        showInNavigation: true,
        navOrder: blogPage.navOrder,
      },
    })
    payload.logger.info(`Renamed blog page slug: ${LEGACY_BLOG_PAGE_SLUG} → ${BLOG_PAGE_SLUG}`)
    return
  }

  if (!doc) {
    await payload.create({
      collection: 'pages',
      data: {
        title: blogPage.title,
        slug: blogPage.slug,
        pageType: blogPage.pageType,
        status: 'published',
        showInNavigation: true,
        navOrder: blogPage.navOrder,
        layout: [...blogPage.layout],
      },
    })
    payload.logger.info(`Created blog page: ${BLOG_PAGE_SLUG}`)
    return
  }

  const layout = Array.isArray(doc.layout) ? (doc.layout as Array<{ blockType?: string }>) : []
  const isDefaultGalleryLayout =
    doc.pageType === 'gallery' &&
    layout.length === 1 &&
    layout[0]?.blockType === 'photoGrid'

  const needsUpdate =
    doc.pageType !== 'blog' ||
    doc.galleryCategory != null ||
    doc.showInNavigation !== true ||
    doc.navOrder !== blogPage.navOrder ||
    isDefaultGalleryLayout

  if (!needsUpdate) return

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: {
      pageType: 'blog',
      galleryCategory: null,
      showInNavigation: true,
      navOrder: blogPage.navOrder,
      ...(isDefaultGalleryLayout ? { layout: [...blogPage.layout] } : {}),
    },
  })

  payload.logger.info(`Updated ${BLOG_PAGE_SLUG} page to blog type`)
}

async function syncContentPageNavigation(payload: Payload): Promise<void> {
  for (const page of DEFAULT_PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
    })

    const doc = existing.docs[0]
    if (!doc) continue

    const needsUpdate =
      doc.showInNavigation !== true ||
      doc.navOrder !== page.navOrder ||
      doc.pageType !== page.pageType

    if (!needsUpdate) continue

    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: {
        showInNavigation: true,
        navOrder: page.navOrder,
        pageType: page.pageType,
      },
    })
  }
}

/** contactForm already shows email — drop legacy contactInfo on the contact page. */
async function removeDuplicateContactInfoBlock(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'contact' } },
    limit: 1,
    depth: 0,
  })

  const page = existing.docs[0]
  if (!page || !Array.isArray(page.layout)) return

  const layout = page.layout as Array<{ blockType?: string }>
  const hasContactForm = layout.some((block) => block.blockType === 'contactForm')
  const hasContactInfo = layout.some((block) => block.blockType === 'contactInfo')

  if (!hasContactForm || !hasContactInfo) return

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: {
      layout: layout.filter((block) => block.blockType !== 'contactInfo') as typeof page.layout,
    },
  })

  payload.logger.info('Removed duplicate contactInfo block from contact page')
}

async function seedDefaultPagesInner(payload: Payload): Promise<void> {
  for (const page of DEFAULT_PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) continue

    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        status: 'published',
        showInNavigation: true,
        navOrder: page.navOrder,
        layout: [...page.layout],
      },
    })

    payload.logger.info(`Created default page: ${page.slug}`)
  }
}
