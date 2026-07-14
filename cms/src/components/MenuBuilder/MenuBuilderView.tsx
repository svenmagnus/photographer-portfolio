import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { MenuBuilder } from './MenuBuilder'

export function MenuBuilderView({ initPageResult }: AdminViewServerProps) {
  if (!initPageResult?.req?.user) {
    return <p>Bitte einloggen, um den Menü-Editor zu nutzen.</p>
  }

  return (
    <Gutter>
      <h1 style={{ marginBottom: '0.25rem' }}>Menü-Editor</h1>
      <p style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.75 }}>
        Seiten links auswählen und rechts per Drag &amp; Drop sortieren — Unterpunkte per Einrücken.
      </p>
      <MenuBuilder />
    </Gutter>
  )
}
