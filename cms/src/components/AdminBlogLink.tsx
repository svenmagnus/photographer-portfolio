import React from 'react'

const accentColor = 'var(--theme-text, #111)'

export function AdminBlogLink() {
  return (
    <div
      style={{
        margin: '0 0 0.75rem',
        padding: '0 1rem',
      }}
    >
      <a
        href="/admin/collections/blog-posts"
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
        Blog-Beiträge
      </a>
    </div>
  )
}
