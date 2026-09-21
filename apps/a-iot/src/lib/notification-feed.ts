import { parse } from 'date-fns'
import type { Event, Notification } from '../services/types'

export function mergeNotificationFeed(events: Event[], live: Notification[], latest: Map<number, Event>, range: { from: string; to: string }) {
  const from = parse(range.from, 'yyyyMMddHHmmss', new Date()).getTime()
  const to = parse(range.to, 'yyyyMMddHHmmss', new Date()).getTime()
  const items = new Map<string, Notification>()
  const add = (notification: Notification) => {
    if (notification.type === 'sensor-alarm') {
      const original = notification.payload as Event
      const event = latest.get(original.eventId) ?? original
      const time = new Date(event.occurredAt).getTime()
      if (event.status !== 'ACTIVE' || !Number.isFinite(time) || time < from || time > to) return
      items.set(`event-${event.eventId}`, { ...notification, id: `event-${event.eventId}`, eventId: event.eventId,
        payload: event, timestamp: new Date(event.occurredAt) })
    } else if (notification.timestamp.getTime() >= from && notification.timestamp.getTime() <= to) {
      items.set(notification.id, notification)
    }
  }
  for (const event of events) add({ id: `event-${event.eventId}`, eventId: event.eventId, type: 'sensor-alarm',
    title: event.title || event.eventName, siteName: event.siteName, message: event.guideMessage,
    timestamp: new Date(event.occurredAt), level: event.level as Notification['level'], payload: event })
  for (const notification of live) add(notification)
  return [...items.values()].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
