import type { AdminViewServerProps } from 'payload'

import { Gutter } from '@payloadcms/ui'
import React from 'react'

import { BulkImportForm } from './BulkImportForm'

export function BulkImportView({ initPageResult }: AdminViewServerProps) {
  if (!initPageResult?.req?.user) {
    return <p>Bitte einloggen, um den Ordner-Import zu nutzen.</p>
  }

  return (
    <Gutter>
      <h1 style={{ marginBottom: '0.25rem' }}>Ordner-Import</h1>
      <p style={{ marginTop: 0, marginBottom: '1.5rem', opacity: 0.75 }}>
        Ganze Ordner mit Bildern auf einmal hochladen
      </p>
      <BulkImportForm />
    </Gutter>
  )
}
