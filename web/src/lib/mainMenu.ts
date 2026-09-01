import type { Locale } from '../i18n/locale'
import { withLocaleParam } from '../i18n/locale'
import { cmsFetchJson } from './cmsFetch'

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

export async function fetchMainMenu(locale: Locale = 'de'): Promise<MainMenuData> {
  const params = withLocaleParam(new URLSearchParams({ depth: '2' }), locale)
  const data = await cmsFetchJson<MainMenuData>(`/api/globals/mainMenu?${params.toString()}`)
  return data ?? { items: [] }
}
