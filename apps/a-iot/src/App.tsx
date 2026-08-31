import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import PageCard from './components/layout/PageCard'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ForbiddenPage from './pages/ForbiddenPage'
import Dashboard from './pages/main/dashboard/Dashboard.tsx'
import SitePage from './pages/management/sites/parks/SitePage.tsx'
import VirtualPatrol from './pages/management/sites/VirtualPatrol'
import SensorCategoriesPage from './pages/management/devices/sensor/SensorCategoriesPage.tsx'
import CCTV from './pages/management/devices/cctv/CCTV.tsx'
import EventsHistoryPage from './pages/main/events/EventsHistoryPage'
import Users from './pages/management/users/Users'
import Roles from './pages/management/users/Roles'
import Permissions from './pages/management/users/Permissions'
import Mobius from './pages/management/system/Mobius'
import IoTSensor from './pages/main/iot/IoTSensor.tsx'
// 2026-08-31 임시 숨김 — CCTV 모니터링(라이브) 비활성화
// import CctvMonitoring from './pages/main/cctv-monitoring/CctvMonitoring.tsx'

/** Wrap pages with white card container */
function Wrapped({ children }: { children: React.ReactNode }) {
  return <PageCard>{children}</PageCard>
}

/** 관리 페이지: ADMIN 역할 보유자만 접근 가능 (비관리자는 /forbidden 으로) */
function AdminOnly({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <PageCard>{children}</PageCard>
    </ProtectedRoute>
  )
}

function App() {
  const basename = import.meta.env.VITE_BASE_PATH === './' ? '/aiot' : (import.meta.env.VITE_BASE_PATH || '/')

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* 2026-08-31 임시 숨김 — CCTV 모니터링(라이브) 비활성화. 복구 시 menu.ts 의 hidden 플래그도 함께 해제 */}
                  {/* <Route path="/cctv-monitoring" element={<CctvMonitoring />} /> */}
                  <Route path="/iot-sensors" element={<Wrapped><IoTSensor /></Wrapped>} />
                  <Route path="/events" element={<Wrapped><EventsHistoryPage /></Wrapped>} />
                  <Route path="/sites/parks" element={<AdminOnly><SitePage /></AdminOnly>} />
                  <Route path="/sites/virtual-patrol" element={<AdminOnly><VirtualPatrol /></AdminOnly>} />
                  <Route path="/devices/sensor-categories" element={<AdminOnly><SensorCategoriesPage /></AdminOnly>} />
                  <Route path="/devices/cctv" element={<AdminOnly><CCTV /></AdminOnly>} />
                  <Route path="/users" element={<AdminOnly><Users /></AdminOnly>} />
                  <Route path="/users/roles" element={<AdminOnly><Roles /></AdminOnly>} />
                  <Route path="/users/permissions" element={<AdminOnly><Permissions /></AdminOnly>} />
                  <Route path="/system/mobius" element={<AdminOnly><Mobius /></AdminOnly>} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
