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

interface PhotosResponse {
  docs: Photo[]
  totalDocs: number
}

export function getPayloadUrl(): string {
  return (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')
}

function resolveMediaUrl(url?: string | null): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const payloadUrl = getPayloadUrl()
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

export async function fetchPhotosFromCMS(): Promise<Photo[]> {
  const params = new URLSearchParams({
    depth: '1',
    limit: '200',
    sort: '-date',
  })

  const response = await fetch(`${getPayloadUrl()}/api/photos?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`CMS antwortet mit Status ${response.status}`)
  }

  const data = (await response.json()) as PhotosResponse
  return data.docs ?? []
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderPhotoGrid(container: HTMLElement, photos: Photo[]): void {
  container.innerHTML = photos
    .map((photo, index) => {
      const media = typeof photo.image === 'object' ? photo.image : null
      const gridUrl = getMediaUrl(media, 'grid')
      const fullUrl = getMediaUrl(media, 'fullscreen') || getMediaUrl(media)
      const alt = media?.alt || photo.title
      const isPortrait =
        media?.height && media?.width ? media.height > media.width * 1.15 : false
      const isFeatured = photo.featured || isPortrait
      const rowClass = isFeatured ? 'row-span-2' : 'row-span-1'

      const imageMarkup = gridUrl
        ? `<img src="${escapeHtml(gridUrl)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover" />`
        : `<div class="flex h-full min-h-[140px] items-center justify-center text-[13px] text-portfolio-muted">Kein Bild</div>`

      return `<button type="button" class="photo-item relative block h-full min-h-0 w-full overflow-hidden bg-white p-0 border-0 cursor-pointer focus:outline-none ${rowClass}" data-index="${index}" data-full="${escapeHtml(fullUrl)}" data-title="${escapeHtml(photo.title)}" data-category="${escapeHtml(photo.category)}" aria-label="${escapeHtml(`${photo.title} öffnen`)}">${imageMarkup}</button>`
    })
    .join('')
}

export async function loadPhotoGrid(): Promise<void> {
  const grid = document.getElementById('photo-grid')
  const loading = document.getElementById('photo-grid-loading')
  const empty = document.getElementById('photo-grid-empty')
  const error = document.getElementById('photo-grid-error')

  if (!grid) return

  loading?.classList.remove('hidden')
  empty?.classList.add('hidden')
  error?.classList.add('hidden')
  grid.innerHTML = ''

  try {
    const photos = await fetchPhotosFromCMS()
    loading?.classList.add('hidden')

    if (!photos.length) {
      empty?.classList.remove('hidden')
      document.dispatchEvent(new CustomEvent('photos-loaded'))
      return
    }

    renderPhotoGrid(grid, photos)
    document.dispatchEvent(new CustomEvent('photos-loaded'))
  } catch (loadError) {
    loading?.classList.add('hidden')
    if (error) {
      error.textContent =
        loadError instanceof Error
          ? loadError.message
          : 'Fotografien konnten nicht geladen werden.'
      error.classList.remove('hidden')
    }
  }
}
