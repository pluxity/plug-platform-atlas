export interface TrackingObjectMetadata {
  name?: string
  speed?: number
  direction?: number
  confidence?: number
  detection_count?: number
  zone?: string
  species?: string
  alert?: string
  imageUrl?: string
}

export interface TrackingObject {
  id: string
  type: 'person' | 'wildlife'
  position: {
    latitude: number
    longitude: number
    altitude?: number
  }
  timestamp: number
  cameraId?: string
  metadata?: TrackingObjectMetadata
}

export interface TrackingPath {
  objectId: string
  positions: Array<{
    latitude: number
    longitude: number
    altitude?: number
    timestamp: number
  }>
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'error'
