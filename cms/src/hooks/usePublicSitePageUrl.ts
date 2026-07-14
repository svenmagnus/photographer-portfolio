'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useMemo } from 'react'

import { buildPageUrl, getPublicSiteUrl } from '../lib/publicSiteUrl'

export function usePublicSitePageUrl(): string {
  const { collectionSlug, data } = useDocumentInfo()

  return useMemo(() => {
    const base = getPublicSiteUrl()

    if (collectionSlug === 'pages') {
      const slug = typeof data?.slug === 'string' ? data.slug.trim() : ''
      if (slug) return buildPageUrl(base, slug)
    }

    return base
  }, [collectionSlug, data?.slug])
}
