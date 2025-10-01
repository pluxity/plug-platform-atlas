import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client/context'
import type {
  PermissionGroupResponse,
  PermissionGroupCreateRequest,
  PermissionGroupUpdateRequest,
  ResourceTypeResponse,
} from '@plug-atlas/types'

type DataResponse<T> = { data: T }

/**
 * Permission 그룹 목록 조회
 */
export function usePermissions(options?: SWRConfiguration<PermissionGroupResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/permissions',
    async () => {
      const response = await client.get<DataResponse<PermissionGroupResponse[]>>('/permissions')
      return response.data
    },
    options
  )
}

/**
 * Permission 그룹 상세 조회
 */
export function usePermission(
  permissionId: number | null,
  options?: SWRConfiguration<PermissionGroupResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    permissionId ? `/permissions/${permissionId}` : null,
    async () => {
      const response = await client.get<DataResponse<PermissionGroupResponse>>(`/permissions/${permissionId}`)
      return response.data
    },
    options
  )
}

/**
 * Resource Types 조회
 */
export function useResourceTypes(options?: SWRConfiguration<ResourceTypeResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/permissions/resource-types',
    async () => {
      const response = await client.get<DataResponse<ResourceTypeResponse[]>>('/permissions/resource-types')
      return response.data
    },
    options
  )
}

/**
 * Permission 그룹 생성 (201 Created)
 */
export function useCreatePermission(options?: SWRMutationConfiguration<number, Error, string, PermissionGroupCreateRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/permissions',
    async (_key: string, { arg }: { arg: PermissionGroupCreateRequest }) => {
      const result = await client.post<number>('/permissions', arg)
      return result as number
    },
    options
  )
}

/**
 * Permission 그룹 수정 (204 No Content)
 */
export function useUpdatePermission(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: PermissionGroupUpdateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/permissions',
    async (_key: string, { arg }: { arg: { id: number; data: PermissionGroupUpdateRequest } }) => {
      await client.patch(`/permissions/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * Permission 그룹 삭제 (204 No Content)
 */
export function useDeletePermission(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/permissions',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/permissions/${arg}`)
    },
    options
  )
}
