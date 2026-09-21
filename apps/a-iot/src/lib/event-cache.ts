import type { Event } from '../services/types'

export function isEventListCacheKey(key: unknown): boolean {
  return typeof key === 'string' && (key === 'events' || key.startsWith('events?') || key.startsWith('$inf$events?'))
}

/** Handles dashboard arrays, cursor pages, and SWRInfinite page arrays. */
export function replaceCachedEvent(data: unknown, event: Event): unknown {
  if (Array.isArray(data)) return data.map(item => replaceCachedEvent(item, event))
  if (data && typeof data === 'object') {
    if ('eventId' in data && data.eventId === event.eventId) return event
    if ('content' in data && Array.isArray(data.content)) {
      return { ...data, content: replaceCachedEvent(data.content, event) }
    }
  }
  return data
}
