import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cesium()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 4000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://dev.pluxity.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
