import type { Block } from 'payload'

export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  labels: {
    singular: 'Bildergalerie',
    plural: 'Bildergalerien',
  },
  fields: [
    {
      name: 'images',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
      label: 'Bilder',
      admin: {
        appearance: 'drawer',
        description:
          'Auf das Feld klicken → Mediathek mit Vorschaubildern öffnet sich → Zeile anklicken zum Hinzufügen. Für jedes weitere Bild wiederholen.',
        isSortable: true,
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '4',
      label: 'Spalten',
      options: [
        { label: '2 Bilder nebeneinander', value: '2' },
        { label: '3 Bilder nebeneinander', value: '3' },
        { label: '4 Bilder nebeneinander', value: '4' },
      ],
    },
    {
      name: 'fullWidth',
      type: 'checkbox',
      defaultValue: true,
      label: 'Volle Seitenbreite',
      admin: {
        description: 'Galerie über die gesamte Browserbreite — bei 4 Bildern „4 Spalten“ wählen.',
      },
    },
  ],
}
