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
    alias: [
      // App alias - must come first
      {
        find: /^@\/(?!lib|atoms|molecules|organisms)/,
        replacement: path.resolve(__dirname, './src') + '/'
      },
      // UI package aliases - resolve @/ imports from UI package
      {
        find: '@/lib',
        replacement: path.resolve(__dirname, '../../packages/ui/src/lib')
      },
      {
        find: '@/atoms',
        replacement: path.resolve(__dirname, '../../packages/ui/src/atoms')
      },
      {
        find: '@/molecules',
        replacement: path.resolve(__dirname, '../../packages/ui/src/molecules')
      },
      {
        find: '@/organisms',
        replacement: path.resolve(__dirname, '../../packages/ui/src/organisms')
      }
    ],
  },
  server: {
    port: 3000,
    host: true,
  },
})