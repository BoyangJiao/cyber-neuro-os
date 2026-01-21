import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['@sanity/visual-editing/react', 'styled-components']
  },
  server: {
    port: 5173,
    strictPort: true,
  }
})
