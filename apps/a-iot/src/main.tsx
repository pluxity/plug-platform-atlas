import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiProvider } from '@plug-atlas/api-hooks'
import { useAuthStore } from './stores/authStore'
import App from './App'
import './index.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const basePath = import.meta.env.VITE_BASE_PATH === './' ? '/aiot' : (import.meta.env.VITE_BASE_PATH || '')

const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  onUnauthorized: () => {
    useAuthStore.getState().logout()
    window.location.href = `${basePath.replace(/\/$/, '')}/login`
  },
  onForbidden: () => {
    window.location.href = `${basePath.replace(/\/$/, '')}/forbidden`
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider config={apiConfig}>
      <App />
    </ApiProvider>
  </StrictMode>,
)
