import type { Payload } from 'payload'

import {
  MENU_LABEL_BY_SLUG,
  PAGE_LOCALE_CONTENT,
  isCmsManagedLayoutSlug,
  isContentCategorySlug,
  isContentEnLayoutSeedSlug,
  isFullLayoutSeedSlug,
  isGalleryCategorySlug,
} from './pageLocaleContent'
import {
  buildImprintDeLayout,
  buildImprintEnLayout,
  isPlaceholderImprintLayout,
} from './imprintLayouts'
import { buildPublicationsEnLayout } from './publicationsEnLayout'

type LocaleCode = 'de' | 'en'

type PageDoc = {
  id: number | string
  pageType?: string
  layout?: unknown
}

async function findPageBySlug(payload: Payload, slug: string, locale: LocaleCode = 'de') {
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    locale,
  })

  return (result.docs[0] as PageDoc | undefined) ?? null
}

function layoutBlockCount(layout: unknown): number {
  return Array.isArray(layout) ? layout.length : 0
}

async function upsertPageLocale(
  payload: Payload,
  pageId: number,
  locale: LocaleCode,
  data: { title: string; layout?: Record<string, unknown>[] },
): Promise<void> {
  await payload.update({
    collection: 'pages',
    id: pageId,
    locale,
    data: data as never,
  })
}

function shouldSeedLayout(
  slug: string,
  pageType: string | undefined,
  locale: LocaleCode,
  layout?: Record<string, unknown>[],
): layout is Record<string, unknown>[] {
  if (!layout?.length) return false
  if (isFullLayoutSeedSlug(slug)) return true
  if (pageType === 'gallery' && isGalleryCategorySlug(slug)) return true
  return false
}

function contentEnLayoutFromDe(
  slug: string,
  pageDe: PageDoc,
): Record<string, unknown>[] | undefined {
  if (!isContentEnLayoutSeedSlug(slug) || !Array.isArray(pageDe.layout)) return undefined

  if (slug === 'publications' && pageDe.layout.length >= 2) {
    const bookImage = (pageDe.layout[0] as Record<string, unknown>).image
    const beautyshotsImage = (pageDe.layout[1] as Record<string, unknown>).image
    if (bookImage != null && beautyshotsImage != null) {
      return buildPublicationsEnLayout(bookImage as number | string, beautyshotsImage as number | string)
    }
  }

  return undefined
}

/**
 * Schreibt DE- und EN-Inhalte in Payload.
 * Inhaltsseiten (advertorial, motion): nur Titel — Layout bleibt im CMS.
 * publications: EN-Layout wird aus Seed übersetzt (Bilder aus DE übernommen).
 */
export async function seedPageLocales(payload: Payload): Promise<void> {
  try {
    for (const [slug, locales] of Object.entries(PAGE_LOCALE_CONTENT)) {
      const pageDe = await findPageBySlug(payload, slug, 'de')
      if (!pageDe) continue

      const pageId = Number(pageDe.id)
      const pageType = pageDe.pageType

      for (const locale of ['de', 'en'] as const) {
        const content = locales[locale]
        if (!content) continue

        const data: { title: string; layout?: Record<string, unknown>[] } = {
          title: content.title,
        }

        if (shouldSeedLayout(slug, pageType, locale, content.layout)) {
          data.layout = content.layout
        } else if (locale === 'en') {
          const enLayout = contentEnLayoutFromDe(slug, pageDe)
          if (enLayout) {
            data.layout = enLayout
          }
        }

        if (
          !data.layout &&
          locale === 'en' &&
          (isContentCategorySlug(slug) || pageType === 'content') &&
          !isFullLayoutSeedSlug(slug) &&
          !isContentEnLayoutSeedSlug(slug) &&
          !isCmsManagedLayoutSlug(slug)
        ) {
          const pageEn = await findPageBySlug(payload, slug, 'en')
          const enBlocks = layoutBlockCount(pageEn?.layout)
          const deBlocks = layoutBlockCount(pageDe.layout)

          if (enBlocks === 0 && deBlocks > 0 && Array.isArray(pageDe.layout)) {
            data.layout = pageDe.layout as Record<string, unknown>[]
            payload.logger.info(
              `Copied DE layout to EN for content page "${slug}" (${deBlocks} blocks).`,
            )
          }
        }

        try {
          await upsertPageLocale(payload, pageId, locale, data)
        } catch (error) {
          payload.logger.warn(
            `Page locale ${slug}/${locale} skipped: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }
    }

    await restoreImprintIfPlaceholder(payload)

    payload.logger.info('Page locale content seeded (de + en).')
  } catch (error) {
    payload.logger.error(
      `Page locale seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/** Stellt das vollständige Impressum wieder her, falls der Seed-Platzhalter noch aktiv ist. */
export async function restoreImprintIfPlaceholder(payload: Payload): Promise<void> {
  const pageDe = await findPageBySlug(payload, 'imprint', 'de')
  if (!pageDe) return

  const pageId = Number(pageDe.id)

  if (isPlaceholderImprintLayout(pageDe.layout)) {
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale: 'de',
      data: { layout: buildImprintDeLayout() as never },
    })
    payload.logger.info('Restored imprint DE layout (replaced seed placeholder).')
  }

  const pageEn = await findPageBySlug(payload, 'imprint', 'en')
  if (pageEn && isPlaceholderImprintLayout(pageEn.layout)) {
    await payload.update({
      collection: 'pages',
      id: pageId,
      locale: 'en',
      data: { layout: buildImprintEnLayout() as never },
    })
    payload.logger.info('Restored imprint EN layout (replaced seed placeholder).')
  }
}

function menuLabelForPage(page: unknown, locale: LocaleCode): string | null {
  if (!page || typeof page !== 'object' || !('slug' in page)) return null
  const slug = (page as { slug?: string }).slug
  if (!slug) return null
  return MENU_LABEL_BY_SLUG[slug]?.[locale] ?? null
}

function localizedMenuItems(items: unknown[], locale: LocaleCode): unknown[] {
  return items.map((item) => {
    const record = item as Record<string, unknown>
    const page = record.page
    const label = menuLabelForPage(page, locale)

    const children = Array.isArray(record.children)
      ? localizedMenuItems(record.children, locale)
      : record.children

    if (!label) {
      return { ...record, children }
    }

    return { ...record, label, children }
  })
}

/** Aktualisiert deutsche und englische Menü-Labels. */
export async function seedMenuLocales(payload: Payload): Promise<void> {
  try {
    const menu = await payload.findGlobal({
      slug: 'main-menu',
      depth: 1,
      locale: 'de',
    })

    if (!Array.isArray(menu.items) || menu.items.length === 0) return

    for (const locale of ['de', 'en'] as const) {
      const items = localizedMenuItems(menu.items, locale)

      await payload.updateGlobal({
        slug: 'main-menu',
        locale,
        data: { items: items as never },
      })
    }

    payload.logger.info('Main menu labels seeded (de + en).')
  } catch (error) {
    payload.logger.error(
      `Menu locale seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
