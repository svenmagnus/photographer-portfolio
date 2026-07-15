import type { Locale } from '../i18n/locale'
import { withLocaleParam } from '../i18n/locale'

export type MainMenuItem = {
  label?: string | null
  linkType?: 'page' | 'category' | 'external' | null
  category?: string | null
  page?:
    | {
        id?: string | number
        title?: string
        slug?: string
        pageType?: string
        galleryCategory?: string | null
      }
    | string
    | number
    | null
  url?: string | null
  openInNewTab?: boolean | null
  children?: MainMenuItem[] | null
}

export type MainMenuData = {
  items?: MainMenuItem[] | null
}

const payloadUrl = (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')

export async function fetchMainMenu(locale: Locale = 'de'): Promise<MainMenuData> {
  try {
    const params = withLocaleParam(new URLSearchParams({ depth: '2' }), locale)
    const response = await fetch(`${payloadUrl}/api/globals/main-menu?${params.toString()}`)

    if (!response.ok) {
      return { items: [] }
    }

    return (await response.json()) as MainMenuData
  } catch {
    return { items: [] }
  }
}
