import type { MediaSize } from './photoLoader'

type SizeName = 'thumbnail' | 'grid' | 'fullscreen'

type MediaLike = {
  url?: string | null
  width?: number | null
  height?: number | null
  sizes?: {
    thumbnail?: MediaSize
    grid?: MediaSize
    fullscreen?: MediaSize
  }
}

function sizeLikelyMissingOnBlob(
  originalUrl: string | null | undefined,
  sizeUrl: string,
): boolean {
  if (!originalUrl) return false

  const originalName = originalUrl.split('/').pop() || ''
  const sizeName = sizeUrl.split('/').pop() || ''
  const originalStem = originalName.replace(/\.[^.]+$/, '')
  // Client uploads with addRandomSuffix leave a long token on the original filename.
  // Payload still records size URLs without that token — those Blobs 404.
  const suffixMatch = originalStem.match(/-([A-Za-z0-9_-]{16,})$/)
  if (!suffixMatch) return false

  return !sizeName.includes(suffixMatch[1])
}

function hasUsableSize(
  size: MediaSize | null | undefined,
  originalUrl?: string | null,
): size is MediaSize {
  if (!size?.url) return false
  if (typeof size.filesize === 'number' && size.filesize <= 0) return false
  if (sizeLikelyMissingOnBlob(originalUrl, size.url)) return false
  return true
}

export function pickMediaUrl(
  media: MediaLike,
  preferred?: SizeName,
): { url: string; width?: number | null; height?: number | null } {
  const order: Array<SizeName | 'original'> = preferred
    ? preferred === 'thumbnail'
      ? ['thumbnail', 'grid', 'original', 'fullscreen']
      : preferred === 'grid'
        ? ['grid', 'thumbnail', 'original', 'fullscreen']
        : ['fullscreen', 'original', 'grid', 'thumbnail']
    : ['grid', 'original', 'fullscreen', 'thumbnail']

  for (const key of order) {
    if (key === 'original') {
      if (media.url) {
        return { url: media.url, width: media.width, height: media.height }
      }
      continue
    }

    const size = media.sizes?.[key]
    if (hasUsableSize(size, media.url)) {
      return { url: size.url!, width: size.width, height: size.height }
    }
  }

  return { url: media.url || '' }
}

export function pickFullMediaUrl(media: MediaLike): {
  url: string
  width?: number | null
  height?: number | null
} {
  return pickMediaUrl(media, 'fullscreen')
}
