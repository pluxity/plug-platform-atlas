import useSWR, { useSWRConfig, type SWRConfiguration } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import { ledApi } from '../led'
import type { LedDispatchRequest, LedPanel, LedPreset, LedPresetCreateRequest, LedPresetUpdateRequest, LedBroadcast, LedPage } from '../types/led'

export function useLedPanels(options?: SWRConfiguration<LedPanel[], Error>) {
  const client = useApiClient()
  const swr = useSWR('displays', () => ledApi.fetchPanels(client), options)
  return { ...swr, panels: swr.data ?? [] }
}

export function useLedPresets(options?: SWRConfiguration<LedPreset[], Error>) {
  const client = useApiClient()
  const swr = useSWR('display-presets', () => ledApi.fetchPresets(client), options)
  return { ...swr, presets: swr.data ?? [] }
}

export function useCreateLedPreset() {
  const client = useApiClient()
  return useSWRMutation('display-presets', (_key, { arg }: { arg: LedPresetCreateRequest }) => ledApi.createPreset(client, arg))
}

export function useUpdateLedPreset() {
  const client = useApiClient()
  return useSWRMutation('display-presets', (_key, { arg }: { arg: { id: number; data: LedPresetUpdateRequest } }) => ledApi.updatePreset(client, arg.id, arg.data))
}

export function useDeleteLedPreset() {
  const client = useApiClient()
  return useSWRMutation('display-presets', (_key, { arg }: { arg: number }) => ledApi.deletePreset(client, arg))
}

export function useDispatchLedMessage() {
  const client = useApiClient()
  const { mutate } = useSWRConfig()
  return useSWRMutation('displays/broadcasts', async (_key, { arg }: { arg: LedDispatchRequest }) => {
    await ledApi.dispatch(client, arg)
    await mutate(key => typeof key === 'string' && key.startsWith('displays/broadcasts?'))
  })
}

export function useLedBroadcasts(page: number, siteId?: number, enabled = true) {
  const client = useApiClient()
  const query = new URLSearchParams({ page: String(page), size: '10' })
  if (siteId != null) query.set('siteId', String(siteId))
  return useSWR(enabled ? `displays/broadcasts?${query}` : null, async (url) => {
    const response = await client.get<{ data: LedPage<LedBroadcast> }>(url, { handleForbiddenLocally: true })
    return response.data
  })
}
