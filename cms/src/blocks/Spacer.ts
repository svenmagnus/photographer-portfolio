import type { Block } from 'payload'

export const SpacerBlock: Block = {
  slug: 'spacer',
  labels: {
    singular: 'Abstand',
    plural: 'Abstände',
  },
  fields: [
    {
      name: 'size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Klein', value: 'small' },
        { label: 'Mittel', value: 'medium' },
        { label: 'Groß', value: 'large' },
      ],
    },
  ],
}
