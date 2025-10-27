import { create } from 'zustand'

export interface TrackingObject {
  id: string
  type: 'person' | 'vehicle' | 'unknown'
  position: {
    latitude: number
    longitude: number
    altitude?: number
  }
  timestamp: number
  cameraId?: string
  metadata?: Record<string, unknown>
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

interface TrackingState {
  objects: Map<string, TrackingObject>
  paths: Map<string, TrackingPath>
  connectionStatus: 'connected' | 'disconnected' | 'error'
  addTrackingData: (data: TrackingObject[]) => void
  updateObjectPosition: (data: TrackingObject) => void
  removeObject: (id: string) => void
  clearAll: () => void
  setConnectionStatus: (status: 'connected' | 'disconnected' | 'error') => void
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  objects: new Map(),
  paths: new Map(),
  connectionStatus: 'disconnected',

  addTrackingData: (data: TrackingObject[]) => {
    const objects = new Map(get().objects)
    const paths = new Map(get().paths)

    data.forEach((obj) => {
      objects.set(obj.id, obj)

      // 경로 초기화
      if (!paths.has(obj.id)) {
        paths.set(obj.id, {
          objectId: obj.id,
          positions: [
            {
              latitude: obj.position.latitude,
              longitude: obj.position.longitude,
              altitude: obj.position.altitude,
              timestamp: obj.timestamp,
            },
          ],
        })
      }
    })

    set({ objects, paths })
  },

  updateObjectPosition: (data: TrackingObject) => {
    const objects = new Map(get().objects)
    const paths = new Map(get().paths)

    // 객체 정보 업데이트
    objects.set(data.id, data)

    // 경로에 위치 추가
    const path = paths.get(data.id)
    if (path) {
      path.positions.push({
        latitude: data.position.latitude,
        longitude: data.position.longitude,
        altitude: data.position.altitude,
        timestamp: data.timestamp,
      })
      paths.set(data.id, path)
    } else {
      paths.set(data.id, {
        objectId: data.id,
        positions: [
          {
            latitude: data.position.latitude,
            longitude: data.position.longitude,
            altitude: data.position.altitude,
            timestamp: data.timestamp,
          },
        ],
      })
    }

    set({ objects, paths })
  },

  removeObject: (id: string) => {
    const objects = new Map(get().objects)
    const paths = new Map(get().paths)

    objects.delete(id)
    paths.delete(id)

    set({ objects, paths })
  },

  clearAll: () => {
    set({ objects: new Map(), paths: new Map() })
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status })
  },
}))
