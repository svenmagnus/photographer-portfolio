import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'

const site = process.env.PUBLIC_SITE_URL || 'http://localhost:4321'
const base = process.env.PUBLIC_BASE_PATH || '/'

export default defineConfig({
  site,
  base,
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  i18n: {
    locales: ['de', 'en'],
    defaultLocale: 'de',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    define: {
      'import.meta.env.PUBLIC_PAYLOAD_URL': JSON.stringify(
        process.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
      ),
    },
  },
})
