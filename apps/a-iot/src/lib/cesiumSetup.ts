import {
  Viewer as CesiumViewer,
  Ion,
  IonImageryProvider,
  IonResource,
  CesiumTerrainProvider,
} from 'cesium'

Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5NGQ0YTBmZC1kMjVmLTQ2OGUtOTFiYy03YWYyNDJhOWZjYzMiLCJpZCI6MjgzMTA2LCJpYXQiOjE3NTMwNjEzMDF9.xhu9JUBNx01Zanmt1lz_MR8a5V0_vTaIpiN8gxhHuU0'

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

export const GOOGLE_MAP_IMAGERY_ASSET_ID = 3830182
export const TERRAIN_ASSET_ID = 3825983

export async function setupCesiumResources(viewer: CesiumViewer): Promise<void> {
  try {
    const imageryProvider = await IonImageryProvider.fromAssetId(GOOGLE_MAP_IMAGERY_ASSET_ID)
    if (!viewer.isDestroyed()) {
      viewer.imageryLayers.removeAll()
      viewer.imageryLayers.addImageryProvider(imageryProvider)
    }
  } catch (error) {
    // Fallback to default imagery
  }

  try {
    const terrainResource = await IonResource.fromAssetId(TERRAIN_ASSET_ID)
    const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
    if (!viewer.isDestroyed()) {
      viewer.terrainProvider = terrainProvider
    }
  } catch (error) {
    // Fallback to default terrain
  }
}
