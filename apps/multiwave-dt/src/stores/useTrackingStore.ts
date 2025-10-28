import { create } from 'zustand'
import type {
  TrackingObject,
  TrackingPath,
  ConnectionStatus,
} from '../types/tracking.types'
import { saveObjectMetadata, saveTrackingPointsBatch } from '../services/indexeddb.service'
import { MAX_PATH_POINTS } from '../constants/indexeddb'

interface TrackingState {
  objects: Map<string, TrackingObject>
  paths: Map<string, TrackingPath>
  pinnedObjects: Set<string>
  connectionStatus: ConnectionStatus
  lastUpdatedObjectId: string | null
  addTrackingData: (data: TrackingObject[]) => void
  updateObjectPosition: (data: TrackingObject) => void
  removeObject: (id: string) => void
  clearAll: () => void
  setConnectionStatus: (status: ConnectionStatus) => void
  togglePinObject: (id: string) => void
  isPinned: (id: string) => boolean
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  objects: new Map(),
  paths: new Map(),
  pinnedObjects: new Set(),
  connectionStatus: 'disconnected',
  lastUpdatedObjectId: null,

  addTrackingData: (data: TrackingObject[]) => {
    const objects = new Map(get().objects)
    const paths = new Map(get().paths)

    data.forEach((obj) => {
      objects.set(obj.id, obj)

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

    objects.set(data.id, data)

    const path = paths.get(data.id)
    if (path) {
      path.positions.push({
        latitude: data.position.latitude,
        longitude: data.position.longitude,
        altitude: data.position.altitude,
        timestamp: data.timestamp,
      })

      if (path.positions.length > MAX_PATH_POINTS) {
        path.positions = path.positions.slice(-MAX_PATH_POINTS)
      }

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

    set({ objects, paths, lastUpdatedObjectId: data.id })

    saveObjectMetadata({
      id: data.id,
      name: data.metadata?.name || data.id,
      type: data.type,
      timestamp: data.timestamp,
      cameraId: data.cameraId,
    }).catch((error) => console.error('Failed to save object metadata:', error))

    saveTrackingPointsBatch([
      {
        objectId: data.id,
        latitude: data.position.latitude,
        longitude: data.position.longitude,
        altitude: data.position.altitude ?? 0,
        timestamp: data.timestamp,
        speed: data.metadata?.speed ?? 0,
        direction: data.metadata?.direction ?? 0,
        confidence: data.metadata?.confidence ?? 0,
        cameraId: data.cameraId ?? '',
        detectionCount: data.metadata?.detection_count ?? 0,
      },
    ]).catch((error) => console.error('Failed to save tracking points:', error))
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

  togglePinObject: (id: string) => {
    const pinnedObjects = new Set(get().pinnedObjects)
    if (pinnedObjects.has(id)) {
      pinnedObjects.delete(id)
    } else {
      pinnedObjects.add(id)
    }
    set({ pinnedObjects })
  },

  isPinned: (id: string) => {
    return get().pinnedObjects.has(id)
  },
}))
