import type { LedPanel, LedPage, LedPreset } from '../types/led'
import { LED_ENDPOINTS, type DataResponse, type LedApi } from './ledApi.types'

interface DisplayResponse {
  id: number
  name: string
  deviceId: string
  location: string | null
  status: LedPanel['status']
  site: { id: number; name: string } | null
}
interface DisplayPresetResponse extends Omit<LedPreset, 'content'> { message: string }

export const realLedApi: LedApi = {
  async fetchPanels(client) {
    const response = await client.get<DataResponse<DisplayResponse[]>>(LED_ENDPOINTS.panels, { handleForbiddenLocally: true })
    return response.data.map(panel => ({
      id: panel.id, name: panel.name, deviceCode: panel.deviceId,
      location: panel.location, status: panel.status,
      siteId: panel.site?.id ?? null, siteName: panel.site?.name ?? '공원 미매핑',
    }))
  },

  async fetchPresets(client) {
    // Exhaust server pagination: local search must not silently search only page 1.
    const presets: LedPreset[] = []
    let page = 1
    while (true) {
      const response = await client.get<DataResponse<LedPage<DisplayPresetResponse>>>(`${LED_ENDPOINTS.presets}?page=${page}&size=100`, { handleForbiddenLocally: true })
      presets.push(...response.data.content.map(preset => ({ ...preset, content: preset.message })))
      if (response.data.last || response.data.content.length === 0) return presets
      page++
    }
  },

  async createPreset(client, request) {
    await client.post(LED_ENDPOINTS.presets, { title: request.title, message: request.content }, { handleForbiddenLocally: true })
  },

  async updatePreset(client, id, request) {
    await client.put(`${LED_ENDPOINTS.presets}/${id}`, { title: request.title, message: request.content })
  },

  async deletePreset(client, id) {
    await client.delete(`${LED_ENDPOINTS.presets}/${id}`)
  },

  async dispatch(client, request) {
    await client.post(LED_ENDPOINTS.dispatch, {
      displayIds: request.panelIds,
      ...(request.presetId != null ? { presetId: request.presetId } : { message: request.content }),
    }, { handleForbiddenLocally: true })
  },
}
