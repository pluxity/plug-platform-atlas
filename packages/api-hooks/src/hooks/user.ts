import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client/context'
import type {
  UserResponse,
  UserUpdateRequest,
  UserPasswordUpdateRequest,
} from '@plug-atlas/types'

// Response wrapper type
type DataResponse<T> = { data: T }

/**
 * 내 정보 조회
 */
export function useMe(options?: SWRConfiguration<UserResponse, Error>) {
  const client = useApiClient()

  return useSWR(
    'users/me',
    async () => {
      const response = await client.get<DataResponse<UserResponse>>('users/me')
      return response.data
    },
    options
  )
}

/**
 * 내 정보 수정 (204 No Content)
 */
export function useUpdateMe(options?: SWRMutationConfiguration<void, Error, string, UserUpdateRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    'users/me',
    async (_key: string, { arg }: { arg: UserUpdateRequest }) => {
      await client.patch('users/me', arg)
    },
    options
  )
}

/**
 * 비밀번호 변경 (204 No Content)
 */
export function useUpdatePassword(options?: SWRMutationConfiguration<void, Error, string, UserPasswordUpdateRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    'users/me/password',
    async (_key: string, { arg }: { arg: UserPasswordUpdateRequest }) => {
      await client.patch('users/me/password', arg)
    },
    options
  )
}