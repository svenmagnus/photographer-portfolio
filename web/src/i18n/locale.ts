/** Unterstützte Frontend-Sprachen */
export type Locale = 'de' | 'en'

export const LOCALES: Locale[] = ['de', 'en']
export const DEFAULT_LOCALE: Locale = 'de'

export function isLocale(value: string | undefined): value is Locale {
  return value === 'de' || value === 'en'
}

/** Internen Pfad mit Sprachpräfix versehen (/blog → /en/blog) */
export function localePath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const withoutLocale = normalized.replace(/^\/en(?=\/|$)/, '') || '/'

  if (locale === DEFAULT_LOCALE) {
    return withoutLocale
  }

  return withoutLocale === '/' ? '/en' : `/en${withoutLocale}`
}

/** Aktuelle URL für Sprachumschalter in die Zielsprache umrechnen */
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const withoutLocale = currentPath.replace(/^\/en(?=\/|$)/, '') || '/'
  return localePath(withoutLocale, targetLocale)
}

/** Englisches /en-Präfix aus dem Pfad entfernen */
export function stripLocalePrefix(path: string): string {
  return path.replace(/^\/en(?=\/|$)/, '') || '/'
}

/** Query-Parameter ?locale= für Payload-API */
export function withLocaleParam(params: URLSearchParams, locale: Locale): URLSearchParams {
  params.set('locale', locale)
  return params
}
