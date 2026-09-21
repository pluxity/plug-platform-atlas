import { useCallback } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { useApiClient } from '@plug-atlas/api-hooks'
import { countEventSummary, EVENT_SUMMARY_KEY } from '../../lib/event-summary'
import { useRecentEventRange } from './useRecentEventRange'

export function useEventSummary() {
  const client = useApiClient()
  const range = useRecentEventRange()
  const key = `${EVENT_SUMMARY_KEY}?${new URLSearchParams(range)}`
  return useSWR(key, async () => {
    const response = await client.get<{ data: Parameters<typeof countEventSummary>[0] }>(key)
    if (!response.data) throw new Error('이벤트 현황 응답이 없습니다.')
    return countEventSummary(response.data)
  }, { refreshInterval: 30_000 })
}

export function useRefreshEventSummary() {
  const { mutate } = useSWRConfig()
  return useCallback(() => mutate(key => typeof key === 'string' &&
    (key === EVENT_SUMMARY_KEY || key.startsWith(`${EVENT_SUMMARY_KEY}?`))).catch(error => {
    console.error('이벤트 현황 갱신 실패:', error)
  }), [mutate])
}
