import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useApiClient } from '@plug-atlas/api-hooks'
import { isDeviceCacheKey } from '../../lib/ai-edge-device'
import type { MicResponse, MicEventsPage } from '../types/mic'

export function useMics() {
  const client = useApiClient()
  return useSWR('mics', async () => {
    const response = await client.get<{ data: MicResponse[] }>('mics', { handleForbiddenLocally: true })
    return response.data
  })
}

export function useSyncMics() {
  const client = useApiClient()
  const { mutate } = useSWRConfig()
  return useSWRMutation('mics', async () => {
    await client.post('mics/sync', undefined, { handleForbiddenLocally: true })
    await mutate(key => isDeviceCacheKey(key, 'mics'))
  })
}

export function useMicEvents(vendorMicId: string, page = 1, size = 20) {
  const client = useApiClient()
  const query = new URLSearchParams({ micId: vendorMicId, page: String(page), size: String(size) })
  return useSWR(vendorMicId ? `mics/events?${query}` : null, async (url) => {
    const response = await client.get<{ data: MicEventsPage }>(url, { handleForbiddenLocally: true })
    return response.data
  })
}
