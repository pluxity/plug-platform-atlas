import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { EventSettingResponse, EventSettingRequest } from '../types/event-setting'

type DataResponse<T> = { data: T }

/**
 * 이벤트 설정 목록 조회
 */
export function useEventSettings(options?: SWRConfiguration<EventSettingResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/event-settings',
    async () => {
      const response = await client.get<DataResponse<EventSettingResponse[]>>('/event-settings')
      return response.data
    },
    options
  )
}

/**
 * 이벤트 설정 상세 조회
 */
export function useEventSetting(
  settingId: number | null,
  options?: SWRConfiguration<EventSettingResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    settingId ? `/event-settings/${settingId}` : null,
    async () => {
      const response = await client.get<DataResponse<EventSettingResponse>>(`/event-settings/${settingId}`)
      return response.data
    },
    options
  )
}

/**
 * 이벤트 설정 히스토리 조회
 */
export function useEventSettingHistories(
  settingId: number | null,
  options?: SWRConfiguration<EventSettingResponse[], Error>
) {
  const client = useApiClient()

  return useSWR(
    settingId ? `/event-settings/${settingId}/histories` : null,
    async () => {
      const response = await client.get<DataResponse<EventSettingResponse[]>>(`/event-settings/${settingId}/histories`)
      return response.data
    },
    options
  )
}

/**
 * 이벤트 설정 생성 (201 Created)
 */
export function useCreateEventSetting(options?: SWRMutationConfiguration<number, Error, string, EventSettingRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/event-settings',
    async (_key: string, { arg }: { arg: EventSettingRequest }) => {
      const result = await client.post<number>('/event-settings', arg)
      return result as number
    },
    options
  )
}

/**
 * 이벤트 설정 수정 (204 No Content)
 */
export function useUpdateEventSetting(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: EventSettingRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/event-settings',
    async (_key: string, { arg }: { arg: { id: number; data: EventSettingRequest } }) => {
      await client.patch(`/event-settings/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 이벤트 설정 삭제 (204 No Content)
 */
export function useDeleteEventSetting(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/event-settings',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/event-settings/${arg}`)
    },
    options
  )
}

/**
 * 이벤트 설정 기간별 복제 (201 Created)
 */
export function useCloneEventSettingWithPeriod(options?: SWRMutationConfiguration<number, Error, string, { settingId: number; data: any }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/event-settings/clone',
    async (_key: string, { arg }: { arg: { settingId: number; data: any } }) => {
      const result = await client.post<number>(`/event-settings/${arg.settingId}/clone-with-period`, arg.data)
      return result as number
    },
    options
  )
}
