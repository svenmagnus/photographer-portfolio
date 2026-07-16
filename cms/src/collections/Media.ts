import type { CollectionConfig } from 'payload'

import { getMediaPreviewUrl } from '@/lib/mediaPreviewUrl'
import { isVercelBlobConfigured } from '@/lib/vercelBlob'

const useVercelBlob = isVercelBlobConfigured()
const isVercel = process.env.VERCEL === '1'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'updatedAt'],
    description:
      'Alle hochgeladenen Dateien. Zum Löschen: Zeile anklicken → unten „Delete“ — oder mehrere markieren und „Delete“.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    ...(useVercelBlob || isVercel
      ? { disableLocalStorage: true }
      : { staticDir: 'media' }),
    bulkUpload: true,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 480,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 82 },
        },
      },
      {
        // ~2x typical grid cell width for sharp retina tiles without shipping full originals
        name: 'grid',
        width: 1200,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: { quality: 82 },
        },
      },
      {
        name: 'fullscreen',
        width: 2400,
        position: 'centre',
        withoutEnlargement: true,
        formatOptions: {
          format: 'webp',
          options: { quality: 85 },
        },
      },
    ],
    adminThumbnail: ({ doc }) => getMediaPreviewUrl(doc) || '',
    focalPoint: true,
    crop: false,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
