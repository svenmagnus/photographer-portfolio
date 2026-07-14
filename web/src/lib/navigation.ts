import { PHOTO_CATEGORIES, STATIC_NAV_LINKS } from './categories'
import type { CmsPage } from './pages'
import type { SiteSettingsData } from './siteSettings'

export interface NavItem {
  label: string
  href: string
  categoryValue?: string
  slug?: string
  openInNewTab?: boolean
}

function getPageSlug(page: unknown): string | undefined {
  if (page && typeof page === 'object' && 'slug' in page && typeof page.slug === 'string') {
    return page.slug
  }
  return undefined
}

function buildNavigationFromPages(pages: CmsPage[]): NavItem[] {
  return pages
    .filter((page) => page.showInNavigation !== false)
    .map((page) => {
      const categoryValue =
        page.pageType === 'gallery' ? page.galleryCategory || page.slug : undefined

      return {
        label: page.title,
        href: page.pageType === 'gallery' && categoryValue ? `/?category=${categoryValue}` : `/${page.slug}`,
        categoryValue,
        slug: page.slug,
      }
    })
}

export function buildNavigation(settings: SiteSettingsData, navPages?: CmsPage[]): NavItem[] {
  if (navPages?.length) {
    return buildNavigationFromPages(navPages)
  }

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

function estimateNavItemWidth(label: string): number {
  // Match Format menu item width at 20px Georgia (≈11px per char + horizontal padding).
  return label.trim().toLowerCase().length * 11 + 50
}

export function splitNavigation(items: NavItem[]): { rowOne: NavItem[]; rowTwo: NavItem[] } {
  if (items.length <= 5) {
    return { rowOne: items, rowTwo: [] }
  }

  const widths = items.map((item) => estimateNavItemWidth(item.label))
  const totalWidth = widths.reduce((sum, width) => sum + width, 0)
  const targetWidth = totalWidth / 2

  let rowOneWidth = 0
  let splitIndex = Math.ceil(items.length / 2)

  for (let index = 0; index < items.length - 1; index += 1) {
    rowOneWidth += widths[index]

    if (rowOneWidth >= targetWidth) {
      splitIndex = index + 1
      break
    }

    splitIndex = index + 1
  }

  return {
    rowOne: items.slice(0, splitIndex),
    rowTwo: items.slice(splitIndex),
  }
}
