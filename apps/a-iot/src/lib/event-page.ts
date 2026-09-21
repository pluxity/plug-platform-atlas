import type { EventsQueryParams, PaginatedEventsResponse } from '../services/types'

export function createEventPageLoader() {
  let pending: Promise<unknown> | null = null
  let lastCursor: string | null = null
  return (cursor: string, load: () => Promise<unknown>): Promise<unknown> => {
    if (pending) return pending
    if (lastCursor === cursor) return Promise.resolve()
    lastCursor = cursor
    pending = Promise.resolve().then(load).catch(error => {
      lastCursor = null
      throw error
    }).finally(() => { pending = null })
    return pending
  }
}

export function getEventPageKey(baseParams: EventsQueryParams | undefined, pageSize: number, pageIndex: number, previousPage: PaginatedEventsResponse | null) {
  if (pageIndex > 0 && (!previousPage?.hasNext || previousPage.nextCursor == null)) return null
  const params: EventsQueryParams = { ...baseParams, size: pageSize }
  if (pageIndex > 0 && previousPage) {
    params.lastId = previousPage.nextCursor ?? undefined
    if (previousPage.nextStatus) params.lastStatus = previousPage.nextStatus
  }
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value))
  }
  return `events?${query}`
}

export function flattenEventPages(pages: PaginatedEventsResponse[] = []) {
  return [...new Map(pages.flatMap(page => page.content).map(event => [event.eventId, event])).values()]
}
