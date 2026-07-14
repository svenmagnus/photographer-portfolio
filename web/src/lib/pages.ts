import type { PhotoCategory } from './categories'
import type { Media } from './photoLoader'

export type PageBlock =
  | {
      blockType: 'heading'
      text: string
      level?: 'h1' | 'h2' | null
      align?: 'center' | 'left' | null
    }
  | {
      blockType: 'richText'
      content: Record<string, unknown>
      width?: 'normal' | 'narrow' | 'full' | null
    }
  | {
      blockType: 'mediaText'
      image: Media | number
      content: Record<string, unknown>
      layout?: 'imageLeft' | 'imageRight' | 'stacked' | null
      imageWidth?: 'half' | 'third' | 'twoThirds' | null
    }
  | {
      blockType: 'imageGallery'
      images: Array<{
        image: Media | number
        caption?: string | null
      }>
      columns?: '2' | '3' | '4' | null
      fullWidth?: boolean | null
    }
  | {
      blockType: 'photoGrid'
      category: PhotoCategory
      showTitle?: boolean | null
    }
  | {
      blockType: 'video'
      url: string
      poster?: Media | number | null
      caption?: string | null
      aspectRatio?: '16:9' | '4:3' | '9:16' | null
    }
  | {
      blockType: 'spacer'
      size?: 'small' | 'medium' | 'large' | null
    }
  | {
      blockType: 'contactInfo'
      showSocial?: boolean | null
      align?: 'center' | 'left' | null
    }

export interface CmsPage {
  id: string | number
  title: string
  slug: string
  pageType: 'content' | 'gallery' | 'landing' | 'blog'
  status: 'draft' | 'published'
  layout: PageBlock[]
  metaTitle?: string | null
  metaDescription?: string | null
}

interface PagesResponse {
  docs: CmsPage[]
  totalDocs: number
}

function getPayloadUrl(): string {
  return (import.meta.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000').replace(/\/$/, '')
}

export async function fetchPublishedPages(): Promise<CmsPage[]> {
  const params = new URLSearchParams({
    depth: '2',
    limit: '100',
    sort: 'title',
    'where[status][equals]': 'published',
  })

  try {
    const response = await fetch(`${getPayloadUrl()}/api/pages?${params.toString()}`)

    if (!response.ok) {
      console.warn(`Pages API error: ${response.status}`)
      return []
    }

    const data = (await response.json()) as PagesResponse
    return data.docs ?? []
  } catch (error) {
    console.warn('Pages API unreachable during build:', error)
    return []
  }
}

export async function fetchPageBySlug(slug: string): Promise<CmsPage | null> {
  const params = new URLSearchParams({
    depth: '2',
    limit: '1',
    'where[slug][equals]': slug,
    'where[status][equals]': 'published',
  })

  try {
    const response = await fetch(`${getPayloadUrl()}/api/pages?${params.toString()}`)
    if (!response.ok) return null

    const data = (await response.json()) as PagesResponse
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}
