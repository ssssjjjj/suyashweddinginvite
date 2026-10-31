import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // This invitation is entirely client-interactive and has no backend.
      // Generate its HTML at build time so Cloudflare can serve static files.
      prerender: { enabled: true },
    }),
    viteReact(),
  ],
})

export default config
