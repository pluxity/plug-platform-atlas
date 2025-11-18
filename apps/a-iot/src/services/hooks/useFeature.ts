import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { FeatureResponse, FeatureUpdateRequest, LatestDataResponse, TimeSeriesDataResponse } from '../types/feature'

type DataResponseWrapper<T> = { data: T }

/**
 * Feature 목록 조회
 */
export function useFeatures(options?: SWRConfiguration<FeatureResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    'features',
    async () => {
      const response = await client.get<DataResponseWrapper<FeatureResponse[]>>('features')
      return response.data
    },
    options
  )
}

/**
 * Feature 상세 조회
 */
export function useFeature(
  featureId: number | null,
  options?: SWRConfiguration<FeatureResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    featureId ? `features/${featureId}` : null,
    async () => {
      const response = await client.get<DataResponseWrapper<FeatureResponse>>(`features/${featureId}`)
      return response.data
    },
    options
  )
}

/**
 * Feature 최신 데이터 조회
 */
export function useFeatureLatestData(
  deviceId: string | null,
  options?: SWRConfiguration<LatestDataResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    deviceId ? `features/${deviceId}/latest` : null,
    async () => {
      const response = await client.get<DataResponseWrapper<LatestDataResponse>>(`features/${deviceId}/latest`)
      return response.data
    },
    options
  )
}

/**
 * Feature 시계열 데이터 조회
 */
export function useFeatureTimeSeries(
  deviceId: string | null,
  options?: SWRConfiguration<TimeSeriesDataResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    deviceId ? `features/${deviceId}/time-series` : null,
    async () => {
      const response = await client.get<DataResponseWrapper<TimeSeriesDataResponse>>(`features/${deviceId}/time-series`)
      return response.data
    },
    options
  )
}

/**
 * Feature 수정 (204 No Content)
 */
export function useUpdateFeature(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: FeatureUpdateRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    'features',
    async (_key: string, { arg }: { arg: { id: number; data: FeatureUpdateRequest } }) => {
      await client.put(`features/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * Feature 동기화 (204 No Content)
 */
export function useSyncFeatures(options?: SWRMutationConfiguration<void, Error, string, void>) {
  const client = useApiClient()

  return useSWRMutation(
    'features/sync',
    async () => {
      await client.post('features/sync')
    },
    options
  )
}
