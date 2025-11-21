import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Ion,
  WebMapTileServiceImageryProvider,
  CesiumTerrainProvider,
  IonResource,
  // ArcGISTiledElevationTerrainProvider, // ArcGIS Terrain 사용 시 주석 해제
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

      // viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(2) // 휠클릭(중간버튼) 활성화

      try {
        const vworldApiKey = import.meta.env.VITE_VWORLD_API_KEY || '3102019F-E82C-3A0B-A92C-18FA1261C2F8'
        const vworldImagery = new WebMapTileServiceImageryProvider({
          url: `http://api.vworld.kr/req/wmts/1.0.0/${vworldApiKey}/Satellite/{TileMatrix}/{TileRow}/{TileCol}.jpeg`,
          layer: 'Satellite',
          style: 'default',
          tileMatrixSetID: 'default',
          format: 'image/jpeg',
          maximumLevel: 19,
          credit: 'VWorld',
        })
        if (!viewer.isDestroyed() && viewer.imageryLayers.length > 0) {
          viewer.imageryLayers.removeAll()
          viewer.imageryLayers.addImageryProvider(vworldImagery)
        }
      } catch (error) {
        console.error('Failed to load VWorld imagery provider:', error)
      }

      // Terrain Provider 설정
      // 방법 1: Cesium Ion Terrain (현재 사용 중 - 3825983)
      try {
        const terrainResource = await IonResource.fromAssetId(3825983)
        const terrainProvider = await CesiumTerrainProvider.fromUrl(terrainResource)
        if (!viewer.isDestroyed()) {
          viewer.terrainProvider = terrainProvider
        }
      } catch (error) {
        console.error('Failed to load Cesium Ion terrain provider:', error)
      }

      // 방법 2: ArcGIS World Elevation 3D (고품질, 무거움)
      // 아래 주석을 해제하고 위의 Cesium Ion 코드를 주석처리하면 ArcGIS Terrain 사용
      // try {
      //   const terrainProvider = await ArcGISTiledElevationTerrainProvider.fromUrl(
      //     'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'
      //   )
      //   if (!viewer.isDestroyed()) {
      //     viewer.terrainProvider = terrainProvider
      //   }
      // } catch (error) {
      //   console.error('Failed to load ArcGIS terrain provider:', error)
      // }

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
