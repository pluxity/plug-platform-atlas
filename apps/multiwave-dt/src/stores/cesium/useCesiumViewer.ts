import { create } from 'zustand'
import { Viewer as CesiumViewer } from 'cesium'

interface ViewerOptions {
  animation?: boolean
  baseLayerPicker?: boolean
  fullscreenButton?: boolean
  geocoder?: boolean
  homeButton?: boolean
  infoBox?: boolean
  sceneModePicker?: boolean
  selectionIndicator?: boolean
  timeline?: boolean
  navigationHelpButton?: boolean
  shouldAnimate?: boolean
  terrain?: any
  vrButton?: boolean
}

interface CesiumViewerState {
  viewer: CesiumViewer | null
  initializeViewer: (container: HTMLElement, options?: ViewerOptions) => void
  destroyViewer: () => void
}

export const useCesiumViewer = create<CesiumViewerState>((set, get) => ({
  viewer: null,

  initializeViewer: (container: HTMLElement, options?: ViewerOptions) => {
    const existing = get().viewer
    if (existing && !existing.isDestroyed()) {
      existing.destroy()
    }

    const viewer = new CesiumViewer(container, options)
    set({ viewer })
  },

  destroyViewer: () => {
    const viewer = get().viewer
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy()
    }
    set({ viewer: null })
  },
}))
