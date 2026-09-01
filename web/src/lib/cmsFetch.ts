import { getPayloadUrl } from './payloadUrl'

/** How long cached CMS JSON stays valid (also used as Vercel fetch revalidate). */
export const CMS_REVALIDATE_SECONDS = 60 * 60

/** Abort CMS calls before the Vercel Hobby function times out (~10s). */
const FETCH_TIMEOUT_MS = process.env.VERCEL ? 15000 : 4000

type MemoryEntry = {
  expiresAt: number
  status: number
  body: string
  contentType: string
}

const memoryCache = new Map<string, MemoryEntry>()

type CachedFetchInit = RequestInit & {
  next?: { revalidate?: number }
}

function cacheKey(url: string): string {
  return url
}

function fromMemory(url: string, allowStale: boolean): Response | null {
  const entry = memoryCache.get(cacheKey(url))
  if (!entry) return null
  if (!allowStale && entry.expiresAt <= Date.now()) return null

  return new Response(entry.body, {
    status: entry.status,
    headers: { 'content-type': entry.contentType },
  })
}

function storeMemory(url: string, status: number, body: string, contentType: string): void {
  memoryCache.set(cacheKey(url), {
    expiresAt: Date.now() + CMS_REVALIDATE_SECONDS * 1000,
    status,
    body,
    contentType,
  })
}

/**
 * Cached GET to the Payload CMS. Reuses in-memory results for warm isolates
 * and asks Vercel to cache the fetch for CMS_REVALIDATE_SECONDS.
 */
export async function cmsFetch(pathWithQuery: string): Promise<Response> {
  const path = pathWithQuery.startsWith('/') ? pathWithQuery : `/${pathWithQuery}`
  const url = `${getPayloadUrl()}${path}`

  const fresh = fromMemory(url, false)
  if (fresh) return fresh

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const init: CachedFetchInit = {
      method: 'GET',
      signal: controller.signal,
    }

    const response = await fetch(url, init)
    const body = await response.text()
    const contentType = response.headers.get('content-type') || 'application/json'

    if (response.ok) {
      storeMemory(url, response.status, body, contentType)
    }

    return new Response(body, {
      status: response.status,
      headers: { 'content-type': contentType },
    })
  } catch (error) {
    const stale = fromMemory(url, true)
    if (stale) return stale
    throw error
  } finally {
    clearTimeout(timer)
  }
}

export async function cmsFetchJson<T>(pathWithQuery: string): Promise<T | null> {
  try {
    const response = await cmsFetch(pathWithQuery)
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}
