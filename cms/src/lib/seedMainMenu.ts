import type { Payload } from 'payload'

import {
  createMenuItemFromPage,
  menuItemFromApi,
  serializeMenuItems,
  type SerializedMenuItem,
} from '@/components/MenuBuilder/types'

function getStoredPageId(page: unknown): number | null {
  if (typeof page === 'number') return page
  if (page && typeof page === 'object' && 'id' in page && page.id != null) {
    return Number(page.id)
  }
  return null
}

function dedupeSerializedMenuItems(items: SerializedMenuItem[]): SerializedMenuItem[] {
  const seenPageIds = new Set<number>()
  const result: SerializedMenuItem[] = []

  for (const item of items) {
    const pageId = getStoredPageId(item.page)

    if (pageId != null) {
      if (seenPageIds.has(pageId)) continue
      seenPageIds.add(pageId)
    }

    result.push({
      ...item,
      children: dedupeSerializedMenuItems(item.children ?? []),
    })
  }

  return result
}

function serializedItemsFromGlobal(items: unknown): SerializedMenuItem[] {
  if (!Array.isArray(items)) return []

  return items.map((item) => {
    const record = item as Record<string, unknown>
    return {
      label: String(record.label ?? ''),
      linkType: (record.linkType as SerializedMenuItem['linkType']) ?? 'page',
      page: getStoredPageId(record.page),
      category: (record.category as string | null) ?? null,
      url: (record.url as string | null) ?? null,
      openInNewTab: Boolean(record.openInNewTab),
      children: serializedItemsFromGlobal(record.children),
    }
  })
}

export async function repairMainMenuDuplicates(payload: Payload): Promise<void> {
  try {
    const existing = await payload.findGlobal({
      slug: 'main-menu',
      depth: 0,
    })

    const current = serializedItemsFromGlobal(existing.items)
    const deduped = dedupeSerializedMenuItems(current)

    if (deduped.length === current.length) {
      return
    }

    await payload.updateGlobal({
      slug: 'main-menu',
      data: {
        items: deduped as never,
      },
    })

    payload.logger.info(
      `Main menu deduplicated: ${current.length} → ${deduped.length} top-level items.`,
    )
  } catch (error) {
    payload.logger.error(
      `Main menu dedupe skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

export async function seedMainMenuFromPages(payload: Payload): Promise<void> {
  try {
    const existing = await payload.findGlobal({
      slug: 'main-menu',
      depth: 0,
    })

    const current = serializedItemsFromGlobal(existing.items)
    if (current.length > 0) {
      return
    }

    const pages = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { status: { equals: 'published' } },
          { showInNavigation: { equals: true } },
        ],
      },
      sort: 'navOrder',
      limit: 200,
      depth: 0,
    })

    if (pages.docs.length === 0) {
      return
    }

    const items = pages.docs.map((page) =>
      createMenuItemFromPage({
        id: page.id,
        title: page.title,
        slug: page.slug,
        pageType: page.pageType,
        galleryCategory: page.galleryCategory ?? null,
      }),
    )

    await payload.updateGlobal({
      slug: 'main-menu',
      data: {
        items: dedupeSerializedMenuItems(serializeMenuItems(items)) as never,
      },
    })

    payload.logger.info(`Main menu seeded from ${pages.docs.length} navigation pages.`)
  } catch (error) {
    payload.logger.error(
      `Main menu seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

const STORE_PAGE_SLUG = 'store'

/** Entfernt Store aus dem Hauptmenü (Seite bleibt erreichbar, nur nicht im Menü). */
export async function removeStoreFromMainMenu(payload: Payload): Promise<void> {
  try {
    const menu = await payload.findGlobal({
      slug: 'main-menu',
      depth: 1,
    })

    const currentItems = Array.isArray(menu.items)
      ? menu.items.map((item) => menuItemFromApi(item as never))
      : []

    const filtered = currentItems.filter((item) => {
      const slug = item.page?.slug
      if (slug === STORE_PAGE_SLUG) return false
      if (item.label.toLowerCase() === 'store') return false
      return true
    })

    if (filtered.length === currentItems.length) return

    await payload.updateGlobal({
      slug: 'main-menu',
      data: {
        items: dedupeSerializedMenuItems(serializeMenuItems(filtered)) as never,
      },
    })

    payload.logger.info('Removed store from main menu.')
  } catch (error) {
    payload.logger.error(
      `Store menu removal skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

const MODEL_APPLICATION_PAGE_SLUG = 'model-bewerbung'

/** Fügt Model-Bewerbung ins Hauptmenü ein, falls die Seite existiert aber noch nicht verlinkt ist. */
export async function ensureModelApplicationInMenu(payload: Payload): Promise<void> {
  try {
    const pageResult = await payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: MODEL_APPLICATION_PAGE_SLUG } },
          { status: { equals: 'published' } },
        ],
      },
      limit: 1,
      depth: 0,
    })

    const page = pageResult.docs[0]
    if (!page) return

    const menu = await payload.findGlobal({
      slug: 'main-menu',
      depth: 1,
    })

    const currentItems = Array.isArray(menu.items)
      ? menu.items.map((item) => menuItemFromApi(item as never))
      : []

    const pageIds = new Set(
      currentItems.flatMap((item) => {
        const ids: number[] = []
        if (item.page?.id != null) ids.push(Number(item.page.id))
        item.children.forEach((child) => {
          if (child.page?.id != null) ids.push(Number(child.page.id))
        })
        return ids
      }),
    )

    if (pageIds.has(Number(page.id))) return

    const newItem = createMenuItemFromPage({
      id: page.id,
      title: page.title,
      slug: page.slug,
      pageType: page.pageType,
      galleryCategory: page.galleryCategory ?? null,
    })

    const contactIndex = currentItems.findIndex(
      (item) => item.page?.slug === 'contact' || item.label.toLowerCase() === 'contact',
    )

    if (contactIndex >= 0) {
      currentItems.splice(contactIndex, 0, newItem)
    } else {
      currentItems.push(newItem)
    }

    await payload.updateGlobal({
      slug: 'main-menu',
      data: {
        items: dedupeSerializedMenuItems(serializeMenuItems(currentItems)) as never,
      },
    })

    payload.logger.info(`Added ${MODEL_APPLICATION_PAGE_SLUG} to main menu.`)
  } catch (error) {
    payload.logger.error(
      `Model application menu link skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
