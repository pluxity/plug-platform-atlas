import {
  Viewer as CesiumViewer,
  Ion,
  IonImageryProvider,
  IonResource,
  CesiumTerrainProvider,
} from 'cesium'

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN

export const DEFAULT_VIEWER_OPTIONS = {
  timeline: false,
  animation: false,
  baseLayerPicker: false,
  geocoder: false,
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  selectionIndicator: false,
  infoBox: false,
  fullscreenButton: false,
}

export const IMAGERY_ASSET_ID = Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID)
export const TERRAIN_ASSET_ID = Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID)

export async function setupCesiumResources(viewer: CesiumViewer): Promise<void> {
  try {
    const imageryProvider = await IonImageryProvider.fromAssetId(IMAGERY_ASSET_ID)
    if (!viewer.isDestroyed()) {
      viewer.imageryLayers.removeAll()
      viewer.imageryLayers.addImageryProvider(imageryProvider)
    }
  } catch (error) {
  }

  try {
    const terrainResource = await IonResource.fromAssetId(TERRAIN_ASSET_ID)
    const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
    if (!viewer.isDestroyed()) {
      viewer.terrainProvider = terrainProvider
    }
  } catch (error) {
  }
}
