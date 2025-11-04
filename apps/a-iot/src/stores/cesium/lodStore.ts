import { create } from 'zustand'
import { Viewer as CesiumViewer } from 'cesium'

export interface LODLevel {
  minDistance: number
  maxDistance: number
  onEnter?: () => void
  onExit?: () => void
  onUpdate?: (distance: number) => void
}

interface LODStore {
  setupCameraDistanceLOD: (
    viewer: CesiumViewer,
    levels: LODLevel[],
    debounceMs?: number
  ) => () => void
}

export const useLODStore = create<LODStore>(() => ({
  setupCameraDistanceLOD: (viewer: CesiumViewer, levels: LODLevel[], debounceMs = 100) => {
    if (!viewer || viewer.isDestroyed()) {
      return () => {}
    }

    let currentLevel: number | null = null
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    const handleCameraChange = () => {
      if (viewer.isDestroyed()) return

      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      debounceTimer = setTimeout(() => {
        const cameraHeight = viewer.camera.positionCartographic.height

        const newLevelIndex = levels.findIndex(
          level => cameraHeight >= level.minDistance && cameraHeight < level.maxDistance
        )

        if (newLevelIndex === -1) {
          return
        }

        if (currentLevel !== newLevelIndex) {
          if (currentLevel !== null) {
            const previousLevel = levels[currentLevel]
            if (previousLevel && previousLevel.onExit) {
              previousLevel.onExit()
            }
          }

          const newLevel = levels[newLevelIndex]
          if (newLevel && newLevel.onEnter) {
            newLevel.onEnter()
          }

          currentLevel = newLevelIndex
        }

        const currentLevelData = levels[newLevelIndex]
        if (currentLevelData && currentLevelData.onUpdate) {
          currentLevelData.onUpdate(cameraHeight)
        }
      }, debounceMs)
    }

    handleCameraChange()

    viewer.camera.changed.addEventListener(handleCameraChange)

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      if (!viewer.isDestroyed()) {
        viewer.camera.changed.removeEventListener(handleCameraChange)
      }

      if (currentLevel !== null) {
        const currentLevelData = levels[currentLevel]
        if (currentLevelData && currentLevelData.onExit) {
          currentLevelData.onExit()
        }
      }
    }
  },
}))
