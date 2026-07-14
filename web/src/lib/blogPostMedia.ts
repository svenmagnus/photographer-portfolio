import type { Media } from './photoLoader'

type LexicalNode = {
  type?: string
  children?: LexicalNode[]
  value?: unknown
  relationTo?: string
  fields?: Record<string, unknown>
}

function isMediaObject(value: unknown): value is Media {
  return Boolean(value && typeof value === 'object' && 'id' in value)
}

function mediaFromUploadNode(node: LexicalNode): Media | null {
  if (node.type !== 'upload') return null

  if (isMediaObject(node.value)) {
    return node.value
  }

  const fields = node.fields
  if (fields && isMediaObject(fields.value)) {
    return fields.value
  }

  return null
}

export function collectMediaFromLexical(content: Record<string, unknown> | null | undefined): Media[] {
  const root =
    content && 'root' in content && content.root && typeof content.root === 'object'
      ? (content.root as LexicalNode)
      : content && 'type' in content && content.type === 'root'
        ? (content as LexicalNode)
        : null

  if (!root) return []

  const media: Media[] = []

  function walk(node: LexicalNode | undefined): void {
    if (!node) return

    const uploadMedia = mediaFromUploadNode(node)
    if (uploadMedia) {
      media.push(uploadMedia)
    }

    node.children?.forEach(walk)
  }

  walk(root)
  return media
}

export function getFirstMediaFromLexical(
  content: Record<string, unknown> | null | undefined,
): Media | null {
  return collectMediaFromLexical(content)[0] ?? null
}

export function normalizeFeaturedImages(
  featuredImage?: Media | Media[] | number | number[] | null,
): Media[] {
  if (!featuredImage) return []

  if (Array.isArray(featuredImage)) {
    return featuredImage.filter((item): item is Media => typeof item === 'object' && item !== null)
  }

  if (typeof featuredImage === 'object') {
    return [featuredImage]
  }

  return []
}

export function getBlogPostListImage(post: {
  featuredImage?: Media | Media[] | number | number[] | null
  content: Record<string, unknown>
}): Media | null {
  const featured = normalizeFeaturedImages(post.featuredImage)[0]
  if (featured) return featured

  return getFirstMediaFromLexical(post.content)
}
