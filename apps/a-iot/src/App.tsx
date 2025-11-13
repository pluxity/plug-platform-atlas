import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ForbiddenPage from './pages/ForbiddenPage'
import Dashboard from './pages/Dashboard'
import SitePage from './pages/sites/parks/SitePage.tsx'
import VirtualPatrol from './pages/sites/VirtualPatrol'
import SensorCategoriesPage from './pages/devices/SensorCategoriesPage'
import Sensors from './pages/devices/Sensors.tsx'
import CCTV from './pages/devices/CCTV'
import EventsHistoryPage from './pages/events/EventsHistoryPage'
import Users from './pages/users/Users'
import Roles from './pages/users/Roles'
import Permissions from './pages/users/Permissions'
import Mobius from './pages/system/Mobius'
import IoTSensor from './pages/IoTSensor'

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
                  <Route path="/devices/sensors" element={<Sensors />} />
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
