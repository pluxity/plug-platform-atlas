import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import PageCard from './components/layout/PageCard'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ForbiddenPage from './pages/ForbiddenPage'
import Dashboard from './pages/main/dashboard/Dashboard.tsx'
import SitePage from './pages/management/sites/parks/SitePage.tsx'
import VirtualPatrol from './pages/management/sites/VirtualPatrol'
import SensorCategoriesPage from './pages/management/devices/sensor/SensorCategoriesPage.tsx'
import AiEdgeDevices from './pages/main/ai-edge/AiEdgeDevices'
import EventsHistoryPage from './pages/main/events/EventsHistoryPage'
import Users from './pages/management/users/Users'
import Roles from './pages/management/users/Roles'
import Permissions from './pages/management/users/Permissions'
import Mobius from './pages/management/system/Mobius'
import IoTSensor from './pages/main/iot/IoTSensor.tsx'
import LedDispatch from './pages/main/announcement/led/LedDispatch.tsx'
import LedPresets from './pages/main/announcement/led/LedPresets.tsx'
import AnnouncementHistory from './pages/main/announcement/AnnouncementHistory.tsx'
import { ANNOUNCEMENT_ENABLED } from './constants/menu'
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
                  <Route path="/ai-edge-devices" element={<Wrapped><AiEdgeDevices /></Wrapped>} />
                  <Route path="/events" element={<Wrapped><EventsHistoryPage /></Wrapped>} />
                  {/*
                    안내방송. 공원 단위 권한은 각 화면에서 useSiteAccess 로 거른다.
                    전광판·프리셋·송출은 /displays, /display-presets API를 사용한다.
                  */}
                  {ANNOUNCEMENT_ENABLED ? (
                    <>
                      <Route path="/announcement/led/dispatch" element={<Wrapped><LedDispatch /></Wrapped>} />
                      <Route path="/announcement/led/presets" element={<Wrapped><LedPresets /></Wrapped>} />
                      <Route path="/announcement/history" element={<Wrapped><AnnouncementHistory /></Wrapped>} />
                    </>
                  ) : (
                    <Route path="/announcement/*" element={<Navigate to="/" replace />} />
                  )}
                  <Route path="/sites/parks" element={<AdminOnly><SitePage /></AdminOnly>} />
                  <Route path="/sites/virtual-patrol" element={<AdminOnly><VirtualPatrol /></AdminOnly>} />
                  <Route path="/devices/sensor-categories" element={<AdminOnly><SensorCategoriesPage /></AdminOnly>} />
                  <Route path="/devices/ai-edge" element={<Navigate to="/ai-edge-devices" replace />} />
                  <Route path="/devices/cctv" element={<Navigate to="/ai-edge-devices?kind=CCTV" replace />} />
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
