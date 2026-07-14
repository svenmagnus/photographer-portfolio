import type { Payload } from 'payload'

import {
  createMenuItemFromPage,
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
