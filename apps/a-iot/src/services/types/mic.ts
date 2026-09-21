export type MicStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONNECTED'

export interface MicResponse {
  id: number
  vendorMicId: string
  name: string
  host: string | null
  edgeId: string | null
  status: MicStatus
  latitude: number | null
  longitude: number | null
  thresholds: Record<string, { confidence: number | null; sound_level_ge: number | null }> | null
  site: { id: number; name: string } | null
}

export interface MicEventResponse {
  id: number
  eventId: string
  micId: string
  micName: string
  labelId: string
  labelNameKo: string
  labelNameEn: string
  confidence: number | null
  latitude: number | null
  longitude: number | null
  noises: number[] | null
  maxNoise: number | null
  avgNoise: number | null
  occurredAt: string
}

export interface MicEventsPage {
  content: MicEventResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
  first: boolean
  last: boolean
}
