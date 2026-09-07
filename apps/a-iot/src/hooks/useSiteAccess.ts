import { useMemo } from 'react'
import { useAuthStore } from '../stores'
import { isAdminUser } from '../constants/roles'

/**
 * 공원(Site) 단위 접근 권한
 *
 * 이 앱은 그동안 ADMIN 여부(`ProtectedRoute adminOnly`, `menu.ts adminOnly`)로만
 * 게이팅해 왔고, 공원 단위 권한을 런타임에 확인하는 코드는 없었다.
 * 권한 데이터 자체는 이미 존재한다 —
 *   User → roles[] → permissions[](권한그룹) → permissions[] → { resourceType, resourceIds[] }
 * 관리 화면(/users/permissions)에서 설정만 하고 아무도 읽지 않던 값을 여기서 처음 읽는다.
 *
 * ⚠️ 공원을 가리키는 resourceType 키를 코드에서 확정할 수 없다.
 * 서버가 `/roles/resource-types` 로 동적으로 내려주고 프론트는 그대로 받아 쓰기만 하는데,
 * 지금 백엔드에 접근이 안 돼(사내망) 실제 키 값을 확인하지 못했다.
 * 그래서 키를 하나로 못 박지 않고 site/park 계열 이름을 모두 공원으로 간주한다.
 * 실제 키가 확인되면 SITE_RESOURCE_TYPE_PATTERN 을 그 값으로 좁히면 된다.
 *
 * ⚠️ 이건 화면 노출 제어일 뿐 보안 경계가 아니다.
 * 실제 차단은 백엔드가 송출 API 에서 해야 한다 (aiot-api #26).
 */
const SITE_RESOURCE_TYPE_PATTERN = /site|park/i

export interface SiteAccess {
  /** ADMIN 은 모든 공원에 접근 가능 */
  isAdmin: boolean
  /** 접근 가능한 공원 id 목록. isAdmin 이면 빈 배열이고 canAccessSite 가 항상 true 다. */
  allowedSiteIds: number[]
  /** 해당 공원에 접근할 수 있는지 */
  canAccessSite: (siteId: number) => boolean
  /** 접근 가능한 공원이 하나라도 있는지 */
  hasAnyAccess: boolean
  /**
   * 사용자 권한에서 공원 계열 resourceType 을 찾지 못한 상태.
   * "권한이 없다"와 "권한 정보를 읽지 못했다"는 다르므로 화면에서 구분해 안내한다.
   */
  isUnresolved: boolean
}

export function useSiteAccess(): SiteAccess {
  const user = useAuthStore((state) => state.user)

  return useMemo(() => {
    const isAdmin = isAdminUser(user)

    // 사용자의 모든 역할 → 권한그룹 → 권한 을 훑어 공원 계열 resourceIds 를 모은다
    const siteIds = new Set<number>()
    let foundSiteResourceType = false

    for (const role of user?.roles ?? []) {
      for (const group of role.permissions ?? []) {
        for (const permission of group.permissions ?? []) {
          if (!SITE_RESOURCE_TYPE_PATTERN.test(permission.resourceType)) continue
          foundSiteResourceType = true
          for (const rawId of permission.resourceIds ?? []) {
            const id = Number(rawId)
            if (Number.isFinite(id)) siteIds.add(id)
          }
        }
      }
    }

    const allowedSiteIds = [...siteIds].sort((a, b) => a - b)

    return {
      isAdmin,
      allowedSiteIds,
      canAccessSite: (siteId: number) => isAdmin || siteIds.has(siteId),
      hasAnyAccess: isAdmin || allowedSiteIds.length > 0,
      isUnresolved: !isAdmin && !foundSiteResourceType,
    }
  }, [user])
}
