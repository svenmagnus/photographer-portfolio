/**
 * Schreibt lokalisierte Seiteninhalte (DE/EN) in Payload — u. a. englisches Publications-Layout.
 *
 * Usage:
 *   cd cms
 *   node scripts/seed-page-locales.mjs
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { seedPageLocales, seedMenuLocales } from '../src/lib/seedPageLocales.ts'

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is required')
  process.exit(1)
}

const payload = await getPayload({ config })
await seedPageLocales(payload)
await seedMenuLocales(payload)
console.log('Page and menu locales seeded (de + en).')
process.exit(0)
