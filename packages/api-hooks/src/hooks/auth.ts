import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client'
import type { SignInRequest, SignUpRequest } from '@plug-atlas/types'

/**
 * 로그인 (204 No Content)
 */
export function useSignIn(options?: SWRMutationConfiguration<void, Error, string, SignInRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    'auth/sign-in',
    async (_key: string, { arg }: { arg: SignInRequest }) => {
      await client.post('auth/sign-in', arg)
    },
    options
  )
}

/**
 * 로그아웃 (204 No Content)
 */
export function useSignOut(options?: SWRMutationConfiguration<void, Error, string, void>) {
  const client = useApiClient()

  return useSWRMutation(
    'auth/sign-out',
    async () => {
      await client.post('auth/sign-out')
    },
    options
  )
}

/**
 * 회원가입 (201 Created, returns id)
 */
export function useSignUp(options?: SWRMutationConfiguration<number, Error, string, SignUpRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    'auth/sign-up',
    async (_key: string, { arg }: { arg: SignUpRequest }) => {
      const result = await client.post<number>('auth/sign-up', arg)
      return result as number
    },
    options
  )
}

/**
 * 토큰 갱신 (204 No Content)
 */
export function useRefreshToken(options?: SWRMutationConfiguration<void, Error, string, void>) {
  const client = useApiClient()

  return useSWRMutation(
    'auth/refresh-token',
    async () => {
      await client.post('auth/refresh-token')
    },
    options
  )
}