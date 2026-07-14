import type { GlobalConfig } from 'payload'

import { menuItemFields } from '@/lib/menuItemFields'

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: 'Menü',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Website',
    description: 'Hauptnavigation der Website — Seiten links auswählen, rechts sortieren.',
    components: {
      views: {
        edit: {
          default: {
            Component: '/components/MenuBuilder/MenuBuilderView#MenuBuilderView',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menüpunkte',
      admin: {
        hidden: true,
      },
      fields: menuItemFields,
    },
  ],
}
