import type { Locale } from '../i18n/locale'
import { withLocaleParam } from '../i18n/locale'

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

const payloadUrl = (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')

const defaults: SiteSettingsData = {
  productionDomain: 'svenmagnus.com',
  cmsUrl: payloadUrl,
  loginPath: '/log-in',
  photographerName: import.meta.env.PUBLIC_PHOTOGRAPHER_NAME || 'Sven Magnus Hanefeld',
  photographerTitle: import.meta.env.PUBLIC_PHOTOGRAPHER_TITLE || 'Photographer',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || null,
  instagramUrl: import.meta.env.PUBLIC_INSTAGRAM_URL || null,
  facebookUrl: import.meta.env.PUBLIC_FACEBOOK_URL || null,
  metaDescription: 'Photography Portfolio by Sven Magnus Hanefeld',
}

export async function fetchSiteSettings(locale: Locale = 'de'): Promise<SiteSettingsData> {
  try {
    const params = withLocaleParam(new URLSearchParams({ depth: '1' }), locale)
    const response = await fetch(`${payloadUrl}/api/globals/site-settings?${params.toString()}`)

    if (!response.ok) {
      return defaults
    }

    const data = (await response.json()) as SiteSettingsData
    return { ...defaults, ...data }
  } catch {
    return defaults
  }
}

export function getAdminLoginUrl(_settings: SiteSettingsData): string {
  // Always use PUBLIC_PAYLOAD_URL — cms.svenmagnus.com may not have valid SSL yet.
  return `${payloadUrl}/admin`
}
