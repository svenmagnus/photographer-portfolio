import type { CollectionConfig } from 'payload'

import { contentLexicalEditor } from '@/lib/contentLexicalEditor'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog-Beitrag',
    plural: 'Blog-Beiträge',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featuredImage', 'blogPage', 'status', 'publishedAt', 'updatedAt'],
    description: 'Beiträge für Blog-Seiten wie Film Editor — erscheinen als Liste auf der Blog-Seite.',
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
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL-Slug',
      admin: {
        description: 'z. B. schnittakademie-berlin → /blog/schnittakademie-berlin',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Kurztext',
      localized: true,
      admin: {
        description: 'Optional — kurze Vorschau in der Blog-Liste',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Beitragsbilder',
      admin: {
        isSortable: true,
        description:
          'Mehrere Bilder möglich. Das erste erscheint in der Blog-Liste; alle werden oben im Artikel angezeigt.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Inhalt',
      editor: contentLexicalEditor,
      localized: true,
    },
    {
      name: 'blogPage',
      type: 'relationship',
      relationTo: 'pages',
      required: true,
      label: 'Blog-Seite',
      admin: {
        position: 'sidebar',
        description: 'Welche Blog-Seite diesen Beitrag anzeigt',
      },
      filterOptions: {
        pageType: {
          equals: 'blog',
        },
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
      name: 'publishedAt',
      type: 'date',
      label: 'Veröffentlicht am',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'SEO-Titel',
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'SEO-Beschreibung',
      localized: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
