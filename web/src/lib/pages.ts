import type { Locale } from '../i18n/locale'
import { withLocaleParam } from '../i18n/locale'
import type { PhotoCategory } from './categories'
import type { Media } from './photoLoader'
import { cmsFetchJson } from './cmsFetch'

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
      images: Array<
        | Media
        | number
        | {
            image?: Media | number
            caption?: string | null
          }
      >
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
  | {
      blockType: 'contactForm'
      intro?: Record<string, unknown> | null
      showPhone?: boolean | null
      showEmail?: boolean | null
      submitLabel?: string | null
      successMessage?: string | null
    }
  | {
      blockType: 'modelApplicationForm'
      intro?: Record<string, unknown> | null
      privacyUrl?: string | null
      submitLabel?: string | null
      successMessage?: string | null
    }

export interface CmsPage {
  id: string | number
  title: string
  slug: string
  pageType: 'content' | 'gallery' | 'landing' | 'blog'
  status: 'draft' | 'published'
  layout: PageBlock[]
  galleryCategory?: string | null
  showInNavigation?: boolean | null
  navOrder?: number | null
  metaTitle?: string | null
  metaDescription?: string | null
}

interface PagesResponse {
  docs: CmsPage[]
  totalDocs: number
}

export async function fetchNavigationPages(locale: Locale = 'de'): Promise<CmsPage[]> {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: '0',
      limit: '100',
      sort: 'navOrder',
      'where[status][equals]': 'published',
      'where[showInNavigation][equals]': 'true',
    }),
    locale,
  )

  const data = await cmsFetchJson<PagesResponse>(`/api/pages?${params.toString()}`)
  const docs = data?.docs ?? []
  return [...docs].sort((a, b) => (a.navOrder ?? 999) - (b.navOrder ?? 999))
}

export async function fetchPublishedPages(locale: Locale = 'de'): Promise<CmsPage[]> {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: '2',
      limit: '100',
      sort: 'title',
      'where[status][equals]': 'published',
    }),
    locale,
  )

  const data = await cmsFetchJson<PagesResponse>(`/api/pages?${params.toString()}`)
  return data?.docs ?? []
}

export async function fetchPageBySlug(slug: string, locale: Locale = 'de'): Promise<CmsPage | null> {
  const params = withLocaleParam(
    new URLSearchParams({
      depth: '2',
      limit: '1',
      'where[slug][equals]': slug,
      'where[status][equals]': 'published',
    }),
    locale,
  )

  const data = await cmsFetchJson<PagesResponse>(`/api/pages?${params.toString()}`)
  return data?.docs?.[0] ?? null
}
