import type { CctvResponse } from '../services/types/cctv'
import type { MicResponse } from '../services/types/mic'

export type AiEdgeKind = 'CCTV' | 'MIC'
export interface DevicePosition { longitude: number; latitude: number }

export interface CoordinateDraft { lon: string; lat: string }

/** Blank inputs must not become zero coordinates through Number(''). */
export function getCoordinateEditState(draft: CoordinateDraft, original: DevicePosition | null) {
  const position = getDevicePosition(
    draft.lon.trim() ? Number(draft.lon) : null,
    draft.lat.trim() ? Number(draft.lat) : null,
  )
  const changed = !!position && (
    position.longitude !== original?.longitude || position.latitude !== original?.latitude
  )
  return { position, changed }
}

export function getDevicePosition(longitude: unknown, latitude: unknown): DevicePosition | null {
  if (typeof longitude !== 'number' || typeof latitude !== 'number' ||
      !Number.isFinite(longitude) || !Number.isFinite(latitude) ||
      Math.abs(longitude) > 180 || Math.abs(latitude) > 90) return null
  return { longitude, latitude }
}

export const DEVICE_STATUSES: Record<string, { label: string; color: string }> = {
  NORMAL: { label: '정상', color: '#15803d' },
  FAULT: { label: '장애', color: '#dc2626' },
  DISCONNECTED: { label: '연결 끊김', color: '#64748b' },
  ACTIVE: { label: '활성', color: '#0369a1' },
  INACTIVE: { label: '비활성', color: '#64748b' },
}

export function getDeviceStatus(status: string) {
  return DEVICE_STATUSES[status] ?? { label: '알 수 없음', color: '#64748b' }
}

interface DeviceBase {
  key: string
  id: number
  name: string
  externalId: string
  status: string
  site: { id: number; name: string } | null
  position: DevicePosition | null
}

export type AiEdgeDevice = DeviceBase & (
  | { kind: 'CCTV'; source: CctvResponse }
  | { kind: 'MIC'; source: MicResponse }
)

export function cctvToDevice(source: CctvResponse): AiEdgeDevice {
  return {
    key: `cctv:${source.id}`, kind: 'CCTV', id: source.id, name: source.name,
    externalId: source.edsCameraId, status: source.cameraStatus, site: source.site,
    position: getDevicePosition(source.lon, source.lat), source,
  }
}

export function micToDevice(source: MicResponse): AiEdgeDevice {
  return {
    key: `mic:${source.id}`, kind: 'MIC', id: source.id, name: source.name,
    externalId: source.vendorMicId, status: source.status, site: source.site,
    position: getDevicePosition(source.longitude, source.latitude), source,
  }
}

/** Includes every site-filtered list and numeric detail, but never streams/events. */
export function isDeviceCacheKey(key: unknown, resource: 'cctvs' | 'mics') {
  return typeof key === 'string' &&
    (key === resource || key.startsWith(`${resource}?`) || new RegExp(`^${resource}/\\d+$`).test(key))
}

export interface DeviceFilters { kind: string; site: string; status: string; location: string; search: string }

export function filterDevices(devices: AiEdgeDevice[], filters: DeviceFilters) {
  const search = filters.search.trim().toLocaleLowerCase()
  return devices.filter(device =>
    (filters.kind === 'all' || device.kind === filters.kind) &&
    (filters.site === 'all' || (filters.site === 'unmapped' ? !device.site : String(device.site?.id) === filters.site)) &&
    (filters.status === 'all' || device.status === filters.status) &&
    (filters.location === 'all' || (filters.location === 'missing' ? !device.position : !!device.position)) &&
    (!search || `${device.name} ${device.externalId}`.toLocaleLowerCase().includes(search)),
  )
}
