import React from 'react'

const accentColor = 'var(--theme-text, #111)'

export function AdminMenuLink() {
  return (
    <div
      style={{
        margin: '0 0 0.75rem',
        padding: '0 1rem',
      }}
    >
      <a
        href="/admin/globals/main-menu"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: accentColor,
          fontSize: '0.875rem',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Menü bearbeiten
      </a>
    </div>
  )
}
