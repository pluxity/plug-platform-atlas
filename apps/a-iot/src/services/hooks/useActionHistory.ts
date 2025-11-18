import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { ActionHistoryResponse, ActionHistoryRequest } from '../types/action-history'

type DataResponse<T> = { data: T }

/**
 * 액션 히스토리 목록 조회
 */
export function useActionHistories(options?: SWRConfiguration<ActionHistoryResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/action-histories',
    async () => {
      const response = await client.get<DataResponse<ActionHistoryResponse[]>>('/action-histories')
      return response.data
    },
    options
  )
}

/**
 * 액션 히스토리 상세 조회
 */
export function useActionHistory(
  historyId: number | null,
  options?: SWRConfiguration<ActionHistoryResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    historyId ? `/action-histories/${historyId}` : null,
    async () => {
      const response = await client.get<DataResponse<ActionHistoryResponse>>(`/action-histories/${historyId}`)
      return response.data
    },
    options
  )
}

/**
 * 디바이스별 액션 히스토리 조회
 */
export function useActionHistoriesByDevice(
  deviceId: string | null,
  options?: SWRConfiguration<ActionHistoryResponse[], Error>
) {
  const client = useApiClient()

  return useSWR(
    deviceId ? `/action-histories/device/${deviceId}` : null,
    async () => {
      const response = await client.get<DataResponse<ActionHistoryResponse[]>>(`/action-histories/device/${deviceId}`)
      return response.data
    },
    options
  )
}

/**
 * 이벤트 히스토리별 액션 히스토리 조회
 */
export function useActionHistoriesByEventHistory(
  eventHistoryId: number | null,
  options?: SWRConfiguration<ActionHistoryResponse[], Error>
) {
  const client = useApiClient()

  return useSWR(
    eventHistoryId ? `/action-histories/event-history/${eventHistoryId}` : null,
    async () => {
      const response = await client.get<DataResponse<ActionHistoryResponse[]>>(`/action-histories/event-history/${eventHistoryId}`)
      return response.data
    },
    options
  )
}

/**
 * 액션 히스토리 생성 (201 Created)
 */
export function useCreateActionHistory(options?: SWRMutationConfiguration<number, Error, string, ActionHistoryRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/action-histories',
    async (_key: string, { arg }: { arg: ActionHistoryRequest }) => {
      const result = await client.post<number>('/action-histories', arg)
      return result as number
    },
    options
  )
}

/**
 * 액션 히스토리 수정 (204 No Content)
 */
export function useUpdateActionHistory(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: ActionHistoryRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/action-histories',
    async (_key: string, { arg }: { arg: { id: number; data: ActionHistoryRequest } }) => {
      await client.patch(`/action-histories/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 액션 히스토리 삭제 (204 No Content)
 */
export function useDeleteActionHistory(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/action-histories',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/action-histories/${arg}`)
    },
    options
  )
}
