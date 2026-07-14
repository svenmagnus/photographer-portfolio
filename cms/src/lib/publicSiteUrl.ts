function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/$/, '')
}

function pickPreferredOrigin(origins: string[]): string | undefined {
  const normalized = origins.map(normalizeOrigin).filter(Boolean)
  const withWww = normalized.find((origin) => /^https:\/\/www\./.test(origin))
  if (withWww) return withWww

  const https = normalized.find((origin) => origin.startsWith('https://'))
  return https ?? normalized[0]
}

export function buildPageUrl(baseUrl: string, slug: string): string {
  const base = normalizeOrigin(baseUrl)
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '')

  if (!cleanSlug || cleanSlug === 'home') return base

  return `${base}/${cleanSlug}`
}

export function getPublicSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.PUBLIC_SITE_URL ||
    process.env.SITE_URL

  if (fromEnv) return normalizeOrigin(fromEnv)

  const corsOrigins =
    process.env.CORS_ORIGINS?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []

  const preferredCorsOrigin = pickPreferredOrigin(corsOrigins)
  if (preferredCorsOrigin) return preferredCorsOrigin

  if (process.env.VERCEL === '1') return 'https://www.svenmagnus.com'

  return 'http://localhost:4321'
}
