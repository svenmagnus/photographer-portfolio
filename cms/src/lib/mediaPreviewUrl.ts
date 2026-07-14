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

export function getMediaPreviewUrl(media?: MediaPreviewSource | null): string | null {
  if (!media) return null

  const candidates = [
    media.url,
    media.thumbnailURL,
    media.sizes?.thumbnail?.url,
    media.sizes?.grid?.url,
    media.sizes?.fullscreen?.url,
  ].filter((value): value is string => Boolean(value))

  // Prefer direct Blob CDN URLs — resized variants and the Payload proxy often 404.
  const directBlobUrl = candidates.find(isDirectBlobUrl)
  if (directBlobUrl) return directBlobUrl

  return candidates[0] ?? null
}
