import { openDB, IDBPDatabase } from 'idb'
import type {
  TrackingDB,
  TrackingPointInput,
  ObjectMetadataInput,
  PathPosition,
} from '../types/indexeddb.types'
import { RETENTION_DAYS, OBJECT_TIMEOUT_MS, DB_NAME, DB_VERSION } from '../constants/indexeddb'

let dbInstance: IDBPDatabase<TrackingDB> | null = null

export async function initDB(): Promise<IDBPDatabase<TrackingDB>> {
  if (dbInstance && !dbInstance.objectStoreNames.length) {
    dbInstance = null
  }

  if (!dbInstance) {
    dbInstance = await openDB<TrackingDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('objects')) {
          const objectStore = db.createObjectStore('objects', { keyPath: 'id' })
          objectStore.createIndex('type', 'type', { unique: false })
          objectStore.createIndex('lastSeen', 'lastSeen', { unique: false })
        }

        if (!db.objectStoreNames.contains('trackingPoints')) {
          const trackingStore = db.createObjectStore('trackingPoints', {
            keyPath: 'key',
          })
          trackingStore.createIndex('objectId', 'objectId', { unique: false })
          trackingStore.createIndex('timestamp', 'timestamp', { unique: false })
          trackingStore.createIndex('objectId-timestamp', ['objectId', 'timestamp'], {
            unique: false,
          })
        }
      },
    })

    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persist()
    }
  }

  return dbInstance
}

export async function saveObjectMetadata(object: ObjectMetadataInput): Promise<void> {
  const db = await initDB()
  const existing = await db.get('objects', object.id)

  const metadata = {
    id: object.id,
    name: object.name,
    type: object.type,
    firstSeen: existing?.firstSeen ?? object.timestamp,
    lastSeen: object.timestamp,
    cameraId: object.cameraId,
  }

  await db.put('objects', metadata)
}

export async function saveTrackingPointsBatch(points: TrackingPointInput[]): Promise<void> {
  if (points.length === 0) return

  const db = await initDB()
  const tx = db.transaction('trackingPoints', 'readwrite')

  await Promise.all(
    points.map((point) => {
      const key = `${point.objectId}_${point.timestamp}`
      return tx.store.put({ ...point, key })
    })
  )

  await tx.done
}

export async function getObjectPath(
  objectId: string,
  startTime?: number,
  endTime?: number
): Promise<PathPosition[]> {
  const db = await initDB()

  const range =
    startTime && endTime
      ? IDBKeyRange.bound([objectId, startTime], [objectId, endTime])
      : IDBKeyRange.bound([objectId, 0], [objectId, Date.now()])

  const points = await db.getAllFromIndex('trackingPoints', 'objectId-timestamp', range)

  return points.map((p) => ({
    latitude: p.latitude,
    longitude: p.longitude,
    altitude: p.altitude,
    timestamp: p.timestamp,
  }))
}

export async function getTimedOutObjects(): Promise<string[]> {
  const db = await initDB()
  const cutoffTime = Date.now() - OBJECT_TIMEOUT_MS

  const tx = db.transaction('objects', 'readonly')
  const index = tx.store.index('lastSeen')

  const range = IDBKeyRange.upperBound(cutoffTime)
  const timedOutObjects = await index.getAll(range)

  return timedOutObjects.map((obj) => obj.id)
}

export async function cleanupOldData(): Promise<void> {
  const db = await initDB()
  const cutoffTime = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000

  const tx1 = db.transaction('trackingPoints', 'readwrite')
  const index1 = tx1.store.index('timestamp')
  const range1 = IDBKeyRange.upperBound(cutoffTime)

  let cursor = await index1.openCursor(range1)

  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }

  await tx1.done

  const tx2 = db.transaction('objects', 'readwrite')
  const index2 = tx2.store.index('lastSeen')
  const range2 = IDBKeyRange.upperBound(cutoffTime)

  let cursor2 = await index2.openCursor(range2)

  while (cursor2) {
    await cursor2.delete()
    cursor2 = await cursor2.continue()
  }

  await tx2.done
}

export async function getStorageStats() {
  const db = await initDB()

  const objectCount = await db.count('objects')
  const pointCount = await db.count('trackingPoints')
  const estimatedSize = pointCount * 100

  return { objectCount, pointCount, estimatedSize }
}

export function scheduleAutoCleanup(): void {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  const timeUntilMidnight = tomorrow.getTime() - now.getTime()

  setTimeout(() => {
    cleanupOldData()
    setInterval(cleanupOldData, 24 * 60 * 60 * 1000)
  }, timeUntilMidnight)
}
