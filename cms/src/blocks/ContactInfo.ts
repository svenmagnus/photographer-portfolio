import type { Block } from 'payload'

export const ContactInfoBlock: Block = {
  slug: 'contactInfo',
  labels: {
    singular: 'Kontakt-Infos',
    plural: 'Kontakt-Infos',
  },
  fields: [
    {
      name: 'showSocial',
      type: 'checkbox',
      defaultValue: true,
      label: 'Social-Media-Links anzeigen',
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
