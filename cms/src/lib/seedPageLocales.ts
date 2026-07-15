import type { Payload } from 'payload'

import {
  MENU_LABEL_BY_SLUG,
  PAGE_LOCALE_CONTENT,
  isContentCategorySlug,
  isFullLayoutSeedSlug,
  isGalleryCategorySlug,
} from './pageLocaleContent'

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

/**
 * Schreibt DE- und EN-Inhalte in Payload.
 * Inhaltsseiten (publications, advertorial, motion): nur Titel — Layout nie überschreiben.
 * Beim ersten EN-Setup: DE-Layout nach EN kopieren, damit du im CMS übersetzen kannst.
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
        } else if (
          locale === 'en' &&
          (isContentCategorySlug(slug) || pageType === 'content') &&
          !isFullLayoutSeedSlug(slug)
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

    payload.logger.info('Page locale content seeded (de + en).')
  } catch (error) {
    payload.logger.error(
      `Page locale seed skipped: ${error instanceof Error ? error.message : String(error)}`,
    )
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
