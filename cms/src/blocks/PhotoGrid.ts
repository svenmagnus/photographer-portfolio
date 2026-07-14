import type { Block } from 'payload'

import { PHOTO_CATEGORIES } from '@/collections/Photos'

export const PhotoGridBlock: Block = {
  slug: 'photoGrid',
  labels: {
    singular: 'Foto-Galerie',
    plural: 'Foto-Galerien',
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Kategorie',
      options: [...PHOTO_CATEGORIES],
    },
    {
      name: 'showTitle',
      type: 'checkbox',
      defaultValue: false,
      label: 'Kategorie als Überschrift anzeigen',
    },
  ],
}
