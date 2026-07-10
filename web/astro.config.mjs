import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'

const site = process.env.PUBLIC_SITE_URL || 'http://localhost:4321'
const base = process.env.PUBLIC_BASE_PATH || '/'

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [tailwind()],
  vite: {
    define: {
      'import.meta.env.PUBLIC_PAYLOAD_URL': JSON.stringify(
        process.env.PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
      ),
    },
  },
})
