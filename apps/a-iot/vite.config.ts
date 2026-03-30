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
        '/kma-api': {
          target: 'https://apihub.kma.go.kr',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/kma-api/, ''),
        },
        '/airkorea-api': {
          target: 'https://apis.data.go.kr',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/airkorea-api/, ''),
        },
        '/api': {
          target: 'http://192.168.10.181:8109',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
        '/eds-api': {
          target: 'http://115.93.67.42:28087',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/eds-api/, ''),
        },
      },
    },
  }
})
