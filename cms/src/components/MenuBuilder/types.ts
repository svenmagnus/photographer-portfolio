export type BuilderPage = {
  id: string | number
  title: string
  slug: string
  pageType: string
  galleryCategory?: string | null
}

export type BuilderMenuItem = {
  clientId: string
  label: string
  linkType: 'page' | 'category' | 'external'
  page?: BuilderPage | null
  category?: string | null
  url?: string | null
  openInNewTab?: boolean
  children: BuilderMenuItem[]
}

export type ApiPage = {
  id: string | number
  title: string
  slug: string
  pageType: string
  galleryCategory?: string | null
  status?: string
}

export type ApiMenuItem = {
  id?: string
  label?: string
  linkType?: 'page' | 'category' | 'external'
  page?: ApiPage | string | number | null
  category?: string | null
  url?: string | null
  openInNewTab?: boolean | null
  children?: ApiMenuItem[] | null
}

export function createClientId(): string {
  return `menu-${Math.random().toString(36).slice(2, 10)}`
}

export function pageFromApi(page: ApiPage | string | number | null | undefined): BuilderPage | null {
  if (!page || typeof page !== 'object') return null

  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    pageType: page.pageType,
    galleryCategory: page.galleryCategory ?? null,
  }
}

export function menuItemFromApi(item: ApiMenuItem): BuilderMenuItem {
  const page = pageFromApi(item.page)

  return {
    clientId: item.id || createClientId(),
    label: item.label?.trim() || page?.title || '',
    linkType: item.linkType || 'page',
    page,
    category: item.category ?? null,
    url: item.url ?? null,
    openInNewTab: Boolean(item.openInNewTab),
    children: (item.children ?? []).map(menuItemFromApi),
  }
}

export function collectPageIds(items: BuilderMenuItem[]): Set<string> {
  const ids = new Set<string>()

  function walk(list: BuilderMenuItem[]) {
    for (const item of list) {
      if (item.page?.id != null) {
        ids.add(String(item.page.id))
      }
      walk(item.children)
    }
  }

  walk(items)
  return ids
}

export type SerializedMenuItem = {
  label: string
  linkType: 'page' | 'category' | 'external'
  page: number | null
  category: string | null
  url: string | null
  openInNewTab: boolean
  children: SerializedMenuItem[]
}

export function serializeMenuItems(items: BuilderMenuItem[]): SerializedMenuItem[] {
  return items.map((item) => ({
    label: item.label.trim() || item.page?.title || 'Menüpunkt',
    linkType: item.linkType,
    page:
      item.linkType === 'page' && item.page?.id != null ? Number(item.page.id) : null,
    category: item.linkType === 'category' ? item.category ?? null : null,
    url: item.linkType === 'external' ? item.url ?? null : null,
    openInNewTab: item.openInNewTab ?? false,
    children: serializeMenuItems(item.children),
  }))
}

export function createMenuItemFromPage(page: BuilderPage): BuilderMenuItem {
  return {
    clientId: createClientId(),
    label: page.title,
    linkType: 'page',
    page,
    category: null,
    url: null,
    openInNewTab: false,
    children: [],
  }
}

type ItemLocation = {
  items: BuilderMenuItem[]
  index: number
}

export function findItemLocation(
  items: BuilderMenuItem[],
  clientId: string,
  parent: BuilderMenuItem[] = items,
): ItemLocation | null {
  for (let index = 0; index < parent.length; index += 1) {
    const item = parent[index]
    if (item.clientId === clientId) {
      return { items: parent, index }
    }

    const nested = findItemLocation(items, clientId, item.children)
    if (nested) return nested
  }

  return null
}

export function removeItem(items: BuilderMenuItem[], clientId: string): BuilderMenuItem[] {
  return items
    .filter((item) => item.clientId !== clientId)
    .map((item) => ({
      ...item,
      children: removeItem(item.children, clientId),
    }))
}

export function flattenMenuItems(items: BuilderMenuItem[]): BuilderMenuItem[] {
  const result: BuilderMenuItem[] = []

  for (const item of items) {
    result.push(item)
    if (item.children.length > 0) {
      result.push(...flattenMenuItems(item.children))
    }
  }

  return result
}
