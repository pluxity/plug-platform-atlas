import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Ion,
  IonImageryProvider,
  IonResource,
  CesiumTerrainProvider,
} from 'cesium'

interface ViewerState {
  viewer: CesiumViewer | null
  isInitialized: boolean
}

interface ViewerActions {
  initializeViewer: (container: HTMLElement) => Promise<CesiumViewer>
  getViewer: () => CesiumViewer | null
  destroyViewer: () => void
  _createViewer: (container: HTMLElement) => CesiumViewer
  _setupCesiumResources: (viewer: CesiumViewer) => Promise<void>
}

type ViewerStore = ViewerState & ViewerActions

export const useViewerStore = create<ViewerStore>((set, get) => ({
  viewer: null,
  isInitialized: false,

  getViewer: () => get().viewer,

  initializeViewer: async (container: HTMLElement) => {
    const existing = get().viewer

    if (existing && !existing.isDestroyed()) {
      if (existing.container !== container) {
        container.appendChild(existing.container)
      }
      return existing
    }

    const viewer = get()._createViewer(container)
    set({ viewer, isInitialized: false })

    await get()._setupCesiumResources(viewer)
    set({ isInitialized: true })

    return viewer
  },

  destroyViewer: () => {
    const viewer = get().viewer
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy()
    }
    set({ viewer: null, isInitialized: false })
  },

  _createViewer: (container: HTMLElement) => {
    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || ''

    const viewer = new CesiumViewer(container, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      shouldAnimate: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
    })

    viewer.imageryLayers.removeAll()

    viewer.scene.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      return false
    })

    return viewer
  },

  _setupCesiumResources: async (viewer: CesiumViewer) => {
    if (viewer.isDestroyed()) return

    const imageryAssetId = Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID)
    const terrainAssetId = Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID)

    // Imagery 로딩 시도
    let imageryLoaded = false
    try {
      if (imageryAssetId) {
        const imageryProvider = await IonImageryProvider.fromAssetId(imageryAssetId)
        if (!viewer.isDestroyed()) {
          viewer.imageryLayers.addImageryProvider(imageryProvider)
          imageryLoaded = true
        }
      }
    } catch (error) {
      console.error('Failed to load Cesium imagery:', error)
      if (!viewer.isDestroyed() && viewer.imageryLayers.length === 0) {
        try {
          const fallbackImagery = await IonImageryProvider.fromAssetId(2)
          viewer.imageryLayers.addImageryProvider(fallbackImagery)
        } catch (fallbackError) {
          console.error('Failed to load fallback imagery:', fallbackError)
        }
      }
    }

    // Terrain 로딩 시도
    try {
      if (terrainAssetId) {
        const terrainResource = await IonResource.fromAssetId(terrainAssetId)
        const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
        if (!viewer.isDestroyed()) {
          viewer.terrainProvider = terrainProvider
        }
      }
    } catch (error) {
      console.warn('Failed to load Cesium terrain, using default ellipsoid:', error)
    }
  },
}))
