import type { Locale } from './locale'

/** Fallback-Labels, wenn im CMS noch kein Eintrag für die Sprache existiert. */
const PAGE_LABELS: Record<string, Record<Locale, string>> = {
  contact: { de: 'Kontakt', en: 'Contact' },
  imprint: { de: 'Impressum', en: 'Imprint' },
  publications: { de: 'publications', en: 'Publications' },
  'model-bewerbung': { de: 'Model-Bewerbung', en: 'Model Application' },
}

export function pageLabel(slug: string | undefined, locale: Locale, fallback = ''): string {
  if (!slug) return fallback
  return fallback || PAGE_LABELS[slug]?.[locale] || slug
}

/** CMS-Text bevorzugen, feste Übersetzung nur als Fallback. */
export function localizedPageText(
  slug: string | undefined,
  locale: Locale,
  cmsText: string | null | undefined,
): string {
  const fromCms = cmsText?.trim()
  if (fromCms) return fromCms
  if (slug && PAGE_LABELS[slug]?.[locale]) return PAGE_LABELS[slug][locale]
  return ''
}

export function contactIntroHtml(locale: Locale): string {
  if (locale === 'de') {
    return `<p>Für lokale Projekte und Anfragen bin ich erreichbar. Nutze das Formular für Preise, Verfügbarkeit — oder sag einfach Hallo.</p>`
  }

  return `<p>I'm available for local projects as well as potential employment opportunities. Use the form to inquire about rates and availability, or just to say hi.</p>`
}

export function imprintBodyHtml(locale: Locale): string {
  if (locale === 'de') {
    return [
      '<p>Angaben gemäß § 5 TMG</p>',
      '<p>Sven Magnus Hanefeld — Photographer</p>',
      '<p>Kontakt: info@svenmagnus.com</p>',
      '<p>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV: Sven Magnus Hanefeld</p>',
    ].join('')
  }

  return [
    '<p>Legal information pursuant to § 5 TMG (German Telemedia Act)</p>',
    '<p>Sven Magnus Hanefeld — Photographer</p>',
    '<p>Contact: info@svenmagnus.com</p>',
    '<p>Responsible for content pursuant to § 55 Abs. 2 RStV: Sven Magnus Hanefeld</p>',
  ].join('')
}
