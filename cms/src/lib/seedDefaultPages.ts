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
        blockType: 'contactInfo',
        showSocial: true,
        align: 'center',
      },
      {
        blockType: 'richText',
        width: 'narrow',
        content: lexicalParagraphs(
          'Für Anfragen zu Aufträgen, Prints oder Publikationen erreichst du mich per E-Mail.',
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
