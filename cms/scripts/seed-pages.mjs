/**
 * Legt Standard-Seiten (contact, imprint, store) an, falls sie noch fehlen.
 *
 * Usage:
 *   cd cms
 *   DATABASE_URL="postgresql://..." PAYLOAD_SECRET="..." node scripts/seed-pages.mjs
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { seedDefaultPages } from '../src/lib/seedDefaultPages.ts'

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is required')
  process.exit(1)
}

const payload = await getPayload({ config })
await seedDefaultPages(payload)
console.log('Default pages seeded (contact, imprint, store).')
process.exit(0)
