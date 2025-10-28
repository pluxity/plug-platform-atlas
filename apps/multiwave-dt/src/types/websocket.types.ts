export interface ServerTrackingObject {
  id: string
  type: 'person' | 'wildlife'
  name: string
  latitude: number
  longitude: number
  speed?: number
  direction?: number
  timestamp: string
  metadata: {
    confidence: number
    camera_id: string
    detection_count: number
  }
}

export interface ServerMessage {
  type: 'connection' | 'tracking_update' | 'event'
  message?: string
  timestamp?: string
  object?: ServerTrackingObject
  server_time?: string
  tracking_count?: number
  event_description?: string
  snapshot_url?: string
}
