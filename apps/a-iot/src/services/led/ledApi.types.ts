/**
 * LED 전광판 API 인터페이스
 *
 * 실 구현(ledApi.real.ts)과 목업(ledApi.mock.ts)이 이 하나를 똑같이 만족한다.
 * 화면은 index.ts 가 내보내는 ledApi 만 보므로, 어느 쪽이 꽂혀 있는지 모른다.
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
import type { Site } from '../types/site'

export interface LedApi {
  /**
   * 전광판 목록.
   * sites 는 목업이 실제 공원 위에 전광판을 얹기 위해 받는다.
   * 실 구현은 서버 응답만 쓰고 무시한다.
   */
  fetchPanels(client: ApiClient, sites: Site[]): Promise<LedPanel[]>

  fetchPresets(client: ApiClient): Promise<LedPreset[]>
  createPreset(client: ApiClient, request: LedPresetCreateRequest): Promise<LedPreset>
  updatePreset(client: ApiClient, id: number, request: LedPresetUpdateRequest): Promise<void>
  deletePreset(client: ApiClient, id: number): Promise<void>

  dispatch(client: ApiClient, request: LedDispatchRequest): Promise<LedDispatchResult>

  /** 현재 표출 중인 내용 (자동 송출분 포함) */
  fetchActiveDisplays(client: ApiClient): Promise<LedActiveDisplay[]>
  /** 표출 해제 — 지정한 전광판을 비운다 */
  clearDisplays(client: ApiClient, panelIds: number[]): Promise<LedDispatchResult>
}

/**
 * 프론트가 제안하는 엔드포인트.
 * 백엔드(aiot-api #24·#25·#26) 확정 시 여기만 맞춘다.
 */
export const LED_ENDPOINTS = {
  panels: 'led/panels',
  presets: 'led/presets',
  dispatch: 'led/dispatch',
  activeDisplays: 'led/displays',
  clear: 'led/displays/clear',
} as const

export type DataResponse<T> = { data: T }
