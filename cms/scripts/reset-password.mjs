/**
 * Reset a CMS user password (production or local).
 *
 * Usage:
 *   cd cms
 *   DATABASE_URL="postgresql://..." PAYLOAD_SECRET="..." node scripts/reset-password.mjs user@example.com "NeuesPasswort"
 *
 * Pull env vars from Vercel first: vercel env pull .env.production
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: node scripts/reset-password.mjs <email> <new-password>')
  process.exit(1)
}

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is required')
  process.exit(1)
}

const payload = await getPayload({ config })

const result = await payload.find({
  collection: 'users',
  where: { email: { equals: email } },
  limit: 1,
})

const user = result.docs[0]

if (!user) {
  console.error(`No user found for email: ${email}`)
  process.exit(1)
}

await payload.update({
  collection: 'users',
  id: user.id,
  data: { password },
})

console.log(`Password updated for ${email}`)

process.exit(0)
