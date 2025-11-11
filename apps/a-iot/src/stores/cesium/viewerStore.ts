import { create } from 'zustand'
import {
  Viewer as CesiumViewer,
  Ion,
  IonImageryProvider,
  IonResource,
  CesiumTerrainProvider,
  CameraEventType,
} from 'cesium'

export interface ViewerOptions {
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
  requestRenderMode?: boolean
  maximumRenderTimeChange?: number
}

const DEFAULT_VIEWER_OPTIONS: ViewerOptions = {
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
}

interface ViewerFactory {
  createViewer: (container: HTMLElement, options?: ViewerOptions) => CesiumViewer
  setupImagery: (viewer: CesiumViewer, assetId?: number) => Promise<void>
  setupTerrain: (viewer: CesiumViewer, assetId?: number) => Promise<void>
  initializeResources: (viewer: CesiumViewer) => Promise<void>
}

export const useViewerStore = create<ViewerFactory>(() => ({
  createViewer: (container: HTMLElement, options?: ViewerOptions) => {
    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_ACCESS_TOKEN || ''

    // Cesium 에러 로그 억제
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      // 3D Tile 관련 에러만 필터링
      if (
        message.includes('A 3D tile failed to load') ||
        message.includes('implicitCoordinates') ||
        message.includes('Cesium3DTileset')
      ) {
        return // 에러 무시
      }
      originalConsoleError.apply(console, args)
    }

    const mergedOptions = { ...DEFAULT_VIEWER_OPTIONS, ...options }

    const viewer = new CesiumViewer(container, mergedOptions)

    viewer.scene.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      return false
    })

    const controller = viewer.scene.screenSpaceCameraController
    controller.minimumZoomDistance = 10
    controller.maximumZoomDistance = 50000000
    controller.inertiaZoom = 0.3
    controller.zoomEventTypes = [CameraEventType.WHEEL, CameraEventType.PINCH]

    // Pitch/Roll 제한 이벤트 리스너
    viewer.camera.changed.addEventListener(() => {
      const cameraHeight = viewer.camera.positionCartographic.height
      const maximumPitch = -0.1 // 약 -5.7도 (거의 수평)

      // 높이에 따라 최대 pitch 조정
      let adjustedMaxPitch = maximumPitch
      if (cameraHeight < 1000) {
        // 낮은 고도에서는 더 많이 기울일 수 있음
        adjustedMaxPitch = -0.3 // 약 -17도
      } else if (cameraHeight < 5000) {
        // 중간 고도
        adjustedMaxPitch = -0.2 // 약 -11도
      }

      const pitch = viewer.camera.pitch
      const roll = viewer.camera.roll

      // Pitch가 너무 수평이거나 Roll이 0이 아니면 조정
      if (pitch > adjustedMaxPitch || Math.abs(roll) > 0.01) {
        viewer.camera.setView({
          orientation: {
            heading: viewer.camera.heading,
            pitch: pitch > adjustedMaxPitch ? adjustedMaxPitch : pitch,
            roll: 0, // Roll은 항상 0으로 유지
          },
        })
      }
    })

    return viewer
  },

  setupImagery: async (viewer: CesiumViewer, assetId?: number) => {
    if (viewer.isDestroyed()) return

    const imageryAssetId = assetId || Number(import.meta.env.VITE_CESIUM_GOOGLE_MAP_ASSET_ID)

    try {
      if (imageryAssetId) {
        const imageryProvider = await IonImageryProvider.fromAssetId(imageryAssetId)
        if (!viewer.isDestroyed()) {
          viewer.imageryLayers.addImageryProvider(imageryProvider)
        }
      }
    } catch (error) {
      if (!viewer.isDestroyed() && viewer.imageryLayers.length === 0) {
        try {
          const fallbackImagery = await IonImageryProvider.fromAssetId(2)
          if (!viewer.isDestroyed()) {
            viewer.imageryLayers.addImageryProvider(fallbackImagery)
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback imagery:', fallbackError)
        }
      }
    }
  },

  setupTerrain: async (viewer: CesiumViewer, assetId?: number) => {
    if (viewer.isDestroyed()) return

    const terrainAssetId = assetId || Number(import.meta.env.VITE_CESIUM_TERRAIN_ASSET_ID)

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

  initializeResources: async (viewer: CesiumViewer) => {
    const { setupImagery, setupTerrain } = useViewerStore.getState()

    await Promise.all([
      setupImagery(viewer),
      setupTerrain(viewer),
    ])
  },
}))
