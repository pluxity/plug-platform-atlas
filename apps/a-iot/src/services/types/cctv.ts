// Site Response (CCTV에 포함됨)
export interface SiteResponse {
  id: number
  name: string
}

// CCTV 카메라 타입
export type CctvCameraType =
  | 'ip'
  | 'video'
  | 'ptz'
  | 'aibox'
  | 'ai'
  | 'unmanaged'
  | 'unsupported'

// CCTV Response (백엔드 API 스펙)
export interface CctvResponse {
  id: number
  name: string
  edsCameraId: string
  cameraIp: string
  cameraPort: number
  lon: number
  lat: number
  ptzControl: number
  cameraType: CctvCameraType
  cameraStatus: number // 0, 1, 2
  cameraAddress: string
  streamResolution: number[]
  cameraRecordType: number
  cameraAnalysisConfigured: number
  site: SiteResponse | null
}

// CCTV 스트림 결과
export interface CctvStreamResult {
  session: string
  stream_url: string
}

// CCTV 좌표 수정 요청
export interface CctvCoordinateRequest {
  lon: number
  lat: number
}

// CCTV List Query Params
export interface CctvListParams {
  siteId?: number
}

// ── CCTV 이벤트 (AI EDGE) ──

export type CctvEventType =
  | 'LOITERING' | 'PATH_PASS' | 'DIRECTIONAL_MOVE' | 'ENTER' | 'EXIT'
  | 'STOP' | 'ABANDONED' | 'LINE_CROSS' | 'SMOKE' | 'FLAME'
  | 'FALL_DOWN' | 'CROWD' | 'VIOLENCE' | 'MULTI_LINE_CROSS'
  | 'VEHICLE_ACCIDENT' | 'VEHICLE_STOP' | 'TRAFFIC_JAM' | 'COLOR_CHANGE'
  | 'VEHICLE_PARKING' | 'REMOVED' | 'DANGER_WATER_LEVEL' | 'AREA_COLOR'
  | 'STAY' | 'STAY_OVERCROWDED' | 'STAY_TIMEOUT' | 'STAY_ALONE'
  | 'NO_HELMET' | 'LEFT_ALONE' | 'APPROACH' | 'SEPARATE'
  | 'ACTION_RECOGNITION' | 'VEHICLE_TAILGATING' | 'JAYWALKING'
  | 'FARE_EVASION' | 'NO_MASK' | 'NO_SAFETY_VEST' | 'PEDESTRIAN_DANGER'
  | 'PEDESTRIAN_STATISTICS' | 'FLASHLIGHT' | 'LICENSE_PLATE_RECOGNITION'
  | 'GAUGE_RECOGNITION' | 'CAKE_RECOGNITION' | 'SAFETY_HOOK_UNLATCHED'
  | 'NO_KORAIL_UNIFORM' | 'CROWD_DENSITY' | 'FACE_RECOGNITION'
  | 'VEHICLE_PLATE' | 'WEAPON_THREAT'

export type CctvEventStatus = 'STARTED' | 'IN_PROGRESS' | 'ENDED'

export interface CctvEventResponse {
  id: number
  index: number
  eventId: number
  profileName: string
  cameraId: string
  eventType: CctvEventType
  eventStart: string
  eventEnd: string
  frameTime: string
  eventStatus: CctvEventStatus
  eventZoneId: number
  eventZoneName: string
  latitude: number
  longitude: number
  detectedVehicleNumber: string | null
  thumbnail: { url: string } | null
  createdAt: string
}

export interface CctvEventsParams {
  page?: number
  size?: number
  from?: string
  to?: string
}

export interface CctvEventsPageResponse {
  content: CctvEventResponse[]
  totalElements: number
  pageNumber: number
  pageSize: number
  first: boolean
  last: boolean
}
