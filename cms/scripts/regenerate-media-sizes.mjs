/**
 * Regeneriert fehlende thumbnail/grid/fullscreen-Dateien auf Vercel Blob.
 *
 * Usage (lokal mit CMS-Env):
 *   cd cms
 *   node scripts/regenerate-media-sizes.mjs
 *
 * Oder nach Deploy als Admin (Cookie-Session):
 *   POST /api/regenerate-media-sizes  { "limit": 25, "offset": 0 }
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { regenerateMediaSizes } from '../src/lib/regenerateMediaSizes.ts'

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is required')
  process.exit(1)
}

const limit = Number.parseInt(process.env.REGEN_LIMIT || '50', 10)
const offset = Number.parseInt(process.env.REGEN_OFFSET || '0', 10)
const force = process.env.REGEN_FORCE === 'true'

const payload = await getPayload({ config })
const result = await regenerateMediaSizes(payload, { limit, offset, force })

console.log(JSON.stringify(result, null, 2))
process.exit(result.errors.length ? 1 : 0)
