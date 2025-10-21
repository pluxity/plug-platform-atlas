import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Ion,
  IonImageryProvider,
  IonResource,
  CesiumTerrainProvider,
} from 'cesium'

interface ViewerState {}

interface ViewerActions {
  createViewer: (container: HTMLElement) => CesiumViewer
  setupCesiumResources: (viewer: CesiumViewer) => Promise<void>
}

type ViewerStore = ViewerState & ViewerActions

export const useViewerStore = create<ViewerStore>(() => ({
  createViewer: (container: HTMLElement) => {
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

  setupCesiumResources: async (viewer: CesiumViewer) => {
    if (viewer.isDestroyed()) return

    const imageryAssetId = Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID)
    const terrainAssetId = Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID)

    try {
      if (imageryAssetId) {
        const imageryProvider = await IonImageryProvider.fromAssetId(imageryAssetId)
        if (!viewer.isDestroyed()) {
          viewer.imageryLayers.addImageryProvider(imageryProvider)
        }
      }
    } catch (error) {

    }

    try {
      if (terrainAssetId) {
        const terrainResource = await IonResource.fromAssetId(terrainAssetId)
        const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
        if (!viewer.isDestroyed()) {
          viewer.terrainProvider = terrainProvider
        }
      }
    } catch (error) {

    }
  },
}))
