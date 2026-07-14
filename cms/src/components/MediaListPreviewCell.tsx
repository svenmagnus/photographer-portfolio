'use client'

import React from 'react'

import { getMediaPreviewUrl, type MediaPreviewSource } from '@/lib/mediaPreviewUrl'

type MediaListPreviewCellProps = {
  rowData?: MediaPreviewSource & {
    filename?: string | null
    mimeType?: string | null
    alt?: string | null
  }
}

export function MediaListPreviewCell({ rowData }: MediaListPreviewCellProps) {
  const src = getMediaPreviewUrl(rowData)
  const isImage = rowData?.mimeType?.startsWith('image/') ?? true
  const label = rowData?.alt || rowData?.filename || 'Media'

  if (!isImage || !src) {
    return (
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          width: '48px',
          height: '48px',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          backgroundColor: 'var(--theme-elevation-100)',
          fontSize: '11px',
          color: 'var(--theme-elevation-500)',
        }}
      >
        FILE
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={label}
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
