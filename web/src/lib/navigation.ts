import { PHOTO_CATEGORIES, STATIC_NAV_LINKS } from './categories'
import type { MainMenuItem } from './mainMenu'
import type { CmsPage } from './pages'
import type { SiteSettingsData } from './siteSettings'
import type { Locale } from '../i18n/locale'
import { localePath } from '../i18n/locale'
import { pageLabel } from '../i18n/pageLabels'

export interface NavItem {
  label: string
  href: string
  categoryValue?: string
  slug?: string
  openInNewTab?: boolean
  isSubItem?: boolean
}

function getPageSlug(page: unknown): string | undefined {
  if (page && typeof page === 'object' && 'slug' in page && typeof page.slug === 'string') {
    return page.slug
  }
  return undefined
}

function getPageTitle(page: unknown): string | undefined {
  if (page && typeof page === 'object' && 'title' in page && typeof page.title === 'string') {
    return page.title
  }
  return undefined
}

function getPageType(page: unknown): string | undefined {
  if (page && typeof page === 'object' && 'pageType' in page && typeof page.pageType === 'string') {
    return page.pageType
  }
  return undefined
}

function getGalleryCategory(page: unknown): string | undefined {
  if (
    page &&
    typeof page === 'object' &&
    'galleryCategory' in page &&
    typeof page.galleryCategory === 'string'
  ) {
    return page.galleryCategory
  }
  return undefined
}

function prefixHref(href: string, locale: Locale): string {
  if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return href
  }

  if (href.startsWith('/?')) {
    return localePath('/', locale) + href.slice(1)
  }

  return localePath(href, locale)
}

function menuItemToNavItem(item: MainMenuItem, locale: Locale, isSubItem = false): NavItem | null {
  const label = item.label?.trim()
  const linkType = item.linkType || 'page'

  if (linkType === 'page') {
    const slug = getPageSlug(item.page)
    if (!slug) return null

    const pageType = getPageType(item.page)
    const categoryValue =
      pageType === 'gallery' ? getGalleryCategory(item.page) || slug : undefined

    return {
      label: pageLabel(slug, locale, label || getPageTitle(item.page) || slug),
      href: prefixHref(
        pageType === 'gallery' && categoryValue ? `/?category=${categoryValue}` : `/${slug}`,
        locale,
      ),
      categoryValue,
      slug,
      openInNewTab: Boolean(item.openInNewTab),
      isSubItem,
    }
  }

  if (linkType === 'category' && item.category) {
    return {
      label: label || item.category,
      href: prefixHref(`/?category=${item.category}`, locale),
      categoryValue: item.category,
      openInNewTab: Boolean(item.openInNewTab),
      isSubItem,
    }
  }

  if (linkType === 'external' && item.url) {
    return {
      label: label || item.url,
      href: item.url,
      openInNewTab: Boolean(item.openInNewTab),
      isSubItem,
    }
  }

  return null
}

function buildNavigationFromMainMenu(items: MainMenuItem[], locale: Locale): NavItem[] {
  const result: NavItem[] = []

  for (const item of items) {
    const navItem = menuItemToNavItem(item, locale, false)
    if (navItem) result.push(navItem)

    for (const child of item.children ?? []) {
      const childItem = menuItemToNavItem(child, locale, true)
      if (childItem) result.push(childItem)
    }
  }

  return result
}

function buildNavigationFromPages(pages: CmsPage[], locale: Locale): NavItem[] {
  return pages
    .filter((page) => page.showInNavigation !== false)
    .map((page) => {
      const categoryValue =
        page.pageType === 'gallery' ? page.galleryCategory || page.slug : undefined

      return {
        label: pageLabel(page.slug, locale, page.title),
        href: prefixHref(
          page.pageType === 'gallery' && categoryValue ? `/?category=${categoryValue}` : `/${page.slug}`,
          locale,
        ),
        categoryValue,
        slug: page.slug,
      }
    })
}

export function buildNavigation(
  settings: SiteSettingsData,
  navPages?: CmsPage[],
  mainMenuItems?: MainMenuItem[] | null,
  locale: Locale = 'de',
): NavItem[] {
  if (mainMenuItems?.length) {
    return buildNavigationFromMainMenu(mainMenuItems, locale)
  }

  if (navPages?.length) {
    return buildNavigationFromPages(navPages, locale)
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
            href: prefixHref(`/?category=${item.category}`, locale),
            categoryValue: item.category,
          }
        }

        if (item.linkType === 'page') {
          const slug = getPageSlug(item.page)
          if (!slug) return null
          return {
            label,
            href: prefixHref(`/${slug}`, locale),
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
    href: prefixHref(`/?category=${category.value}`, locale),
    categoryValue: category.value,
  }))

  const staticItems: NavItem[] = STATIC_NAV_LINKS.map((link) => ({
    label: pageLabel(link.href.replace(/^\//, ''), locale, link.label),
    href: prefixHref(link.href, locale),
    slug: link.href.replace(/^\//, ''),
  }))

  return [...categoryItems, ...staticItems]
}

function estimateNavItemWidth(label: string): number {
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
