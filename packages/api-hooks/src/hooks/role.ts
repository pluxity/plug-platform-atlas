import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client/context'
import type {
  RoleResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
} from '@plug-atlas/types'

type DataResponse<T> = { data: T }

/**
 * Role 목록 조회
 */
export function useRoles(options?: SWRConfiguration<RoleResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/roles',
    async () => {
      const response = await client.get<DataResponse<RoleResponse[]>>('/roles')
      return response.data
    },
    options
  )
}

/**
 * Role 상세 조회
 */
export function useRole(
  roleId: number | null,
  options?: SWRConfiguration<RoleResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    roleId ? `/roles/${roleId}` : null,
    async () => {
      const response = await client.get<DataResponse<RoleResponse>>(`/roles/${roleId}`)
      return response.data
    },
    options
  )
}

/**
 * Role 생성 (201 Created)
 */
export function useCreateRole(options?: SWRMutationConfiguration<number, Error, string, RoleCreateRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/roles',
    async (_key: string, { arg }: { arg: RoleCreateRequest }) => {
      const result = await client.post<number>('/roles', arg)
      return result as number
    },
    options
  )
}

/**
 * Role 수정 (204 No Content)
 */
export function useUpdateRole(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: RoleUpdateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/roles',
    async (_key: string, { arg }: { arg: { id: number; data: RoleUpdateRequest } }) => {
      await client.patch(`/roles/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * Role 삭제 (204 No Content)
 */
export function useDeleteRole(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/roles',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/roles/${arg}`)
    },
    options
  )
}
