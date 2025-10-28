import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Ion,
  IonImageryProvider,
  IonResource,
  CesiumTerrainProvider,
} from 'cesium'

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || ''

interface CesiumViewerState {
  viewer: CesiumViewer | null
  isInitializing: boolean
  initializeViewer: (container: HTMLElement) => Promise<void>
  destroyViewer: () => void
}

export const useCesiumViewer = create<CesiumViewerState>((set, get) => ({
  viewer: null,
  isInitializing: false,

  initializeViewer: async (container: HTMLElement) => {
    const existing = get().viewer
    if (existing && !existing.isDestroyed()) {
      existing.destroy()
    }

    set({ isInitializing: true })

    try {
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

      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(2)

      try {
        const bingMapsImagery = await IonImageryProvider.fromAssetId(2)
        if (!viewer.isDestroyed() && viewer.imageryLayers.length > 0) {
          viewer.imageryLayers.removeAll()
          viewer.imageryLayers.addImageryProvider(bingMapsImagery)
        }
      } catch (error) {
        console.error('Failed to load imagery provider:', error)
      }

      const terrainAssetId = Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID)

      try {
        if (terrainAssetId) {
          const terrainResource = await IonResource.fromAssetId(terrainAssetId)
          const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
          if (!viewer.isDestroyed()) {
            viewer.terrainProvider = terrainProvider
          }
        }
      } catch (error) {
        console.error('Failed to load terrain provider:', error)
      }

      set({ viewer, isInitializing: false })
    } catch (error) {
      set({ viewer: null, isInitializing: false })
    }
  },

  destroyViewer: () => {
    const viewer = get().viewer
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy()
    }
    set({ viewer: null })
  },
}))
