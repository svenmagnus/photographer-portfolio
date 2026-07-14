import type { Payload } from 'payload'

import { lexicalParagraphs } from './defaultLexical'

const DEFAULT_PAGES = [
  {
    title: 'Contact',
    slug: 'contact',
    pageType: 'content' as const,
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
] as const

export async function seedDefaultPages(payload: Payload): Promise<void> {
  try {
    await seedDefaultPagesInner(payload)
    await removeDuplicateContactInfoBlock(payload)
  } catch (error) {
    payload.logger.error(
      `Default pages seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
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
      layout: layout.filter((block) => block.blockType !== 'contactInfo'),
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
        layout: [...page.layout],
      },
    })

    payload.logger.info(`Created default page: ${page.slug}`)
  }
}
