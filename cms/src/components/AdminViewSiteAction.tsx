'use client'

import React from 'react'

import { usePublicSitePageUrl } from '../hooks/usePublicSitePageUrl'
import { ViewSiteIcon } from './ViewSiteIcon'

const accentColor = 'var(--theme-success-500, #16a34a)'

export function AdminViewSiteAction() {
  const siteUrl = usePublicSitePageUrl()

  return (
    <a
      href={siteUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.375rem 0.75rem',
        border: `1px solid ${accentColor}`,
        borderRadius: 'var(--style-radius-s, 4px)',
        color: accentColor,
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.2,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <ViewSiteIcon />
      Website ansehen
    </a>
  )
}
