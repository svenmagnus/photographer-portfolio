/**
 * Listet Media-Dateien auf, die nirgends im CMS verwendet werden.
 *
 * Usage:
 *   cd cms
 *   DATABASE_ADAPTER=postgres node scripts/list-unused-media.mjs
 *   DATABASE_ADAPTER=postgres node scripts/list-unused-media.mjs --delete
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const shouldDelete = process.argv.includes('--delete')

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is required')
  process.exit(1)
}

function collectMediaIds(value, ids) {
  if (!value) return

  if (Array.isArray(value)) {
    for (const entry of value) collectMediaIds(entry, ids)
    return
  }

  if (typeof value === 'number') {
    ids.add(value)
    return
  }

  if (typeof value === 'string' && /^\d+$/.test(value)) {
    ids.add(Number.parseInt(value, 10))
    return
  }

  if (typeof value !== 'object') return

  if ('relationTo' in value && value.relationTo === 'media' && 'value' in value) {
    collectMediaIds(value.value, ids)
    return
  }

  if ('mimeType' in value && 'id' in value && typeof value.id === 'number') {
    ids.add(value.id)
    return
  }

  if ('image' in value) collectMediaIds(value.image, ids)
  if ('poster' in value) collectMediaIds(value.poster, ids)
  if ('images' in value) collectMediaIds(value.images, ids)

  for (const nested of Object.values(value)) {
    if (nested && typeof nested === 'object') collectMediaIds(nested, ids)
  }
}

const payload = await getPayload({ config })
const usedIds = new Set()

const photos = await payload.find({
  collection: 'photos',
  limit: 1000,
  depth: 0,
  pagination: false,
})

for (const photo of photos.docs) {
  collectMediaIds(photo.image, usedIds)
}

const pages = await payload.find({
  collection: 'pages',
  limit: 200,
  depth: 0,
  pagination: false,
})

for (const page of pages.docs) {
  collectMediaIds(page.layout, usedIds)
}

const allMedia = await payload.find({
  collection: 'media',
  limit: 1000,
  depth: 0,
  pagination: false,
})

const unused = allMedia.docs.filter((doc) => !usedIds.has(doc.id))

console.log(`Verwendet: ${usedIds.size}`)
console.log(`Gesamt in Media: ${allMedia.docs.length}`)
console.log(`Unbenutzt: ${unused.length}\n`)

for (const doc of unused) {
  console.log(`- [${doc.id}] ${doc.alt || '(ohne Alt)'} — ${doc.filename || 'ohne Dateiname'}`)
}

if (!unused.length) {
  console.log('\nKeine unbenutzten Dateien gefunden.')
  process.exit(0)
}

if (!shouldDelete) {
  console.log('\nZum Löschen: node scripts/list-unused-media.mjs --delete')
  process.exit(0)
}

console.log('\nLösche unbenutzte Dateien …')

for (const doc of unused) {
  await payload.delete({
    collection: 'media',
    id: doc.id,
  })
  console.log(`Gelöscht: [${doc.id}] ${doc.filename || doc.alt}`)
}

console.log(`\nFertig. ${unused.length} Datei(en) entfernt.`)

process.exit(0)
