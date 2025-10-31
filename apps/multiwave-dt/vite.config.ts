import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium'
import path from 'path'

export default defineConfig(({ mode }) => {
  // 개발: '/' (절대 경로)
  // staging: './' (상대 경로 - Nginx alias 사용)
  const base = mode === 'development' ? '/' : './'

  return {
    base,
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
    },
  }
})
