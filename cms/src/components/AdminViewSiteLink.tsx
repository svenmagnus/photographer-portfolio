import React from 'react'

import { getPublicSiteUrl } from '../lib/publicSiteUrl'
import { ViewSiteIcon } from './ViewSiteIcon'

const accentColor = 'var(--theme-success-500, #16a34a)'

export function AdminViewSiteLink() {
  const siteUrl = getPublicSiteUrl()

  return (
    <div
      style={{
        margin: '0 0 0.75rem',
        padding: '0 1rem',
      }}
    >
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: accentColor,
          fontSize: '0.875rem',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        Website ansehen
        <ViewSiteIcon />
      </a>
    </div>
  )
}
