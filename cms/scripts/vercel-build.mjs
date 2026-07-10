import { execSync } from 'node:child_process'

const nodeOptions = '--no-deprecation --max-old-space-size=8000'
const env = { ...process.env, NODE_OPTIONS: nodeOptions }

function run(command) {
  execSync(command, { stdio: 'inherit', env })
}

const connectionString =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  ''

const usePostgres =
  process.env.DATABASE_ADAPTER === 'postgres' ||
  connectionString.startsWith('postgres://') ||
  connectionString.startsWith('postgresql://')

if (process.env.VERCEL === '1' && usePostgres) {
  console.log('Running database migrations before build...')
  run('cross-env NODE_OPTIONS=--no-deprecation payload migrate')
}

console.log('Building Next.js app...')
run(`cross-env NODE_OPTIONS="${nodeOptions}" next build`)
