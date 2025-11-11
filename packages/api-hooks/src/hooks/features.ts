import useSWR, { type SWRConfiguration } from 'swr'
import { useApiClient } from '../client/context'

// Feature 타입 정의 (API 응답 구조에 맞게 조정 필요)
export interface Feature {
  id: string | number
  name: string
  type: string
  latitude: number
  longitude: number
  height?: number
  properties?: {
    status?: string
    icon?: string
    [key: string]: any
  }
}

// Response wrapper type
type DataResponse<T> = { data: T }
type FeaturesResponse = Feature[]

/**
 * Features 목록 조회
 */
export function useFeatures(options?: SWRConfiguration<FeaturesResponse, Error>) {
  const client = useApiClient()

  return useSWR(
    'features',
    async () => {
      const response = await client.get<DataResponse<FeaturesResponse>>('features')
      return response.data
    },
    options
  )
}
