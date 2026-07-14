'use client'

import React, { useEffect, useState } from 'react'

type MediaLike = {
  alt?: string | null
  thumbnailURL?: string | null
  url?: string | null
  sizes?: {
    thumbnail?: {
      url?: string | null
    }
  }
}

type PhotoImageCellProps = {
  cellData?: MediaLike | number | string | null
  rowData?: {
    image?: MediaLike | number | string | null
  }
}

function getThumbnailUrl(media: MediaLike): string | null {
  return media.thumbnailURL || media.sizes?.thumbnail?.url || media.url || null
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

export function PhotoImageCell({ cellData, rowData }: PhotoImageCellProps) {
  const [src, setSrc] = useState<string | null>(() => {
    const media =
      cellData && typeof cellData === 'object'
        ? cellData
        : rowData?.image && typeof rowData.image === 'object'
          ? rowData.image
          : null

    return media ? getThumbnailUrl(media) : null
  })
  const [alt, setAlt] = useState('')

  useEffect(() => {
    const populated =
      cellData && typeof cellData === 'object'
        ? cellData
        : rowData?.image && typeof rowData.image === 'object'
          ? rowData.image
          : null

    if (populated) {
      setSrc(getThumbnailUrl(populated))
      setAlt(populated.alt || '')
      return
    }

    const mediaId = getMediaId(cellData, rowData)
    if (!mediaId) {
      setSrc(null)
      setAlt('')
      return
    }

    let cancelled = false

    void fetch(`/api/media/${mediaId}?depth=0`, { credentials: 'include' })
      .then((response) => (response.ok ? response.json() : null))
      .then((media: MediaLike | null) => {
        if (cancelled || !media) return
        setSrc(getThumbnailUrl(media))
        setAlt(media.alt || '')
      })
      .catch(() => {
        if (!cancelled) {
          setSrc(null)
          setAlt('')
        }
      })

    return () => {
      cancelled = true
    }
  }, [cellData, rowData])

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
