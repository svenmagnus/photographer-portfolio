import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Einstellungen',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Einstellungen',
    description:
      'Domain, Kontakt und Website-Einstellungen — analog zu Format „Settings → Domain and Email“.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Domain & Website',
          fields: [
            {
              name: 'productionDomain',
              type: 'text',
              label: 'Produktions-Domain',
              defaultValue: 'svenmagnus.com',
              admin: {
                description: 'Deine Hauptdomain ohne https://',
              },
            },
            {
              name: 'wwwEnabled',
              type: 'checkbox',
              label: 'www-Subdomain nutzen',
              defaultValue: true,
              admin: {
                description: 'www.svenmagnus.com soll ebenfalls erreichbar sein.',
              },
            },
            {
              name: 'cmsUrl',
              type: 'text',
              label: 'CMS-URL',
              defaultValue: 'https://cms.svenmagnus.com',
              admin: {
                description: 'URL des Payload-Admin (mit https://, ohne /admin).',
              },
            },
            {
              name: 'loginPath',
              type: 'text',
              label: 'Login-Pfad auf der Website',
              defaultValue: '/log-in',
              admin: {
                description: 'Öffentlicher Pfad, z. B. /log-in',
              },
            },
            {
              name: 'domainStatusNote',
              type: 'textarea',
              label: 'DNS-Notizen',
              admin: {
                readOnly: true,
                description: 'Referenz für die Strato-Konfiguration',
              },
              defaultValue:
                'Strato: Umleitung Extern deaktivieren → DNS-Tab → A-Record @ auf Vercel-IP, CNAME www + cms auf Vercel.',
            },
          ],
        },
        {
          label: 'Profil',
          fields: [
            {
              name: 'photographerName',
              type: 'text',
              label: 'Name',
              defaultValue: 'Sven Magnus Hanefeld',
            },
            {
              name: 'photographerTitle',
              type: 'text',
              label: 'Titel',
              defaultValue: 'Photographer',
            },
          ],
        },
        {
          label: 'Kontakt & Social',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'Kontakt-E-Mail',
            },
            {
              name: 'instagramUrl',
              type: 'text',
              label: 'Instagram-URL',
            },
            {
              name: 'facebookUrl',
              type: 'text',
              label: 'Facebook-URL',
            },
          ],
        },
        {
          label: 'E-Mail',
          fields: [
            {
              name: 'professionalEmail',
              type: 'email',
              label: 'Professionelle E-Mail',
              admin: {
                description: 'z. B. mail@svenmagnus.com — Einrichtung erfolgt bei Strato/Google Workspace.',
              },
            },
            {
              name: 'emailProvider',
              type: 'select',
              label: 'E-Mail-Anbieter',
              options: [
                { label: 'Strato', value: 'strato' },
                { label: 'Google Workspace', value: 'google' },
                { label: 'Anderer', value: 'other' },
              ],
            },
            {
              name: 'emailNotes',
              type: 'textarea',
              label: 'Notizen zur E-Mail-Einrichtung',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta-Beschreibung',
              defaultValue: 'Photography Portfolio by Sven Magnus Hanefeld',
            },
          ],
        },
      ],
    },
  ],
}
