import { DBSchema } from 'idb'

export interface TrackingDB extends DBSchema {
  objects: {
    key: string
    value: {
      id: string
      name: string
      type: 'person' | 'wildlife'
      firstSeen: number
      lastSeen: number
      cameraId?: string
    }
    indexes: {
      type: string
      lastSeen: number
    }
  }
  trackingPoints: {
    key: string
    value: {
      key: string
      objectId: string
      latitude: number
      longitude: number
      altitude: number
      timestamp: number
      speed: number
      direction: number
      confidence: number
      cameraId: string
      detectionCount: number
    }
    indexes: {
      objectId: string
      timestamp: number
      'objectId-timestamp': [string, number]
    }
  }
}

export interface TrackingPointInput {
  objectId: string
  latitude: number
  longitude: number
  altitude: number
  timestamp: number
  speed: number
  direction: number
  confidence: number
  cameraId: string
  detectionCount: number
}

export interface ObjectMetadataInput {
  id: string
  name: string
  type: 'person' | 'wildlife'
  timestamp: number
  cameraId?: string
}

export interface PathPosition {
  latitude: number
  longitude: number
  altitude: number
  timestamp: number
}
