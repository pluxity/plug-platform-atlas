import useSWR, { type SWRConfiguration } from 'swr'
import useSWRMutation, { type SWRMutationConfiguration } from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import type { DeviceTypeResponse, DeviceTypeRequest, DeviceProfileRequest } from '../types'

type DataResponse<T> = { data: T }

/**
 * 디바이스 타입 목록 조회
 */
export function useDeviceTypes(options?: SWRConfiguration<DeviceTypeResponse[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/device-types',
    async () => {
      const response = await client.get<DataResponse<DeviceTypeResponse[]>>('/device-types')
      return response.data
    },
    options
  )
}

/**
 * 디바이스 타입 상세 조회
 */
export function useDeviceType(
  typeId: number | null,
  options?: SWRConfiguration<DeviceTypeResponse, Error>
) {
  const client = useApiClient()

  return useSWR(
    typeId ? `/device-types/${typeId}` : null,
    async () => {
      const response = await client.get<DataResponse<DeviceTypeResponse>>(`/device-types/${typeId}`)
      return response.data
    },
    options
  )
}

/**
 * 디바이스 타입별 프로필 목록 조회
 */
export function useDeviceTypeProfiles(
  typeId: number | null,
  options?: SWRConfiguration<any[], Error>
) {
  const client = useApiClient()

  return useSWR(
    typeId ? `/device-types/${typeId}/profiles` : null,
    async () => {
      const response = await client.get<DataResponse<any[]>>(`/device-types/${typeId}/profiles`)
      return response.data
    },
    options
  )
}

/**
 * 디바이스 타입 생성 (201 Created)
 */
export function useCreateDeviceType(options?: SWRMutationConfiguration<number, Error, string, DeviceTypeRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/device-types',
    async (_key: string, { arg }: { arg: DeviceTypeRequest }) => {
      const result = await client.post<number>('/device-types', arg)
      return result as number
    },
    options
  )
}

/**
 * 디바이스 타입 수정 (204 No Content)
 */
export function useUpdateDeviceType(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: DeviceTypeRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/device-types',
    async (_key: string, { arg }: { arg: { id: number; data: DeviceTypeRequest } }) => {
      await client.patch(`/device-types/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 디바이스 타입 삭제 (204 No Content)
 */
export function useDeleteDeviceType(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/device-types',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/device-types/${arg}`)
    },
    options
  )
}

/**
 * 디바이스 프로필 목록 조회
 */
export function useDeviceProfiles(options?: SWRConfiguration<any[], Error>) {
  const client = useApiClient()

  return useSWR(
    '/device-profiles',
    async () => {
      const response = await client.get<DataResponse<any[]>>('/device-profiles')
      return response.data
    },
    options
  )
}

/**
 * 디바이스 프로필 상세 조회
 */
export function useDeviceProfile(
  profileId: number | null,
  options?: SWRConfiguration<any, Error>
) {
  const client = useApiClient()

  return useSWR(
    profileId ? `/device-profiles/${profileId}` : null,
    async () => {
      const response = await client.get<DataResponse<any>>(`/device-profiles/${profileId}`)
      return response.data
    },
    options
  )
}

/**
 * 디바이스 프로필 생성 (201 Created)
 */
export function useCreateDeviceProfile(options?: SWRMutationConfiguration<number, Error, string, DeviceProfileRequest>) {
  const client = useApiClient()

  return useSWRMutation(
    '/device-profiles',
    async (_key: string, { arg }: { arg: DeviceProfileRequest }) => {
      const result = await client.post<number>('/device-profiles', arg)
      return result as number
    },
    options
  )
}

/**
 * 디바이스 프로필 수정 (204 No Content)
 */
export function useUpdateDeviceProfile(options?: SWRMutationConfiguration<void, Error, string, { id: number; data: DeviceProfileRequest }>) {
  const client = useApiClient()

  return useSWRMutation(
    '/device-profiles',
    async (_key: string, { arg }: { arg: { id: number; data: DeviceProfileRequest } }) => {
      await client.patch(`/device-profiles/${arg.id}`, arg.data)
    },
    options
  )
}

/**
 * 디바이스 프로필 삭제 (204 No Content)
 */
export function useDeleteDeviceProfile(options?: SWRMutationConfiguration<void, Error, string, number>) {
  const client = useApiClient()

  return useSWRMutation(
    '/device-profiles',
    async (_key: string, { arg }: { arg: number }) => {
      await client.delete(`/device-profiles/${arg}`)
    },
    options
  )
}
