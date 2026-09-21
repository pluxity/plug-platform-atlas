import { useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { useApiClient } from '@plug-atlas/api-hooks'
import { countEventSummary, EVENT_SUMMARY_KEY } from '../../lib/event-summary'

export function useEventSummary() {
  const client = useApiClient()
  return useSWR(EVENT_SUMMARY_KEY, async () => {
    const response = await client.get<{ data: Parameters<typeof countEventSummary>[0] }>(EVENT_SUMMARY_KEY)
    if (!response.data) throw new Error('이벤트 현황 응답이 없습니다.')
    return countEventSummary(response.data)
  }, { refreshInterval: 30_000 })
}

export function useRefreshEventSummary() {
  const { mutate } = useSWRConfig()
  return useCallback(() => mutate(EVENT_SUMMARY_KEY).catch(error => {
    console.error('이벤트 현황 갱신 실패:', error)
  }), [mutate])
}
