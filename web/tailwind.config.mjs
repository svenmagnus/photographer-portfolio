/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      colors: {
        portfolio: {
          black: '#000000',
          white: '#ffffff',
          muted: '#888888',
        },
      },
    },
  },
  plugins: [],
}
