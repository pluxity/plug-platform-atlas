import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Dashboard'
import FacilityManagement from './pages/FacilityManagement'
import Users from './pages/users/Users'
import Roles from './pages/users/Roles'
import Permissions from './pages/users/Permissions'

function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/facilities" element={<FacilityManagement />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/roles" element={<Roles />} />
          <Route path="/users/permissions" element={<Permissions />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  )
}

export default App