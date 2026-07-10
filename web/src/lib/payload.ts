import type { PhotoCategory } from './categories'

export interface MediaSize {
  url?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
}

export interface Media {
  id: string
  alt: string
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: MediaSize
    grid?: MediaSize
    fullscreen?: MediaSize
  }
}

export interface Photo {
  id: string
  title: string
  category: PhotoCategory
  date: string
  featured?: boolean | null
  image: Media | string
}

export interface PhotosResponse {
  docs: Photo[]
  totalDocs: number
}

const payloadUrl = (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')

function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${payloadUrl}${url.startsWith('/') ? url : `/${url}`}`
}

export function getMediaUrl(
  media: Media | string | null | undefined,
  size?: 'thumbnail' | 'grid' | 'fullscreen',
): string {
  if (!media) return ''
  if (typeof media === 'string') return resolveMediaUrl(media)

  if (size) {
    const sized = media.sizes?.[size]?.url
    if (sized) return resolveMediaUrl(sized)
  }

  const fallbacks = [
    media.sizes?.grid?.url,
    media.sizes?.fullscreen?.url,
    media.sizes?.thumbnail?.url,
    media.url,
  ]

  for (const candidate of fallbacks) {
    const resolved = resolveMediaUrl(candidate)
    if (resolved) return resolved
  }

  return ''
}

export async function fetchPhotos(category?: PhotoCategory): Promise<Photo[]> {
  const params = new URLSearchParams({
    depth: '1',
    limit: '200',
    sort: '-date',
  })

  if (category) {
    params.set('where[category][equals]', category)
  }

  try {
    const response = await fetch(`${payloadUrl}/api/photos?${params.toString()}`)

    if (!response.ok) {
      console.warn(`Payload API error: ${response.status}`)
      return []
    }

    const data = (await response.json()) as PhotosResponse
    return data.docs ?? []
  } catch (error) {
    console.warn('Payload API unreachable during build:', error)
    return []
  }
}

export async function fetchAllPhotos(): Promise<Photo[]> {
  return fetchPhotos()
}
