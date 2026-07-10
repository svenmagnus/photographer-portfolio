import type { CollectionConfig } from 'payload'

export const PHOTO_CATEGORIES = [
  { label: 'Hollywood', value: 'hollywood' },
  { label: 'Fashion Clicks', value: 'fashion-clicks' },
  { label: 'Black & White', value: 'black-white' },
  { label: 'Beauty Pics', value: 'beauty-pics' },
  { label: 'Runway', value: 'runway' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
  { label: 'Alaïa Collection', value: 'alaia-collection' },
  { label: 'Advertorial', value: 'advertorial' },
  { label: 'Film Editor', value: 'film-editor' },
  { label: 'Motion', value: 'motion' },
  { label: 'Insta', value: 'insta' },
  { label: 'Publications', value: 'publications' },
] as const

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number]['value']

export const Photos: CollectionConfig = {
  slug: 'photos',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'updatedAt'],
    description: 'Einzelne Fotos bearbeiten oder ganze Ordner unter „Ordner-Import“ hochladen.',
    components: {
      beforeListTable: ['/components/BulkImport/BulkImportLink#BulkImportLink'],
      views: {
        bulkImport: {
          Component: '/components/BulkImport/BulkImportView#BulkImportView',
          path: '/bulk-import',
          exact: true,
        },
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [...PHOTO_CATEGORIES],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Große Darstellung im Grid (2 Zeilen hoch)',
        position: 'sidebar',
      },
    },
  ],
}
