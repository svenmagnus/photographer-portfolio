import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import {
  filenameToTitle,
  getFileBasename,
  inferCategoryFromPath,
  isImageFile,
} from '@/lib/filenameToTitle'
import { PHOTO_CATEGORIES } from '@/collections/Photos'
import { isVercelBlobConfigured } from '@/lib/vercelBlob'

export const maxDuration = 60

const validCategories = new Set(PHOTO_CATEGORIES.map((category) => category.value))

export async function POST(request: Request) {
  if (process.env.VERCEL === '1' && !isVercelBlobConfigured()) {
    return Response.json(
      {
        error:
          'Vercel Blob ist nicht verbunden. Unter Vercel → Storage → Blob mit dem CMS-Projekt verbinden, dann redeployen.',
      },
      { status: 503 },
    )
  }

  const payload = await getPayload({ config })
  const requestHeaders = await headers()
  const { user } = await payload.auth({ headers: requestHeaders })

  if (!user) {
    return Response.json({ error: 'Nicht autorisiert' }, { status: 401 })
  }

  const formData = await request.formData()
  const selectedCategory = formData.get('category')
  const useFolderCategories = formData.get('useFolderCategories') === 'true'

  if (
    typeof selectedCategory !== 'string' ||
    !validCategories.has(selectedCategory as (typeof PHOTO_CATEGORIES)[number]['value'])
  ) {
    return Response.json({ error: 'Ungültige Kategorie' }, { status: 400 })
  }

  const dateValue = formData.get('date')
  const photoDate =
    typeof dateValue === 'string' && dateValue
      ? new Date(dateValue).toISOString()
      : new Date().toISOString()

  const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File)
  const imageFiles = files.filter(isImageFile)

  const oversized = imageFiles.filter((file) => file.size > 4 * 1024 * 1024)
  if (oversized.length > 0) {
    return Response.json(
      {
        error: `${oversized.length} Datei(en) sind größer als 4 MB. Bitte kleinere JPG/WebP-Dateien verwenden.`,
        oversized: oversized.map((file) => file.name),
      },
      { status: 413 },
    )
  }

  if (!imageFiles.length) {
    return Response.json({ error: 'Keine Bilddateien gefunden' }, { status: 400 })
  }

  const created: Array<{ id: number | string; title: string; category: string }> = []
  const failed: Array<{ filename: string; error: string }> = []

  for (const file of imageFiles) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const basename = getFileBasename(file)
      const title = filenameToTitle(basename)
      const inferredCategory = inferCategoryFromPath(file, validCategories)
      const category = (
        useFolderCategories && inferredCategory
          ? inferredCategory
          : selectedCategory
      ) as (typeof PHOTO_CATEGORIES)[number]['value']

      const media = await payload.create({
        collection: 'media',
        data: {
          alt: title,
        },
        file: {
          data: buffer,
          mimetype: file.type || 'application/octet-stream',
          name: basename,
          size: buffer.length,
        },
        user,
      })

      const photo = await payload.create({
        collection: 'photos',
        data: {
          title,
          category,
          image: media.id,
          date: photoDate,
        },
        user,
      })

      created.push({
        id: photo.id,
        title: photo.title as string,
        category: photo.category as string,
      })
    } catch (error) {
      failed.push({
        filename: file.webkitRelativePath || file.name,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler',
      })
    }
  }

  return Response.json({
    created: created.length,
    failed: failed.length,
    photos: created,
    errors: failed,
  })
}
