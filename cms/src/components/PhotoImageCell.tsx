import type { Media } from '@/payload-types'

type PhotoImageCellProps = {
  cellData?: Media | number | string | null
  payload: {
    findByID: (args: { collection: 'media'; id: number | string }) => Promise<Media>
  }
  rowData?: {
    image?: Media | number | string | null
  }
}

function getThumbnailUrl(media: Media): string | null {
  return media.thumbnailURL || media.sizes?.thumbnail?.url || media.url || null
}

async function resolveMedia(
  cellData: PhotoImageCellProps['cellData'],
  rowData: PhotoImageCellProps['rowData'],
  payload: PhotoImageCellProps['payload'],
): Promise<Media | null> {
  if (cellData && typeof cellData === 'object') {
    return cellData
  }

  if (rowData?.image && typeof rowData.image === 'object') {
    return rowData.image
  }

  const mediaId =
    (typeof cellData === 'number' || typeof cellData === 'string' ? cellData : null) ??
    (typeof rowData?.image === 'number' || typeof rowData?.image === 'string'
      ? rowData.image
      : null)

  if (!mediaId) return null

  try {
    return await payload.findByID({
      collection: 'media',
      id: mediaId,
    })
  } catch {
    return null
  }
}

export async function PhotoImageCell({ cellData, payload, rowData }: PhotoImageCellProps) {
  const media = await resolveMedia(cellData, rowData, payload)
  const src = media ? getThumbnailUrl(media) : null

  if (!src) {
    return <span style={{ color: 'var(--theme-elevation-400)', fontSize: '12px' }}>—</span>
  }

  return (
    <img
      src={src}
      alt={media?.alt || ''}
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      style={{
        display: 'block',
        width: '48px',
        height: '48px',
        objectFit: 'cover',
        borderRadius: '4px',
        backgroundColor: 'var(--theme-elevation-100)',
      }}
    />
  )
}
