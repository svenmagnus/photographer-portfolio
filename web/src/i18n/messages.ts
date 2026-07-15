import type { Locale } from './locale'

const messages = {
  de: {
    langSwitch: 'Sprache',
    langDe: 'DE',
    langEn: 'EN',
    menuOpen: 'Menü öffnen',
    menuClose: 'Menü schließen',
    mainNav: 'Hauptnavigation',
    blogReadMore: 'Weiterlesen …',
    blogEmpty: 'Noch keine Beiträge veröffentlicht.',
    blogBack: '← {title}',
    photoGridEmpty: 'Noch keine Fotografien vorhanden. Bitte im CMS unter Fotos anlegen.',
    photoGridEmptyCms: 'CMS',
  },
  en: {
    langSwitch: 'Language',
    langDe: 'DE',
    langEn: 'EN',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    mainNav: 'Main navigation',
    blogReadMore: 'Read more …',
    blogEmpty: 'No posts published yet.',
    blogBack: '← {title}',
    photoGridEmpty: 'No photographs yet. Please add photos in the CMS under Photos.',
    photoGridEmptyCms: 'CMS',
  },
} as const

export type MessageKey = keyof (typeof messages)['de']

export function t(locale: Locale, key: MessageKey, vars?: Record<string, string>): string {
  let text: string = messages[locale][key] ?? messages.de[key]

  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, value)
    }
  }

  return text
}

export function dateLocale(locale: Locale): string {
  return locale === 'en' ? 'en-GB' : 'de-DE'
}
