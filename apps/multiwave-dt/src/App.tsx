import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@plug-atlas/ui'
import { TrackingPage } from './pages/TrackingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tracking" replace />} />
        <Route path="/tracking" element={<TrackingPage />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
