import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium'
import path from 'path'

export default defineConfig({
  base: '/aiot',
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
  define: {
    global: 'globalThis',
  },
  server: {
    port: 4000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://192.168.10.181:8101',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
})
