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
    title: 'Kontakt',
    slug: 'contact',
    pageType: 'content' as const,
    navOrder: GALLERY_COUNT + 3,
    layout: [
      {
        blockType: 'heading',
        text: 'Kontakt',
        level: 'h1',
        align: 'center',
      },
      {
        blockType: 'contactForm',
        showPhone: true,
        showEmail: true,
        submitLabel: 'Nachricht senden',
        successMessage: 'Vielen Dank — deine Nachricht wurde gesendet.',
        intro: lexicalParagraphs(
          'Für lokale Projekte und Anfragen bin ich erreichbar. Nutze das Formular für Preise, Verfügbarkeit — oder sag einfach Hallo.',
        ),
      },
    ],
  },
  {
    title: 'Impressum',
    slug: 'imprint',
    pageType: 'content' as const,
    navOrder: GALLERY_COUNT + 1,
    layout: [
      {
        blockType: 'heading',
        text: 'Impressum',
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
    showInNavigation: false,
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
    title: 'Model-Bewerbung',
    slug: 'model-bewerbung',
    pageType: 'content' as const,
    navOrder: GALLERY_COUNT + 4,
    showInNavigation: true,
    layout: [
      {
        blockType: 'heading',
        text: 'Model-Bewerbung',
        level: 'h1',
        align: 'center',
      },
      {
        blockType: 'modelApplicationForm',
        privacyUrl: '/datenschutz',
        submitLabel: 'Bewerbung absenden',
        successMessage: 'Vielen Dank — deine Bewerbung wurde erfolgreich gesendet.',
        intro: lexicalParagraphs(
          'Für diese Bewerbung brauchst du keine professionellen Fotos. Natürliche Polas (Polaroids / Snapshots) reichen völlig aus — aufgenommen bei Tageslicht, ohne Make-up und in schlichter Kleidung.',
          'Bitte fülle alle Pflichtfelder aus und lade deine vier Polas hoch.',
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
    await ensureModelApplicationPage(payload)
    await ensureStoreHiddenFromNavigation(payload)
    await removeDuplicateLegacyBlogPage(payload)
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

async function ensureModelApplicationPage(payload: Payload): Promise<void> {
  const modelPage = DEFAULT_PAGES.find((page) => page.slug === 'model-bewerbung')
  if (!modelPage) return

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: modelPage.slug } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs.length === 0) {
    await payload.create({
      collection: 'pages',
      data: {
        title: modelPage.title,
        slug: modelPage.slug,
        pageType: modelPage.pageType,
        status: 'published',
        showInNavigation: modelPage.showInNavigation ?? true,
        navOrder: modelPage.navOrder,
        layout: [...modelPage.layout] as never,
      },
    })
    payload.logger.info(`Created model application page: ${modelPage.slug}`)
    return
  }

  const doc = existing.docs[0]
  const layout = Array.isArray(doc.layout) ? (doc.layout as Array<{ blockType?: string }>) : []
  const hasFormBlock = layout.some((block) => block.blockType === 'modelApplicationForm')

  if (hasFormBlock) {
    if (doc.showInNavigation !== true) {
      await payload.update({
        collection: 'pages',
        id: doc.id,
        data: { showInNavigation: true },
      })
    }
    return
  }

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: {
      status: 'published',
      showInNavigation: true,
      layout: [...modelPage.layout] as never,
    },
  })

  payload.logger.info(`Updated ${modelPage.slug} page with model application form block`)
}

async function ensureStoreHiddenFromNavigation(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'store' } },
    limit: 1,
    depth: 0,
  })

  const doc = existing.docs[0]
  if (!doc || doc.showInNavigation === false) return

  await payload.update({
    collection: 'pages',
    id: doc.id,
    data: { showInNavigation: false },
  })

  payload.logger.info('Store page hidden from navigation.')
}

async function removeDuplicateLegacyBlogPage(payload: Payload): Promise<void> {
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

  const blog = existingBlog.docs[0]
  const legacy = legacyBlog.docs[0]

  if (!blog || !legacy) return

  const posts = await payload.find({
    collection: 'blog-posts',
    where: { blogPage: { equals: legacy.id } },
    limit: 200,
    depth: 0,
  })

  for (const post of posts.docs) {
    await payload.update({
      collection: 'blog-posts',
      id: post.id,
      data: { blogPage: blog.id },
    })
  }

  await payload.delete({
    collection: 'pages',
    id: legacy.id,
  })

  payload.logger.info(`Removed duplicate legacy blog page: ${LEGACY_BLOG_PAGE_SLUG}`)
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

    const needsUpdate = doc.navOrder !== page.navOrder || doc.pageType !== page.pageType

    if (!needsUpdate) continue

    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: {
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
        showInNavigation: 'showInNavigation' in page ? page.showInNavigation : true,
        navOrder: page.navOrder,
        layout: [...page.layout] as never,
      },
    })

    payload.logger.info(`Created default page: ${page.slug}`)
  }
}
