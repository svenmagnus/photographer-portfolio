'use client'

import React from 'react'

import { getMediaPreviewUrl, type MediaPreviewSource } from '@/lib/mediaPreviewUrl'

type MediaFilenameCellProps = {
  cellData?: string | null
  rowData?: MediaPreviewSource & {
    filename?: string | null
    mimeType?: string | null
    alt?: string | null
  }
}

export function MediaFilenameCell({ cellData, rowData }: MediaFilenameCellProps) {
  const filename = cellData || rowData?.filename || ''
  const src = getMediaPreviewUrl(rowData)
  const isImage = rowData?.mimeType?.startsWith('image/') ?? true

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
      {isImage && src ? (
        <img
          src={src}
          alt={rowData?.alt || filename}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          style={{
            flexShrink: 0,
            display: 'block',
            width: '40px',
            height: '40px',
            objectFit: 'cover',
            borderRadius: '4px',
            backgroundColor: 'var(--theme-elevation-100)',
          }}
        />
      ) : (
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            width: '40px',
            height: '40px',
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
      )}
      <span
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {filename}
      </span>
    </div>
  )
}
