import { create } from 'zustand'
import { Viewer as CesiumViewer, Cartesian3, Math as CesiumMath } from 'cesium'
import type { CameraPosition } from './types'

interface CameraState {
  
}

interface CameraActions {
  flyToPosition: (viewer: CesiumViewer, position: CameraPosition) => void
  setView: (viewer: CesiumViewer, position: CameraPosition) => void
}

type CameraStore = CameraState & CameraActions

export const useCameraStore = create<CameraStore>(() => ({
  flyToPosition: (viewer: CesiumViewer, position: CameraPosition) => {
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(position.lon, position.lat, position.height),
      orientation: {
        heading: CesiumMath.toRadians(position.heading ?? 0),
        pitch: CesiumMath.toRadians(position.pitch ?? -45),
        roll: position.roll ?? 0,
      },
    })
  },

  setView: (viewer: CesiumViewer, position: CameraPosition) => {
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(position.lon, position.lat, position.height),
      orientation: {
        heading: CesiumMath.toRadians(position.heading ?? 0),
        pitch: CesiumMath.toRadians(position.pitch ?? -45),
        roll: position.roll ?? 0,
      },
    })
  },
}))
