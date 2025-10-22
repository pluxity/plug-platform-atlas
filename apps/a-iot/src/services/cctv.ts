import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type {
  CctvResponse,
  CctvCreateRequest,
  CctvUpdateRequest,
  CctvListParams,
} from '../types/cctv'

// Response wrapper type
type DataResponse<T> = { data: T }

/**
 * CCTV 목록 조회
 */
export function useCctvList(params?: CctvListParams, options?: SWRConfiguration<CctvResponse[], Error>) {
  const client = useApiClient()

  const queryParams = new URLSearchParams()
  if (params?.siteId) queryParams.append('siteId', params.siteId.toString())

  const queryString = queryParams.toString()
  const url = queryString ? `cctvs?${queryString}` : 'cctvs'

  return useSWR(
    url,
    async () => {
      const response = await client.get<DataResponse<CctvResponse[]>>(url)
      return response.data
    },
    options
  )
}

/**
 * CCTV 상세 조회
 */
export function useCctv(id: number | null, options?: SWRConfiguration<CctvResponse, Error>) {
  const client = useApiClient()

  return useSWR(
    id ? `cctvs/${id}` : null,
    async () => {
      const response = await client.get<DataResponse<CctvResponse>>(`cctvs/${id}`)
      return response.data
    },
    options
  )
}

/**
 * CCTV 생성
 */
export function useCreateCctv(options?: SWRMutationConfiguration<number | void, Error, string, CctvCreateRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    'cctvs',
    async (_key: string, { arg }: { arg: CctvCreateRequest }) => {
      return await client.post<number>('cctvs', arg)
    },
    options
  )
}

/**
 * CCTV 수정
 */
export function useUpdateCctv(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: CctvUpdateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    'cctvs',
    async (_key: string, { arg }: { arg: { id: number; data: CctvUpdateRequest } }) => {
      await client.put(`cctvs/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * CCTV 삭제
 */
export function useDeleteCctv(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    'cctvs',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`cctvs/${arg}`)
    },
    options
  )
}
