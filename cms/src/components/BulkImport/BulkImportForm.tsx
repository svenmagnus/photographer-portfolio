'use client'

import React, { useMemo, useState } from 'react'

import type { PhotoCategory } from '../../collections/Photos'
import { PHOTO_CATEGORIES } from '../../collections/Photos'
import { isImageFile } from '../../lib/filenameToTitle'

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const MAX_BATCH_BYTES = 3 * 1024 * 1024

function buildUploadBatches(files: File[]): File[][] {
  const batches: File[][] = []
  let currentBatch: File[] = []
  let currentSize = 0

  for (const file of files) {
    if (file.size > MAX_UPLOAD_BYTES) {
      batches.push([file])
      continue
    }

    if (currentBatch.length > 0 && currentSize + file.size > MAX_BATCH_BYTES) {
      batches.push(currentBatch)
      currentBatch = []
      currentSize = 0
    }

    currentBatch.push(file)
    currentSize += file.size
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }

  return batches
}

type ImportResult = {
  created: number
  failed: number
  photos: Array<{ id: number | string; title: string; category?: string }>
  errors: Array<{ filename: string; error: string }>
}

export function BulkImportForm() {
  const [category, setCategory] = useState<PhotoCategory>(
    PHOTO_CATEGORIES[0]?.value ?? 'hollywood',
  )
  const [useFolderCategories, setUseFolderCategories] = useState(true)
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0 })
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const imageCount = useMemo(() => files.filter(isImageFile).length, [files])

  function handleFolderChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    setFiles(selected.filter(isImageFile))
    setResult(null)
    setError(null)
  }

  async function uploadBatch(batch: File[]): Promise<ImportResult> {
    const formData = new FormData()
    formData.set('category', category)
    formData.set('date', date)
    formData.set('useFolderCategories', String(useFolderCategories))
    batch.forEach((file) => formData.append('files', file))

    const response = await fetch('/api/bulk-import', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    const raw = await response.text()
    let data: ImportResult & { error?: string }

    try {
      data = JSON.parse(raw) as ImportResult & { error?: string }
    } catch {
      const message = raw.trim().slice(0, 160)
      throw new Error(
        message.includes('Request Entity Too Large') || message.includes('FUNCTION_PAYLOAD_TOO_LARGE')
          ? 'Upload zu groß für Vercel (max. ca. 4 MB pro Bild). Bitte kleinere JPG/WebP-Dateien verwenden.'
          : message || `Upload fehlgeschlagen (${response.status})`,
      )
    }

    if (!response.ok) {
      throw new Error(data.error || 'Upload fehlgeschlagen')
    }

    return data
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setResult(null)

    const imageFiles = files.filter(isImageFile)
    if (!imageFiles.length) {
      setError('Bitte einen Ordner mit Bilddateien auswählen.')
      return
    }

    const oversized = imageFiles.filter((file) => file.size > MAX_UPLOAD_BYTES)
    if (oversized.length > 0) {
      setError(
        `${oversized.length} Datei(en) sind größer als 4 MB und können online nicht hochgeladen werden. Bitte vorher exportieren/verkleinern (JPG/WebP).`,
      )
      return
    }

    setIsUploading(true)
    setProgress({ done: 0, total: imageFiles.length })

    const combined: ImportResult = {
      created: 0,
      failed: 0,
      photos: [],
      errors: [],
    }

    const batches = buildUploadBatches(imageFiles)

    try {
      for (const batch of batches) {
        const batchResult = await uploadBatch(batch)

        combined.created += batchResult.created
        combined.failed += batchResult.failed
        combined.photos.push(...batchResult.photos)
        combined.errors.push(...batchResult.errors)
        setProgress((prev) => ({
          done: Math.min(prev.done + batch.length, imageFiles.length),
          total: imageFiles.length,
        }))
      }

      setResult(combined)
      setFiles([])
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Verbindungsfehler beim Upload')
      if (combined.created > 0) {
        setResult(combined)
      }
    } finally {
      setIsUploading(false)
      setProgress({ done: 0, total: 0 })
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem', maxWidth: '720px' }}>
      <p style={{ margin: 0, lineHeight: 1.5, opacity: 0.85 }}>
        Wähle einen Ordner mit Fotos. Auf Vercel werden Bilder einzeln oder in kleinen Paketen
        hochgeladen (max. ca. 4 MB pro Datei). Titel werden aus dem Dateinamen erzeugt.
      </p>

      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span>Standard-Kategorie</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as PhotoCategory)}
          disabled={isUploading}
          style={{ padding: '0.65rem 0.75rem' }}
        >
          {PHOTO_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={useFolderCategories}
          onChange={(event) => setUseFolderCategories(event.target.checked)}
          disabled={isUploading}
        />
        <span>Kategorie aus Ordnernamen erkennen (z. B. „fashion-clicks/bild.jpg“)</span>
      </label>

      <label style={{ display: 'grid', gap: '0.5rem' }}>
        <span>Datum für alle Fotos</span>
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          disabled={isUploading}
          style={{ padding: '0.65rem 0.75rem' }}
        />
      </label>

      <label
        style={{
          display: 'grid',
          gap: '0.75rem',
          padding: '1.5rem',
          border: '1px dashed var(--theme-elevation-250)',
          cursor: isUploading ? 'not-allowed' : 'pointer',
        }}
      >
        <span style={{ fontWeight: 600 }}>Ordner auswählen</span>
        <span style={{ opacity: 0.8, fontSize: '0.95rem' }}>
          JPG, PNG, WebP, AVIF, TIFF — auch ganze Ordner mit Unterordnern
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          // @ts-expect-error non-standard folder picker attributes
          webkitdirectory=""
          directory=""
          onChange={handleFolderChange}
          disabled={isUploading}
        />
        {imageCount > 0 && (
          <span style={{ fontSize: '0.95rem' }}>
            {imageCount} Bild{imageCount === 1 ? '' : 'er'} ausgewählt
          </span>
        )}
      </label>

      {isUploading && progress.total > 0 && (
        <p style={{ margin: 0 }}>
          Fortschritt: {progress.done} / {progress.total}
        </p>
      )}

      {error && (
        <p style={{ margin: 0, color: 'var(--theme-error-500)' }} role="alert">
          {error}
        </p>
      )}

      {result && (
        <div
          style={{
            padding: '1rem',
            border: '1px solid var(--theme-elevation-250)',
            display: 'grid',
            gap: '0.5rem',
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{result.created}</strong> Foto{result.created === 1 ? '' : 's'} erfolgreich
            importiert.
          </p>
          {result.failed > 0 && (
            <p style={{ margin: 0, color: 'var(--theme-error-500)' }}>
              {result.failed} Datei{result.failed === 1 ? '' : 'en'} fehlgeschlagen.
            </p>
          )}
          <p style={{ margin: 0 }}>
            <a href="/admin/collections/photos">→ Alle Fotos ansehen</a>
          </p>
          {result.errors.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {result.errors.map((entry) => (
                <li key={entry.filename}>
                  {entry.filename}: {entry.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={isUploading || imageCount === 0}
        style={{
          justifySelf: 'start',
          padding: '0.7rem 1.2rem',
          cursor: isUploading || imageCount === 0 ? 'not-allowed' : 'pointer',
        }}
      >
        {isUploading ? 'Import läuft…' : `Ordner importieren (${imageCount || 0})`}
      </button>
    </form>
  )
}
