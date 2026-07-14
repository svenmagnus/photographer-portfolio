import React from 'react'

export function MenuBuilderLink() {
  return (
    <div
      style={{
        marginBottom: '0.75rem',
        padding: '0.85rem 1rem',
        border: '1px solid var(--theme-elevation-250)',
        borderRadius: '4px',
      }}
    >
      <strong>Menü:</strong>{' '}
      <a href="/admin/globals/main-menu">Menü-Editor öffnen (WordPress-Stil)</a>
    </div>
  )
}
