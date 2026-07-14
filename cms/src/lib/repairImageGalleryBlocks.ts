import type { Payload } from 'payload'

function extractMediaId(entry: unknown): number | null {
  if (typeof entry === 'number' && Number.isFinite(entry)) return entry

  if (typeof entry === 'string') {
    const parsed = Number.parseInt(entry, 10)
    return Number.isFinite(parsed) ? parsed : null
  }

  if (!entry || typeof entry !== 'object') return null

  if ('image' in entry) {
    const image = (entry as { image?: unknown }).image

    if (typeof image === 'number') return image
    if (typeof image === 'string') {
      const parsed = Number.parseInt(image, 10)
      return Number.isFinite(parsed) ? parsed : null
    }
    if (image && typeof image === 'object' && 'id' in image) {
      const id = (image as { id?: unknown }).id
      return typeof id === 'number' ? id : null
    }
  }

  if ('id' in entry && 'url' in entry) {
    const id = (entry as { id?: unknown }).id
    return typeof id === 'number' ? id : null
  }

  return null
}

async function mediaExists(payload: Payload, id: number): Promise<boolean> {
  try {
    await payload.findByID({
      collection: 'media',
      id,
      depth: 0,
    })
    return true
  } catch {
    return false
  }
}

export async function repairImageGalleryBlocks(payload: Payload): Promise<void> {
  const pages = await payload.find({
    collection: 'pages',
    limit: 200,
    depth: 0,
    pagination: false,
  })

  for (const page of pages.docs) {
    if (!Array.isArray(page.layout)) continue

    let changed = false
    const newLayout: typeof page.layout = []

    for (const block of page.layout as Array<Record<string, unknown>>) {
      if (block.blockType !== 'imageGallery' || !Array.isArray(block.images)) {
        newLayout.push(block as (typeof page.layout)[number])
        continue
      }

      const validIds: number[] = []

      for (const entry of block.images) {
        const id = extractMediaId(entry)
        if (!id) continue

        const exists = await mediaExists(payload, id)
        if (!exists) {
          changed = true
          continue
        }

        if (!validIds.includes(id)) {
          validIds.push(id)
        }
      }

      const previousIds = block.images
        .map((entry) => extractMediaId(entry))
        .filter((id): id is number => id !== null)

      const structureChanged =
        block.images.some((entry) => entry && typeof entry === 'object' && 'image' in entry) ||
        JSON.stringify(previousIds) !== JSON.stringify(validIds)

      if (structureChanged) changed = true

      newLayout.push({
        ...block,
        images: validIds,
      } as unknown as (typeof page.layout)[number])
    }

    if (!changed) continue

    await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        layout: newLayout as typeof page.layout,
      },
    })

    payload.logger.info(`Repaired imageGallery on page: ${page.slug}`)
  }
}
