import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { getEmailConfig, isEmailConfigured } from './lib/email'
import { isVercelBlobConfigured } from './lib/vercelBlob'
import { vercelBlobStorage } from './storage/vercelBlobStorage'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Photos } from './collections/Photos'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { seedDefaultPages } from './lib/seedDefaultPages'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function getPostgresConnectionString(): string {
  return (
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    ''
  )
}

function shouldUsePostgres(): boolean {
  if (process.env.DATABASE_ADAPTER === 'postgres') return true
  if (process.env.DATABASE_ADAPTER === 'sqlite') return false

  const connectionString = getPostgresConnectionString()
  return (
    connectionString.startsWith('postgres://') ||
    connectionString.startsWith('postgresql://')
  )
}

const usePostgres = shouldUsePostgres()
const postgresConnectionString = getPostgresConnectionString()
const useVercelBlob = isVercelBlobConfigured()
const isVercel = process.env.VERCEL === '1'

if (isVercel && !useVercelBlob) {
  console.warn(
    'WARN: Vercel Blob ist nicht verbunden — Bild-Uploads schlagen fehl. Unter Vercel → Storage → Blob mit dem CMS-Projekt verbinden und redeployen.',
  )
}

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const envCorsOrigins =
  process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []

const defaultFrontendOrigins = isVercel
  ? [
      'https://svenmagnus.com',
      'https://www.svenmagnus.com',
      'https://photographer-portfolio-web.vercel.app',
    ]
  : ['http://localhost:4321']

const frontendOrigins = envCorsOrigins.length > 0 ? envCorsOrigins : defaultFrontendOrigins

const webOrigins =
  process.env.WEB_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) ?? []

// Admin requests come from the CMS domain — must be allowed for CSRF/CORS.
const trustedOrigins = [...new Set([...frontendOrigins, ...webOrigins, serverURL])]

const plugins = useVercelBlob
  ? [
      vercelBlobStorage({
        collections: {
          media: {
            // Serve images directly from the public Blob CDN (proxy /api/media/file/* returns 404 on Vercel).
            disablePayloadAccessControl: true,
          },
        },
        clientUploads: true,
        addRandomSuffix: true,
      }),
    ]
  : []

const email = getEmailConfig()

if (isVercel && !isEmailConfigured()) {
  console.warn(
    'WARN: E-Mail ist nicht konfiguriert — „Forgot password“ sendet keine Mails. SMTP_* Variablen in Vercel setzen oder cms/scripts/reset-password.mjs nutzen.',
  )
}

export default buildConfig({
  ...(email ? { email } : {}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/AdminLogoutLink#AdminLogoutLink'],
    },
  },
  collections: [Users, Media, Photos, Pages],
  globals: [SiteSettings],
  cors: trustedOrigins,
  csrf: trustedOrigins,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: usePostgres
    ? postgresAdapter({
        pool: {
          connectionString: postgresConnectionString,
        },
        blocksAsJSON: true,
        prodMigrations: migrations,
        push: isVercel,
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./cms.db',
        },
      }),
  plugins,
  sharp,
  serverURL,
  onInit: async (payload) => {
    await seedDefaultPages(payload)
  },
})
