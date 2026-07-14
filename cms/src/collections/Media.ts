import type { CollectionConfig } from 'payload'

import { getMediaPreviewUrl } from '@/lib/mediaPreviewUrl'
import { isVercelBlobConfigured } from '@/lib/vercelBlob'

const useVercelBlob = isVercelBlobConfigured()
const isVercel = process.env.VERCEL === '1'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
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
        },
      },
      {
        name: 'grid',
        width: 800,
        position: 'centre',
        formatOptions: {
          format: 'webp',
        },
      },
      {
        name: 'fullscreen',
        width: 2400,
        position: 'centre',
        formatOptions: {
          format: 'webp',
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
