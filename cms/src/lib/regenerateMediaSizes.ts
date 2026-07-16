import { put } from '@vercel/blob'
import sharp from 'sharp'
import type { Payload } from 'payload'

import { getBlobAuthOptions, getVercelBlobReadWriteToken, usesVercelBlobOidc } from '@/lib/vercelBlob'

type MediaSizeConfig = {
  name: 'thumbnail' | 'grid' | 'fullscreen'
  width: number
  height?: number
  quality: number
  crop?: boolean
}

const SIZE_CONFIGS: MediaSizeConfig[] = [
  { name: 'thumbnail', width: 480, height: 480, quality: 82, crop: true },
  { name: 'grid', width: 1200, quality: 82 },
  { name: 'fullscreen', width: 2400, quality: 85 },
]

type MediaDoc = {
  id: number | string
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<
    string,
    {
      url?: string | null
      filename?: string | null
      width?: number | null
      height?: number | null
      filesize?: number | null
      mimeType?: string | null
    } | null
  > | null
}

function baseNameWithoutExt(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').replace(/-\d+x\d+$/, '')
}

function sizeFilename(originalFilename: string, width: number, height: number): string {
  // Strip accidental prior size suffix and random-looking trailing segments for clean names
  const stem = originalFilename
    .replace(/\.[^.]+$/, '')
    .replace(/-\d+x\d+$/, '')
  return `${stem}-${width}x${height}.webp`
}

function blobBaseUrl(storeUrl: string): string {
  try {
    const url = new URL(storeUrl)
    return `${url.origin}`
  } catch {
    return storeUrl.replace(/\/[^/]+$/, '')
  }
}

async function blobExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

async function buildSize(
  buffer: Buffer,
  config: MediaSizeConfig,
  sourceWidth: number,
  sourceHeight: number,
): Promise<{ buffer: Buffer; width: number; height: number } | null> {
  let width = config.width
  let height = config.height

  if (config.crop && height) {
    const resized = await sharp(buffer)
      .rotate()
      .resize(width, height, { fit: 'cover', position: 'centre' })
      .webp({ quality: config.quality })
      .toBuffer({ resolveWithObject: true })

    return {
      buffer: resized.data,
      width: resized.info.width,
      height: resized.info.height,
    }
  }

  // Don't enlarge past source
  const maxSourceEdge = Math.max(sourceWidth, sourceHeight)
  if (width > maxSourceEdge && !height) {
    return null
  }

  if (!height) {
    height = Math.round((sourceHeight * width) / sourceWidth)
  }

  if (sourceWidth <= width && sourceHeight <= (height || sourceHeight)) {
    // Already within target — still emit a webp derivative for consistent delivery
    width = sourceWidth
    height = sourceHeight
  }

  const resized = await sharp(buffer)
    .rotate()
    .resize({
      width,
      height: config.height,
      fit: config.height ? 'cover' : 'inside',
      position: 'centre',
      withoutEnlargement: true,
    })
    .webp({ quality: config.quality })
    .toBuffer({ resolveWithObject: true })

  return {
    buffer: resized.data,
    width: resized.info.width,
    height: resized.info.height,
  }
}

export async function regenerateMediaSizes(
  payload: Payload,
  options: { limit?: number; offset?: number; force?: boolean } = {},
): Promise<{
  processed: number
  updated: number
  skipped: number
  errors: string[]
}> {
  const token = getVercelBlobReadWriteToken()
  if (!token && !usesVercelBlobOidc()) {
    throw new Error('BLOB_READ_WRITE_TOKEN fehlt — Größen können nicht nach Blob geschrieben werden.')
  }

  const limit = options.limit ?? 25
  const offset = options.offset ?? 0
  const force = options.force === true

  const result = await payload.find({
    collection: 'media',
    limit,
    page: Math.floor(offset / limit) + 1,
    depth: 0,
    sort: 'id',
  })

  const authOptions = getBlobAuthOptions()
  let updated = 0
  let skipped = 0
  const errors: string[] = []

  for (const doc of result.docs as MediaDoc[]) {
    if (!doc.url) {
      skipped += 1
      continue
    }

    try {
      const sizes = { ...(doc.sizes || {}) }
      let needsUpdate = force

      if (!force) {
        for (const config of SIZE_CONFIGS) {
          const existing = sizes[config.name]
          if (!existing?.url || !(await blobExists(existing.url))) {
            needsUpdate = true
            break
          }
        }
      }

      if (!needsUpdate) {
        skipped += 1
        continue
      }

      const originalResponse = await fetch(doc.url)
      if (!originalResponse.ok) {
        errors.push(`Media ${doc.id}: Original nicht ladbar (${originalResponse.status})`)
        continue
      }

      const originalBuffer = Buffer.from(await originalResponse.arrayBuffer())
      const meta = await sharp(originalBuffer).metadata()
      const sourceWidth = meta.width || doc.width || 0
      const sourceHeight = meta.height || doc.height || 0

      if (!sourceWidth || !sourceHeight) {
        errors.push(`Media ${doc.id}: Keine Bildmaße`)
        continue
      }

      const base = blobBaseUrl(doc.url)
      const sourceFilename = doc.filename || doc.url.split('/').pop() || `media-${doc.id}.webp`

      for (const config of SIZE_CONFIGS) {
        const built = await buildSize(originalBuffer, config, sourceWidth, sourceHeight)
        if (!built) {
          sizes[config.name] = {
            url: null,
            filename: null,
            width: null,
            height: null,
            filesize: null,
            mimeType: null,
          }
          continue
        }

        const filename = sizeFilename(sourceFilename, built.width, built.height)
        const pathname = filename

        const uploaded = await put(pathname, built.buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'image/webp',
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          allowOverwrite: true,
          ...authOptions,
        })

        sizes[config.name] = {
          url: uploaded.url || `${base}/${filename}`,
          filename,
          width: built.width,
          height: built.height,
          filesize: built.buffer.byteLength,
          mimeType: 'image/webp',
        }
      }

      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          sizes,
        } as never,
        overwriteExistingFiles: false,
      })

      updated += 1
      payload.logger.info(`Regenerated media sizes for ${doc.id} (${baseNameWithoutExt(sourceFilename)})`)
    } catch (error) {
      errors.push(
        `Media ${doc.id}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  return {
    processed: result.docs.length,
    updated,
    skipped,
    errors,
  }
}
