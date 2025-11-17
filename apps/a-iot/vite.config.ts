import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesium from 'vite-plugin-cesium'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_BASE_PATH || '/',
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
          target: 'http://192.168.10.181:8101',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
  }
})
