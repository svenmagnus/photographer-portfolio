import type { Payload } from 'payload'

import { MENU_LABEL_BY_SLUG, PAGE_LOCALE_CONTENT } from './pageLocaleContent'

type LocaleCode = 'de' | 'en'

async function findPageBySlug(payload: Payload, slug: string) {
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    locale: 'de',
  })

  return result.docs[0] ?? null
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

/** Schreibt DE- und EN-Inhalte für alle bekannten Seiten in Payload. */
export async function seedPageLocales(payload: Payload): Promise<void> {
  try {
    for (const [slug, locales] of Object.entries(PAGE_LOCALE_CONTENT)) {
      const page = await findPageBySlug(payload, slug)
      if (!page) continue

      for (const locale of ['de', 'en'] as const) {
        const content = locales[locale]
        if (!content) continue

        try {
          await upsertPageLocale(payload, Number(page.id), locale, {
            title: content.title,
            ...(content.layout ? { layout: content.layout } : {}),
          })
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
