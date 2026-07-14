import type { Payload } from 'payload'

import {
  createMenuItemFromPage,
  serializeMenuItems,
} from '@/components/MenuBuilder/types'

export async function seedMainMenuFromPages(payload: Payload): Promise<void> {
  try {
    const existing = await payload.findGlobal({
      slug: 'main-menu',
      depth: 0,
    })

    if (Array.isArray(existing.items) && existing.items.length > 0) {
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
        items: serializeMenuItems(items) as never,
      },
    })

    payload.logger.info(`Main menu seeded from ${pages.docs.length} navigation pages.`)
  } catch (error) {
    payload.logger.error(
      `Main menu seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
