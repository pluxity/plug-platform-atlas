import { useCallback } from 'react'
import useSWR, { type SWRConfiguration } from 'swr'
import useSWRInfinite, { type SWRInfiniteConfiguration } from 'swr/infinite'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type {
  CctvResponse,
  CctvCoordinateRequest,
  CctvStreamResult,
  CctvListParams,
  CctvEventsParams,
  CctvEventsPageResponse,
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
 * CCTV 좌표 수정
 */
export function useUpdateCctvCoordinates(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: CctvCoordinateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    'cctvs',
    async (_key: string, { arg }: { arg: { id: number; data: CctvCoordinateRequest } }) => {
      await client.patch(`cctvs/${arg.id}/coordinates`, arg.data)
    },
    options
  )
}

/**
 * CCTV 실시간 스트림 URL 요청
 */
export function useCctvRealtimeStream() {
  const client = useApiClient()

  return useCallback(
    async (id: number): Promise<CctvStreamResult> => {
      const response = await client.get<DataResponse<CctvStreamResult>>(`cctvs/${id}/stream/realtime`)
      return response.data
    },
    [client]
  )
}

/**
 * CCTV 녹화 영상 스트림 URL 요청
 */
export function useCctvRecordStream() {
  const client = useApiClient()

  return useCallback(
    async (id: number, startTime: string, endTime: string): Promise<CctvStreamResult> => {
      const params = new URLSearchParams({
        recordStartTime: startTime,
        recordEndTime: endTime,
      })
      const response = await client.get<DataResponse<CctvStreamResult>>(`cctvs/${id}/stream/record?${params}`)
      return response.data
    },
    [client]
  )
}

/**
 * CCTV 이벤트 목록 조회 (AI EDGE)
 */
export function useCctvEvents(params?: CctvEventsParams, options?: SWRConfiguration<CctvEventsPageResponse, Error>) {
  const client = useApiClient()

  const queryParams = new URLSearchParams()
  if (params?.page) queryParams.append('page', params.page.toString())
  if (params?.size) queryParams.append('size', params.size.toString())
  if (params?.from) queryParams.append('from', params.from)
  if (params?.to) queryParams.append('to', params.to)

  const queryString = queryParams.toString()
  const url = queryString ? `cctvs/events?${queryString}` : 'cctvs/events'

  return useSWR(
    url,
    async () => {
      const response = await client.get<DataResponse<CctvEventsPageResponse>>(url)
      return response.data
    },
    options
  )
}

/**
 * CCTV 이벤트 무한스크롤 (페이지 기반)
 */
export function useInfiniteCctvEvents(
  baseParams?: Omit<CctvEventsParams, 'page'>,
  pageSize: number = 20,
  options?: SWRInfiniteConfiguration<CctvEventsPageResponse, Error>,
) {
  const client = useApiClient()

  const getKey = (pageIndex: number, prevData: CctvEventsPageResponse | null) => {
    if (prevData && prevData.last) return null

    const queryParams = new URLSearchParams()
    queryParams.append('page', (pageIndex + 1).toString())
    queryParams.append('size', pageSize.toString())
    if (baseParams?.from) queryParams.append('from', baseParams.from)
    if (baseParams?.to) queryParams.append('to', baseParams.to)

    return `cctvs/events?${queryParams.toString()}`
  }

  const result = useSWRInfinite<CctvEventsPageResponse>(
    getKey,
    async (key: string) => {
      const response = await client.get<DataResponse<CctvEventsPageResponse>>(key)
      return response.data
    },
    options,
  )

  const events = result.data?.flatMap((page) => page.content) ?? []
  const lastPage = result.data?.[result.data.length - 1]
  const hasMore = lastPage ? !lastPage.last : false

  return {
    ...result,
    events,
    hasMore,
    loadMore: () => result.setSize(result.size + 1),
  }
}

/**
 * EDS 카메라 동기화
 * EDS 서버의 카메라 목록을 조회하여 CCTV 테이블과 동기화합니다.
 */
export function useSyncCctv(options?: SWRMutationConfiguration<void, Error, string, null>) {
  const client = useApiClient()

  return useSWRMutation(
    'cctvs',
    async () => {
      await client.post('cctvs/sync')
    },
    options
  )
}
