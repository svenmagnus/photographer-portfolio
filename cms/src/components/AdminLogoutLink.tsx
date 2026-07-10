'use client'

import React from 'react'

import { Link } from '@payloadcms/ui'

export function AdminLogoutLink() {
  return (
    <div
      style={{
        marginTop: '0.5rem',
        padding: '0.75rem 1rem 1rem',
        borderTop: '1px solid var(--theme-elevation-150)',
      }}
    >
      <Link
        href="/admin/logout"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
        }}
      >
        Abmelden
      </Link>
    </div>
  )
}
