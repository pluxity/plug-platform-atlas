import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@plug-atlas/ui'
import { TrackingPage } from './pages/TrackingPage'

// 개발 환경에서는 basename 없이, staging/production에서는 /multiwave-dt 사용
const basename = import.meta.env.MODE === 'development' ? '/' : '/multiwave-dt'

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Navigate to="/tracking" replace />} />
        <Route path="/tracking" element={<TrackingPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
