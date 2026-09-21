import type { Event, EventsQueryParams, PaginatedEventsResponse } from '../services/types'

type EventScope = Pick<EventsQueryParams, 'sourceType' | 'siteId'>
type EventClient = { get<T>(path: string): Promise<T> }

// The API exposes cursor-based lists, but no GET /events/{id} endpoint.
export async function fetchEvent(client: EventClient, id: number, scope: EventScope = {}): Promise<Event> {
  const params = new URLSearchParams({ size: '100' })
  if (scope.sourceType) params.set('sourceType', scope.sourceType)
  if (scope.siteId != null) params.set('siteId', String(scope.siteId))
  const cursors = new Set<string>()
  while (true) {
    const response = await client.get<{ data: PaginatedEventsResponse }>(`events?${params}`)
    const page = response.data
    const event = page?.content.find(item => item.eventId === id)
    if (event) return event
    if (!page?.hasNext || page.nextCursor == null) break
    const cursor = `${page.nextStatus ?? ''}:${page.nextCursor}`
    if (cursors.has(cursor)) throw new Error('이벤트 조회 커서가 반복되었습니다.')
    cursors.add(cursor)
    params.set('lastId', String(page.nextCursor))
    if (page.nextStatus) params.set('lastStatus', page.nextStatus)
    else params.delete('lastStatus')
  }
  throw new Error('이벤트의 최신 상태를 찾을 수 없습니다.')
}
