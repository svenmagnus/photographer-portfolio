import type { CollectionConfig } from 'payload'

import { pageBlocks } from '@/blocks'

export const PAGE_TYPES = [
  { label: 'Inhalt (Text, Bilder, Medien)', value: 'content' },
  { label: 'Galerie (Foto-Grid)', value: 'gallery' },
  { label: 'Landingpage', value: 'landing' },
  { label: 'Blog-Artikel', value: 'blog' },
] as const

export type PageType = (typeof PAGE_TYPES)[number]['value']

const galleryBlocks = pageBlocks.filter((block) =>
  ['heading', 'photoGrid', 'spacer'].includes(block.slug),
)

const contentBlocks = pageBlocks.filter((block) => block.slug !== 'photoGrid')

const landingBlocks = pageBlocks

const blogBlocks = pageBlocks.filter((block) =>
  ['heading', 'richText', 'mediaText', 'imageGallery', 'video', 'contactInfo', 'spacer'].includes(
    block.slug,
  ),
)

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Seite',
    plural: 'Seiten',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'pageType', 'status', 'updatedAt'],
    description:
      'Gestaltete Seiten mit Blöcken — Text, Bilder, Galerien, Videos. Analog zu Format.com „Pages“.',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-Slug',
      admin: {
        description: 'z. B. publications, contact, film-editor — wird zu /slug auf der Website',
      },
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      defaultValue: 'content',
      label: 'Seitentyp',
      options: [...PAGE_TYPES],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      label: 'Status',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'Veröffentlicht', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInNavigation',
      type: 'checkbox',
      defaultValue: false,
      label: 'In Navigation anzeigen',
      admin: {
        position: 'sidebar',
        description: 'Alternativ: Navigation unter Website-Einstellungen pflegen',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      label: 'Seiteninhalt',
      minRows: 1,
      blocks: pageBlocks,
      admin: {
        initCollapsed: false,
        description: 'Blöcke per Drag & Drop anordnen — Überschrift, Text, Bild+Text, Galerie, Video …',
      },
      filterOptions: ({ siblingData }) => {
        const pageType = (siblingData as { pageType?: PageType } | undefined)?.pageType

        if (pageType === 'gallery') {
          return galleryBlocks.map((block) => block.slug)
        }

        if (pageType === 'blog') {
          return blogBlocks.map((block) => block.slug)
        }

        if (pageType === 'landing') {
          return landingBlocks.map((block) => block.slug)
        }

        return contentBlocks.map((block) => block.slug)
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'SEO-Titel',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'SEO-Beschreibung',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
