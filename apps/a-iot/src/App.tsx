import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import MapDashboard from './pages/dashboard/MapDashboard'
import Parks from './pages/sites/Parks'
import VirtualPatrol from './pages/sites/VirtualPatrol'
import SensorCategories from './pages/devices/SensorCategories'
import Sensors from './pages/devices/Sensors'
import CCTV from './pages/devices/CCTV'
import Events from './pages/history/Events'
import Users from './pages/users/Users'
import Roles from './pages/users/Roles'
import Permissions from './pages/users/Permissions'
import Mobius from './pages/system/Mobius'

function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard/map" element={<MapDashboard />} />
          <Route path="/sites/parks" element={<Parks />} />
          <Route path="/sites/virtual-patrol" element={<VirtualPatrol />} />
          <Route path="/devices/sensor-categories" element={<SensorCategories />} />
          <Route path="/devices/sensors" element={<Sensors />} />
          <Route path="/devices/cctv" element={<CCTV />} />
          <Route path="/history/events" element={<Events />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/roles" element={<Roles />} />
          <Route path="/users/permissions" element={<Permissions />} />
          <Route path="/system/mobius" element={<Mobius />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  )
}

export default App