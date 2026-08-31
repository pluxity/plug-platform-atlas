import { useAuthStore } from '../stores'
import { isAdminUser } from '../constants/roles'

/** 현재 로그인한 사용자가 관리자인지 여부 */
export function useIsAdmin(): boolean {
  const user = useAuthStore((state) => state.user)
  return isAdminUser(user)
}
