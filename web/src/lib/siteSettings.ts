import type { Locale } from '../i18n/locale'
import { withLocaleParam } from '../i18n/locale'
import { cmsFetchJson } from './cmsFetch'
import { getPayloadUrl } from './payloadUrl'

export interface SiteSettingsData {
  productionDomain?: string | null
  wwwEnabled?: boolean | null
  cmsUrl?: string | null
  loginPath?: string | null
  photographerName?: string | null
  photographerTitle?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  professionalEmail?: string | null
  metaDescription?: string | null
  navigation?: Array<{
    label: string
    linkType: 'category' | 'page' | 'external'
    category?: string | null
    page?: { slug?: string } | number | string | null
    url?: string | null
    openInNewTab?: boolean | null
  }> | null
}

function getDefaults(): SiteSettingsData {
  return {
    productionDomain: 'svenmagnus.com',
    cmsUrl: getPayloadUrl(),
    loginPath: '/log-in',
    photographerName: import.meta.env.PUBLIC_PHOTOGRAPHER_NAME || 'Sven Magnus Hanefeld',
    photographerTitle: import.meta.env.PUBLIC_PHOTOGRAPHER_TITLE || 'Photographer',
    contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || null,
    instagramUrl: import.meta.env.PUBLIC_INSTAGRAM_URL || null,
    facebookUrl: import.meta.env.PUBLIC_FACEBOOK_URL || null,
    metaDescription: 'Photography Portfolio by Sven Magnus Hanefeld',
  }
}

export async function fetchSiteSettings(locale: Locale = 'de'): Promise<SiteSettingsData> {
  const defaults = getDefaults()
  const params = withLocaleParam(new URLSearchParams({ depth: '1' }), locale)
  const data = await cmsFetchJson<SiteSettingsData>(`/api/globals/site-settings?${params.toString()}`)
  return data ? { ...defaults, ...data } : defaults
}

export function getAdminLoginUrl(_settings: SiteSettingsData): string {
  return `${getPayloadUrl()}/admin`
}
