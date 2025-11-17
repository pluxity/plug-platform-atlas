import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout.tsx'
import DashboardLayout from './components/layout/DashboardLayout.tsx'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/iot-sensors" element={<IoTSensor />} />
                    <Route path="/events" element={<EventsHistoryPage />} />

                  <Route path="/sites/parks" element={<SitePage />} />
                  <Route path="/sites/virtual-patrol" element={<VirtualPatrol />} />

                  <Route path="/devices/sensor-categories" element={<SensorCategoriesPage />} />
                  <Route path="/devices/cctv" element={<CCTV />} />

                  <Route path="/users" element={<Users />} />
                  <Route path="/users/roles" element={<Roles />} />
                  <Route path="/users/permissions" element={<Permissions />} />

                  <Route path="/system/mobius" element={<Mobius />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
