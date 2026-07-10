export interface SiteSettingsData {
  productionDomain?: string | null
  wwwEnabled?: boolean | null
  cmsUrl?: string | null
  loginPath?: string | null
  photographerName?: string | null
  photographerTitle?: string | null
  contactEmail?: string | null
  instagramUrl?: string | null
  facebookUrl?: string | null
  professionalEmail?: string | null
  metaDescription?: string | null
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

export async function fetchSiteSettings(): Promise<SiteSettingsData> {
  try {
    const response = await fetch(`${payloadUrl}/api/globals/site-settings?depth=0`)

    if (!response.ok) {
      return defaults
    }

    const data = (await response.json()) as SiteSettingsData
    return { ...defaults, ...data }
  } catch {
    return defaults
  }
}

export function getAdminLoginUrl(settings: SiteSettingsData): string {
  const isDev = import.meta.env.DEV
  const cmsUrl = (isDev ? payloadUrl : settings.cmsUrl || payloadUrl).replace(/\/$/, '')
  return `${cmsUrl}/admin`
}
