import type { Field } from 'payload'

import { PHOTO_CATEGORIES } from '@/collections/Photos'

export const menuLinkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    label: 'Anzeigename',
  },
  {
    name: 'linkType',
    type: 'select',
    required: true,
    defaultValue: 'page',
    label: 'Link-Typ',
    options: [
      { label: 'CMS-Seite', value: 'page' },
      { label: 'Galerie-Kategorie', value: 'category' },
      { label: 'Externer Link', value: 'external' },
    ],
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    label: 'Seite',
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'page',
    },
  },
  {
    name: 'category',
    type: 'select',
    label: 'Kategorie',
    options: [...PHOTO_CATEGORIES],
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'category',
    },
  },
  {
    name: 'url',
    type: 'text',
    label: 'URL',
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'external',
      description: 'Vollständige URL oder Pfad, z. B. /store',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    defaultValue: false,
    label: 'In neuem Tab öffnen',
  },
]

export const menuItemFields: Field[] = [
  ...menuLinkFields,
  {
    name: 'children',
    type: 'array',
    label: 'Unterpunkte',
    fields: [...menuLinkFields],
  },
]
