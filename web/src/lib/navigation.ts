import { PHOTO_CATEGORIES, STATIC_NAV_LINKS } from './categories'
import type { SiteSettingsData } from './siteSettings'

export interface NavItem {
  label: string
  href: string
  categoryValue?: string
  slug?: string
  openInNewTab?: boolean
}

function getPageSlug(page: unknown): string | undefined {
  if (!page || typeof page === 'object' && 'slug' in page && typeof page.slug === 'string') {
    return page.slug
  }
  return undefined
}

export function buildNavigation(settings: SiteSettingsData): NavItem[] {
  const custom = settings.navigation

  if (custom?.length) {
    return custom
      .map((item) => {
        const label = item.label?.trim()
        if (!label) return null

        if (item.linkType === 'category' && item.category) {
          return {
            label,
            href: `/?category=${item.category}`,
            categoryValue: item.category,
          }
        }

        if (item.linkType === 'page') {
          const slug = getPageSlug(item.page)
          if (!slug) return null
          return {
            label,
            href: `/${slug}`,
            slug,
          }
        }

        if (item.linkType === 'external' && item.url) {
          const href = item.url.startsWith('http') ? item.url : item.url
          return {
            label,
            href,
            openInNewTab: Boolean(item.openInNewTab),
          }
        }

        return null
      })
      .filter((item): item is NavItem => Boolean(item))
  }

  const categoryItems: NavItem[] = PHOTO_CATEGORIES.map((category) => ({
    label: category.label,
    href: `/?category=${category.value}`,
    categoryValue: category.value,
  }))

  const staticItems: NavItem[] = STATIC_NAV_LINKS.map((link) => ({
    label: link.label,
    href: link.href,
    slug: link.href.replace(/^\//, ''),
  }))

  return [...categoryItems, ...staticItems]
}

export function splitNavigation(items: NavItem[]): { rowOne: NavItem[]; rowTwo: NavItem[] } {
  if (items.length <= 10) {
    return { rowOne: items, rowTwo: [] }
  }

  return {
    rowOne: items.slice(0, 10),
    rowTwo: items.slice(10),
  }
}
