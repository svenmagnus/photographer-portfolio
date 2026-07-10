export function getFileBasename(file: File): string {
  const path = file.webkitRelativePath || file.name
  const parts = path.split('/').filter(Boolean)
  return parts[parts.length - 1] || file.name
}

export function filenameToTitle(filename: string): string {
  const basename = filename.split('/').pop() || filename

  return basename
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/gif',
])

export function isImageFile(file: File): boolean {
  const name = getFileBasename(file)
  if (file.type && IMAGE_MIME_TYPES.has(file.type)) return true
  return /\.(jpe?g|png|webp|avif|tiff?|gif)$/i.test(name)
}

export function inferCategoryFromPath(
  file: File,
  validCategories: Set<string>,
): string | null {
  const path = file.webkitRelativePath || ''
  const topFolder = path.split('/').filter(Boolean)[0]

  if (!topFolder) return null

  const normalized = topFolder.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')
  const aliases: Record<string, string> = {
    hollywood: 'hollywood',
    'fashion-clicks': 'fashion-clicks',
    'fashion clicks': 'fashion-clicks',
    'black-white': 'black-white',
    'black & white': 'black-white',
    'beauty-pics': 'beauty-pics',
    'beauty pics': 'beauty-pics',
    runway: 'runway',
    miscellaneous: 'miscellaneous',
    'alaia-collection': 'alaia-collection',
    'alaïa collection': 'alaia-collection',
    advertorial: 'advertorial',
    'film-editor': 'film-editor',
    'film editor': 'film-editor',
    motion: 'motion',
    insta: 'insta',
    publications: 'publications',
  }

  const mapped = aliases[topFolder.toLowerCase()] || aliases[normalized]
  if (mapped && validCategories.has(mapped)) return mapped

  return null
}
