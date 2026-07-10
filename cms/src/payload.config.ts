import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Photos } from './collections/Photos'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
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
const useVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN)

const serverURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const plugins = useVercelBlob
  ? [
      vercelBlobStorage({
        collections: {
          media: true,
        },
        token: process.env.BLOB_READ_WRITE_TOKEN,
        clientUploads: true,
        addRandomSuffix: true,
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Photos],
  globals: [SiteSettings],
  cors: process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? [
    'http://localhost:4321',
  ],
  csrf: process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? [
    'http://localhost:4321',
  ],
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
        prodMigrations: migrations,
      })
    : sqliteAdapter({
        client: {
          url: process.env.DATABASE_URL || 'file:./cms.db',
        },
      }),
  plugins,
  sharp,
  serverURL,
})
