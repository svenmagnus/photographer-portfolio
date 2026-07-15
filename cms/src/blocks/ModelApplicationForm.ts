import { contentLexicalEditor } from '@/lib/contentLexicalEditor'
import type { Block } from 'payload'

/**
 * CMS-Block: Model-Bewerbungsformular
 *
 * Im Seiten-Layout unter „Blöcke hinzufügen → Model-Bewerbung" einfügen.
 * Feld-Labels und Formularstruktur liegen im Astro-Frontend und können dort
 * direkt im Code angepasst werden (ModelApplicationForm.astro).
 */
export const ModelApplicationFormBlock: Block = {
  slug: 'modelApplicationForm',
  labels: {
    singular: 'Model-Bewerbungsformular',
    plural: 'Model-Bewerbungsformulare',
  },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      label: 'Einleitungstext',
      admin: {
        description: 'Optional — erscheint über dem Formular. Leer = Standardtext im Frontend.',
      },
      editor: contentLexicalEditor,
    },
    {
      name: 'privacyUrl',
      type: 'text',
      label: 'Link Datenschutzerklärung',
      defaultValue: '/datenschutz',
      admin: {
        description: 'Relativer Pfad oder vollständige URL zur Datenschutzseite.',
      },
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Bewerbung absenden',
      label: 'Button-Text',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Vielen Dank — deine Bewerbung wurde erfolgreich gesendet.',
      label: 'Erfolgsmeldung',
    },
  ],
}
