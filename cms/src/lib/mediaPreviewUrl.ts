export type MediaPreviewSource = {
  url?: string | null
  thumbnailURL?: string | null
  filename?: string | null
  sizes?: {
    thumbnail?: { url?: string | null }
    grid?: { url?: string | null }
    fullscreen?: { url?: string | null }
  }
}

function isDirectBlobUrl(url: string): boolean {
  return url.includes('.blob.vercel-storage.com/')
}

function isBrokenPayloadProxyUrl(url: string): boolean {
  return url.includes('/api/media/file/')
}

function getUsableCandidates(media: MediaPreviewSource): string[] {
  return [
    media.url,
    media.thumbnailURL,
    media.sizes?.thumbnail?.url,
    media.sizes?.grid?.url,
    media.sizes?.fullscreen?.url,
  ].filter((value): value is string => typeof value === 'string' && !isBrokenPayloadProxyUrl(value))
}

export function getMediaPreviewUrl(media?: MediaPreviewSource | null): string | null {
  if (!media) return null

  const candidates = getUsableCandidates(media)

  const directBlobUrl = candidates.find(isDirectBlobUrl)
  if (directBlobUrl) return directBlobUrl

  return candidates[0] ?? null
}
