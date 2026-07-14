'use client'

import React, { useEffect, useState } from 'react'

import { getMediaPreviewUrl, type MediaPreviewSource } from '@/lib/mediaPreviewUrl'

type PhotoImageCellProps = {
  cellData?: MediaPreviewSource | number | string | null
  rowData?: {
    image?: MediaPreviewSource | number | string | null
  }
}

function getMediaId(
  cellData: PhotoImageCellProps['cellData'],
  rowData: PhotoImageCellProps['rowData'],
): number | string | null {
  if (typeof cellData === 'number' || typeof cellData === 'string') return cellData
  if (typeof rowData?.image === 'number' || typeof rowData?.image === 'string') {
    return rowData.image
  }
  return null
}

function getPopulatedMedia(
  cellData: PhotoImageCellProps['cellData'],
  rowData: PhotoImageCellProps['rowData'],
): MediaPreviewSource | null {
  if (cellData && typeof cellData === 'object') return cellData
  if (rowData?.image && typeof rowData.image === 'object') return rowData.image
  return null
}

export function PhotoImageCell({ cellData, rowData }: PhotoImageCellProps) {
  const [media, setMedia] = useState<MediaPreviewSource | null>(() =>
    getPopulatedMedia(cellData, rowData),
  )

  useEffect(() => {
    const populated = getPopulatedMedia(cellData, rowData)
    if (populated) {
      setMedia(populated)
      return
    }

    const mediaId = getMediaId(cellData, rowData)
    if (!mediaId) {
      setMedia(null)
      return
    }

    let cancelled = false

    void fetch(`/api/media/${mediaId}?depth=0`, { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((fetched: MediaPreviewSource | null) => {
        if (!cancelled) setMedia(fetched)
      })
      .catch(() => {
        if (!cancelled) setMedia(null)
      })

    return () => {
      cancelled = true
    }
  }, [cellData, rowData])

  const src = getMediaPreviewUrl(media)
  const alt =
    media && 'alt' in media && typeof media.alt === 'string' ? media.alt : 'Foto-Vorschau'

  if (!src) {
    return <span style={{ color: 'var(--theme-elevation-400)', fontSize: '12px' }}>—</span>
  }

  return (
    <img
      src={src}
      alt={alt}
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
