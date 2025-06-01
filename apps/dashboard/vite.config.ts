import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // Output folder
  },
  base: '/admin/', // Important: sets the base path for static assets and routing
})
