import { useEffect } from 'react'
import { useTrackingStore } from '../stores/useTrackingStore'
import { OBJECT_TIMEOUT_MS } from '../constants/indexeddb'

export function useObjectTimeout() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now()
      const timedOutObjects: string[] = []
      const { objects, removeObject } = useTrackingStore.getState()

      objects.forEach((obj) => {
        const timeSinceLastUpdate = now - obj.timestamp

        if (timeSinceLastUpdate > OBJECT_TIMEOUT_MS) {
          timedOutObjects.push(obj.id)
        }
      })

      timedOutObjects.forEach((id) => {
        removeObject(id)
      })
    }, 10 * 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])
}
