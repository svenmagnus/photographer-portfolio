import { contentLexicalEditor } from '@/lib/contentLexicalEditor'
import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Text',
    plural: 'Texte',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Inhalt',
      editor: contentLexicalEditor,
    },
    {
      name: 'width',
      type: 'select',
      defaultValue: 'normal',
      label: 'Breite',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Schmal (lesbar)', value: 'narrow' },
        { label: 'Volle Breite', value: 'full' },
      ],
    },
  ],
}
