import type { Locale } from './locale'

/** Feste Übersetzungen für Seiten, solange das CMS einsprachig ist. */
const PAGE_LABELS: Record<string, Record<Locale, string>> = {
  'model-bewerbung': {
    de: 'Model-Bewerbung',
    en: 'Model Application',
  },
}

export function pageLabel(slug: string | undefined, locale: Locale, fallback = ''): string {
  if (!slug) return fallback
  return PAGE_LABELS[slug]?.[locale] ?? (fallback || slug)
}

/** CMS-Texte für EN ersetzen, wenn eine feste Seitenübersetzung existiert. */
export function localizedPageText(
  slug: string | undefined,
  locale: Locale,
  cmsText: string | null | undefined,
): string {
  const fallback = cmsText?.trim() || ''
  if (locale === 'en' && slug && PAGE_LABELS[slug]?.en) {
    return PAGE_LABELS[slug].en
  }
  return fallback
}
