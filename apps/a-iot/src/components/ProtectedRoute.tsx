import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { isAdminUser } from '../constants/roles'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** true 이면 ADMIN 역할 보유자만 접근 가능 */
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdminUser(user)) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
