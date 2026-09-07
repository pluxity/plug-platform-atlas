/**
 * LED 전광판 실 API 구현
 *
 * 백엔드(aiot-api #24 장치관리 / #25 프리셋 / #26 송출)가 아직 미구현이라
 * 지금은 index.ts 가 목업을 꽂아 두고 있다. 백엔드가 나오면 index.ts 의
 * USE_MOCK 을 false 로 바꾸면 이 구현이 쓰인다.
 *
 * 이 파일에는 목업 코드가 없다. 목업을 걷어낼 때 손댈 필요가 없는 파일이다.
 */
import type { ApiClient } from '@plug-atlas/api-hooks'
import type {
  LedActiveDisplay,
  LedDispatchRequest,
  LedDispatchResult,
  LedPanel,
  LedPreset,
  LedPresetCreateRequest,
  LedPresetUpdateRequest,
} from '../types/led'
import { LED_ENDPOINTS, type DataResponse, type LedApi } from './ledApi.types'

/** ApiClient.post 는 201 + Location 만 오면 본문 없이 끝난다. 그 경우를 구분한다. */
function unwrap<T>(response: unknown): T | null {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as DataResponse<T>).data
  }
  return null
}

export const realLedApi: LedApi = {
  async fetchPanels(client: ApiClient): Promise<LedPanel[]> {
    const response = await client.get<DataResponse<LedPanel[]>>(LED_ENDPOINTS.panels)
    return response.data || []
  },

  async fetchPresets(client: ApiClient): Promise<LedPreset[]> {
    const response = await client.get<DataResponse<LedPreset[]>>(LED_ENDPOINTS.presets)
    return response.data || []
  },

  async createPreset(client: ApiClient, request: LedPresetCreateRequest): Promise<LedPreset> {
    const response = await client.post<DataResponse<LedPreset>>(LED_ENDPOINTS.presets, request)
    const created = unwrap<LedPreset>(response)
    if (created) return created

    // 본문 없이 201 만 온 경우 목록을 다시 받아 방금 만든 것을 찾는다
    const list = await this.fetchPresets(client)
    const found = list.find((preset) => preset.title === request.title)
    if (!found) throw new Error('등록한 프리셋을 찾지 못했습니다.')
    return found
  },

  async updatePreset(
    client: ApiClient,
    id: number,
    request: LedPresetUpdateRequest,
  ): Promise<void> {
    await client.put(`${LED_ENDPOINTS.presets}/${id}`, request)
  },

  async deletePreset(client: ApiClient, id: number): Promise<void> {
    await client.delete(`${LED_ENDPOINTS.presets}/${id}`)
  },

  async dispatch(client: ApiClient, request: LedDispatchRequest): Promise<LedDispatchResult> {
    const response = await client.post<DataResponse<LedDispatchResult>>(
      LED_ENDPOINTS.dispatch,
      request,
    )
    const result = unwrap<LedDispatchResult>(response)
    if (!result) throw new Error('송출 응답을 해석하지 못했습니다.')
    return result
  },

  async fetchActiveDisplays(client: ApiClient): Promise<LedActiveDisplay[]> {
    const response = await client.get<DataResponse<LedActiveDisplay[]>>(
      LED_ENDPOINTS.activeDisplays,
    )
    return response.data || []
  },

  async clearDisplays(client: ApiClient, panelIds: number[]): Promise<LedDispatchResult> {
    const response = await client.post<DataResponse<LedDispatchResult>>(LED_ENDPOINTS.clear, {
      panelIds,
    })
    const result = unwrap<LedDispatchResult>(response)
    if (!result) throw new Error('표출 해제 응답을 해석하지 못했습니다.')
    return result
  },
}
