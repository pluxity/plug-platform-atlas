import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '../client/context'
import type { MobiusConfigResponse, MobiusConfigUpdateRequest } from '@plug-atlas/types'

// Response wrapper type
type DataResponse<T> = { data: T }

/**
 * Mobius 플랫폼 연동 설정 조회
 */
export function useMobiusConfig(options?: SWRConfiguration<MobiusConfigResponse, Error>) {
  const client = useApiClient()

  return useSWR(
    'mobius/api-url',
    async () => {
      const response = await client.get<DataResponse<MobiusConfigResponse>>('mobius/api-url')
      return response.data
    },
    options
  )
}

/**
 * Mobius 플랫폼 연동 설정 수정
 */
export function useUpdateMobiusConfig(
  options?: SWRMutationConfiguration<void, Error, string, MobiusConfigUpdateRequest>
) {
  const client = useApiClient()

  return useSWRMutation(
    'mobius/api-url',
    async (_key: string, { arg }: { arg: MobiusConfigUpdateRequest }) => {
      await client.post('mobius/api-url', arg)
    },
    options
  )
}
