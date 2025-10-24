import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ForbiddenPage from './pages/ForbiddenPage'
import Dashboard from './pages/Dashboard'
import MapDashboard from './pages/dashboard/MapDashboard'
import Parks from './pages/sites/Parks'
import VirtualPatrol from './pages/sites/VirtualPatrol'
import SensorCategoriesPage from './pages/devices/sensor/category/SensorCategoriesPage.tsx'
import Sensors from './pages/devices/sensor/list/Sensors.tsx'
import CCTV from './pages/devices/CCTV'
import Events from './pages/history/Events'
import Users from './pages/users/Users'
import Roles from './pages/users/Roles'
import Permissions from './pages/users/Permissions'
import Mobius from './pages/system/Mobius'
import SensorCategoryDetailPage from "./pages/devices/sensor/detail/SensorCategoryDetailPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard/map" element={<MapDashboard />} />
                  <Route path="/sites/parks" element={<Parks />} />
                  <Route path="/sites/virtual-patrol" element={<VirtualPatrol />} />
                  <Route path="/devices/sensors" element={<SensorCategoriesPage />} />
                  <Route path="/devices/sensors/:id" element={<SensorCategoryDetailPage />} />
                  <Route path="/sensors" element={<Sensors />} />
                  <Route path="/devices/cctv" element={<CCTV />} />
                  <Route path="/history/events" element={<Events />} />
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
