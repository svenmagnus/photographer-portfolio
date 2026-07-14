export function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\//, '')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop()
      if (videoId) return `https://player.vimeo.com/video/${videoId}`
    }
  } catch {
    return null
  }

  return null
}

export function getAspectRatioClass(aspectRatio?: string | null): string {
  switch (aspectRatio) {
    case '4:3':
      return 'aspect-[4/3]'
    case '9:16':
      return 'aspect-[9/16]'
    case '16:9':
    default:
      return 'aspect-video'
  }
}
