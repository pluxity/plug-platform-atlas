import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiProvider } from '@plug-atlas/api-hooks'
import App from './App'
import './index.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

// API 설정
const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://dev.pluxity.com/api',
  timeout: 30000,
  onUnauthorized: () => {
    // 401 에러 시 로그인 페이지로 리다이렉트
    console.warn('에러 페이지로 이동합니다.')
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider config={apiConfig}>
      <App />
    </ApiProvider>
  </StrictMode>,
)