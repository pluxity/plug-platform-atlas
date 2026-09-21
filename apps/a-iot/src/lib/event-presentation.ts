import type { Event } from '../services/types/eventManagement'

export function isAiEdgeEvent(event: Pick<Event, 'sourceType'>) {
  return event.sourceType === 'CCTV' || event.sourceType === 'MIC'
}

export function isSensorEvent(event: Pick<Event, 'sourceType'>) {
  return event.sourceType === 'SENSOR' || event.sourceType == null
}

export function getEventSourceLabel(event: Pick<Event, 'sourceType'>) {
  if (isAiEdgeEvent(event)) return `AI EDGE · ${event.sourceType}`
  return isSensorEvent(event) ? 'IoT 센서' : '기타 이벤트'
}

export function hasSensorMeasurement(event: Pick<Event, 'sourceType' | 'value'>) {
  return !isAiEdgeEvent(event) && typeof event.value === 'number' && Number.isFinite(event.value)
}
