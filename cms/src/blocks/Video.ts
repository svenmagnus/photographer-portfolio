import type { Block } from 'payload'

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Video / Film',
    plural: 'Videos / Filme',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'Video-URL',
      admin: {
        description: 'YouTube- oder Vimeo-Link',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Vorschaubild',
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Beschriftung',
    },
    {
      name: 'aspectRatio',
      type: 'select',
      defaultValue: '16:9',
      label: 'Seitenverhältnis',
      options: [
        { label: '16:9 (Breitbild)', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '9:16 (Hochformat)', value: '9:16' },
      ],
    },
  ],
}
