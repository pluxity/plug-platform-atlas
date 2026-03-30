// ── EDS ���통 응답 ──
export interface EdsResponse<T = unknown> {
  code: number
  message: string
  time_stamp: string
  result?: T
}

// ── 인증 ──
export interface EdsLoginRequest {
  system_key: string
  system_token: string
  keep_alive_timeout?: number
}

export interface EdsLoginResult {
  'api-key': string
}

// ── 카메라 ──
export interface EdsCameraListRequest {
  service_pk?: string | null
  offset?: number
  limit?: number
}

export interface EdsCamera {
  camera_id: string
  camera_name: string
  camera_ip: string
  camera_port: number
  latitude: number
  longitude: number
  ptz_control: number
  camera_type: string
  camera_status: number
  camera_address?: string
  stream_resolution?: number[]
  camera_record_type?: number
  camera_analysis_configured?: number
  camera_install_purpose?: string
}

export interface EdsCameraListResponse extends EdsResponse<EdsCamera[]> {
  total_count: number
}

// ── 실시간 영상 ──
export interface EdsRealtimeStreamRequest {
  camera_id: string
  external_flag: number
  meta_include_flag: number
  protocol_type: 'ws' | 'rtsp'
  resolution_type?: number
}

export interface EdsStreamResult {
  stream_url: string
  session?: string
}

// ── 녹화 영상 ──
export interface EdsRecordStreamRequest {
  camera_id: string
  external_flag: number
  protocol_type: 'ws' | 'rtsp'
  resolution_type?: number
  play_time?: string
  record_start_time: string
  record_end_time: string
  scaled_time?: boolean
  speed?: number
}

// ── 썸네일 ──
export interface EdsThumbnailRequest {
  camera_id: string
  resolution_type?: number
  width?: number
  height?: number
}

// ── 이벤트 웹소켓 URL ──
export interface EdsWebsocketUrlResult {
  ws_url: string
}

// ── PTZ ──
export interface EdsPtzLockResult {
  camera_id: string
  control_auth_key: string
}
