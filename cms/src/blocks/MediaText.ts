import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: {
    singular: 'Bild + Text',
    plural: 'Bild + Text',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Bild',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Text',
      editor: lexicalEditor(),
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'imageLeft',
      label: 'Anordnung',
      options: [
        { label: 'Bild links, Text rechts', value: 'imageLeft' },
        { label: 'Bild rechts, Text links', value: 'imageRight' },
        { label: 'Bild oben, Text unten', value: 'stacked' },
      ],
    },
    {
      name: 'imageWidth',
      type: 'select',
      defaultValue: 'half',
      label: 'Bildbreite',
      options: [
        { label: 'Hälfte', value: 'half' },
        { label: 'Drittel', value: 'third' },
        { label: 'Zwei Drittel', value: 'twoThirds' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout !== 'stacked',
      },
    },
  ],
}
