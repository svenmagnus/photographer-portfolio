import type { PhotoCategory } from './categories'
import { pickFullMediaUrl, pickMediaUrl } from './mediaUrls'

export interface MediaSize {
  url?: string | null
  width?: number | null
  height?: number | null
  filename?: string | null
  filesize?: number | null
  mimeType?: string | null
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

export function getFullMediaUrl(media: Media | string | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return resolveMediaUrl(media)
  return resolveMediaUrl(pickFullMediaUrl(media).url)
}

export function getMediaUrl(
  media: Media | string | null | undefined,
  size: 'thumbnail' | 'grid' | 'fullscreen' = 'grid',
): string {
  if (!media) return ''
  if (typeof media === 'string') return resolveMediaUrl(media)
  return resolveMediaUrl(pickMediaUrl(media, size).url)
}

export async function fetchPhotosFromCMS(category?: string): Promise<Photo[]> {
  const params = new URLSearchParams({
    depth: '1',
    limit: '200',
    sort: '-date',
  })

  if (category) {
    params.set('where[category][equals]', category)
  }

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
      const fullUrl = getFullMediaUrl(media)
      const originalUrl = media?.url ? resolveMediaUrl(media.url) : fullUrl
      const alt = media?.alt || photo.title
      const isPortrait =
        media?.height && media?.width ? media.height > media.width * 1.15 : false
      const isFeatured = photo.featured || isPortrait
      const rowClass = isFeatured ? 'row-span-2' : 'row-span-1'
      const fallbackAttr =
        originalUrl && originalUrl !== gridUrl
          ? ` data-fallback="${escapeHtml(originalUrl)}"`
          : ''

      const imageMarkup = gridUrl
        ? `<img src="${escapeHtml(gridUrl)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-cover"${fallbackAttr} />`
        : `<div class="flex h-full min-h-[140px] items-center justify-center text-[13px] text-portfolio-muted">Kein Bild</div>`

      return `<button type="button" class="lightbox-item photo-item relative block h-full min-h-0 w-full overflow-hidden bg-white p-0 border-0 cursor-pointer focus:outline-none ${rowClass}" data-index="${index}" data-full="${escapeHtml(fullUrl)}" data-title="${escapeHtml(photo.title)}" data-category="${escapeHtml(photo.category)}" aria-label="${escapeHtml(`${photo.title} öffnen`)}">${imageMarkup}</button>`
    })
    .join('')

  container.querySelectorAll('img[data-fallback]').forEach((node) => {
    const img = node as HTMLImageElement
    img.addEventListener(
      'error',
      () => {
        const fallback = img.dataset.fallback
        if (fallback && img.src !== fallback) {
          img.src = fallback
        }
      },
      { once: true },
    )
  })
}

export async function loadCategoryPhotoGrid(category: string, rootId: string): Promise<void> {
  const grid = document.getElementById(`${rootId}-grid`)
  const loading = document.getElementById(`${rootId}-loading`)
  const empty = document.getElementById(`${rootId}-empty`)
  const error = document.getElementById(`${rootId}-error`)

  if (!grid) return

  loading?.classList.remove('hidden')
  empty?.classList.add('hidden')
  error?.classList.add('hidden')
  grid.innerHTML = ''

  try {
    const photos = await fetchPhotosFromCMS(category)

    loading?.classList.add('hidden')

    if (!photos.length) {
      empty?.classList.remove('hidden')
      return
    }

    renderPhotoGrid(grid, photos)
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

export async function loadPhotoGrid(category?: string): Promise<void> {
  const grid = document.getElementById('photo-grid')
  const loading = document.getElementById('photo-grid-loading')
  const empty = document.getElementById('photo-grid-empty')
  const error = document.getElementById('photo-grid-error')

  if (!grid) return

  const activeCategory =
    category ||
    new URLSearchParams(window.location.search).get('category') ||
    'hollywood'

  loading?.classList.remove('hidden')
  empty?.classList.add('hidden')
  error?.classList.add('hidden')
  grid.innerHTML = ''

  try {
    const photos = await fetchPhotosFromCMS(activeCategory)
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
