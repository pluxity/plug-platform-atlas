import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client/context'
import type {
  UserResponse,
  UserLoggedInResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserRoleUpdateRequest,
} from '@plug-atlas/types'

type DataResponse<T> = { data: T }

/**
 * 사용자 목록 조회 (Admin)
 */
export function useAdminUsers(options?: SWRConfiguration<UserResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/admin/users',
    async () => {
      const response = await client.get<DataResponse<UserResponse[]>>('/admin/users')
      return response.data
    },
    options
  )
}

/**
 * 로그인 상태 포함 사용자 목록 조회 (Admin)
 */
export function useAdminUsersWithLoggedIn(options?: SWRConfiguration<UserLoggedInResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/admin/users/with-is-logged-in',
    async () => {
      const response = await client.get<DataResponse<UserLoggedInResponse[]>>('/admin/users/with-is-logged-in')
      return response.data
    },
    options
  )
}

/**
 * 사용자 상세 조회 (Admin)
 */
export function useAdminUser(
  userId: number | null,
  options?: SWRConfiguration<UserResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    userId ? `/admin/users/${userId}` : null,
    async () => {
      const response = await client.get<DataResponse<UserResponse>>(`/admin/users/${userId}`)
      return response.data
    },
    options
  )
}

/**
 * 사용자 생성 (Admin) (201 Created)
 */
export function useCreateAdminUser(options?: SWRMutationConfiguration<number, Error, string, UserCreateRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users',
    async (_key: string, { arg }: { arg: UserCreateRequest }) => {
      const result = await client.post<number>('/admin/users', arg)
      return result as number
    },
    options
  )
}

/**
 * 사용자 수정 (Admin) (204 No Content)
 */
export function useUpdateAdminUser(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: UserUpdateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users',
    async (_key: string, { arg }: { arg: { id: number; data: UserUpdateRequest } }) => {
      await client.patch(`/admin/users/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 사용자 삭제 (Admin) (204 No Content)
 */
export function useDeleteAdminUser(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/admin/users/${arg}`)
    },
    options
  )
}

/**
 * 사용자 역할 수정 (Admin) (204 No Content)
 */
export function useUpdateAdminUserRoles(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: UserRoleUpdateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users/roles',
    async (_key: string, { arg }: { arg: { id: number; data: UserRoleUpdateRequest } }) => {
      await client.patch(`/admin/users/${arg.id}/roles`, arg.data)
    },
    options
  )
}

/**
 * 사용자 역할 제거 (Admin) (204 No Content)
 */
export function useDeleteAdminUserRole(options?: SWRMutationConfiguration<void, Error, string, { userId: number; roleId: number }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users/roles',
    async (_key: string, { arg }: { arg: { userId: number; roleId: number } }) => {
      await client.delete(`/admin/users/${arg.userId}/roles/${arg.roleId}`)
    },
    options
  )
}

/**
 * 사용자 비밀번호 변경 (Admin) (204 No Content)
 */
export function useUpdateAdminUserPassword(options?: SWRMutationConfiguration<void, Error, string, { id: number; password: string }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users/password',
    async (_key: string, { arg }: { arg: { id: number; password: string } }) => {
      await client.patch(`/admin/users/${arg.id}/password`, { password: arg.password })
    },
    options
  )
}

/**
 * 사용자 비밀번호 초기화 (Admin) (204 No Content)
 */
export function useInitAdminUserPassword(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/admin/users/password-init',
    async (_key: string, { arg }: { arg: number }) => {
      await client.patch(`/admin/users/${arg}/password-init`)
    },
    options
  )
}
