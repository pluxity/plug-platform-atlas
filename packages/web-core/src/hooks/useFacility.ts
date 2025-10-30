import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { FacilityResponse, FacilityRequest } from '../types/facility'
import type { TimeSeriesDataResponse } from '../types/feature'

type DataResponseWrapper<T> = { data: T }

/**
 * 시설 목록 조회
 */
export function useFacilities(options?: SWRConfiguration<FacilityResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/facilities',
    async () => {
      const response = await client.get<DataResponseWrapper<FacilityResponse[]>>('/facilities')
      return response.data
    },
    options
  )
}

/**
 * 시설 상세 조회
 */
export function useFacility(
  facilityId: number | null,
  options?: SWRConfiguration<FacilityResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    facilityId ? `/facilities/${facilityId}` : null,
    async () => {
      const response = await client.get<DataResponseWrapper<FacilityResponse>>(`/facilities/${facilityId}`)
      return response.data
    },
    options
  )
}

/**
 * 시설 생성 (201 Created, returns id)
 */
export function useCreateFacility(options?: SWRMutationConfiguration<number, Error, string, FacilityRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/facilities',
    async (_key: string, { arg }: { arg: FacilityRequest }) => {
      const result = await client.post<number>('/facilities', arg)
      return result as number
    },
    options
  )
}

/**
 * 시설 수정 (204 No Content)
 */
export function useUpdateFacility(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: FacilityRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/facilities',
    async (_key: string, { arg }: { arg: { id: number; data: FacilityRequest } }) => {
      await client.put(`/facilities/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 시설 삭제 (204 No Content)
 */
export function useDeleteFacility(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/facilities',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/facilities/${arg}`)
    },
    options
  )
}

/**
 * 시설 시계열 데이터 조회
 */
export function useFacilityTimeSeries(
  facilityId: number | null,
  options?: SWRConfiguration<TimeSeriesDataResponse[], Error>
) {
  const client = useApiClient()

  return useSWR(
    facilityId ? `/facilities/${facilityId}/time-series` : null,
    async () => {
      const response = await client.get<DataResponseWrapper<TimeSeriesDataResponse[]>>(`/facilities/${facilityId}/time-series`)
      return response.data
    },
    options
  )
}
