/**
 * Legt Standard-Blog-Beiträge an, falls sie noch fehlen.
 *
 * Usage:
 *   cd cms
 *   DATABASE_URL="postgresql://..." PAYLOAD_SECRET="..." node scripts/seed-blog-posts.mjs
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { seedBlogPosts } from '../src/lib/seedBlogPosts.ts'

if (!process.env.PAYLOAD_SECRET) {
  console.error('PAYLOAD_SECRET is required')
  process.exit(1)
}

const payload = await getPayload({ config })
await seedBlogPosts(payload)
console.log('Blog posts seeded.')
process.exit(0)
