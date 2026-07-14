import type { Block } from 'payload'

export const HeadingBlock: Block = {
  slug: 'heading',
  labels: {
    singular: 'Überschrift',
    plural: 'Überschriften',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Text',
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'h1',
      options: [
        { label: 'Groß (H1)', value: 'h1' },
        { label: 'Mittel (H2)', value: 'h2' },
      ],
    },
    {
      name: 'align',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Zentriert', value: 'center' },
        { label: 'Links', value: 'left' },
      ],
    },
  ],
}
