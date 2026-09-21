import { getDevicePosition, type AiEdgeDevice } from './ai-edge-device.ts'
import { isSensorEvent } from './event-presentation.ts'
import type { Event, FeatureResponse } from '../services/types'

export function getEventMapTarget(event: Event, sensors: FeatureResponse[], devices: AiEdgeDevice[]) {
  const sensor = isSensorEvent(event)
    ? sensors.find(item => item.siteResponse?.id === event.siteId && item.deviceId === event.deviceId)
    : undefined
  const device = devices.find(item => item.kind === event.sourceType &&
    item.site?.id === event.siteId && item.externalId === event.deviceId)
  return getDevicePosition(sensor?.longitude, sensor?.latitude) ?? device?.position ??
    getDevicePosition(event.longitude, event.latitude)
}
