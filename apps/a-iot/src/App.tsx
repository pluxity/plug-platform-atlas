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
import CctvMonitoring from './pages/main/cctv-monitoring/CctvMonitoring.tsx'

/** Wrap admin/management pages with white card container */
function Wrapped({ children }: { children: React.ReactNode }) {
  return <PageCard>{children}</PageCard>
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
                  <Route path="/cctv-monitoring" element={<CctvMonitoring />} />
                  <Route path="/iot-sensors" element={<Wrapped><IoTSensor /></Wrapped>} />
                  <Route path="/events" element={<Wrapped><EventsHistoryPage /></Wrapped>} />
                  <Route path="/sites/parks" element={<Wrapped><SitePage /></Wrapped>} />
                  <Route path="/sites/virtual-patrol" element={<Wrapped><VirtualPatrol /></Wrapped>} />
                  <Route path="/devices/sensor-categories" element={<Wrapped><SensorCategoriesPage /></Wrapped>} />
                  <Route path="/devices/cctv" element={<Wrapped><CCTV /></Wrapped>} />
                  <Route path="/users" element={<Wrapped><Users /></Wrapped>} />
                  <Route path="/users/roles" element={<Wrapped><Roles /></Wrapped>} />
                  <Route path="/users/permissions" element={<Wrapped><Permissions /></Wrapped>} />
                  <Route path="/system/mobius" element={<Wrapped><Mobius /></Wrapped>} />
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
