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
          target: 'http://apis.data.go.kr',
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/airkorea-api/, ''),
        },
        '/api': {
          target: 'https://dev.pluxity.com',
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (p) => p.replace(/^\/api/, '/aiot/api'),
          cookieDomainRewrite: { 'dev.pluxity.com': 'localhost' },
          cookiePathRewrite: { '/aiot/api': '/api' },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log(`[Proxy] ${req.method} ${req.url} -> https://dev.pluxity.com${proxyReq.path}`)
              console.log(`[Proxy Headers]`, JSON.stringify(proxyReq.getHeaders()))
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              let body = ''
              proxyRes.on('data', (chunk: Buffer) => { body += chunk.toString() })
              proxyRes.on('end', () => {
                console.log(`[Proxy] ${req.url} <- ${proxyRes.statusCode}`)
                if (proxyRes.statusCode !== 200) console.log(`[Proxy Body]`, body.substring(0, 300))
              })
            })
            proxy.on('error', (err, req) => {
              console.error(`[Proxy Error] ${req.url}:`, err.message)
            })
          },
        },
      },
    },
  }
})
