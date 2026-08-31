import type { UserResponse } from '@plug-atlas/types'

/** 서버가 내려주는 관리자 역할 이름 (RoleResponse.name) */
export const ADMIN_ROLE_NAME = 'ADMIN'

/** 사용자가 관리자 역할을 보유했는지 판별 */
export function isAdminUser(user: UserResponse | null | undefined): boolean {
  return user?.roles?.some((role) => role.name === ADMIN_ROLE_NAME) ?? false
}
