import React from 'react'

export function BulkImportLink() {
  return (
    <div
      style={{
        marginBottom: '1rem',
        padding: '1rem',
        border: '1px solid var(--theme-elevation-250)',
      }}
    >
      <strong>Ordner-Import:</strong>{' '}
      <a href="/admin/collections/photos/bulk-import">Ganze Ordner mit Bildern auf einmal hochladen</a>
    </div>
  )
}
