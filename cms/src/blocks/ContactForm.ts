import { contentLexicalEditor } from '@/lib/contentLexicalEditor'
import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: {
    singular: 'Kontaktformular',
    plural: 'Kontaktformulare',
  },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Einleitungstext',
      admin: {
        description: 'Optionaler Text über dem Formular, z. B. Verfügbarkeit oder Anfrage-Hinweis.',
      },
      editor: contentLexicalEditor,
    },
    {
      name: 'showPhone',
      type: 'checkbox',
      defaultValue: true,
      label: 'Telefon anzeigen',
      admin: {
        description: 'Nummer aus Website-Einstellungen → Kontakt & Social.',
      },
    },
    {
      name: 'showEmail',
      type: 'checkbox',
      defaultValue: true,
      label: 'E-Mail anzeigen',
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Send Message',
      label: 'Button-Text',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thank you — your message has been sent.',
      label: 'Erfolgsmeldung',
    },
  ],
}
