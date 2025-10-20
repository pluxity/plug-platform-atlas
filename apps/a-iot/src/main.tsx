import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiProvider } from '@plug-atlas/api-hooks'
import { useAuthStore } from './stores/authStore'
import App from './App'
import './index.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'

const apiConfig = {
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  onUnauthorized: () => {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  },
  onForbidden: () => {
    window.location.href = '/forbidden'
  },
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApiProvider config={apiConfig}>
      <App />
    </ApiProvider>
  </StrictMode>,
)
