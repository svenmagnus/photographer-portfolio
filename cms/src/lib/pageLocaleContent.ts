import { PHOTO_CATEGORIES } from '@/collections/Photos'
import { lexicalParagraphs } from './defaultLexical'

type LocaleCode = 'de' | 'en'

type PageLocaleData = {
  title: string
  layout?: Record<string, unknown>[]
}

/**
 * Foto-Kategorien, die als Inhaltsseite (Text/Bilder) statt Galerie laufen.
 * Diese Seiten werden im Seed nicht mit einem Foto-Grid überschrieben.
 */
export const CONTENT_CATEGORY_SLUGS = ['publications', 'advertorial', 'motion'] as const

/** Seiten mit festem Layout — Seed darf Inhalt setzen/aktualisieren. */
export const FULL_LAYOUT_SEED_SLUGS = [
  'contact',
  'imprint',
  'model-bewerbung',
  'blog',
] as const

const GALLERY_CATEGORY_SLUGS = PHOTO_CATEGORIES.filter(
  (category) =>
    category.value !== 'film-editor' &&
    !CONTENT_CATEGORY_SLUGS.includes(category.value as (typeof CONTENT_CATEGORY_SLUGS)[number]),
).map((category) => category.value)

/** Deutsche Navigations-Titel (Kleinschreibung wie auf der Website) */
const GALLERY_TITLE_DE: Record<string, string> = {
  hollywood: 'hollywood',
  'fashion-clicks': 'fashion clicks',
  'black-white': 'black & white',
  'beauty-pics': 'beauty pics',
  runway: 'runway',
  miscellaneous: 'miscellaneous',
  'alaia-collection': 'alaïa collection',
  advertorial: 'advertorial',
  motion: 'motion',
  insta: 'insta',
  publications: 'publications',
}

function galleryLayout(category: string) {
  return [
    {
      blockType: 'photoGrid',
      category,
      showTitle: false,
    },
  ]
}

function headingBlock(text: string, align: 'center' | 'left' = 'center') {
  return {
    blockType: 'heading',
    text,
    level: 'h1',
    align,
  }
}

/** Lokalisierter Seiteninhalt — wird per Seed in Payload geschrieben. */
export const PAGE_LOCALE_CONTENT: Record<string, Partial<Record<LocaleCode, PageLocaleData>>> = {
  contact: {
    de: {
      title: 'Kontakt',
      layout: [
        headingBlock('Kontakt'),
        {
          blockType: 'contactForm',
          showPhone: true,
          showEmail: true,
          submitLabel: 'Nachricht senden',
          successMessage: 'Vielen Dank — deine Nachricht wurde gesendet.',
          intro: lexicalParagraphs(
            'Für lokale Projekte und Anfragen bin ich erreichbar. Nutze das Formular für Preise, Verfügbarkeit — oder sag einfach Hallo.',
          ),
        },
      ],
    },
    en: {
      title: 'Contact',
      layout: [
        headingBlock('Contact'),
        {
          blockType: 'contactForm',
          showPhone: true,
          showEmail: true,
          submitLabel: 'Send message',
          successMessage: 'Thank you — your message has been sent.',
          intro: lexicalParagraphs(
            "I'm available for local projects as well as potential employment opportunities. Use the form to inquire about rates and availability, or just to say hi.",
          ),
        },
      ],
    },
  },
  imprint: {
    de: {
      title: 'Impressum',
      layout: [
        headingBlock('Impressum', 'left'),
        {
          blockType: 'richText',
          width: 'narrow',
          content: lexicalParagraphs(
            'Angaben gemäß § 5 TMG',
            'Sven Magnus Hanefeld — Photographer',
            'Kontakt: info@svenmagnus.com',
            'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Sven Magnus Hanefeld',
          ),
        },
      ],
    },
    en: {
      title: 'Imprint',
      layout: [
        headingBlock('Imprint', 'left'),
        {
          blockType: 'richText',
          width: 'narrow',
          content: lexicalParagraphs(
            'Legal information pursuant to § 5 TMG (German Telemedia Act)',
            'Sven Magnus Hanefeld — Photographer',
            'Contact: info@svenmagnus.com',
            'Responsible for content pursuant to § 55 Abs. 2 RStV: Sven Magnus Hanefeld',
          ),
        },
      ],
    },
  },
  'model-bewerbung': {
    de: {
      title: 'Model-Bewerbung',
      layout: [
        headingBlock('Model-Bewerbung'),
        {
          blockType: 'modelApplicationForm',
          privacyUrl: '/datenschutz',
          submitLabel: 'Bewerbung absenden',
          successMessage: 'Vielen Dank — deine Bewerbung wurde erfolgreich gesendet.',
          intro: lexicalParagraphs(
            'Für diese Bewerbung brauchst du keine professionellen Fotos. Natürliche Polas (Polaroids / Snapshots) reichen völlig aus — aufgenommen bei Tageslicht, ohne Make-up und in schlichter Kleidung.',
            'Bitte fülle alle Pflichtfelder aus und lade deine vier Polas hoch.',
          ),
        },
      ],
    },
    en: {
      title: 'Model Application',
      layout: [
        headingBlock('Model Application'),
        {
          blockType: 'modelApplicationForm',
          privacyUrl: '/datenschutz',
          submitLabel: 'Submit application',
          successMessage: 'Thank you — your application was sent successfully.',
          intro: lexicalParagraphs(
            'You do not need professional photos for this application. Natural polas (polaroids / snapshots) are enough — taken in daylight, without make-up and in simple clothing.',
            'Please fill in all required fields and upload your four polas.',
          ),
        },
      ],
    },
  },
  blog: {
    de: { title: 'Blog', layout: [headingBlock('Blog')] },
    en: { title: 'Blog', layout: [headingBlock('Blog')] },
  },
}

// Inhaltsseiten: nur Titel lokalisiert — Layout bleibt im CMS (DE/EN separat pflegen)
for (const slug of CONTENT_CATEGORY_SLUGS) {
  PAGE_LOCALE_CONTENT[slug] = {
    de: { title: GALLERY_TITLE_DE[slug] ?? slug },
    en: { title: slug === 'publications' ? 'Publications' : GALLERY_TITLE_DE[slug] ?? slug },
  }
}

// Galerie-Seiten: Foto-Grid-Layout
for (const slug of GALLERY_CATEGORY_SLUGS) {
  PAGE_LOCALE_CONTENT[slug] = {
    de: {
      title: GALLERY_TITLE_DE[slug] ?? slug,
      layout: galleryLayout(slug),
    },
    en: {
      title: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      layout: galleryLayout(slug),
    },
  }
}

/** Menü-Label pro Seiten-Slug */
export const MENU_LABEL_BY_SLUG: Record<string, Record<LocaleCode, string>> = {
  contact: { de: 'Kontakt', en: 'Contact' },
  imprint: { de: 'Impressum', en: 'Imprint' },
  blog: { de: 'Blog', en: 'Blog' },
  'model-bewerbung': { de: 'Model-Bewerbung', en: 'Model Application' },
  publications: { de: 'publications', en: 'Publications' },
}

for (const category of PHOTO_CATEGORIES) {
  if (category.value === 'film-editor') continue
  MENU_LABEL_BY_SLUG[category.value] = {
    de: GALLERY_TITLE_DE[category.value] ?? category.label,
    en: category.label,
  }
}

export function isFullLayoutSeedSlug(slug: string): boolean {
  return (FULL_LAYOUT_SEED_SLUGS as readonly string[]).includes(slug)
}

export function isContentCategorySlug(slug: string): boolean {
  return (CONTENT_CATEGORY_SLUGS as readonly string[]).includes(slug)
}

export function isGalleryCategorySlug(slug: string): boolean {
  return (GALLERY_CATEGORY_SLUGS as string[]).includes(slug)
}
