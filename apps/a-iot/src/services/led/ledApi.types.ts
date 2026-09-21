import type { ApiClient } from '@plug-atlas/api-hooks'
import type { LedDispatchRequest, LedPanel, LedPreset, LedPresetCreateRequest, LedPresetUpdateRequest } from '../types/led'

export interface LedApi {
  fetchPanels(client: ApiClient): Promise<LedPanel[]>
  fetchPresets(client: ApiClient): Promise<LedPreset[]>
  createPreset(client: ApiClient, request: LedPresetCreateRequest): Promise<void>
  updatePreset(client: ApiClient, id: number, request: LedPresetUpdateRequest): Promise<void>
  deletePreset(client: ApiClient, id: number): Promise<void>
  dispatch(client: ApiClient, request: LedDispatchRequest): Promise<void>
}

export const LED_ENDPOINTS = {
  panels: 'displays',
  presets: 'display-presets',
  dispatch: 'displays/broadcasts',
} as const

export type DataResponse<T> = { data: T }
