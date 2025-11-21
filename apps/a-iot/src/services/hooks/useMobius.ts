import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { MobiusResponse, MobiusRequest } from '../types/mobius'

type DataResponse<T> = { data: T }

/**
 * Mobius API URL 조회
 */
export function useMobiusApiUrl(options?: SWRConfiguration<MobiusResponse, Error>) {
  const client = useApiClient()

  return useSWR(
    '/mobius/api-url',
    async () => {
      const response = await client.get<DataResponse<MobiusResponse>>('/mobius/api-url')
      return response.data
    },
    options
  )
}

/**
 * Mobius API URL 수정 (204 No Content)
 */
export function useUpdateMobiusApiUrl(options?: SWRMutationConfiguration<void, Error, string, MobiusRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/mobius/api-url',
    async (_key: string, { arg }: { arg: MobiusRequest }) => {
      await client.patch('/mobius/api-url', arg)
    },
    options
  )
}
