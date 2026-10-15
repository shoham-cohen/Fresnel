import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // fresnel-api (api/), started with `npm run start:dev`
    proxy: { '/api': 'http://localhost:3000' },
  },
})
